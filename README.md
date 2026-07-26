# ShadowMeta

**Builds, páginas de runas, maestrías y tier lists de League of Legends — todas las eras, todos los modos.**

De las botas y tres pociones de la Season 1 al parche actual, pasando por LoL Classic, el modo retro oficial de Riot. Cada build se renderiza con los iconos del parche de *su* temporada.

🔗 **https://shadowmeta.vercel.app**

App web sin frameworks: HTML5 + CSS + JavaScript puro. Funciona abriendo `index.html` directamente.

## Qué incluye

- **Selector de contexto**: elige la era (LoL Classic · Season 1 · Season 2 · Season 3 · Actual) y el modo (Grieta · ARAM). Todo el sitio se adapta y la elección se recuerda entre visitas.
- **Componentes visuales reales**, no listas de texto:
  - Página de runas clásica con las 30 gemas (9 marcas, 9 sellos, 9 glifos, 3 quintaesencias).
  - Tablero de maestrías con el reparto de puntos por árbol (Ofensa / Defensa / Utilidad).
  - Runas modernas con piedra angular, árbol secundario y fragmentos.
  - Tabla de subida de habilidades nivel por nivel (1–18).
- **Roster completo** de LoL Classic (61 campeones de lanzamiento + los confirmados después).
- **Tier list** por modo de juego.
- **Búsqueda con autocompletado** entre campeones, builds, eras y modos.
- **Iconos oficiales** de Data Dragon, el CDN de Riot, del parche correspondiente a cada era.

## Estructura

```
index.html        Estructura y vistas
css/style.css     Tema oscuro estilo cliente de LoL
js/data.js        Eras, modos, roster, builds y tier lists
js/app.js         Renderizado, componentes visuales, navegación y búsqueda
```

## Añadir una build

Todo vive en `js/data.js`, en el objeto `BUILDS` (la clave es el id del campeón en Data Dragon, en minúsculas):

```js
nombreCampeon: [
  {
    name: 'Top — Nombre de la build',
    season: 'S3',        // 'S1' | 'S2' | 'S3' | 'ACT' — define el parche de iconos
    modo: 'grieta',      // 'grieta' | 'aram'
    role: 'Top',
    items: { inicio: [[1054, 'Escudo de Doran']], core: [...], situacionales: [...] },
    runas: { marca: {...}, sello: {...}, glifo: {...}, quinta: {...} },   // clásicas
    maestrias: { reparto: '21/9/0', clave: '...', arboles: [...] },
    // hechizos, habilidades, plan, tips, fuentes...
  }
]
```

Para builds del parche actual usa `season: 'ACT'` y sustituye `runas` + `maestrias` por `runasModernas`
(piedra angular, árbol secundario y fragmentos). El renderizador detecta cuál toca automáticamente.

Las builds de la Season 3 aparecen también en LoL Classic, porque comparten meta. Si necesitas otra
combinación, declara `ediciones: ['classic']` explícitamente.

**Verifica siempre los IDs de objetos contra el catálogo del parche**, porque no todos existían en todas
las eras (el Eco de Luden, por ejemplo, no existe en la Season 3):

```bash
curl -s https://ddragon.leagueoflegends.com/cdn/3.15.5/data/es_ES/item.json
```

## Fuentes

Los datos combinan el meta documentado de cada era con estadísticas en vivo:
[MetaSRC Classic](https://www.metasrc.com/lol/classic), [Coachless](https://coachless.gg/builds),
[Mobalytics](https://mobalytics.gg/lol/classic), [OP.GG](https://op.gg/lol/classic) y la
[Wiki de LoL](https://leagueoflegends.fandom.com/es/wiki/).

Proyecto de fan, sin relación oficial con Riot Games.
