import { clamp, getVisibleTilesForView, tileToWorldBounds, worldToScreen } from './mapProjection.js';

export function createMapTileRenderer({ canvas, context, camera, tileManager }) {
    return {
        render() {
            const { width, height } = camera.getViewSize();
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#dfeaf2';
            context.fillRect(0, 0, width, height);

            const center = camera.getCenter();
            const zoom = camera.getZoom();
            const tiles = getVisibleTilesForView(center.x, center.y, zoom, width, height);

            for (const tile of tiles) {
                const bounds = tileToWorldBounds(tile.tileX, tile.tileY, tile.zoom);
                const topLeft = worldToScreen(bounds.left, bounds.top, center.x, center.y, tile.zoom, width, height);
                const bottomRight = worldToScreen(bounds.right, bounds.bottom, center.x, center.y, tile.zoom, width, height);

                const drawX = Math.round(topLeft.x);
                const drawY = Math.round(topLeft.y);
                const drawWidth = Math.max(1, Math.round(bottomRight.x - topLeft.x));
                const drawHeight = Math.max(1, Math.round(bottomRight.y - topLeft.y));

                if (drawX + drawWidth < 0 || drawY + drawHeight < 0 || drawX > width || drawY > height) {
                    continue;
                }

                const cachedTile = tileManager.getCachedTile(tile.zoom, tile.tileX, tile.tileY);
                if (!cachedTile) {
                    tileManager.requestTile(tile.zoom, tile.tileX, tile.tileY).catch(() => undefined);
                    continue;
                }

                context.drawImage(cachedTile, drawX, drawY, drawWidth, drawHeight);
            }

            context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            context.lineWidth = 1;
            context.strokeRect(0, 0, width, height);
        },
    };
}
