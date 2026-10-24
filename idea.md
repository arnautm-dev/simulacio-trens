# Joc trens — Document de disseny i pla de desenvolupament

Versió 1.0 · Document base del projecte

Aquest document defineix el joc de gestió ferroviària que construirem des de zero per al navegador. Està pensat perquè el puguis donar a una IA de programació i fer que desenvolupi el projecte pas a pas, amb comprovacions entre fases, sense intentar crear-ho tot de cop ni acabar amb un codi difícil de mantenir.

La idea principal és que puguis dirigir una companyia ferroviària a Catalunya: construir vies i estacions, comprar trens, crear línies, transportar passatgers, gestionar els ingressos i ampliar la xarxa.

## 1. Resum del joc

[TrainStation 2: New Event – Explore Europe & Unlock New Trains](https://images.openai.com/static-rsc-4/svepRydQ9d0cW3VE4ZivVh6EwNssJWmIuUzLoVaEWb5JuyjPUKW-sO0Ztn0Lv_yT8CARNo_SD1QdagNjHbAYp0riAijxOFZoc9Gsj_liL8wxWLQB8F1M-BXJVFQ4yUffS-Dx-zLugL99Ak-fUZSn9hFR5Xhb9RK3qrBlRJjHeRQ?purpose=inline)

Nom del projecte: Joc trens

Gènere: simulador de gestió ferroviària

Plataforma: navegador d'escriptori

Jugadors: un jugador

Estil: mapa 2D des de dalt, geografia simplificada de Catalunya

### Objectius del jugador

- Construir una xarxa ferroviària que connecti ciutats i pobles catalans.
- Construir estacions i traçar vies amb el ratolí.
- Comprar trens de passatgers i d'alta velocitat.
- Crear línies seleccionant les estacions en l'ordre de servei.
- Decidir les freqüències i, en una fase posterior, els horaris.
- Transportar passatgers i obtenir ingressos pels bitllets.
- Gestionar els costos de construcció, compra i manteniment.
- Ampliar progressivament la xarxa sense haver de desbloquejar tecnologies obligatòries.

### Filosofia de disseny

El joc ha de ser fàcil d'entendre, relaxat i prou profund per permetre planificar una xarxa ferroviària interessant. No volem reproduir tots els detalls d'un sistema ferroviari real: volem un joc funcional, coherent i ampliable.

La primera versió ha de ser jugable de principi a fi. Això no significa implementar totes les funcions imaginables, sinó incloure un circuit complet: construir, operar, transportar passatgers, guanyar o perdre diners, guardar la partida i continuar jugant.

## 2. Decisions de disseny ja establertes

| Àmbit               | Decisió                                                              |
| ------------------- | -------------------------------------------------------------------- |
| Món                 | Catalunya, amb geografia simplificada                                |
| Vista               | Mapa 2D des de dalt                                                  |
| Construcció de vies | Dibuix amb el ratolí i connexions controlades                        |
| Terreny             | Rius, muntanyes i obstacles influeixen en el cost                    |
| Trens               | Passatgers i alta velocitat                                          |
| Moviment            | Automàtic                                                            |
| Línies              | Selecció ordenada d'estacions                                        |
| Circulació          | Senyalització i ocupació de trams simplificades                      |
| Via única i doble   | Ambdues, amb comportaments diferents                                 |
| Economia            | Ingressos per bitllets; despeses de construcció, trens i manteniment |
| Demanda             | Dinàmica, calculada de manera agregada                               |
| Dificultat          | Relaxada                                                             |
| Progrés             | Basat en el capital i l'expansió de la xarxa                         |
| Mode                | Joc lliure                                                           |
| Temps               | Temps real, pausa i acceleració                                      |
| Partides            | Guardar localment, exportar i importar                               |
| Servidor            | No necessari per a la primera versió                                 |
| Motor gràfic        | Cap motor extern: Canvas 2D del navegador                            |
| Tecnologia          | React, TypeScript i Vite                                             |

## 3. Arquitectura tècnica recomanada

La recomanació és utilitzar tecnologies web habituals, sense motors gràfics externs, contenidors ni entorns Python.

### Tecnologies

[File:React-icon.svg - Wikimedia Commons](https://images.openai.com/static-rsc-4/tjuq8CSZsQxTIdZtFonmGxDMC9ab1kuxbAMTay7xUOjRnFzy6g3DFGnUmpXhbemPkyGR0_vElHKNIctox1iYcGqay3smAf4wC32agNSKIrsOtt8AiamAsaeUtHPTJ31PQ8fxzKCF2EoPNk1sxzHFAlF7n9f5TlmeZ-h4QMBDzyY?purpose=inline)

React

Interfície del joc: finestres, panells, menús, botons, llistes de línies i gestió de trens.

[TypeScript Logo Icons for Web and App Development](https://images.openai.com/static-rsc-4/Pbx8y0BkFx2FGL0rrQv12qhf7VCxQjJIxX5qzDbXfFc_2r0281FTrrhYxXs3oeHVXGVOioNH7bLrVixEVSASmJ_wcEhF77ZXSHxlzycjvcxjtXJBHHMnjUNYoQ5lFVUZW7gTZd7KpLmODFhOjJ9wCXSRFqfHbE7Oj1PItTwTFWk?purpose=inline)

TypeScript

Lògica i dades amb tipus explícits per reduir errors i facilitar el treball de la IA.

[How to achieve top-notch scrolling performance using HTML5 Canvas - DEV Community](https://images.openai.com/static-rsc-4/sluNxc2-hquvEEJ9zNCchcklG2e5wCBXs4gCHZNqcuHFZiOs_GZlxYDgMwZOgB6iqcKxnvTThmYU-TFHd5M50KO9liGve6EW7NRXbiTUrLt_IiMrXIbkDjsEH5kz48iy8EzTUywKpBX4ylj3tevn_mFuKY1JJC95g--hBTcOdXg?purpose=inline)

Canvas 2D

Dibuix del mapa, vies, estacions, trens, terreny i interacció gràfica.

[Vite Logo PNG,  Vector (AI, EPS, CDR, PDF, SVG) - iconLogoVector](https://images.openai.com/static-rsc-4/3z0Km4avLxM07hDPhEKDfS7e7PZ2lL2d3cwaKeEzgNJv9dyl98qGYk571u4SaDifiikdYK2hz1shWLZ9XF_Yxb2nSviCVF-CT-lxbC7LskalbJ4GtZ76GhzgB_MZk2WTQc3IigAMSX0g3wNU9KhgeUkOGefHiGbg1uJSTHBED1E?purpose=inline)

Vite i npm

Crear, executar i compilar el projecte web amb eines estàndard de JavaScript.

No cal instal·lar Unity, Unreal Engine, Godot ni un motor gràfic addicional. Tampoc no cal crear un entorn virtual `.venv`, perquè el projecte no utilitzarà Python.

Requisits locals: un ordinador, Node.js en una versió LTS compatible i npm, inclòs habitualment amb Node.js, més un navegador modern.

### Per què separar Canvas i React?

El mapa serà l'element visual principal. Canvas permet dibuixar molts trams de via, estacions i trens de manera eficient. React gestionarà la interfície de control.

La simulació ferroviària i l'economia no han de dependre ni de React ni de Canvas. D'aquesta manera, es poden provar i modificar sense reescriure la interfície.

## 4. Estructura de carpetes

La IA ha de crear aquesta estructura de manera progressiva, no necessàriament tota al primer pas.

```
joc-trens/
    package.json
    package-lock.json
    index.html
    tsconfig.json
    vite.config.ts
    README.md

    public/
        assets/
            README.md

    src/
        main.tsx
        App.tsx

        styles/
            global.css
            layout.css
            map.css
            panels.css

        types/
            game.ts
            map.ts
            railway.ts
            train.ts
            economy.ts
            save.ts

        data/
            catalonia.ts
            trainCatalog.ts
            gameConfig.ts

        engine/
            GameEngine.ts
            GameClock.ts
            GameState.ts

        map/
            MapCanvas.tsx
            renderMap.ts
            mapCoordinates.ts
            mapInteractions.ts
            terrain.ts

        railway/
            trackBuilder.ts
            trackGraph.ts
            pathfinding.ts
            signaling.ts
            routeValidation.ts

        simulation/
            simulationLoop.ts
            trainMovement.ts
            stationOperations.ts
            passengerDemand.ts
            lineScheduler.ts

        economy/
            revenue.ts
            expenses.ts
            economySystem.ts

        systems/
            saveSystem.ts
            importExport.ts
            validation.ts

        components/
            GameLayout.tsx
            TopBar.tsx
            SidePanel.tsx
            MapToolbar.tsx
            NotificationPanel.tsx
            ConfirmDialog.tsx

        panels/
            FinancePanel.tsx
            StationPanel.tsx
            TrainPanel.tsx
            LinePanel.tsx
            ConstructionPanel.tsx

        tests/
            economy.test.ts
            trackGraph.test.ts
            trainMovement.test.ts
            saveSystem.test.ts
```

### Responsabilitat dels mòduls

- `types/`: definicions de les dades del joc.
- `data/`: mapa inicial, catàleg de trens i configuració.
- `engine/`: estat general, rellotge i coordinació de la simulació.
- `map/`: visualització i interacció amb el mapa.
- `railway/`: vies, connexions, camins i senyalització.
- `simulation/`: moviment dels trens i transport de passatgers.
- `economy/`: ingressos i despeses.
- `systems/`: guardat, càrrega, importació, exportació i validacions.
- `components/` i `panels/`: interfície d'usuari.
- `tests/`: proves automàtiques.

Regla important: no s'ha de crear un únic fitxer enorme amb tot el joc. Cada mòdul ha de tenir una responsabilitat concreta.

## 5. El mapa de Catalunya

El mapa ha de ser reconeixible com a Catalunya, però no cal reproduir-ne amb exactitud tota la geografia ferroviària des de la primera versió.

### 5.1. Regió inicial

La proposta és començar amb una zona reduïda al voltant de Barcelona i els seus corredors principals, amb una expansió posterior cap a Girona, Tarragona, Lleida i altres zones.

El mapa inicial hauria de tenir:

- Barcelona com a nucli principal de demanda.
- Diverses poblacions connectables.
- Costa, rius, planes i zones muntanyoses.
- Alguns corredors ferroviaris preexistents com a referència visual, però sense obligar el jugador a seguir-los.
- Espai lliure per construir noves línies.

Les posicions i distàncies es poden simplificar per aconseguir una jugabilitat clara. Cal evitar que el mapa sigui només un dibuix decoratiu: el terreny ha de participar en el càlcul dels costos de construcció.

### 5.2. Coordenades

El món del joc ha de tenir coordenades pròpies independents de la pantalla.

- Les coordenades del món representen la posició d'estacions, vies i terreny.
- Les coordenades de pantalla serveixen per dibuixar i detectar clics.
- El zoom i el desplaçament de la càmera no han de modificar les dades reals del món.
- El jugador ha de poder ampliar, reduir i moure el mapa sense desplaçar accidentalment les vies.

### 5.3. Terreny i construcció

El cost d'una via dependrà de la distància i del tipus de terreny.

| Terreny                   | Efecte inicial proposat                |
| ------------------------- | -------------------------------------- |
| Plana                     | Cost base                              |
| Costa o terreny irregular | Recàrrec moderat                       |
| Muntanya                  | Cost elevat                            |
| Riu                       | Cost addicional per travessar-lo       |
| Túnel                     | Cost elevat en trams subterranis       |
| Pont                      | Cost addicional en travessar obstacles |

Aquests valors han de ser configurables. No s'han d'escampar números arbitraris per tot el codi.

Per a la primera versió, ponts i túnels poden ser simplificacions visuals i econòmiques. La construcció ha de poder detectar quan una via travessa un riu o una zona muntanyosa sense necessitat d'una simulació geològica realista.

### 5.4. Construcció de vies

El jugador podrà:

1. Activar l'eina de construcció.
2. Seleccionar el punt inicial, normalment una estació o un extrem de via.
3. Dibuixar el recorregut amb el ratolí.
4. Veure una previsualització abans de confirmar-lo.
5. Consultar el cost estimat.
6. Confirmar o cancel·lar la construcció.

La via s'ha de representar com una xarxa de connexions, no com una simple línia dibuixada.

Cada segment ha de tenir extrems identificables i connexions amb els segments veïns. Això permetrà calcular rutes, detectar trams ocupats i moure trens.

## 6. Estacions, vies i xarxa ferroviària

### 6.1. Estacions

Les estacions es construiran sobre una via existent o com a part d'un nou traçat.

Cada estació tindrà, com a mínim:

- Identificador únic.
- Nom.
- Posició al mapa.
- Capacitat de passatgers.
- Vies o andanes disponibles.
- Demanda de passatgers.
- Connexions amb la xarxa ferroviària.

Les estacions no necessiten treballadors, horaris interns complexos ni serveis auxiliars en aquesta primera versió.

### 6.2. Via única i doble

Via única: els trens poden circular en ambdós sentits, però han de compartir els trams. Si dos trens necessiten ocupar un mateix tram alhora, un haurà d'esperar.

Via doble: cada sentit té assignat el seu propi tram de circulació. Això redueix els conflictes entre trens que circulen en direccions oposades.

En la primera versió no cal simular totes les particularitats de les bifurcacions reals. Sí que cal impedir que dos trens ocupin simultàniament un mateix tram incompatible.

### 6.3. Validació dels traçats

El joc ha de comprovar que:

- Els segments estan connectats.
- No es creen connexions impossibles per errors de clic.
- Les estacions connecten amb la xarxa.
- Les línies tenen un recorregut continu.
- El cost de construcció es pot calcular abans de confirmar.
- No es pot gastar capital que no es té, llevat que més endavant s'introdueixi un mecanisme específic.
- La cancel·lació d'una construcció provisional no altera la xarxa real.

## 7. Trens i circulació

### 7.1. Catàleg de trens

El jugador comprarà trens complets, no locomotores i vagons per separat.

Cada model tindrà dades com ara:

- Nom i categoria.
- Preu de compra.
- Capacitat de passatgers.
- Velocitat màxima.
- Acceleració simplificada.
- Cost de manteniment.
- Consum o cost operatiu abstracte.
- Velocitat màxima permesa segons el tipus de via.

Els valors inicials poden ser ficticis però coherents. Han de quedar en un catàleg central perquè sigui fàcil afegir models.

### 7.2. Trens d'alta velocitat

Els trens d'alta velocitat podran utilitzar vies ordinàries si el disseny del joc ho permet, però hi circularan a una velocitat limitada.

Per simplificar la primera versió:

- Cada tram tindrà una velocitat màxima.
- Cada tren tindrà una velocitat màxima pròpia.
- La velocitat efectiva serà la menor de les dues, tenint en compte les limitacions de seguretat.
- Les línies d'alta velocitat podran rebre un cost de construcció més elevat i permetre velocitats superiors.

Així es pot diferenciar l'alta velocitat sense haver d'implementar tota la normativa ferroviària real.

### 7.3. Circulació automàtica

Els trens circularan automàticament segons la línia assignada.

Un tren haurà de poder:

- Esperar a l'estació.
- Accelerar i frenar de manera simplificada.
- Recórrer segments de via.
- Aturar-se a les estacions de la línia.
- Carregar i descarregar passatgers.
- Esperar si el següent tram no està disponible.
- Continuar quan el tram estigui lliure.

La circulació ha de ser determinista en les condicions bàsiques: si no hi ha canvis de dades, els trens no han de desaparèixer, teletransportar-se ni travessar-se per errors de programació.

### 7.4. Senyalització

La primera versió tindrà una senyalització simplificada basada en l'ocupació dels trams.

Cada tren reservarà o ocuparà els trams que necessiti segons la regla de circulació definida. Els altres trens no hi podran entrar si això genera un conflicte.

No cal començar amb senyals semafòrics configurables pel jugador. Primer s'ha de garantir una circulació segura; posteriorment es poden afegir senyals visibles i opcions avançades.

## 8. Línies i horaris

### 8.1. Crear una línia

El jugador podrà crear una línia seleccionant estacions en ordre.

Cada línia tindrà:

- Nom i color.
- Llista ordenada d'estacions.
- Trens assignats.
- Freqüència de servei.
- Ingressos i despeses estimats.
- Estat de funcionament.
- Nombre aproximat de passatgers transportats.

El joc ha de validar que totes les estacions de la línia estiguin connectades mitjançant un recorregut ferroviari vàlid.

### 8.2. Freqüències

La primera versió ha de prioritzar les freqüències en lloc dels horaris exactes.

Per exemple, el jugador pot seleccionar una freqüència objectiu de sortides cada 10, 15 o 30 minuts. El sistema determinarà quants trens calen per prestar el servei i indicarà si n'hi ha prou.

Si la flota assignada és insuficient, la línia funcionarà amb una freqüència pitjor de la desitjada o mostrarà un avís clar.

### 8.3. Horaris detallats

Els horaris amb hores exactes de sortida, arribada i coordinació entre línies es deixen per a una ampliació posterior.

Això evita haver de resoldre al principi tots els problemes de sincronització. L'arquitectura, però, ha de separar les línies del moviment dels trens perquè més endavant es pugui afegir un planificador horari sense reescriure tot el sistema.

## 9. Passatgers i demanda

La demanda ha de ser dinàmica, però no cal simular individualment cada passatger.

### 9.1. Model agregat

El joc calcularà quants passatgers volen viatjar entre parelles d'estacions o zones.

La demanda podrà dependre de:

- Importància de les poblacions.
- Atracció de l'origen i la destinació.
- Temps estimat de viatge.
- Freqüència del servei.
- Capacitat dels trens.
- Preu dels bitllets, en una fase posterior.

Les ciutats grans generaran més demanda que les petites. Els serveis freqüents i ràpids seran més atractius.

### 9.2. Transport i ingressos

Quan un tren arribi a una estació:

1. El joc calcula quants passatgers volen pujar-hi.
2. Comprova la capacitat disponible.
3. Carrega els passatgers possibles.
4. Els passatgers arriben a la seva destinació quan el tren hi arriba.
5. El sistema registra els bitllets venuts i els ingressos.

No s'ha de generar un objecte individual per a cada viatger. Les quantitats es poden gestionar mitjançant comptadors agregats, cosa que redueix la complexitat i millora el rendiment.

### 9.3. Indicadors

La interfície hauria de mostrar:

- Passatgers transportats.
- Ocupació mitjana dels trens.
- Passatgers que no han pogut pujar per falta de capacitat.
- Ingressos per línia.
- Temps aproximat de viatge.
- Demanda estimada de les estacions.

## 10. Economia i progressió

### 10.1. Capital inicial

El jugador començarà amb un capital mitjà, configurable des de la configuració del joc. El valor exacte es podrà ajustar després de provar la primera versió.

Les principals despeses seran:

- Construcció de vies.
- Construcció d'estacions.
- Compra de trens.
- Manteniment.
- Cost operatiu dels serveis.

L'últim punt és una proposta complementària: tot i que la gestió desitjada és relaxada, un cost operatiu senzill per tren o distància ajuda a evitar que el joc es converteixi en una font d'ingressos infinita sense decisions econòmiques.

### 10.2. Ingressos

Els ingressos principals provindran dels bitllets.

El preu pot començar amb una tarifa base configurable per viatge o distància. No cal incloure preus diferents segons la classe, abonaments, descomptes o sistemes tarifaris complexos en la primera versió.

### 10.3. Dificultat relaxada

La partida no hauria de quedar inutilitzada per una mala decisió econòmica.

Es recomana:

- Mostrar el cost abans de cada construcció o compra.
- Avisar quan el capital sigui baix.
- Evitar que una acció deixi el saldo negatiu sense una confirmació explícita.
- Permetre continuar jugant encara que l'empresa tingui pèrdues, però sense possibilitat de fer compres que no es pugui permetre.
- Oferir la càrrega d'una partida anterior.

No hi haurà préstecs ni desbloquejos tecnològics obligatoris en la primera versió.

### 10.4. Progressió

El jugador podrà ampliar la xarxa a mesura que acumuli capital. La progressió serà emergent: construir connexions rendibles, augmentar la freqüència, comprar trens millors i ampliar l'àrea servida.

## 11. Temps i simulació

El joc funcionarà en temps real i tindrà tres controls principals:

- Pausa.
- Velocitat normal.
- Acceleració.

La velocitat del joc ha de controlar la simulació, no la velocitat de dibuix de la pantalla.

Per tant, cal separar:

- Actualització de simulació: modifica trens, passatgers, economia i rellotge.
- Renderització: dibuixa l'estat actual del joc.

El sistema ha de funcionar de manera raonable encara que la freqüència de refresc del navegador variï. No s'han d'aplicar costos econòmics a cada fotograma; s'han de calcular a partir del temps de joc transcorregut.

## 12. Interfície d'usuari

La distribució recomanada és un mapa central amb una barra superior i panells laterals.

Barra superior

Capital · Hora del joc · Pausa · Velocitat · Guardar

Eines

Vies

Estacions

Línies

Trens

Mapa ferroviari de Catalunya

Vies · Estacions · Trens · Terreny

Informació

Element seleccionat

Costos

Estadístiques

Notificacions

Conflictes de circulació, avisos econòmics i errors de construcció

Aquest esquema és conceptual. La mida dels panells ha de ser adaptable a la finestra i el mapa ha de conservar la major part de l'espai disponible.

### Panells necessaris

- Construcció: vies, estacions i cost estimat.
- Línies: crear línies, modificar-ne les parades i assignar-hi trens.
- Trens: comprar, consultar, assignar i retirar trens.
- Estacions: demanda, passatgers i connexions.
- Finances: ingressos, despeses, saldo i evolució econòmica.
- Notificacions: avisos importants i errors que el jugador pugui corregir.

Els errors han d'explicar què ha passat i com solucionar-ho. No n'hi ha prou amb mostrar missatges genèrics com «Error».

## 13. Guardar, carregar i compartir partides

La primera versió no necessita un servidor ni comptes d'usuari.

### Guardat local

El joc ha de poder guardar l'estat de la partida al navegador mitjançant `localStorage`, amb una versió del format de dades.

Cal guardar, com a mínim:

- Capital i estadístiques.
- Temps del joc.
- Estacions.
- Xarxa de vies.
- Trens i posicions lògiques.
- Línies i assignacions.
- Demanda i comptadors necessaris per continuar la simulació.

### Exportació i importació

L'usuari ha de poder exportar la partida a un fitxer JSON i tornar-la a importar.

La importació ha de validar les dades abans de carregar-les. Un fitxer mal format o incompatible no ha de bloquejar el joc ni destruir la partida actual.

El format ha d'incloure un camp de versió perquè les futures actualitzacions puguin migrar les partides antigues.

## 14. Abast de la primera versió jugable

Per evitar que el projecte es descontroli, aquestes són les funcions que han de quedar completades abans de considerar la primera versió funcional.

| Funció                            | Obligatòria        |
| --------------------------------- | ------------------ |
| Mapa de Catalunya simplificat     | Sí                 |
| Zoom i desplaçament del mapa      | Sí                 |
| Construcció de vies i estacions   | Sí                 |
| Connexions i validació de rutes   | Sí                 |
| Compra de trens                   | Sí                 |
| Creació de línies                 | Sí                 |
| Moviment automàtic dels trens     | Sí                 |
| Ocupació de trams i espera segura | Sí                 |
| Transport agregat de passatgers   | Sí                 |
| Ingressos i despeses              | Sí                 |
| Pausa i acceleració               | Sí                 |
| Guardar i carregar                | Sí                 |
| Importar i exportar partides      | Sí                 |
| Alta velocitat diferenciada       | Sí                 |
| Horaris exactes avançats          | No, fase posterior |
| Senyals configurables manualment  | No, fase posterior |
| Multijugador                      | No                 |
| Mercaderies                       | No                 |
| Clima i avaries aleatòries        | No                 |
| Gestió de personal                | No                 |
| Servidor o comptes                | No                 |

La primera versió no s'ha de considerar acabada si només es pot dibuixar una via i veure un tren circular. Cal que el jugador pugui gestionar una xarxa amb ingressos, costos i guardat de partida.

# 15. Pla de desenvolupament amb una IA

Aquesta és la part més important per al teu objectiu. No demanis a la IA que construeixi tot el joc d'una sola vegada. Demana-li una fase, comprova el resultat al teu ordinador i només aleshores passa a la següent.

Fes servir una mateixa carpeta de projecte i, si és possible, una mateixa conversa de programació. Si necessites canviar de conversa, conserva el document, el `README.md`, l'estat actual i els errors pendents.

## Regles que s'apliquen a tots els passos

Copia aquestes instruccions al començament de la conversa amb la IA que escrigui el codi.

Estàs desenvolupant el projecte «Joc trens», un joc de gestió ferroviària per a navegador definit en el document de disseny que t'he proporcionat.

**Regles obligatòries de desenvolupament:**

1. Desenvolupa el projecte per fases petites i verificables. No implementis fases futures sense que t'ho demani.
2. Abans de modificar fitxers, inspecciona l'estructura i el codi existent. No assumeixis que un fitxer està buit ni que pots substituir-lo.
3. Mantén l'arquitectura modular. Separa la simulació, les dades, el mapa, l'economia i la interfície.
4. Fes servir TypeScript, React, Vite, Canvas 2D i CSS.
5. Utilitza indentació de 4 espais en tots els fitxers de codi que ho permetin.
6. No utilitzis Python, entorns `.venv`, Docker, motors gràfics externs ni dependències innecessàries.
7. Utilitza npm i les eines estàndard del projecte. Justifica qualsevol dependència nova abans d'afegir-la.
8. No creïs fitxers gegants ni concentris tota la lògica en un sol component.
9. No canviïs interfaces, tipus o formats de dades existents sense comprovar quins mòduls en depenen.
10. Abans d'acabar una fase, executa les comprovacions disponibles: compilació, comprovació de tipus i proves automatitzades quan n'hi hagi.
11. No declaris que una comprovació ha funcionat si no l'has executada.
12. No eliminis funcions existents per solucionar errors d'altres mòduls. Busca la causa real.
13. Si falta informació essencial, hi ha decisions de disseny incompatibles o cal una dependència addicional, explica-m'ho abans de prendre una decisió difícil de revertir.
14. No utilitzis dades fictícies per simular una funcionalitat com si ja fos real. Les dades de prova han d'estar identificades.
15. Si una fase falla, corregeix-la abans de continuar. No acumulis errors pendents.
16. En acabar cada fase, informa'm dels fitxers creats o modificats, què funciona, les proves executades i el que he de fer per comprovar-ho.
17. Atura't al final de cada fase i espera la meva confirmació explícita.

**Format de treball:** primer explica breument el pla de la fase, després implementa només aquella fase, executa les comprovacions, resumeix el resultat i espera la meva aprovació. No avancis automàticament.

## Ordre exacte dels prompts

Ves copiant els prompts següents un per un, en aquest ordre. No els enviïs tots alhora.

### Pas 1. Crear l'esquelet del projecte

Primera tasca

Demana només el projecte web buit, preparat per executar-se.

Fase 1 del Joc trens: crea l'esquelet mínim del projecte amb Vite, React i TypeScript.

Abans de començar, comprova si la carpeta ja conté fitxers. Si no existeix, crea el projecte. No sobreescriguis fitxers sense avisar-me.

Configura npm, TypeScript i l'estructura inicial de carpetes definida al document de disseny. Afegeix un README amb les instruccions per instal·lar dependències, iniciar el servidor de desenvolupament i generar la compilació.

Crea només una pantalla inicial amb el títol «Joc trens». No implementis encara mapa, economia, trens ni simulació.

Executa les comprovacions disponibles i explica'm exactament com obrir el joc al navegador. Atura't quan aquesta fase funcioni.

### Pas 2. Definir les dades i els tipus

Establir els fonaments abans d'afegir funcionalitats.

Fase 2: defineix els tipus i les estructures de dades del Joc trens.

Implementa els tipus TypeScript necessaris per representar el món, les estacions, els segments de via, les connexions, els trens, els models de tren, les línies, els passatgers agregats, l'economia, el rellotge i les partides guardades.

Utilitza identificadors estables i únics. Defineix explícitament les relacions entre entitats. Separa les dades del món de les coordenades de pantalla.

Crea també una configuració central per als costos, velocitats, capacitats i altres paràmetres de simulació.

No implementis encara el comportament del joc. Evita tipus genèrics excessivament permissius com `any`.

Executa la comprovació de tipus. Resumeix les decisions de model de dades i atura't.

### Pas 3. Crear el mapa 2D

Encara sense circulació ferroviària.

Fase 3: implementa el mapa 2D amb Canvas natiu del navegador.

Crea un mapa inicial esquemàtic de Catalunya amb poblacions, costa, rius i zones muntanyoses. Les dades geogràfiques han d'estar separades del renderitzador i ser fàcils de substituir per dades més precises en el futur.

Implementa zoom, desplaçament de càmera, redimensionament del Canvas i conversió correcta entre coordenades del món i coordenades de pantalla.

Organitza el codi en mòduls petits. El mapa ha de continuar funcionant amb diferents dimensions de finestra.

No implementis encara construcció, trens ni economia. No utilitzis imatges com a substitut d'un mapa interactiu.

Comprova visualment que el mapa es veu bé i que el zoom no desplaça incorrectament els elements. Atura't.

### Pas 4. Construir la xarxa de vies

Connectivitat real, no només dibuix.

Fase 4: implementa el model de xarxa ferroviària i la construcció de vies.

Crea un graf de nodes i segments connectats, amb identificadors estables. Implementa les operacions per afegir, consultar i validar connexions.

Afegeix una eina de construcció amb ratolí, previsualització del recorregut, cancel·lació, càlcul estimat del cost i confirmació de la construcció. Incorpora una representació inicial del cost segons la distància i el terreny.

La xarxa de dades ha de ser independent del Canvas. El dibuix ha de representar les dades reals de la xarxa.

Evita implementar encara circulació de trens. Afegeix proves per a les connexions, els extrems de via i els recorreguts invàlids.

Comprova que les vies es mantenen correctes després de fer zoom i moure el mapa. Atura't.

### Pas 5. Afegir estacions

Fase 5: implementa la construcció i gestió bàsica d'estacions.

Permet crear una estació, assignar-li un nom, seleccionar-la al mapa i mostrar-ne la informació en un panell lateral. Connecta cada estació amb la xarxa ferroviària mitjançant una estructura de dades coherent.

Valida que les estacions no es creïn en posicions invàlides i que la connexió amb la xarxa es pugui detectar. Afegeix capacitat i demanda inicial com a dades configurables.

No implementis encara passatgers ni moviment de trens. Comprova la creació, selecció i visualització de les estacions. Atura't.

### Pas 6. Crear el rellotge i el motor de simulació

Fase 6: crea el motor de simulació independent de la interfície.

Implementa el rellotge del joc, la pausa, la velocitat normal i l'acceleració. Separa les actualitzacions de simulació del dibuix del mapa. Gestiona el temps transcorregut de manera que els resultats no depenguin directament del nombre de fotogrames per segon.

Crea un punt d'entrada central per actualitzar l'estat del joc i deixa els sistemes de trens i economia preparats per integrar-s'hi després.

No afegeixis encara moviment ferroviari ni costos recurrents. Prova que el rellotge avança, s'atura i s'accelera correctament. Atura't.

### Pas 7. Comprar i representar trens

Fase 7: implementa el catàleg de trens i la compra de trens complets.

Defineix diversos models inicials de trens de passatgers i d'alta velocitat, amb preu, capacitat, velocitat i costos configurables. Afegeix una interfície per consultar el catàleg, comprar un tren i veure els trens propietat del jugador.

Dibuixa els trens al mapa quan tinguin una posició vàlida, però no implementis encara circulació automàtica.

La compra ha de comprovar el capital disponible. Evita que el saldo es modifiqui si una compra falla. Afegeix proves per al catàleg i la compra. Atura't.

### Pas 8. Crear línies i trobar recorreguts

Fase 8: implementa la creació de línies ferroviàries i el càlcul de recorreguts.

Permet seleccionar estacions en ordre, assignar un nom i un color a cada línia i validar que les estacions estan connectades mitjançant un recorregut real.

Implementa un algorisme de cerca de camins sobre el graf de vies. El resultat ha de ser una seqüència ordenada de segments que connecti les estacions de la línia.

Si no hi ha cap camí possible, mostra un missatge útil i no guardis una línia invàlida.

Encara no facis circular els trens. Afegeix proves per als camins possibles, els camins inexistents i les connexions múltiples. Atura't.

### Pas 9. Implementar circulació i senyalització

Fase 9: implementa el moviment automàtic dels trens sobre la xarxa ferroviària.

Els trens han de seguir els segments del recorregut calculat, aturar-se a les estacions i adaptar la velocitat als límits del tren i de la via.

Implementa un sistema d'ocupació de trams perquè dos trens no entrin simultàniament en un mateix tram incompatible. Si un tram està ocupat, el tren ha d'esperar i reprendre la marxa quan sigui segur.

Diferencia la via única de la doble via mitjançant regles explícites de circulació. No simulis una via doble només canviant-ne el dibuix.

Integra el moviment amb el rellotge del joc. Afegeix proves de trens que avancen, s'aturen, esperen i reprenen la circulació.

No implementis encara economia de passatgers. Atura't quan el moviment sigui estable.

### Pas 10. Simular passatgers

Fase 10: implementa la demanda agregada de passatgers i el transport entre estacions.

No creïs una entitat individual per a cada passatger. Utilitza quantitats agregades i fluxos entre orígens i destinacions.

La demanda ha de dependre de la importància de les poblacions i de la qualitat del servei. Quan un tren arribi a una estació, ha de carregar passatgers dins de la capacitat disponible i descarregar-los quan arribin a la seva destinació.

Registra passatgers transportats, ocupació i demanda no atesa. Integra-ho amb les línies i el moviment ja existents.

No implementis encara els comptes econòmics definitius. Evita que els passatgers desapareguin o es comptin dues vegades. Afegeix proves i atura't.

### Pas 11. Integrar l'economia

Fase 11: implementa l'economia completa del Joc trens.

Integra els ingressos per bitllets i les despeses de construcció, estacions, compra de trens, manteniment i operació. Centralitza les fórmules i els paràmetres econòmics.

Mostra el capital disponible, els ingressos, les despeses i el resultat net. Afegeix un historial resumit dels comptes i estadístiques per línia.

Les operacions s'han de comptabilitzar una sola vegada. Les despeses recurrents han de dependre del temps de joc, no de la freqüència de refresc del navegador.

Mantén la dificultat relaxada: avisos abans de compres costoses i impossibilitat de comprar si no hi ha prou capital. Afegeix proves econòmiques. Atura't.

### Pas 12. Guardar i importar partides

Fase 12: implementa el sistema de guardat i recuperació de partides.

Guarda l'estat complet i necessari per continuar la simulació a localStorage. Afegeix exportació a fitxer JSON i importació des d'un fitxer JSON.

Defineix una versió del format de partida. Valida les dades importades abans de substituir l'estat actual. Si la importació falla, conserva la partida actual i mostra un missatge clar.

Evita guardar dades derivades que es puguin reconstruir fàcilment si això pot provocar inconsistències. Comprova que una partida exportada i importada manté la xarxa, els trens, les línies, el capital i el temps.

Afegeix proves i atura't.

### Pas 13. Completar la interfície

Fase 13: integra i completa la interfície de gestió del Joc trens.

Organitza la pantalla amb mapa central, barra superior, eines de construcció, panells laterals i notificacions.

Implementa els panells de construcció, estacions, línies, trens i finances. Afegeix controls per a pausa, acceleració, selecció d'elements i guardat.

Assegura't que tots els controls tinguin una funció real. Elimina els botons decoratius que no facin res o implementa'n el comportament abans de considerar la fase acabada.

Els missatges han de ser comprensibles i les accions destructives o costoses han de requerir confirmació quan sigui necessari. Comprova que el mapa continua funcionant quan s'obren i es tanquen panells.

No reescriguis els sistemes de simulació si no és imprescindible. Atura't.

### Pas 14. Prova completa i correcció d'errors

Fase 14: fes una auditoria funcional de la primera versió completa del Joc trens.

No afegeixis funcions noves. Revisa els sistemes existents i executa les comprovacions disponibles.

Comprova aquest recorregut complet: iniciar una partida, construir vies, crear estacions, comprar un tren, connectar estacions, crear una línia, fer circular el tren, transportar passatgers, registrar ingressos i despeses, guardar la partida, recarregar-la i continuar jugant.

Busca errors de tipus, errors de consola, càlculs econòmics duplicats, trens bloquejats permanentment, vies desconnectades, problemes de zoom, errors d'importació i inconsistències en les dades.

Corregeix els errors trobats sense eliminar funcionalitats per ocultar-los. Executa les proves després de cada correcció i documenta els problemes que no es puguin resoldre.

Acaba amb una llista de comprovacions superades i pendents. No declaris el joc acabat si el recorregut principal no funciona.

## 16. Com comprovar cada fase al teu ordinador

Quan la IA acabi una fase, no et limitis a acceptar la seva explicació. Comprova que el projecte funciona realment.

Els comandos exactes dependran del que hi hagi configurat a `package.json`, però normalment faràs servir:

```
npm install
npm run dev
```

Això inicia el servidor de desenvolupament. La terminal indicarà l'adreça local que has d'obrir al navegador.

Per comprovar la compilació:

```
npm run build
```

Si el projecte disposa d'una comprovació de tipus independent:

```
npx tsc --noEmit
```

No cal executar tots aquests comandos a cegues: demana a la IA que comprovi els scripts disponibles i que t'indiqui què ha executat. Si no tens terminal integrada en l'eina de programació, hauràs de fer les comprovacions tu mateix.

### Llista de verificació personal

### Prova de la primera versió

0 de 10

El projecte s'inicia al navegador sense errors.

El mapa es pot ampliar i moure.

Puc construir vies i crear estacions.

Les vies connectades formen recorreguts reals.

Puc comprar un tren i crear una línia.

Els trens es mouen i esperen quan cal.

Els passatgers es transporten i es compten correctament.

Els ingressos i les despeses són coherents.

La pausa i l'acceleració funcionen.

Puc guardar, exportar, importar i continuar una partida.

Reiniciar comprovacions

## 17. Funcions per afegir després

Un cop la primera versió sigui estable, pots ampliar-la sense comprometre el nucli del joc.

Ordre recomanat:

1. Horaris exactes i coordinació entre línies.
2. Geografia més precisa de Catalunya i més poblacions.
3. Estacions més grans, més vies i andanes.
4. Millores de senyalització i gestió de bifurcacions.
5. Serveis d'alta velocitat més diferenciats.
6. Estadístiques avançades de demanda i rendibilitat.
7. Tarifes i preus de bitllets.
8. Més models de trens i opcions de personalització.
9. Expansió del mapa cap a altres regions.
10. Millores visuals i efectes de so.

El servidor, el multijugador i la gestió de mercaderies queden fora del pla inicial.

## 18. Regles per evitar que el projecte es trenqui

Hi ha cinc riscos especialment importants en un joc ferroviari d'aquest tipus.

1\. Modificacions massives. Si la IA modifica simultàniament molts mòduls, és difícil saber quin canvi ha provocat un error. Limita cada fase als fitxers estrictament necessaris.

2\. Xarxa dibuixada però no connectada. Les vies han de ser una estructura de dades amb connexions reals. El Canvas només les representa.

3\. Simulació dependent dels fotogrames. El moviment i l'economia han de dependre del temps de joc transcorregut, no del nombre de dibuixos per segon.

4\. Tipus i formats canviants. Abans de modificar un tipus central, la IA ha de localitzar-ne tots els usos i actualitzar les dependències de manera coherent.

5\. Funcions aparentment acabades. Una pantalla amb un botó no significa que la funcionalitat estigui implementada. Cada funció ha de tenir una prova manual o automatitzada.

És recomanable fer una còpia de seguretat o un commit de Git quan acabis cada fase. Git és opcional, però molt útil per recuperar una versió que funcionava.

## 19. Condicions per donar el projecte per acabat

La primera versió es podrà considerar completa quan:

- Es pugui iniciar i continuar una partida al navegador.
- El mapa representi una Catalunya simplificada.
- Es puguin construir xarxes ferroviàries connectades.
- Es puguin crear estacions i línies vàlides.
- Els trens circulin automàticament amb gestió bàsica dels conflictes.
- Els passatgers generin ingressos reals dins del model de simulació.
- Les despeses s'apliquin de manera coherent.
- El jugador pugui pausar i accelerar el temps.
- El guardat i la recuperació de partides funcionin.
- La compilació i les comprovacions definides pel projecte passin sense errors coneguts pendents que bloquegin el joc.

La recomanació final: comença pel pas 1 i no passis al pas següent fins que el resultat actual funcioni. El valor d'aquest mètode és que sempre tindràs una versió comprovable, sabràs què ha canviat i podràs corregir els problemes abans que es propaguin a la resta del joc.