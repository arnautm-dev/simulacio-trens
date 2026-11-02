# JOC TRENS — Document de disseny i pla de desenvolupament

**Versió:** 2.0  
**Plataforma:** navegador d'escriptori  
**Tecnologies base:** HTML, CSS i JavaScript natius  
**Model de desenvolupament:** implementació progressiva amb una IA, fase per fase

---

## 1. Visió general

Joc trens és un joc de gestió ferroviària per a navegador en què el jugador dirigeix una empresa ferroviària a Catalunya. El jugador construeix vies i estacions, compra trens, crea línies, transporta passatgers i gestiona els ingressos i les despeses.

El joc serà per a un sol jugador, amb una simulació simplificada i una dificultat econòmica relaxada. La prioritat és oferir una experiència de gestió clara i entretinguda, no reproduir tots els detalls tècnics d'una xarxa ferroviària real.

### Decisions principals

| Àmbit | Decisió |
|---|---|
| Paper del jugador | Dirigir una empresa ferroviària |
| Jugadors | Un jugador |
| Plataforma | Ordinador, navegador web |
| Tecnologies | HTML, CSS i JavaScript natius |
| Dependències | Cap framework ni biblioteca obligatòria |
| Renderització del mapa | Canvas 2D natiu |
| Món | Catalunya amb geografia simplificada |
| Vista | 2D des de dalt |
| Construcció | Sistema híbrid: traçat lliure assistit per connexions |
| Terreny | Influència moderada en els costos |
| Serveis | Passatgers i alta velocitat |
| Circulació | Automàtica |
| Línies | Selecció ordenada d'estacions |
| Horaris | Freqüències a la primera versió; horaris detallats més endavant |
| Senyalització | Ocupació de trams i regles bàsiques |
| Vies | Via única i via doble |
| Estacions | Construïdes pel jugador |
| Trens | Compra de trens complets |
| Incidències | Molt poques; no són un sistema central |
| Ingressos | Bitllets |
| Despeses | Construcció, compra de trens, manteniment i operació simplificada |
| Dificultat | Relaxada |
| Capital inicial | Mitjà, configurable |
| Progressió | Acumulació de capital i ampliació de la xarxa |
| Objectius | Mode lliure |
| Finançament | Sense préstecs |
| Demanda | Dinàmica i agregada |
| Temps | Temps real, pausa i acceleració |
| Desament | Local, amb importació i exportació |
| Servidor | No necessari per a la primera versió |
| Mapa | Catalunya simplificada, començant per una regió petita |
| Interfície | Mapa central i panells de gestió |
| Abast | Primera versió jugable completa |

---

## 2. Principis de desenvolupament

1. El projecte s'ha de fer amb **HTML, CSS i JavaScript natius**.
2. No utilitzar React, Vue, Angular, TypeScript, Vite, Webpack ni altres frameworks o eines de compilació.
3. No utilitzar cap motor gràfic extern. El mapa es dibuixarà amb l'API Canvas 2D del navegador.
4. No utilitzar Python, `.venv`, Docker ni entorns virtuals.
5. No afegir dependències externes. Si en algun moment una dependència sembla imprescindible, cal explicar-ne el motiu i demanar autorització abans d'afegir-la.
6. El joc ha de poder executar-se obrint `index.html` directament quan sigui possible. Si alguna funció del navegador requereix un servidor local, s'ha d'explicar i proposar l'opció més simple, sense eines de compilació.
7. El codi ha de ser modular, encara que no hi hagi cap sistema de mòduls o compilador complex.
8. Fer servir JavaScript modern (ES6 o posterior) i mòduls ES (`type="module"`) si són compatibles amb el mètode d'execució triat.
9. Utilitzar indentació de quatre espais.
10. Cada fase ha de deixar el projecte en un estat executable i comprovable.
11. No implementar fases futures sense autorització.
12. No substituir fitxers sencers sense inspeccionar-los i explicar per què és necessari.
13. No afirmar que s'ha provat una funcionalitat si no s'ha executat realment.
14. Les dades de prova s'han d'identificar com a tals i no s'han de presentar com a funcionalitats acabades.

---

## 3. Arquitectura tècnica

### 3.1. Tecnologies

**HTML** estructura la pàgina i els panells de la interfície.

**CSS** defineix el disseny, la disposició dels panells, els colors, els estats dels controls i l'adaptació a diferents mides de finestra.

**JavaScript** implementa tota la lògica: estat del joc, mapa, construcció, trens, simulació, economia, desament i interaccions.

**Canvas 2D** és una API nativa del navegador, accessible des de JavaScript. S'utilitzarà per dibuixar el mapa i els elements ferroviaris. No és un motor extern ni una dependència que s'hagi d'instal·lar.

### 3.2. Arquitectura en capes

- **Interfície HTML/CSS:** estructura i aparença dels menús i panells.
- **Controladors d'interfície:** reben clics, tecles i accions de l'usuari.
- **Estat del joc:** conté les dades actuals de la partida.
- **Lògica de domini:** vies, estacions, línies, trens i economia.
- **Motor de simulació:** avança el temps i actualitza els sistemes.
- **Renderitzador Canvas:** representa l'estat del joc, sense ser-ne el propietari.
- **Persistència:** guarda, carrega, importa i exporta les dades.

El renderitzador no ha de contenir les regles econòmiques ni les regles de circulació. La interfície tampoc no ha de modificar directament estructures internes de manera descontrolada: ha de cridar funcions dels mòduls corresponents.

### 3.3. Execució sense eines especials

Estructura prevista:
- Obrir `index.html` en un navegador modern.
- Si els mòduls ES o l'accés a fitxers locals provoquen restriccions del navegador, iniciar un servidor estàtic local senzill.
- No cal instal·lar Node.js ni npm si no s'utilitzen eines que ho requereixin.
- No hi haurà procés de compilació: els fitxers HTML, CSS i JS seran els fitxers finals que executa el navegador.

Per evitar problemes amb `file://`, es recomana que el projecte inclogui instruccions per iniciar un servidor estàtic simple si és necessari. Aquesta opció no ha de convertir-se en una dependència del joc.

---

## 4. Estructura de carpetes

```text
joc-trens/
    index.html
    README.md

    assets/
        images/
        icons/

    css/
        main.css
        layout.css
        map.css
        panels.css
        controls.css

    js/
        main.js

        config/
            gameConfig.js
            trainCatalog.js

        data/
            cataloniaMap.js
            initialGameState.js

        core/
            gameState.js
            gameLoop.js
            gameClock.js
            eventBus.js

        map/
            mapCanvas.js
            mapRenderer.js
            mapCamera.js
            mapCoordinates.js
            mapInteractions.js
            terrain.js

        railway/
            trackGraph.js
            trackBuilder.js
            routeFinder.js
            routeValidation.js
            signaling.js

        stations/
            stationSystem.js
            stationOperations.js

        trains/
            trainSystem.js
            trainMovement.js
            trainRenderer.js

        lines/
            lineSystem.js
            lineScheduler.js

        passengers/
            passengerDemand.js
            passengerSystem.js

        economy/
            economySystem.js
            revenue.js
            expenses.js

        storage/
            saveSystem.js
            importExport.js
            saveValidation.js

        ui/
            uiController.js
            panelController.js
            notificationSystem.js
            modalController.js

        utils/
            id.js
            math.js
            geometry.js
            validation.js

    tests/
        README.md
        manual-test-plan.md
```

No cal crear tots aquests fitxers el primer dia. La IA els ha d'afegir quan una fase els necessiti. Si es decideix agrupar dos mòduls petits, s'ha de mantenir una separació clara de responsabilitats.

### Responsabilitats

- `config/`: paràmetres configurables i catàleg de trens.
- `data/`: dades inicials del mapa i de la partida.
- `core/`: estat global, rellotge, bucle i comunicació entre sistemes.
- `map/`: Canvas, càmera, coordenades, interaccions i terreny.
- `railway/`: graf ferroviari, construcció, camins i senyalització.
- `stations/`: creació i operació d'estacions.
- `trains/`: compra, estat, moviment i representació dels trens.
- `lines/`: definició de línies i freqüències.
- `passengers/`: demanda i transport agregat.
- `economy/`: ingressos i despeses.
- `storage/`: desament i intercanvi de partides.
- `ui/`: connexió dels controls HTML amb la lògica.
- `utils/`: funcions genèriques petites i reutilitzables.

---

## 5. Mapa de Catalunya

### 5.1. Abast geogràfic

La primera versió tindrà una regió petita de Catalunya, amb Barcelona com a nucli principal i algunes poblacions properes. L'extensió cap a Girona, Tarragona, Lleida i altres zones es podrà fer després.

El mapa serà esquemàtic, no cartogràficament exacte. Ha de permetre reconèixer la geografia general i oferir espai suficient per construir.

Elements inicials:
- Barcelona i diverses poblacions de l'entorn.
- Costa i mar.
- Rius principals simplificats.
- Zones planes i muntanyoses.
- Àrees amb diferents costos de construcció.
- Espai lliure perquè el jugador creï la seva pròpia xarxa.

### 5.2. Coordenades i càmera

Les dades del món han d'utilitzar coordenades pròpies, independents de la pantalla.

La càmera ha de permetre:
- Fer zoom amb la roda del ratolí.
- Desplaçar el mapa arrossegant-lo.
- Convertir coordenades de pantalla a coordenades del món i a l'inrevés.
- Mantenir les vies i estacions a la posició correcta després de canviar zoom o mida de finestra.

### 5.3. Terreny i costos

| Terreny | Efecte |
|---|---|
| Plana | Cost base |
| Terreny irregular | Recàrrec moderat |
| Muntanya | Cost elevat |
| Riu | Cost addicional per pont |
| Zona de túnel | Cost elevat |
| Costa | Efecte configurable |

Els costos seran paràmetres centralitzats. Per a la primera versió, ponts i túnels poden ser representacions simplificades; no cal simular enginyeria civil.

---

## 6. Construcció de vies i estacions

### 6.1. Sistema híbrid de construcció

El jugador podrà dibuixar un traçat amb el ratolí, però el resultat s'haurà de convertir en segments i connexions reals.

Flux:
1. Seleccionar l'eina de construcció.
2. Triar un punt inicial, una estació o un extrem de via.
3. Marcar punts intermedis o dibuixar el traçat.
4. Veure una previsualització.
5. Consultar el cost estimat.
6. Confirmar o cancel·lar.

La xarxa serà un graf format per nodes i segments. No n'hi ha prou amb dibuixar línies al Canvas.

### 6.2. Via única i doble

**Via única:** permet circulació en ambdós sentits, però els trens comparteixen el mateix tram i s'han de coordinar per evitar conflictes.

**Via doble:** disposa de dos corredors diferenciats, un per a cada sentit. La lògica ha de tractar-los com a recursos diferents, no només dibuixar dues línies paral·leles.

### 6.3. Estacions

Cada estació tindrà:
- Identificador únic.
- Nom.
- Posició.
- Capacitat.
- Andanes o vies disponibles, simplificades.
- Demanda de passatgers.
- Connexions amb el graf ferroviari.

Les estacions les construeix el jugador. Es poden crear sobre una via existent o com a part d'un traçat nou, sempre que la connexió sigui vàlida.

---

## 7. Trens i circulació

### 7.1. Catàleg

El jugador comprarà trens complets. Cada model tindrà:
- Nom i categoria.
- Preu.
- Capacitat de passatgers.
- Velocitat màxima.
- Acceleració i frenada simplificades.
- Cost de manteniment.
- Tipus de servei compatible.

Hi haurà trens convencionals de passatgers i trens d'alta velocitat. Els valors inicials poden ser ficticis però coherents i configurables en un catàleg central.

### 7.2. Velocitat

La velocitat efectiva d'un tren en un tram serà limitada per:
- La velocitat màxima del tren.
- La velocitat màxima del tram.
- Les limitacions de seguretat i de senyalització.

Els trens d'alta velocitat podran circular per vies convencionals amb limitació de velocitat, si el disseny del joc ho permet. Les vies d'alta velocitat tindran un cost superior i permetran velocitats més altes.

### 7.3. Circulació automàtica

Els trens:
- Seguiran la línia assignada.
- Recorreran els segments del camí calculat.
- S'aturaran a les estacions corresponents.
- Carregaran i descarregaran passatgers.
- Esperaran quan un tram necessari estigui ocupat.
- Continuaran quan sigui segur.

La primera versió no tindrà un sistema complex d'avaries o incidències.

### 7.4. Senyalització bàsica

La circulació es basarà inicialment en l'ocupació i reserva de trams. Un tren no podrà entrar en un tram si això crea un conflicte.

No cal que el jugador col·loqui manualment senyals a la primera versió. Primer s'ha de garantir una circulació segura i comprensible.

---

## 8. Línies, freqüències i horaris

El jugador crearà una línia seleccionant estacions en ordre. Cada línia tindrà nom, color, recorregut, trens assignats, freqüència i estadístiques.

El sistema comprovarà que totes les estacions consecutives tenen un camí vàlid a través de la xarxa.

### Freqüències

La primera versió prioritzarà freqüències com ara una sortida cada 10, 15 o 30 minuts. El joc estimarà quants trens calen per assolir la freqüència.

Si no hi ha prou trens, mostrarà la freqüència real estimada o un avís. No s'ha de prometre una freqüència que la flota no pot prestar.

### Horaris detallats

Els horaris exactes de sortida i arribada es reserven per a una fase posterior. L'arquitectura ha de mantenir separat el sistema de línies del moviment dels trens per poder incorporar-los sense reescriure la simulació.

---

## 9. Passatgers i demanda

La demanda serà dinàmica i agregada: no es crearà un objecte per a cada passatger.

La demanda podrà dependre de:
- Importància de les poblacions.
- Atracció de l'origen i la destinació.
- Temps de viatge.
- Freqüència del servei.
- Capacitat disponible.
- Tarifa, en una ampliació posterior.

Quan un tren arribi a una estació:
1. Es descarregaran els passatgers que hi tenen destinació.
2. Es calcularà la demanda que vol pujar.
3. Es carregarà fins al límit de capacitat.
4. Es registraran els passatgers transportats i la demanda no atesa.

Cal evitar comptar passatgers dues vegades o fer-los desaparèixer sense una regla definida.

---

## 10. Economia i progressió

### Ingressos
- Venda de bitllets.
- Tarifa inicial simple, configurable per distància o viatge.

### Despeses
- Construcció de vies.
- Construcció d'estacions.
- Compra de trens.
- Manteniment.
- Cost operatiu simplificat dels serveis.

El capital inicial serà mitjà i configurable. La dificultat serà relaxada. No hi haurà préstecs ni objectius obligatoris.

El jugador podrà continuar jugant amb pèrdues, però no podrà fer compres o construccions que no pugui pagar. El joc avisarà abans d'accions costoses.

La progressió serà lliure: ampliar la xarxa, connectar poblacions, augmentar freqüències i comprar trens més capaços o ràpids.

---

## 11. Temps i motor de simulació

El joc tindrà:
- Pausa.
- Velocitat normal.
- Acceleració.

El motor de simulació ha d'estar separat del renderitzat. El Canvas pot dibuixar a la freqüència que permeti el navegador, però l'economia i el moviment s'han de basar en el temps de simulació transcorregut.

No s'han de cobrar despeses per fotograma. Els costos recurrents s'han de calcular per unitat de temps del joc.

---

## 12. Interfície

La pantalla principal tindrà:
- Barra superior amb capital, hora, pausa, velocitat i desament.
- Mapa central ampli.
- Barra d'eines de construcció.
- Panell lateral contextual.
- Panells de gestió de línies, trens, estacions i finances.
- Zona de notificacions.

Els panells han de ser funcionals, no decoratius. Els errors han d'explicar què ha passat i, quan sigui possible, com corregir-ho.

### Panells
- Construcció: vies, estacions i cost estimat.
- Línies: creació, parades, freqüències i trens assignats.
- Trens: catàleg, compra i gestió de flota.
- Estacions: demanda, passatgers i connexions.
- Finances: capital, ingressos, despeses i evolució.
- Notificacions: avisos de circulació, economia i construcció.

---

## 13. Desament i partides

No cal servidor ni comptes d'usuari per a la primera versió.

- Desament automàtic o manual a `localStorage`.
- Exportació a un fitxer JSON.
- Importació des d'un fitxer JSON.
- Validació completa abans de substituir la partida actual.
- Camp de versió del format de desament per facilitar futures migracions.

S'han de desar les dades necessàries per continuar: capital, temps, vies, estacions, trens, línies, posicions lògiques, passatgers i comptadors de simulació rellevants.

Si una importació falla, la partida actual ha de continuar intacta.

---

## 14. Abast de la primera versió jugable

### Obligatori
- Mapa simplificat de Catalunya.
- Zoom i desplaçament.
- Construcció de vies i estacions.
- Graf ferroviari i validació de connexions.
- Via única i doble amb lògica diferenciada.
- Compra de trens.
- Creació de línies i cerca de camins.
- Circulació automàtica i ocupació de trams.
- Passatgers agregats.
- Ingressos i despeses.
- Pausa i acceleració.
- Guardar, carregar, importar i exportar.
- Interfície funcional.

### Fora de la primera versió
- Multijugador.
- Mercaderies.
- Servidor i comptes.
- Horaris exactes avançats.
- Senyalització manual complexa.
- Avaries, clima i incidències freqüents.
- Gestió de personal.
- Geografia cartogràfica precisa de tota Catalunya.

La primera versió només es considerarà completa quan es pugui construir una xarxa, operar-la, transportar passatgers, gestionar l'economia i desar i recuperar la partida.

---

## 15. Pla d'implementació per fases

La IA ha de completar una fase, provar-la i aturar-se. L'usuari ha de revisar el resultat abans d'autoritzar la següent.

### Fase 1 — Estructura HTML/CSS/JS
- Crear `index.html`, fulls CSS i fitxers JavaScript.
- Crear la pantalla inicial.
- Preparar la càrrega dels scripts.
- Escriure un README amb instruccions d'execució.
- No implementar encara cap sistema de joc.

**Acceptació:** la pàgina s'obre al navegador i no presenta errors de consola.

### Fase 2 — Model de dades i estat
- Definir estructures per a mapa, nodes, vies, estacions, trens, línies, economia i partida.
- Crear estat inicial.
- Definir identificadors únics i funcions de validació.
- Evitar `any` conceptualment: validar les dades d'entrada i mantenir estructures consistents.

**Acceptació:** l'estat inicial es pot crear, consultar i modificar mitjançant funcions clares.

### Fase 3 — Mapa Canvas
- Crear Canvas 2D.
- Dibuixar la geografia esquemàtica inicial.
- Implementar càmera, zoom i desplaçament.
- Separar coordenades del món i de pantalla.

**Acceptació:** el mapa es veu correctament i els elements mantenen la posició amb el zoom i el desplaçament.

### Fase 4 — Xarxa ferroviària
- Implementar graf de nodes i segments.
- Crear construcció amb previsualització i cancel·lació.
- Calcular costos estimats.
- Validar connexions.
- Dibuixar les vies a partir de les dades reals.

**Acceptació:** es poden crear vies connectades i detectar traçats invàlids.

### Fase 5 — Estacions
- Construir i seleccionar estacions.
- Connectar-les al graf ferroviari.
- Mostrar informació al panell.
- Afegir capacitat i demanda inicial.

**Acceptació:** les estacions es creen, es seleccionen i queden connectades correctament.

### Fase 6 — Rellotge i bucle de simulació
- Implementar temps de joc.
- Implementar pausa i acceleració.
- Separar actualització de simulació i renderització.

**Acceptació:** el temps avança, s'atura i s'accelera sense dependre dels fotogrames.

### Fase 7 — Catàleg i compra de trens
- Crear models de trens convencionals i d'alta velocitat.
- Implementar compra i comprovació de capital.
- Mostrar la flota.
- Representar els trens al mapa en una posició vàlida.

**Acceptació:** es poden comprar trens i el capital es modifica correctament.

### Fase 8 — Línies i cerca de camins
- Seleccionar estacions ordenades.
- Validar connectivitat.
- Calcular seqüències de segments.
- Assignar nom, color i freqüència objectiu.

**Acceptació:** només es poden crear línies amb recorreguts vàlids.

### Fase 9 — Circulació i senyalització
- Moure trens sobre els segments.
- Aturar-los a les estacions.
- Gestionar ocupació i reserva de trams.
- Diferenciar via única i doble.
- Fer esperar i reprendre els trens de manera segura.

**Acceptació:** no hi ha col·lisions ni ocupacions incompatibles en els casos de prova.

### Fase 10 — Passatgers
- Implementar demanda agregada entre estacions.
- Carregar i descarregar passatgers.
- Respectar la capacitat.
- Registrar ocupació i demanda no atesa.

**Acceptació:** els passatgers arriben a destinació i no es compten dues vegades.

### Fase 11 — Economia
- Implementar bitllets i ingressos.
- Implementar construcció, compra, manteniment i operació com a despeses.
- Mostrar resum financer.
- Fer que els costos recurrents depenguin del temps de joc.

**Acceptació:** cada operació es comptabilitza una sola vegada i el saldo és coherent.

### Fase 12 — Guardar i importar/exportar
- Implementar `localStorage`.
- Exportar JSON.
- Importar JSON amb validació i versió.
- Protegir la partida actual si la importació falla.

**Acceptació:** una partida exportada es pot importar i continuar sense perdre dades essencials.

### Fase 13 — Interfície completa
- Integrar barra superior, mapa, eines i panells.
- Completar els panells de construcció, estacions, línies, trens i finances.
- Afegir notificacions i confirmacions.
- Eliminar controls sense funcionalitat.

**Acceptació:** totes les accions visibles tenen un comportament real.

### Fase 14 — Auditoria i estabilització
- Provar el recorregut complet de joc.
- Revisar errors de consola.
- Revisar càlculs econòmics.
- Revisar bloquejos de trens i connexions.
- Revisar importació/exportació.
- Corregir errors sense eliminar funcionalitats.

**Acceptació:** es pot completar el cicle construir → operar → transportar → ingressar → desar → carregar.

---

## 16. Prompt general per a la IA de programació

Copia aquest text al principi de la conversa amb la IA que desenvoluparà el joc. Després utilitza els prompts de fase de l'apartat següent.

> Estàs desenvolupant «Joc trens» segons aquest document de disseny.
>
> Requisit tècnic innegociable: utilitza exclusivament HTML, CSS i JavaScript natius. No utilitzis React, Vue, Angular, TypeScript, Vite, Webpack, Node.js com a requisit d'execució, ni cap motor gràfic extern. El mapa s'ha de dibuixar amb Canvas 2D natiu.
>
> No utilitzis Python, `.venv`, Docker ni entorns virtuals. No afegeixis dependències externes sense explicar-ne el motiu i demanar permís.
>
> El projecte ha de ser executable directament al navegador obrint `index.html` sempre que sigui possible. Si les restriccions del navegador ho impedeixen, explica com iniciar un servidor estàtic local senzill, sense convertir-lo en una dependència de compilació.
>
> Treballa exclusivament en la fase que et demani. Abans de modificar fitxers, inspecciona l'estat actual. No sobreescriguis codi sense justificar-ho. Mantén els mòduls separats i utilitza quatre espais d'indentació.
>
> Abans d'acabar, prova el que hagis implementat i indica quines comprovacions has executat realment. Al final, resumeix els fitxers creats o modificats, què funciona, què queda pendent i com ho puc provar. Atura't i espera la meva aprovació abans de continuar.

---

## 17. Prompts de cada fase

Envia només el prompt de la fase actual. No enviïs tots els prompts de cop.

### Prompt 1 — Estructura inicial

> Implementa la Fase 1 del document: crea l'estructura mínima del projecte amb HTML, CSS i JavaScript natius. No utilitzis frameworks, compiladors ni dependències. Crea `index.html`, els fitxers CSS i JS inicials, una pantalla amb el títol «Joc trens» i un README amb les instruccions per obrir-lo. Inspecciona primer la carpeta i no sobreescriguis res sense avisar. Comprova que funciona al navegador i atura't.

### Prompt 2 — Model de dades

> Implementa la Fase 2: defineix el model de dades i l'estat inicial del joc en JavaScript. Separa mapa, vies, estacions, trens, línies, economia i partida. Utilitza identificadors únics i funcions de validació. No implementis encara la interfície de construcció ni la simulació. Afegeix comprovacions adequades i atura't.

### Prompt 3 — Mapa

> Implementa la Fase 3: crea el mapa de Catalunya simplificat amb Canvas 2D natiu. Afegeix càmera, zoom, desplaçament i conversió de coordenades. Separa les dades geogràfiques del renderitzador. No implementis encara vies interactives ni trens. Comprova el funcionament visual i atura't.

### Prompt 4 — Vies

> Implementa la Fase 4: crea el graf ferroviari i l'eina de construcció de vies. Inclou previsualització, confirmació, cancel·lació, cost estimat i validació de connexions. Les vies dibuixades han de correspondre a segments reals de dades. No implementis trens. Prova connexions vàlides i invàlides i atura't.

### Prompt 5 — Estacions

> Implementa la Fase 5: permet construir, seleccionar i consultar estacions connectades a la xarxa. Afegeix nom, capacitat i demanda inicial. No implementis encara passatgers en circulació. Prova les operacions i atura't.

### Prompt 6 — Temps

> Implementa la Fase 6: crea el rellotge i el bucle de simulació amb pausa i acceleració. Separa el temps de simulació del renderitzat. No afegeixis encara moviment de trens ni economia recurrent. Prova els controls i atura't.

### Prompt 7 — Trens

> Implementa la Fase 7: crea el catàleg de trens convencionals i d'alta velocitat, la compra de trens complets i la visualització de la flota. Comprova el capital abans de comprar. Encara no implementis circulació. Prova les compres i atura't.

### Prompt 8 — Línies i camins

> Implementa la Fase 8: permet crear línies seleccionant estacions en ordre. Implementa la cerca de camins al graf i valida que el recorregut sigui continu. Afegeix nom, color i freqüència objectiu. No facis circular els trens encara. Prova recorreguts vàlids i invàlids i atura't.

### Prompt 9 — Circulació

> Implementa la Fase 9: fes circular automàticament els trens pels recorreguts de les línies. Implementa ocupació i reserva de trams, espera segura i diferència funcional entre via única i doble. Integra-ho amb el rellotge. No implementis encara passatgers. Prova situacions de conflicte i atura't.

### Prompt 10 — Passatgers

> Implementa la Fase 10: afegeix demanda agregada i transport de passatgers entre estacions. Respecta la capacitat dels trens i registra passatgers transportats i demanda no atesa. Integra-ho amb les parades dels trens. Evita comptatges duplicats. Prova el cicle de pujada i baixada i atura't.

### Prompt 11 — Economia

> Implementa la Fase 11: integra ingressos per bitllets i despeses de construcció, estacions, trens, manteniment i operació. Mostra capital, ingressos, despeses i resultat. Els costos recurrents han de dependre del temps de joc i no dels fotogrames. Prova els càlculs i atura't.

### Prompt 12 — Desament

> Implementa la Fase 12: afegeix guardat local, exportació JSON i importació JSON amb validació i versió del format. Una importació incorrecta no ha de destruir la partida actual. Prova exportar, importar i continuar una partida. Atura't.

### Prompt 13 — Interfície

> Implementa la Fase 13: completa la interfície amb mapa central, barra superior, eines i panells de construcció, estacions, línies, trens i finances. Afegeix notificacions i confirmacions. Tots els controls visibles han de funcionar. No reescriguis sistemes que ja funcionen sense necessitat. Atura't.

### Prompt 14 — Auditoria

> Implementa la Fase 14: no afegeixis funcions noves. Audita el joc complet i prova el recorregut iniciar partida → construir → crear estacions → comprar tren → crear línia → circular → transportar passatgers → ingressar i gastar → desar → carregar. Revisa errors de consola, bloquejos, economia, vies i importació/exportació. Corregeix els errors i informa de les proves executades i dels problemes pendents. No declaris el joc acabat si el cicle principal no funciona.

---

## 18. Com executar i comprovar el projecte

### Execució normal

La primera opció és obrir `index.html` directament amb un navegador modern.

Si el navegador bloqueja els mòduls JavaScript o l'accés a fitxers locals, es pot utilitzar un servidor estàtic local. No cal instal·lar un entorn de desenvolupament complet. La IA ha d'indicar una opció compatible amb l'ordinador de l'usuari i explicar com aturar-la.

### Comprovacions

- Obrir la consola del navegador i comprovar que no hi ha errors.
- Provar les interaccions amb ratolí.
- Redimensionar la finestra.
- Provar zoom i desplaçament.
- Recarregar la pàgina i comprovar el desament.
- Exportar i importar una partida.
- Provar situacions límit, com ara capital insuficient o vies desconnectades.

No s'ha de donar una fase per acabada només perquè la pàgina s'obre: cal comprovar la funcionalitat específica de la fase.

---

## 19. Llista de verificació de la primera versió

- [ ] El joc s'obre al navegador sense errors.
- [ ] El mapa representa una Catalunya simplificada.
- [ ] El mapa es pot ampliar i desplaçar.
- [ ] Es poden construir vies connectades.
- [ ] Es poden construir i seleccionar estacions.
- [ ] La via única i la doble tenen comportaments diferents.
- [ ] Es poden comprar trens.
- [ ] Es poden crear línies vàlides.
- [ ] Els trens circulen automàticament.
- [ ] Els trens esperen quan un tram està ocupat.
- [ ] Els passatgers es transporten correctament.
- [ ] Els ingressos i les despeses són coherents.
- [ ] La pausa i l'acceleració funcionen.
- [ ] Es pot desar una partida localment.
- [ ] Es pot exportar i importar una partida.
- [ ] Es pot continuar jugant després de carregar-la.

---

## 20. Riscos principals i com evitar-los

**Vies que només són dibuixos:** totes les vies han de tenir representació en el graf de dades. El Canvas només les dibuixa.

**Trens que es travessen:** cal gestionar ocupació i reserva de trams abans d'afegir més complexitat.

**Simulació dependent dels FPS:** el moviment i l'economia han de dependre del temps transcorregut, no del nombre de fotogrames.

**Codi massa concentrat:** separar mòduls i evitar un únic fitxer JavaScript gegant.

**Canvis que trenquen fases anteriors:** abans de modificar una estructura central, localitzar tots els mòduls que la utilitzen i tornar-los a provar.

**Desaments incompatibles:** versionar el format JSON i validar-lo abans d'aplicar-lo.

**Abast excessiu:** no afegir mercaderies, multijugador, horaris complexos o geografia detallada abans que el cicle principal funcioni.

---

## 21. Evolució posterior

Quan la primera versió sigui estable, es podran afegir, en aquest ordre orientatiu:

1. Horaris exactes i coordinació entre línies.
2. Mapa més precís i ampliació a tot Catalunya.
3. Més estacions, andanes i configuracions de vies.
4. Senyalització visible i opcions avançades.
5. Més models de trens.
6. Estadístiques i eines d'anàlisi de demanda.
7. Tarifes i preus més elaborats.
8. Millores visuals i efectes de so.
9. Mercaderies.
10. Servidor, comptes o multijugador, només si algun dia es considera necessari.

**Criteri final:** primer cal tenir un joc petit però complet, estable i fàcil de modificar. Les ampliacions han de venir després, sense comprometre el funcionament del nucli.
