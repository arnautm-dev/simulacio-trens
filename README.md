# Joc trens — prototip visual

Aquest projecte és un prototip estàtic de disseny UI per a la interfície del videojoc de gestió ferroviària "Joc trens".

## Com executar-ho

1. Obre la carpeta del projecte.
2. Obre `index.html` en un navegador modern.
3. Alternativament, pots servir la carpeta localment amb un servidor estàtic simple:

```bash
python -m http.server 8000
```

I després obre `http://localhost:8000`.

## Inclou

- Barra superior i indicadors econòmics
- Barra lateral d'eines i submenús
- Mapa central estilitzat de Catalunya
- Panell contextual dret
- Notificacions flotants
- Pantalla de menú principal
- Creador de partida
- Modals de compra i creació de línies
- Configuració i crèdits

El rellotge de simulació és funcional i el mapa permet construir una xarxa bàsica
de vies i estacions. L'economia, els trens i la resta de sistemes de joc encara
són un prototip visual.

## Construcció de vies

Selecciona el tipus de via i fes clic al mapa per definir-ne l'inici, els punts
de corba i el final. El sistema mostra una previsualització corbada i ajusta els
extrems propers a nodes o vies existents. Confirma la construcció amb el botó o
Retorn; Esc o «Cancel·lar» descarta el traçat. Per afegir una estació, selecciona
«Construir estació» i fes clic sobre una via existent.

## Sistema de temps

El rellotge de simulació utilitza una data UTC interna (per defecte, 01/01/2026 a les 06:00:00) i no consulta el rellotge de l’ordinador. La data inicial es pot canviar a `DEFAULT_START_DATE` de `core/gameClock.js`; els multiplicadors es configuren a `core/simulationSpeed.js`.

El temps avança amb `requestAnimationFrame`, amb el delta limitat a un segon per fotograma i congelat quan la pestanya queda en segon pla. La pausa manual no canvia la velocitat seleccionada. El botó «Desar» desa exclusivament les dades de temps a l’emmagatzematge local del navegador; «Continuar partida» i «Carregar partida» les recuperen.

Per executar totes les proves amb Node.js 24:

```bash
node --test
```
