import {
    clamp,
    lonLatToWorld,
    screenToWorld,
    worldToScreen,
} from './mapProjection.js';

export function createMapCamera({
    initialCenter,
    initialZoom,
    minZoom,
    maxZoom,
    viewportWidth = 1200,
    viewportHeight = 700,
}) {
    let zoom = clamp(initialZoom, minZoom, maxZoom);
    let centerWorld = lonLatToWorld(initialCenter.lat, initialCenter.lon);
    let width = viewportWidth;
    let height = viewportHeight;

    function updateCenterFromAnchor(screenX, screenY, nextZoom) {
        const worldAtCursor = screenToWorld(screenX, screenY, centerWorld.x, centerWorld.y, zoom, width, height);
        zoom = clamp(nextZoom, minZoom, maxZoom);
        const adjustedCenter = screenToWorld(screenX, screenY, centerWorld.x, centerWorld.y, zoom, width, height);
        centerWorld.x += worldAtCursor.x - adjustedCenter.x;
        centerWorld.y += worldAtCursor.y - adjustedCenter.y;
    }

    return {
        getZoom() {
            return zoom;
        },

        setZoom(value) {
            zoom = clamp(value, minZoom, maxZoom);
        },

        zoomAt(screenX, screenY, delta) {
            const nextZoom = zoom + delta;
            const worldBefore = screenToWorld(screenX, screenY, centerWorld.x, centerWorld.y, zoom, width, height);
            zoom = clamp(nextZoom, minZoom, maxZoom);
            const worldAfter = screenToWorld(screenX, screenY, centerWorld.x, centerWorld.y, zoom, width, height);
            centerWorld.x += worldBefore.x - worldAfter.x;
            centerWorld.y += worldBefore.y - worldAfter.y;
        },

        setCenter(worldX, worldY) {
            centerWorld.x = worldX;
            centerWorld.y = worldY;
        },

        panBy(dx, dy) {
            const { scale } = worldToScreen(0, 0, centerWorld.x, centerWorld.y, zoom, width, height);
            const worldDeltaX = (dx / scale) * 1;
            const worldDeltaY = (dy / scale) * 1;
            centerWorld.x -= worldDeltaX;
            centerWorld.y -= worldDeltaY;
        },

        setSize(nextWidth, nextHeight) {
            width = nextWidth;
            height = nextHeight;
        },

        getViewSize() {
            return { width, height };
        },

        getCenter() {
            return { ...centerWorld };
        },

        worldToScreen(worldX, worldY) {
            return worldToScreen(worldX, worldY, centerWorld.x, centerWorld.y, zoom, width, height);
        },

        screenToWorld(screenX, screenY) {
            return screenToWorld(screenX, screenY, centerWorld.x, centerWorld.y, zoom, width, height);
        },

        getBounds() {
            return {
                minX: centerWorld.x - (width / 2) / ((2 ** zoom) * 256 / 40075016.68557849),
                maxX: centerWorld.x + (width / 2) / ((2 ** zoom) * 256 / 40075016.68557849),
                minY: centerWorld.y - (height / 2) / ((2 ** zoom) * 256 / 40075016.68557849),
                maxY: centerWorld.y + (height / 2) / ((2 ** zoom) * 256 / 40075016.68557849),
            };
        },
    };
}
