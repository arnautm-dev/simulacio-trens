export const TRACK_TYPES = Object.freeze({
    single: {
        id: 'single',
        label: 'Via única',
        costPerKm: 180000,
        maxSpeed: 160,
        laneOffset: 0,
        width: 4,
        color: '#93a5b7',
    },
    double: {
        id: 'double',
        label: 'Via doble',
        costPerKm: 280000,
        maxSpeed: 220,
        laneOffset: 5,
        width: 3,
        color: '#5fa8ff',
    },
    highSpeed: {
        id: 'highSpeed',
        label: 'Via d’alta velocitat',
        costPerKm: 430000,
        maxSpeed: 350,
        laneOffset: 7,
        width: 3,
        color: '#ffb703',
    },
});

export function getTrackType(trackTypeId) {
    return TRACK_TYPES[trackTypeId] ?? null;
}

export function estimateTrackCost(trackTypeId, distanceMeters) {
    if (!getTrackType(trackTypeId)) {
        throw new RangeError(`El tipus de via «${trackTypeId}» no és vàlid.`);
    }
    if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
        throw new RangeError('La longitud de la via ha de ser un valor no negatiu.');
    }

    return TRACK_TYPES[trackTypeId].costPerKm * (distanceMeters / 1000);
}

const EARTH_RADIUS_METERS = 6371000;
const DEFAULT_SNAP_TOLERANCE_METERS = 80;

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

export function distanceMeters(start, end) {
    const lat1 = toRadians(start.lat);
    const lat2 = toRadians(end.lat);
    const deltaLat = toRadians(end.lat - start.lat);
    const deltaLng = toRadians(end.lng - start.lng);
    const a = Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
    return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function geometryLength(geometry) {
    let length = 0;
    for (let index = 1; index < geometry.length; index += 1) {
        length += distanceMeters(geometry[index - 1], geometry[index]);
    }
    return length;
}

function projectLocal(point, originLatitude) {
    return {
        x: EARTH_RADIUS_METERS * toRadians(point.lng) * Math.cos(toRadians(originLatitude)),
        y: EARTH_RADIUS_METERS * toRadians(point.lat),
    };
}

function unprojectLocal(point, originLatitude) {
    return {
        lat: (point.y / EARTH_RADIUS_METERS) * (180 / Math.PI),
        lng: (point.x / (EARTH_RADIUS_METERS * Math.cos(toRadians(originLatitude)))) * (180 / Math.PI),
    };
}

function closestPointOnSegment(point, start, end) {
    const a = projectLocal(start, point.lat);
    const b = projectLocal(end, point.lat);
    const p = projectLocal(point, point.lat);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy;
    const ratio = lengthSquared === 0
        ? 0
        : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared));
    const projected = { x: a.x + dx * ratio, y: a.y + dy * ratio };

    return {
        latLng: unprojectLocal(projected, point.lat),
        ratio,
        distance: Math.hypot(p.x - projected.x, p.y - projected.y),
    };
}

export function createSmoothGeometry(points, samplesPerSegment = 8) {
    if (!Array.isArray(points) || points.length < 2) {
        throw new TypeError('El traçat ha de contenir com a mínim dos punts.');
    }
    if (!Number.isInteger(samplesPerSegment) || samplesPerSegment < 2) {
        throw new RangeError('La resolució de les corbes ha de ser com a mínim de dos punts.');
    }

    const originLatitude = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
    const localPoints = points.map((point) => projectLocal(point, originLatitude));
    const geometry = [{ ...points[0] }];

    for (let index = 0; index < localPoints.length - 1; index += 1) {
        const previous = localPoints[Math.max(0, index - 1)];
        const start = localPoints[index];
        const end = localPoints[index + 1];
        const next = localPoints[Math.min(localPoints.length - 1, index + 2)];
        const control1 = {
            x: start.x + (end.x - previous.x) / 6,
            y: start.y + (end.y - previous.y) / 6,
        };
        const control2 = {
            x: end.x - (next.x - start.x) / 6,
            y: end.y - (next.y - start.y) / 6,
        };

        for (let step = 1; step <= samplesPerSegment; step += 1) {
            const t = step / samplesPerSegment;
            const inverse = 1 - t;
            if (step === samplesPerSegment) {
                geometry.push({ ...points[index + 1] });
                continue;
            }
            const point = {
                x: inverse ** 3 * start.x + 3 * inverse ** 2 * t * control1.x +
                    3 * inverse * t ** 2 * control2.x + t ** 3 * end.x,
                y: inverse ** 3 * start.y + 3 * inverse ** 2 * t * control1.y +
                    3 * inverse * t ** 2 * control2.y + t ** 3 * end.y,
            };
            geometry.push(unprojectLocal(point, originLatitude));
        }
    }

    geometry[0] = { ...points[0] };
    geometry[geometry.length - 1] = { ...points[points.length - 1] };
    return geometry;
}

export class RailNetwork {
    constructor({ snapToleranceMeters = DEFAULT_SNAP_TOLERANCE_METERS } = {}) {
        if (!Number.isFinite(snapToleranceMeters) || snapToleranceMeters < 0) {
            throw new RangeError('La tolerància de snapping ha de ser un valor no negatiu.');
        }
        this.snapToleranceMeters = snapToleranceMeters;
        this.nodes = new Map();
        this.segments = new Map();
        this.stations = new Map();
        this.nextNumber = 1;
    }

    nextId(prefix) {
        const id = `${prefix}-${this.nextNumber}`;
        this.nextNumber += 1;
        return id;
    }

    createNode(latLng, type = 'junction') {
        const node = {
            id: this.nextId('node'),
            lat: latLng.lat,
            lng: latLng.lng,
            type,
            connectedSegments: [],
        };
        this.nodes.set(node.id, node);
        return node;
    }

    findNearestNode(latLng, maxDistanceMeters = this.snapToleranceMeters) {
        let nearest = null;
        let nearestDistance = maxDistanceMeters;
        for (const node of this.nodes.values()) {
            const distance = distanceMeters(latLng, node);
            if (distance <= nearestDistance) {
                nearest = node;
                nearestDistance = distance;
            }
        }
        return nearest ? { node: nearest, distance: nearestDistance } : null;
    }

    findNearestSegmentPoint(latLng, maxDistanceMeters = this.snapToleranceMeters) {
        let nearest = null;
        let nearestDistance = maxDistanceMeters;

        for (const segment of this.segments.values()) {
            for (let index = 1; index < segment.geometry.length; index += 1) {
                const projection = closestPointOnSegment(
                    latLng,
                    segment.geometry[index - 1],
                    segment.geometry[index],
                );
                if (projection.distance <= nearestDistance) {
                    nearest = {
                        segment,
                        geometryIndex: index,
                        ...projection,
                    };
                    nearestDistance = projection.distance;
                }
            }
        }
        return nearest;
    }

    findSnap(latLng, maxDistanceMeters = this.snapToleranceMeters) {
        const nodeSnap = this.findNearestNode(latLng, maxDistanceMeters);
        const segmentSnap = this.findNearestSegmentPoint(latLng, maxDistanceMeters);
        if (!nodeSnap && !segmentSnap) {
            return null;
        }
        if (nodeSnap && (
            !segmentSnap ||
            nodeSnap.distance <= 20 ||
            nodeSnap.distance <= segmentSnap.distance
        )) {
            return {
                kind: 'node',
                nodeId: nodeSnap.node.id,
                latLng: { lat: nodeSnap.node.lat, lng: nodeSnap.node.lng },
                distance: nodeSnap.distance,
            };
        }
        return {
            kind: 'segment',
            segmentId: segmentSnap.segment.id,
            geometryIndex: segmentSnap.geometryIndex,
            ratio: segmentSnap.ratio,
            latLng: segmentSnap.latLng,
            distance: segmentSnap.distance,
        };
    }

    _createSegment(fromNode, toNode, type, geometry, id = this.nextId('segment')) {
        const lengthMeters = geometryLength(geometry);
        const segment = {
            id,
            from: fromNode.id,
            to: toNode.id,
            type,
            geometry,
            lengthMeters,
            maxSpeed: TRACK_TYPES[type].maxSpeed,
            cost: estimateTrackCost(type, lengthMeters),
            status: 'planned',
            physicalTracks: type === 'single'
                ? [{ id: `${id}-shared`, direction: 'both' }]
                : [
                    { id: `${id}-forward`, direction: 'forward' },
                    { id: `${id}-reverse`, direction: 'reverse' },
                ],
        };
        this.segments.set(segment.id, segment);
        fromNode.connectedSegments.push(segment.id);
        toNode.connectedSegments.push(segment.id);
        return segment;
    }

    _detachSegment(segment) {
        this.segments.delete(segment.id);
        for (const nodeId of [segment.from, segment.to]) {
            const node = this.nodes.get(nodeId);
            if (node) {
                node.connectedSegments = node.connectedSegments.filter((id) => id !== segment.id);
            }
        }
    }

    _splitSegmentAt(segmentId, geometryIndex, latLng) {
        const segment = this.segments.get(segmentId);
        if (!segment) {
            return null;
        }

        const startNode = this.nodes.get(segment.from);
        const endNode = this.nodes.get(segment.to);
        if (distanceMeters(latLng, startNode) < 1) {
            return startNode;
        }
        if (distanceMeters(latLng, endNode) < 1) {
            return endNode;
        }

        const junction = this.createNode(latLng, 'junction');
        const firstGeometry = [
            ...segment.geometry.slice(0, geometryIndex),
            { ...latLng },
        ];
        const secondGeometry = [
            { ...latLng },
            ...segment.geometry.slice(geometryIndex),
        ];
        this._detachSegment(segment);
        this._createSegment(startNode, junction, segment.type, firstGeometry, segment.id);
        this._createSegment(junction, endNode, segment.type, secondGeometry);
        return junction;
    }

    _resolvePoint(latLng, snapToleranceMeters) {
        const snap = this.findSnap(latLng, snapToleranceMeters);
        if (!snap) {
            return this.createNode(latLng, 'switch');
        }
        if (snap.kind === 'node') {
            return this.nodes.get(snap.nodeId);
        }
        return this._splitSegmentAt(snap.segmentId, snap.geometryIndex, snap.latLng);
    }

    addRoute(points, trackType = 'single', snapToleranceMeters = this.snapToleranceMeters) {
        if (!getTrackType(trackType)) {
            throw new RangeError(`El tipus de via «${trackType}» no és vàlid.`);
        }
        if (!Array.isArray(points) || points.length < 2) {
            throw new TypeError('El traçat ha de contenir com a mínim dos punts.');
        }

        const routePoints = points.map((point) => ({ lat: point.lat, lng: point.lng }));
        const fromNode = this._resolvePoint(routePoints[0], snapToleranceMeters);
        const toNode = this._resolvePoint(routePoints[routePoints.length - 1], snapToleranceMeters);
        if (fromNode.id === toNode.id) {
            return null;
        }

        routePoints[0] = { lat: fromNode.lat, lng: fromNode.lng };
        routePoints[routePoints.length - 1] = { lat: toNode.lat, lng: toNode.lng };
        const geometry = createSmoothGeometry(routePoints);
        return this._createSegment(fromNode, toNode, trackType, geometry);
    }

    addSegment(startLatLng, endLatLng, trackType = 'single') {
        return this.addRoute([startLatLng, endLatLng], trackType);
    }

    addStation(latLng, stationName = null, snapToleranceMeters = this.snapToleranceMeters) {
        const snap = this.findSnap(latLng, snapToleranceMeters);
        if (!snap) {
            return null;
        }

        const node = snap.kind === 'node'
            ? this.nodes.get(snap.nodeId)
            : this._splitSegmentAt(snap.segmentId, snap.geometryIndex, snap.latLng);
        if (!node) {
            return null;
        }
        node.type = 'station';

        const station = {
            id: this.nextId('station'),
            name: stationName ?? `Estació ${this.stations.size + 1}`,
            lat: node.lat,
            lng: node.lng,
            nodeId: node.id,
            connectedSegments: [...node.connectedSegments],
        };
        this.stations.set(station.id, station);
        return station;
    }

    removeSegment(segmentId) {
        const segment = this.segments.get(segmentId);
        if (!segment) {
            return false;
        }
        this._detachSegment(segment);
        return true;
    }

    serialize() {
        return {
            nodes: [...this.nodes.values()],
            segments: [...this.segments.values()],
            stations: [...this.stations.values()],
        };
    }
}

function offsetGeometry(map, geometry, offsetPixels) {
    const points = geometry.map((point) => map.latLngToLayerPoint(point));
    return points.map((point, index) => {
        const previous = points[Math.max(0, index - 1)];
        const next = points[Math.min(points.length - 1, index + 1)];
        const dx = next.x - previous.x;
        const dy = next.y - previous.y;
        const length = Math.hypot(dx, dy) || 1;
        const nearbyLatLng = map.layerPointToLatLng([point.x + 1, point.y]);
        const metersPerPixel = map.distance(map.layerPointToLatLng(point), nearbyLatLng);
        const effectiveOffset = Math.sign(offsetPixels) *
            Math.min(Math.abs(offsetPixels), 250 / Math.max(metersPerPixel, 0.001));
        return map.layerPointToLatLng([
            point.x - (dy / length) * effectiveOffset,
            point.y + (dx / length) * effectiveOffset,
        ]);
    });
}

export function createRailBuilder(map, options = {}) {
    const network = new RailNetwork(options);
    let selectedTrackType = options.trackType ?? 'single';
    if (!getTrackType(selectedTrackType)) {
        throw new RangeError(`El tipus de via «${selectedTrackType}» no és vàlid.`);
    }
    const railLayer = L.layerGroup().addTo(map);
    const previewLayer = L.layerGroup().addTo(map);

    function getPixelTolerance(latLng) {
        const containerPoint = map.latLngToContainerPoint(latLng);
        const nearbyPoint = map.containerPointToLatLng([
            containerPoint.x + 12,
            containerPoint.y,
        ]);
        return Math.max(20, Math.min(800, map.distance(latLng, nearbyPoint)));
    }

    function drawNetwork() {
        railLayer.clearLayers();
        for (const segment of network.segments.values()) {
            const trackConfig = TRACK_TYPES[segment.type];
            const style = {
                color: trackConfig.color,
                weight: trackConfig.width,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
            };

            if (segment.type === 'single') {
                L.polyline(segment.geometry, style).addTo(railLayer);
            } else {
                L.polyline(offsetGeometry(map, segment.geometry, trackConfig.laneOffset), style).addTo(railLayer);
                L.polyline(offsetGeometry(map, segment.geometry, -trackConfig.laneOffset), style).addTo(railLayer);
            }
        }

        for (const station of network.stations.values()) {
            L.circleMarker([station.lat, station.lng], {
                radius: 6,
                color: '#0f172a',
                weight: 2,
                fillColor: '#ffffff',
                fillOpacity: 1,
            }).bindTooltip(station.name).addTo(railLayer);
        }
    }

    const builder = {
        network,
        get selectedTrackType() {
            return selectedTrackType;
        },
        set selectedTrackType(value) {
            if (!getTrackType(value)) {
                throw new RangeError(`El tipus de via «${value}» no és vàlid.`);
            }
            selectedTrackType = value;
        },
        addTrack(startLatLng, endLatLng) {
            const segment = network.addSegment(startLatLng, endLatLng, selectedTrackType);
            drawNetwork();
            return segment;
        },
        addRoute(points) {
            const tolerance = Math.max(...points.map(getPixelTolerance));
            const segment = network.addRoute(points, selectedTrackType, tolerance);
            drawNetwork();
            return segment;
        },
        addStation(latLng, stationName = null) {
            const station = network.addStation(latLng, stationName, getPixelTolerance(latLng));
            drawNetwork();
            return station;
        },
        findSnap(latLng, tolerance) {
            return network.findSnap(latLng, tolerance ?? getPixelTolerance(latLng));
        },
        renderPreview(points, snapPoint = null) {
            previewLayer.clearLayers();
            if (points.length >= 2) {
                const geometry = createSmoothGeometry(points);
                const config = TRACK_TYPES[selectedTrackType];
                const style = {
                    color: config.color,
                    weight: config.width + 1,
                    opacity: 0.8,
                    dashArray: '7 7',
                    lineCap: 'round',
                    lineJoin: 'round',
                };
                if (selectedTrackType === 'single') {
                    L.polyline(geometry, style).addTo(previewLayer);
                } else {
                    L.polyline(offsetGeometry(map, geometry, config.laneOffset), style).addTo(previewLayer);
                    L.polyline(offsetGeometry(map, geometry, -config.laneOffset), style).addTo(previewLayer);
                }
            }
            if (snapPoint) {
                L.circleMarker(snapPoint, {
                    radius: 8,
                    color: '#16a34a',
                    weight: 3,
                    fillColor: '#ffffff',
                    fillOpacity: 0.9,
                }).addTo(previewLayer);
            }
        },
        clearPreview() {
            previewLayer.clearLayers();
        },
        drawNetwork,
    };

    map.on('move zoom viewreset', drawNetwork);
    drawNetwork();
    return builder;
}
