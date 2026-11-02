import { PAUSED_MULTIPLIER } from './simulationSpeed.js';

export const MAX_FRAME_DELTA_SECONDS = 1;

export function createGameLoop({
    clock,
    getSpeed,
    isPaused,
    onFrame,
    documentRef = globalThis.document,
    requestFrame = globalThis.requestAnimationFrame,
    cancelFrame = globalThis.cancelAnimationFrame,
}) {
    if (!clock || typeof getSpeed !== 'function' ||
        typeof isPaused !== 'function' || typeof onFrame !== 'function' ||
        typeof requestFrame !== 'function' || typeof cancelFrame !== 'function') {
        throw new TypeError('Falten dependències vàlides per inicialitzar el bucle temporal.');
    }

    let running = false;
    let frameId = null;
    let previousTimestamp = null;

    const scheduleFrame = () => {
        if (running && (!documentRef || !documentRef.hidden) && frameId === null) {
            frameId = requestFrame(onAnimationFrame);
        }
    };

    const onAnimationFrame = (timestamp) => {
        frameId = null;
        if (!running || (documentRef && documentRef.hidden)) {
            previousTimestamp = null;
            return;
        }

        if (previousTimestamp !== null) {
            const realSeconds = Math.max(0, (timestamp - previousTimestamp) / 1000);
            const effectiveSpeed = isPaused() ? PAUSED_MULTIPLIER : getSpeed();
            clock.advance(Math.min(realSeconds, MAX_FRAME_DELTA_SECONDS), effectiveSpeed);
        }

        previousTimestamp = timestamp;
        onFrame();
        scheduleFrame();
    };

    const onVisibilityChange = () => {
        if (!running) {
            return;
        }

        if (documentRef.hidden) {
            if (frameId !== null) {
                cancelFrame(frameId);
                frameId = null;
            }
            previousTimestamp = null;
            return;
        }

        previousTimestamp = null;
        onFrame();
        scheduleFrame();
    };

    return {
        start() {
            if (running) {
                return;
            }

            running = true;
            if (documentRef) {
                documentRef.addEventListener('visibilitychange', onVisibilityChange);
            }
            previousTimestamp = null;
            onFrame();
            scheduleFrame();
        },

        stop() {
            if (!running) {
                return;
            }

            running = false;
            if (documentRef) {
                documentRef.removeEventListener('visibilitychange', onVisibilityChange);
            }
            if (frameId !== null) {
                cancelFrame(frameId);
                frameId = null;
            }
            previousTimestamp = null;
        },
    };
}
