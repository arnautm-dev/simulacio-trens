export const SPEED_MULTIPLIERS = Object.freeze([0, 1, 2, 4, 8, 16]);
export const PLAY_SPEEDS = Object.freeze(SPEED_MULTIPLIERS.filter((speed) => speed > 0));
export const PAUSED_MULTIPLIER = 0;

export function isSupportedSpeed(speed) {
    return PLAY_SPEEDS.includes(speed);
}

export function getAdjacentSpeed(speed, direction) {
    const currentIndex = PLAY_SPEEDS.indexOf(speed);
    if (currentIndex === -1 || !Number.isInteger(direction)) {
        throw new RangeError('No es pot calcular el canvi de velocitat sol·licitat.');
    }

    const nextIndex = Math.max(0, Math.min(PLAY_SPEEDS.length - 1, currentIndex + direction));
    return PLAY_SPEEDS[nextIndex];
}
