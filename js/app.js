import '../ui/timeController.js';

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
