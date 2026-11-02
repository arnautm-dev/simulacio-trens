import { createGameClock, DEFAULT_START_DATE, formatGameDateTime, restoreGameTime, serializeGameTime } from '../core/gameClock.js';
import { createGameLoop } from '../core/gameLoop.js';
import { getAdjacentSpeed, isSupportedSpeed } from '../core/simulationSpeed.js';

const SAVE_KEY = 'joc-trens-time-save-v1';
const INITIAL_SPEED = 4;

const clock = createGameClock(DEFAULT_START_DATE);
let selectedSpeed = INITIAL_SPEED;
let manualPaused = false;
let gameStarted = false;

const dateTimeElement = document.getElementById('game-date-time');
const pauseButton = document.getElementById('time-toggle');
const pauseIcon = pauseButton.querySelector('span');
const timeStateElement = document.getElementById('time-state');
const speedButtons = [...document.querySelectorAll('.speed-option[data-speed]')];
const speedDownButton = document.getElementById('speed-down');
const speedUpButton = document.getElementById('speed-up');
const saveButton = document.querySelector('.save-button');
const statusElement = document.getElementById('time-save-status');

function renderTime() {
    const currentTimeSeconds = clock.getCurrentTimeSeconds();
    dateTimeElement.textContent = formatGameDateTime(currentTimeSeconds);
    dateTimeElement.dateTime = new Date(currentTimeSeconds * 1000).toISOString();
    timeStateElement.textContent = manualPaused ? 'Pausat' : 'En marxa';
    pauseButton.setAttribute('aria-label', manualPaused ? 'Reprendre el temps' : 'Pausar el temps');
    pauseButton.setAttribute('aria-pressed', String(manualPaused));
    pauseIcon.classList.toggle('icon-pause', !manualPaused);
    pauseIcon.classList.toggle('icon-play', manualPaused);
    for (const button of speedButtons) {
        const active = Number(button.dataset.speed) === selectedSpeed;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    }
    speedDownButton.disabled = selectedSpeed === 1;
    speedUpButton.disabled = selectedSpeed === 16;
}

function showStatus(message) {
    statusElement.textContent = message;
}

function startNewGame(statusMessage = '') {
    const newGameScreen = document.getElementById('new-game-screen');
    newGameScreen.classList.add('hidden');
    newGameScreen.classList.remove('visible');
    clock.reset();
    selectedSpeed = INITIAL_SPEED;
    manualPaused = false;
    gameStarted = true;
    timeLoop.start();
    renderTime();
    showStatus(statusMessage);
}

function loadSavedGame() {
    const serialized = localStorage.getItem(SAVE_KEY);
    if (serialized === null) {
        showStatus('No hi ha cap desament horari.');
        return false;
    }

    const savedState = JSON.parse(serialized);
    const restoredState = restoreGameTime(clock, savedState);
    selectedSpeed = restoredState.selectedSpeed;
    manualPaused = restoredState.manualPaused;
    gameStarted = true;
    timeLoop.start();
    renderTime();
    showStatus('Partida carregada.');
    return true;
}

const timeLoop = createGameLoop({
    clock,
    getSpeed: () => selectedSpeed,
    isPaused: () => manualPaused,
    onFrame: renderTime,
});

pauseButton.addEventListener('click', () => {
    manualPaused = !manualPaused;
    renderTime();
});

speedDownButton.addEventListener('click', () => {
    selectedSpeed = getAdjacentSpeed(selectedSpeed, -1);
    renderTime();
});

speedUpButton.addEventListener('click', () => {
    selectedSpeed = getAdjacentSpeed(selectedSpeed, 1);
    renderTime();
});

for (const button of speedButtons) {
    button.addEventListener('click', () => {
        const speed = Number(button.dataset.speed);
        if (!isSupportedSpeed(speed)) {
            throw new RangeError(`La velocitat ${button.dataset.speed}× no està configurada.`);
        }
        selectedSpeed = speed;
        renderTime();
    });
}

saveButton.addEventListener('click', () => {
    try {
        const saveData = serializeGameTime(clock, selectedSpeed, manualPaused);
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        showStatus('Temps de la partida desat.');
    } catch (error) {
        showStatus(`No s’ha pogut desar el temps: ${error.message}`);
    }
});

for (const button of document.querySelectorAll('[data-show]')) {
    button.addEventListener('click', () => {
        const target = button.dataset.show;
        if (target === 'game-view') {
            startNewGame();
        } else if (target === 'continue-game' || target === 'load-save') {
            try {
                if (!loadSavedGame() && !gameStarted) {
                    startNewGame('No hi ha cap desament horari. S’ha iniciat una partida nova.');
                }
            } catch (error) {
                const message = `No s’ha pogut carregar el temps: ${error.message}`;
                if (!gameStarted) {
                    startNewGame(`${message} S’ha iniciat una partida nova.`);
                } else {
                    showStatus(message);
                }
            }
        }
    });
}

renderTime();
