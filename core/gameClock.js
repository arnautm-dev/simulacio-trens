import { PAUSED_MULTIPLIER, isSupportedSpeed } from './simulationSpeed.js';

export const DEFAULT_START_DATE = Object.freeze({
    year: 2026,
    month: 1,
    day: 1,
    hour: 6,
    minute: 0,
    second: 0,
});

export const TIME_SAVE_VERSION = 1;

function assertValidDateTime(dateTime) {
    const values = ['year', 'month', 'day', 'hour', 'minute', 'second'];
    if (!dateTime || values.some((key) => !Number.isInteger(dateTime[key]))) {
        throw new TypeError('La data inicial ha de contenir valors enters de calendari.');
    }

    const { year, month, day, hour, minute, second } = dateTime;
    if (year < 1 || year > 9999 || month < 1 || month > 12 ||
        day < 1 || day > 31 || hour < 0 || hour > 23 ||
        minute < 0 || minute > 59 || second < 0 || second > 59) {
        throw new RangeError('La data o l’hora inicial no són vàlides.');
    }

    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(hour, minute, second, 0);

    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day || date.getUTCHours() !== hour ||
        date.getUTCMinutes() !== minute || date.getUTCSeconds() !== second) {
        throw new RangeError('La data o l’hora inicial no són vàlides.');
    }

    return date;
}

export function dateTimeToSeconds(dateTime) {
    return assertValidDateTime(dateTime).getTime() / 1000;
}

export function secondsToDateTime(totalSeconds) {
    if (!Number.isFinite(totalSeconds)) {
        throw new TypeError('El temps del joc ha de ser un nombre finit de segons.');
    }

    const date = new Date(Math.floor(totalSeconds) * 1000);
    if (Number.isNaN(date.getTime())) {
        throw new RangeError('El temps del joc és fora del calendari admès.');
    }

    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
    };
}

function twoDigits(value) {
    return String(value).padStart(2, '0');
}

export function formatGameDateTime(totalSeconds) {
    const { year, month, day, hour, minute, second } = secondsToDateTime(totalSeconds);
    const fullYear = String(year).padStart(4, '0');
    return `${twoDigits(day)}/${twoDigits(month)}/${fullYear} — ${twoDigits(hour)}:${twoDigits(minute)}:${twoDigits(second)}`;
}

export function createGameClock(initialDate = DEFAULT_START_DATE) {
    const initialTimeSeconds = dateTimeToSeconds(initialDate);
    let currentTimeSeconds = initialTimeSeconds;
    let elapsedSeconds = 0;

    return {
        advance(realSeconds, speedMultiplier) {
            if (!Number.isFinite(realSeconds) || realSeconds < 0) {
                throw new RangeError('El temps real transcorregut ha de ser finit i no negatiu.');
            }
            if (speedMultiplier !== PAUSED_MULTIPLIER && !isSupportedSpeed(speedMultiplier)) {
                throw new RangeError('La velocitat seleccionada no és vàlida.');
            }

            const gameSeconds = realSeconds * speedMultiplier;
            currentTimeSeconds += gameSeconds;
            elapsedSeconds += gameSeconds;
        },

        getCurrentTimeSeconds() {
            return currentTimeSeconds;
        },

        getDateTime() {
            return secondsToDateTime(currentTimeSeconds);
        },

        getElapsedSeconds() {
            return elapsedSeconds;
        },

        reset() {
            currentTimeSeconds = initialTimeSeconds;
            elapsedSeconds = 0;
        },

        restore(state) {
            if (!state || !Number.isFinite(state.currentTimeSeconds) ||
                !Number.isFinite(state.elapsedSeconds) || state.elapsedSeconds < 0) {
                throw new TypeError('Les dades de temps desades no són vàlides.');
            }

            secondsToDateTime(state.currentTimeSeconds);
            currentTimeSeconds = state.currentTimeSeconds;
            elapsedSeconds = state.elapsedSeconds;
        },
    };
}

export function serializeGameTime(clock, selectedSpeed, manualPaused) {
    if (!isSupportedSpeed(selectedSpeed) || typeof manualPaused !== 'boolean') {
        throw new TypeError('L’estat de velocitat o pausa no és vàlid.');
    }

    const currentTimeSeconds = clock.getCurrentTimeSeconds();
    return {
        version: TIME_SAVE_VERSION,
        currentTimeSeconds,
        currentDateTime: formatGameDateTime(currentTimeSeconds),
        elapsedSeconds: clock.getElapsedSeconds(),
        selectedSpeed,
        manualPaused,
    };
}

export function restoreGameTime(clock, state) {
    if (!state || state.version !== TIME_SAVE_VERSION ||
        !isSupportedSpeed(state.selectedSpeed) ||
        typeof state.manualPaused !== 'boolean') {
        throw new TypeError('El desament horari no és vàlid o no és compatible.');
    }

    if (state.currentDateTime !== formatGameDateTime(state.currentTimeSeconds)) {
        throw new TypeError('La data i l’hora del desament no coincideixen.');
    }

    clock.restore({
        currentTimeSeconds: state.currentTimeSeconds,
        elapsedSeconds: state.elapsedSeconds,
    });

    return {
        selectedSpeed: state.selectedSpeed,
        manualPaused: state.manualPaused,
    };
}
