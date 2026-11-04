export const WORLD_HALF_SIZE = 20037508.342789244;
export const WORLD_SIZE = WORLD_HALF_SIZE * 2;
export const TILE_SIZE = 256;

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function mercatorXFromLongitude(longitude) {
    return (longitude * WORLD_HALF_SIZE) / 180;
}

export function mercatorYFromLatitude(latitude) {
    const latitudeRadians = (latitude * Math.PI) / 180;
    const sinLatitude = Math.sin(latitudeRadians);
    return (
        (Math.log((1 + sinLatitude) / (1 - sinLatitude)) / 2) * WORLD_HALF_SIZE
    ) / Math.PI;
}

export function longitudeFromMercatorX(x) {
    return (x * 180) / WORLD_HALF_SIZE;
}

export function latitudeFromMercatorY(y) {
    const latitudeRadians = (2 * Math.atan(Math.exp((y * Math.PI) / WORLD_HALF_SIZE)) - Math.PI / 2);
    return (latitudeRadians * 180) / Math.PI;
}

export function lonLatToWorld(lat, lon) {
    return {
        x: mercatorXFromLongitude(lon),
        y: mercatorYFromLatitude(lat),
    };
}

export function worldToLonLat(worldX, worldY) {
    return {
        lon: longitudeFromMercatorX(worldX),
        lat: latitudeFromMercatorY(worldY),
    };
}

export function worldToTilePixel(worldX, worldY, zoom) {
    const worldSize = TILE_SIZE * (2 ** zoom);
    const pixelX = ((worldX + WORLD_HALF_SIZE) / WORLD_SIZE) * worldSize;
    const pixelY = ((WORLD_HALF_SIZE - worldY) / WORLD_SIZE) * worldSize;

    return {
        x: Math.floor(pixelX / TILE_SIZE),
        y: Math.floor(pixelY / TILE_SIZE),
        localX: pixelX % TILE_SIZE,
        localY: pixelY % TILE_SIZE,
    };
}

export function tileToWorldBounds(tileX, tileY, zoom) {
    const tileWorldSize = WORLD_SIZE / (2 ** zoom);
    const worldX = tileX * tileWorldSize - WORLD_HALF_SIZE;
    const worldY = WORLD_HALF_SIZE - (tileY + 1) * tileWorldSize;

    return {
        left: worldX,
        top: worldY,
        right: worldX + tileWorldSize,
        bottom: worldY + tileWorldSize,
    };
}

export function tileKey(tileX, tileY, zoom) {
    return `${zoom}/${tileX}/${tileY}`;
}

export function getZoomScale(zoom) {
    return 2 ** zoom;
}

export function getWorldToScreenScale(zoom, viewportWidth, viewportHeight) {
    const scale = (getZoomScale(zoom) * TILE_SIZE) / WORLD_SIZE;
    return {
        scale,
        worldPerPixelX: WORLD_SIZE / (getZoomScale(zoom) * TILE_SIZE * viewportWidth),
        worldPerPixelY: WORLD_SIZE / (getZoomScale(zoom) * TILE_SIZE * viewportHeight),
    };
}

export function worldToScreen(worldX, worldY, centerX, centerY, zoom, viewportWidth, viewportHeight) {
    const { scale } = getWorldToScreenScale(zoom, viewportWidth, viewportHeight);
    return {
        x: (worldX - centerX) * scale + (viewportWidth / 2),
        y: (worldY - centerY) * scale + (viewportHeight / 2),
    };
}

export function screenToWorld(screenX, screenY, centerX, centerY, zoom, viewportWidth, viewportHeight) {
    const { scale } = getWorldToScreenScale(zoom, viewportWidth, viewportHeight);
    return {
        x: ((screenX - (viewportWidth / 2)) / scale) + centerX,
        y: ((screenY - (viewportHeight / 2)) / scale) + centerY,
    };
}

export function getVisibleTilesForView(centerX, centerY, zoom, viewportWidth, viewportHeight) {
    const leftWorld = screenToWorld(0, 0, centerX, centerY, zoom, viewportWidth, viewportHeight);
    const rightWorld = screenToWorld(viewportWidth, viewportHeight, centerX, centerY, zoom, viewportWidth, viewportHeight);
    const minX = Math.min(leftWorld.x, rightWorld.x);
    const maxX = Math.max(leftWorld.x, rightWorld.x);
    const minY = Math.min(leftWorld.y, rightWorld.y);
    const maxY = Math.max(leftWorld.y, rightWorld.y);

    const minTile = worldToTilePixel(minX, minY, zoom);
    const maxTile = worldToTilePixel(maxX, maxY, zoom);

    const tileMinX = Math.max(0, minTile.x - 1);
    const tileMaxX = Math.max(tileMinX, maxTile.x + 1);
    const tileMinY = Math.max(0, minTile.y - 1);
    const tileMaxY = Math.max(tileMinY, maxTile.y + 1);

    const tiles = [];
    const maxTilesPerSide = 2 ** zoom;

    for (let tileY = tileMinY; tileY <= tileMaxY; tileY += 1) {
        if (tileY < 0 || tileY >= maxTilesPerSide) {
            continue;
        }

        for (let tileX = tileMinX; tileX <= tileMaxX; tileX += 1) {
            if (tileX < 0 || tileX >= maxTilesPerSide) {
                continue;
            }

            tiles.push({ tileX, tileY, zoom });
        }
    }

    return tiles;
}
