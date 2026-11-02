import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameClock, dateTimeToSeconds, formatGameDateTime, restoreGameTime, serializeGameTime } from '../core/gameClock.js';
import { createGameLoop, MAX_FRAME_DELTA_SECONDS } from '../core/gameLoop.js';
import { PLAY_SPEEDS, getAdjacentSpeed } from '../core/simulationSpeed.js';

function createFakeBrowser() {
    let nextFrameId = 0;
    const frames = new Map();
    const listeners = new Map();
    const documentRef = {
        hidden: false,
        addEventListener(name, callback) {
            listeners.set(name, callback);
        },
        removeEventListener(name) {
            listeners.delete(name);
        },
        dispatch(name) {
            listeners.get(name)?.();
        },
    };

    return {
        documentRef,
        requestFrame(callback) {
            const id = ++nextFrameId;
            frames.set(id, callback);
            return id;
        },
        cancelFrame(id) {
            frames.delete(id);
        },
        tick(timestamp) {
            const nextFrame = frames.entries().next().value;
            assert.ok(nextFrame, 's’espera un fotograma programat');
            const [id, callback] = nextFrame;
            frames.delete(id);
            callback(timestamp);
        },
        get pendingFrames() {
            return frames.size;
        },
    };
}

function createLoop(clock, { speed = () => 1, paused = () => false, browser = createFakeBrowser() } = {}) {
    const loop = createGameLoop({
        clock,
        getSpeed: speed,
        isPaused: paused,
        onFrame() {},
        documentRef: browser.documentRef,
        requestFrame: browser.requestFrame,
        cancelFrame: browser.cancelFrame,
    });
    return { loop, browser };
}

test('avança segons i canvia minuts i hores', () => {
    const clock = createGameClock({ year: 2026, month: 1, day: 1, hour: 5, minute: 59, second: 59 });
    clock.advance(1, 1);
    assert.deepEqual(clock.getDateTime(), { year: 2026, month: 1, day: 1, hour: 6, minute: 0, second: 0 });

    clock.advance(60, 1);
    assert.deepEqual(clock.getDateTime(), { year: 2026, month: 1, day: 1, hour: 6, minute: 1, second: 0 });
});

test('canvia correctament de dia, mes i any', () => {
    const clock = createGameClock({ year: 2026, month: 12, day: 31, hour: 23, minute: 59, second: 59 });
    clock.advance(1, 1);
    assert.deepEqual(clock.getDateTime(), { year: 2027, month: 1, day: 1, hour: 0, minute: 0, second: 0 });
});

test('gestiona anys de traspàs i rebutja el 29 de febrer no vàlid', () => {
    const leapClock = createGameClock({ year: 2028, month: 2, day: 28, hour: 23, minute: 59, second: 59 });
    leapClock.advance(1, 1);
    assert.deepEqual(leapClock.getDateTime(), { year: 2028, month: 2, day: 29, hour: 0, minute: 0, second: 0 });

    const regularClock = createGameClock({ year: 2027, month: 2, day: 28, hour: 23, minute: 59, second: 59 });
    regularClock.advance(1, 1);
    assert.deepEqual(regularClock.getDateTime(), { year: 2027, month: 3, day: 1, hour: 0, minute: 0, second: 0 });
    assert.throws(() => dateTimeToSeconds({ year: 2027, month: 2, day: 29, hour: 0, minute: 0, second: 0 }), RangeError);
});

test('aplica totes les velocitats i canvis de velocitat', () => {
    for (const speed of PLAY_SPEEDS) {
        const clock = createGameClock();
        clock.advance(1, speed);
        assert.equal(clock.getElapsedSeconds(), speed);
    }

    assert.deepEqual(
        [getAdjacentSpeed(1, -1), getAdjacentSpeed(16, 1), getAdjacentSpeed(2, 1), getAdjacentSpeed(8, -1)],
        [1, 16, 4, 4],
    );
    assert.throws(() => getAdjacentSpeed(1, -2.5), RangeError);
});

test('la velocitat 0× no avança el rellotge', () => {
    const clock = createGameClock();
    clock.advance(10, 0);
    assert.equal(clock.getElapsedSeconds(), 0);
});

test('la pausa manual congela el rellotge i conserva la velocitat en reprendre', () => {
    const clock = createGameClock();
    let paused = false;
    const { loop, browser } = createLoop(clock, { speed: () => 8, paused: () => paused });
    loop.start();
    browser.tick(0);
    paused = true;
    browser.tick(1000);
    assert.equal(clock.getElapsedSeconds(), 0);
    paused = false;
    browser.tick(2000);
    assert.equal(clock.getElapsedSeconds(), 8);
    loop.stop();
});

test('el resultat no depèn dels FPS en intervals normals', () => {
    function runForTenSeconds(framesPerSecond) {
        const clock = createGameClock();
        const { loop, browser } = createLoop(clock, { speed: () => 4 });
        const frames = framesPerSecond * 10;
        loop.start();
        browser.tick(0);
        for (let frame = 1; frame <= frames; frame += 1) {
            browser.tick(frame * 1000 / framesPerSecond);
        }
        loop.stop();
        return clock.getElapsedSeconds();
    }

    assert.ok(Math.abs(runForTenSeconds(30) - 40) < 1e-9);
    assert.ok(Math.abs(runForTenSeconds(144) - 40) < 1e-9);
});

test('limita el temps acumulat després d’un bloqueig llarg', () => {
    const clock = createGameClock();
    const { loop, browser } = createLoop(clock, { speed: () => 16 });
    loop.start();
    browser.tick(0);
    browser.tick(60000);
    assert.equal(clock.getElapsedSeconds(), MAX_FRAME_DELTA_SECONDS * 16);
    loop.stop();
});

test('congela el temps en perdre el focus i no recupera el temps en segon pla', () => {
    const clock = createGameClock();
    const { loop, browser } = createLoop(clock);
    loop.start();
    browser.tick(0);
    browser.tick(1000);
    assert.equal(clock.getElapsedSeconds(), 1);

    browser.documentRef.hidden = true;
    browser.documentRef.dispatch('visibilitychange');
    assert.equal(browser.pendingFrames, 0);
    browser.documentRef.hidden = false;
    browser.documentRef.dispatch('visibilitychange');
    browser.tick(60000);
    assert.equal(clock.getElapsedSeconds(), 1);
    browser.tick(61000);
    assert.equal(clock.getElapsedSeconds(), 2);
    loop.stop();
});

test('desa i recupera exactament data, temps transcorregut, velocitat i pausa', () => {
    const original = createGameClock();
    original.advance(2.5, 8);
    const serialized = serializeGameTime(original, 8, true);
    assert.equal(serialized.currentDateTime, formatGameDateTime(original.getCurrentTimeSeconds()));

    const restored = createGameClock();
    const restoredSettings = restoreGameTime(restored, serialized);
    assert.equal(restored.getCurrentTimeSeconds(), original.getCurrentTimeSeconds());
    assert.equal(restored.getElapsedSeconds(), original.getElapsedSeconds());
    assert.deepEqual(restoredSettings, { selectedSpeed: 8, manualPaused: true });

    const invalidSave = { ...serialized, currentDateTime: '01/01/2026 — 06:00:00' };
    assert.throws(() => restoreGameTime(createGameClock(), invalidSave), /no coincideixen/);
});
