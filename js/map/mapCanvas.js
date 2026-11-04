import { CATALONIA_MAP } from '../data/cataloniaMap.js';
import { createMapCamera } from './mapCamera.js';
import { createMapTileManager } from './mapTileManager.js';
import { createMapTileRenderer } from './mapTileRenderer.js';

export function createMapCanvas({
    canvas,
    container,
    config = CATALONIA_MAP,
}) {
    if (!canvas) {
        throw new Error('No s’ha trobat el canvas del mapa.');
    }

    const context = canvas.getContext('2d');
    const tileManager = createMapTileManager({ tileServer: config.tileServer });
    const camera = createMapCamera({
        initialCenter: config.center,
        initialZoom: config.initialZoom,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        viewportWidth: 960,
        viewportHeight: 700,
    });
    const tileRenderer = createMapTileRenderer({ canvas, context, camera, tileManager });

    let isDragging = false;
    let dragStart = null;
    let dragOrigin = null;

    function resize() {
        const bounds = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetWidth = Math.max(1, Math.floor(bounds.width * dpr));
        const targetHeight = Math.max(1, Math.floor(bounds.height * dpr));

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }

        canvas.style.width = `${bounds.width}px`;
        canvas.style.height = `${bounds.height}px`;
        camera.setSize(bounds.width, bounds.height);
        tileRenderer.render();
    }

    function handlePointerDown(event) {
        isDragging = true;
        dragStart = { x: event.clientX, y: event.clientY };
        dragOrigin = camera.getCenter();
        canvas.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event) {
        if (!isDragging || !dragStart || !dragOrigin) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const startWorld = camera.screenToWorld(dragStart.x - rect.left, dragStart.y - rect.top);
        const pointerWorld = camera.screenToWorld(event.clientX - rect.left, event.clientY - rect.top);

        camera.setCenter(dragOrigin.x - (pointerWorld.x - startWorld.x), dragOrigin.y - (pointerWorld.y - startWorld.y));
        tileRenderer.render();
    }

    function handlePointerUp(event) {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        dragStart = null;
        dragOrigin = null;
        canvas.releasePointerCapture?.(event.pointerId);
    }

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;
        const delta = event.deltaY < 0 ? 0.6 : -0.6;

        camera.zoomAt(screenX, screenY, delta);
        tileRenderer.render();
    }, { passive: false });

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    let animationFrameId = null;

    function animate() {
        tileRenderer.render();
        animationFrameId = window.requestAnimationFrame(animate);
    }

    return {
        start() {
            resize();
            animationFrameId = window.requestAnimationFrame(animate);
        },
        render() {
            tileRenderer.render();
        },
        dispose() {
            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
            }
            resizeObserver.disconnect();
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointerleave', handlePointerUp);
        },
        camera,
        tileManager,
    };
}
