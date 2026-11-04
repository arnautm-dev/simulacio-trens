import {
    lonLatToWorld,
    worldToLonLat,
    screenToWorld,
    worldToScreen,
} from './mapProjection.js';

export function getMapCoordinatesFromLonLat(latitude, longitude) {
    return lonLatToWorld(latitude, longitude);
}

export function getLonLatFromMapCoordinates(worldX, worldY) {
    return worldToLonLat(worldX, worldY);
}

export function projectWorldPointToScreen(worldX, worldY, centerX, centerY, zoom, viewportWidth, viewportHeight) {
    return worldToScreen(worldX, worldY, centerX, centerY, zoom, viewportWidth, viewportHeight);
}

export function projectScreenPointToWorld(screenX, screenY, centerX, centerY, zoom, viewportWidth, viewportHeight) {
    return screenToWorld(screenX, screenY, centerX, centerY, zoom, viewportWidth, viewportHeight);
}
