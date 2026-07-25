# ShadowLOLClassic

Builds, runas, maestrías y tier lists de **League of Legends Classic** — el modo retro oficial de Riot (lanzamiento 29 de julio de 2026, parche 26.15, base Season 3).

App web sin frameworks: HTML5 + CSS + JavaScript puro. Funciona abriendo `index.html` directamente, sin instalar nada.

## Qué incluye

- **Roster oficial** de LoL Classic: los 61 campeones de lanzamiento con kits pre-rework, más los confirmados para después (Akali, Caitlyn, Fiora, Graves, Irelia, LeBlanc, Mordekaiser).
- **Builds detalladas** con objetos (inicio / núcleo / situacionales), runas clásicas (marcas, sellos, glifos, quintaesencias), maestrías del árbol Ofensa / Defensa / Utilidad, hechizos de invocador, orden de habilidades, plan de partida por fases y consejos.
- **Builds por season**: cada build pertenece a una era (S1, S2, S3) y renderiza los iconos del parche de *su* temporada.
- **Tier list por modos**: Grieta Clásica y ARAM Clásico.
- **Búsqueda con autocomplete** entre campeones, builds y secciones.
- **Iconos originales** servidos desde Data Dragon, el CDN oficial de Riot.

## Estructura

```
index.html        Estructura y vistas
css/style.css     Tema oscuro estilo cliente de LoL
js/data.js        Roster, builds, tier lists y metadatos de seasons
js/app.js         Renderizado, navegación y búsqueda
```

## Añadir un campeón o una build

Todo vive en `js/data.js`. Para una build nueva, añade una entrada al objeto `BUILDS` usando la clave del campeón (su id de Data Dragon en minúsculas):

```js
nombreCampeon: [
  {
    name: 'Top — Nombre de la build',
    season: 'S3',              // opcional: 'parche' fija los iconos de otra época
    role: 'Top',
    items: { inicio: [[1054, 'Escudo de Doran']], core: [...], situacionales: [...] },
    runas: { marca: {...}, sello: {...}, glifo: {...}, quinta: {...} },
    maestrias: { reparto: '21/9/0', clave: '...', arboles: [...] },
    // hechizos, habilidades, plan, tips, fuentes...
  }
]
```

Los IDs de objetos se verifican contra el catálogo del parche:
`https://ddragon.leagueoflegends.com/cdn/3.15.5/data/es_ES/item.json`

## Fuentes

Los datos combinan varias fuentes, enlazadas en cada build dentro de la app:

- [MetaSRC — LoL Classic](https://www.metasrc.com/lol/classic) (estadísticas en vivo del modo)
- [Coachless](https://coachless.gg/builds) (builds analíticas)
- [Mobalytics](https://mobalytics.gg/lol/classic) y [OP.GG](https://op.gg/lol/classic)
- [Wiki de LoL](https://leagueoflegends.fandom.com/es/wiki/) (kits e historial de parches)

Proyecto de fan, sin relación oficial con Riot Games.
