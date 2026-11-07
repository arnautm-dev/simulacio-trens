import '../ui/timeController.js';
import { getTrackType, createRailBuilder, createSmoothGeometry, geometryLength } from './railNetwork.js';

const mapElement = document.getElementById('map-canvas');
let railBuilder = null;
if (mapElement && window.L) {
    const map = L.map('map-canvas', {
        zoomControl: false,
        attributionControl: true,
        worldCopyJump: true,
    }).setView([41.8, 1.8], 7);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
        crossOrigin: true,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    railBuilder = createRailBuilder(map, { trackType: 'single' });

    const loadingStatus = document.getElementById('map-loading-status');
    if (loadingStatus) {
        loadingStatus.textContent = 'Mapa OSM carregat';
    }

    const infoValue = document.getElementById('track-estimated-cost');
    const infoType = document.getElementById('track-type-label');
    const statusElement = document.getElementById('track-construction-status');
    const confirmButton = document.getElementById('confirm-track-construction');
    const cancelButton = document.getElementById('cancel-track-construction');
    const syncTrackInfo = (trackType) => {
        const config = getTrackType(trackType);
        if (infoValue) infoValue.textContent = `${Math.round(config.costPerKm / 1000).toLocaleString('ca-ES')} €/km`;
        if (infoType) infoType.textContent = config.label;
    };
    const showStatus = (message) => {
        if (statusElement) statusElement.textContent = message;
    };
    const setConfirmEnabled = (enabled) => {
        if (!confirmButton) return;
        confirmButton.disabled = !enabled;
        confirmButton.classList.toggle('disabled', !enabled);
    };
    const updateEstimate = (points) => {
        if (!infoValue || points.length < 2) return;
        const geometry = createSmoothGeometry(points);
        const lengthMeters = geometryLength(geometry);
        const config = getTrackType(railBuilder.selectedTrackType);
        const cost = config.costPerKm * lengthMeters / 1000;
        infoValue.textContent = `${Math.round(cost).toLocaleString('ca-ES')} € · ${(lengthMeters / 1000).toFixed(1)} km`;
    };
    const trackButtons = document.querySelectorAll('#panel-construction .menu-item[data-role="track"]');
    const stationButton = document.querySelector('#panel-construction .menu-item[data-role="station"]');
    let stationMode = false;
    let draftPoints = [];

    const displayDraft = (cursorPoint = null) => {
        if (draftPoints.length === 0) {
            railBuilder.clearPreview();
            setConfirmEnabled(false);
            syncTrackInfo(railBuilder.selectedTrackType);
            return;
        }

        const endpoint = cursorPoint ?? draftPoints[draftPoints.length - 1];
        const snap = railBuilder.findSnap(endpoint);
        const snappedEndpoint = snap?.latLng ?? endpoint;
        const points = draftPoints.length === 1
            ? [draftPoints[0], snappedEndpoint]
            : [...draftPoints.slice(0, -1), snappedEndpoint];
        railBuilder.renderPreview(points, snap?.latLng ?? null);
        setConfirmEnabled(draftPoints.length >= 2);
        if (draftPoints.length >= 2) {
            updateEstimate(points);
            showStatus('Traçat provisional. Afegeix punts de corba o confirma’l.');
        } else {
            syncTrackInfo(railBuilder.selectedTrackType);
            showStatus('Punt inicial seleccionat. Clica per definir el traçat.');
        }
    };
    const clearDraft = (message = 'Clica per afegir punts; confirma el traçat per construir-lo.') => {
        draftPoints = [];
        stationMode = false;
        railBuilder.clearPreview();
        setConfirmEnabled(false);
        if (stationButton) stationButton.classList.remove('active');
        syncTrackInfo(railBuilder.selectedTrackType);
        showStatus(message);
    };

    trackButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextType = button.dataset.trackType;
            if (!nextType) return;
            stationMode = false;
            if (stationButton) stationButton.classList.remove('active');
            railBuilder.selectedTrackType = nextType;
            syncTrackInfo(nextType);
            trackButtons.forEach((item) => item.classList.toggle('active', item === button));
            displayDraft();
        });
    });

    if (stationButton) {
        stationButton.addEventListener('click', () => {
            draftPoints = [];
            railBuilder.clearPreview();
            stationMode = true;
            setConfirmEnabled(false);
            stationButton.classList.add('active');
            trackButtons.forEach((item) => item.classList.remove('active'));
            showStatus('Clica sobre una via existent per col·locar-hi una estació.');
        });
    }

    if (confirmButton) {
        confirmButton.addEventListener('click', () => {
            if (draftPoints.length < 2) return;
            const snap = railBuilder.findSnap(draftPoints[draftPoints.length - 1]);
            const points = [...draftPoints];
            if (snap) points[points.length - 1] = snap.latLng;
            const segment = railBuilder.addRoute(points);
            if (!segment) {
                showStatus('No s’ha pogut crear el tram: els dos extrems coincideixen.');
                return;
            }
            clearDraft(`Via construïda: ${(segment.lengthMeters / 1000).toFixed(1)} km.`);
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => clearDraft());
    }

    map.on('click', (event) => {
        if (stationMode) {
            const station = railBuilder.addStation(event.latlng);
            if (!station) {
                showStatus('No hi ha cap via prou a prop. Acosta’t a una via existent.');
                return;
            }
            stationMode = false;
            stationButton?.classList.remove('active');
            railBuilder.clearPreview();
            const length = station.connectedSegments.length;
            showStatus(`${station.name} connectada a ${length} tram${length === 1 ? '' : 's'}.`);
            return;
        }

        const snap = railBuilder.findSnap(event.latlng);
        const point = snap?.latLng ?? { lat: event.latlng.lat, lng: event.latlng.lng };
        draftPoints.push(point);
        displayDraft();
    });

    map.on('mousemove', (event) => {
        if (stationMode) {
            const snap = railBuilder.findSnap(event.latlng);
            railBuilder.renderPreview([], snap?.latLng ?? null);
        } else if (draftPoints.length > 0) {
            displayDraft(event.latlng);
        }
    });

    map.on('mouseout', () => {
        if (draftPoints.length > 0) displayDraft();
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && (draftPoints.length > 0 || stationMode)) {
            clearDraft();
        } else if (event.key === 'Enter' && draftPoints.length >= 2) {
            confirmButton?.click();
        }
    });

    map.doubleClickZoom.disable();
    syncTrackInfo('single');
    setConfirmEnabled(false);
    window.addEventListener('load', () => {
        map.invalidateSize();
    });

    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
}

const toolButtons = document.querySelectorAll('.tool-button');
const toolPanels = document.querySelectorAll('.tool-panel');

for (const button of toolButtons) {
  button.addEventListener('click', () => {
    const selected = button.dataset.panel;

    toolButtons.forEach((item) => item.classList.toggle('active', item === button));
    toolPanels.forEach((panel) => {
      panel.classList.toggle('visible', panel.id === `panel-${selected}`);
    });
  });
}

const overlayMap = {
  'new-game': document.getElementById('new-game-screen'),
  'settings-screen': document.getElementById('settings-screen'),
  'credits-screen': document.getElementById('credits-screen'),
  'purchase-modal': document.getElementById('purchase-modal'),
  'line-modal': document.getElementById('line-modal'),
  'game-view': document.querySelector('.app-shell'),
  'continue-game': document.querySelector('.app-shell'),
  'load-save': document.querySelector('.app-shell'),
};

const showButtons = document.querySelectorAll('[data-show]');
for (const button of showButtons) {
  button.addEventListener('click', () => {
    const target = button.dataset.show;
    const screen = overlayMap[target];

    if (!screen) return;

    if (target === 'game-view' || target === 'continue-game' || target === 'load-save') {
      document.getElementById('menu-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('visible');
      return;
    }

    if (screen instanceof HTMLElement) {
      screen.classList.remove('hidden');
      screen.classList.add('visible');
    }
  });
}

const hideButtons = document.querySelectorAll('[data-hide]');
for (const button of hideButtons) {
  button.addEventListener('click', () => {
    const targetId = button.dataset.hide;
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add('hidden');
      target.classList.remove('visible');
    }
  });
}

const menuButton = document.querySelector('.menu-button');
if (menuButton) {
  menuButton.addEventListener('click', () => {
    const menu = document.getElementById('menu-screen');
    menu.classList.remove('hidden');
    menu.classList.add('visible');
  });
}

const createLineTrigger = document.querySelector('.tool-panel #panel-lines .action-button.primary.compact');
if (createLineTrigger) {
  createLineTrigger.addEventListener('click', () => {
    const modal = document.getElementById('line-modal');
    modal.classList.remove('hidden');
    modal.classList.add('visible');
  });
}
