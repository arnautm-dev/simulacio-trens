import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createSmoothGeometry,
    distanceMeters,
    RailNetwork,
} from '../js/railNetwork.js';

test('genera una corba suau que passa pels punts de control', () => {
    const waypoints = [
        { lat: 41, lng: 2 },
        { lat: 41, lng: 2.01 },
        { lat: 41.01, lng: 2.01 },
    ];
    const geometry = createSmoothGeometry(waypoints);

    assert.equal(geometry.length, 17);
    assert.deepEqual(geometry[0], waypoints[0]);
    assert.deepEqual(geometry[8], waypoints[1]);
    assert.deepEqual(geometry.at(-1), waypoints.at(-1));
    assert.ok(
        geometry.some((point) => point.lat > 41 && point.lng > 2.01),
        'la corba ha de suavitzar el gir entre els trams',
    );
});

test('uneix un nou tram a un node existent dins de la tolerància', () => {
    const network = new RailNetwork();
    const first = network.addSegment(
        { lat: 41, lng: 2 },
        { lat: 41, lng: 2.01 },
    );
    const sharedNode = network.nodes.get(first.to);
    const connected = network.addSegment(
        { lat: sharedNode.lat + 0.00001, lng: sharedNode.lng },
        { lat: 41.01, lng: 2.01 },
    );

    assert.equal(connected.from, sharedNode.id);
    assert.equal(sharedNode.connectedSegments.length, 2);
});

test('projecta el snapping sobre una via corba i divideix el tram per crear una unió', () => {
    const network = new RailNetwork();
    const existing = network.addRoute([
        { lat: 41, lng: 2 },
        { lat: 41, lng: 2.01 },
        { lat: 41.01, lng: 2.01 },
    ]);
    const target = existing.geometry[4];
    const branch = network.addSegment(
        { lat: target.lat + 0.0001, lng: target.lng },
        { lat: 41.02, lng: 2.02 },
    );
    const junction = [...network.nodes.values()].find((node) => node.connectedSegments.length === 3);

    assert.ok(junction, 'el punt projectat ha de connectar tres trams');
    assert.equal(network.segments.size, 3);
    assert.ok(network.segments.has(existing.id), 'conserva l’identificador del primer tram dividit');
    assert.ok(junction.connectedSegments.includes(branch.id));
    assert.ok(distanceMeters(junction, target) < 20);
});

test('col·loca les estacions sobre la projecció real i les connecta al graf', () => {
    const network = new RailNetwork();
    const segment = network.addSegment(
        { lat: 41, lng: 2 },
        { lat: 41, lng: 2.01 },
    );
    const station = network.addStation({ lat: 41.0002, lng: 2.005 }, 'Estació de prova');
    const stationNode = network.nodes.get(station.nodeId);

    assert.equal(station.name, 'Estació de prova');
    assert.ok(Math.abs(station.lng - 2.005) < 1e-8);
    assert.equal(stationNode.type, 'station');
    assert.equal(stationNode.connectedSegments.length, 2);
    assert.equal(network.segments.size, 2);
    assert.ok(network.segments.has(segment.id));
});

test('un encreuament visual no crea connexió sense snapping d’extrem', () => {
    const network = new RailNetwork();
    network.addSegment(
        { lat: 41, lng: 2 },
        { lat: 41, lng: 2.01 },
    );
    network.addSegment(
        { lat: 40.995, lng: 2.005 },
        { lat: 41.005, lng: 2.005 },
    );

    assert.equal(network.nodes.size, 4);
    assert.ok([...network.nodes.values()].every((node) => node.connectedSegments.length === 1));
});
