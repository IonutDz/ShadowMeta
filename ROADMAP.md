# ShadowMeta — Hoja de ruta

Estado real del proyecto. Actualizado: 26/07/2026.

Leyenda: ✅ hecho · 🔨 parcial · ⬜ pendiente

---

## 1. Contenido — builds

| Contexto | Hoy | Objetivo | Estado |
|---|---|---|---|
| Classic/S3 · Grieta | **63** | 61 + roles extra | ✅ roster completo |
| Classic · ARAM | **61** | 61 | ✅ **roster completo** |
| LoL Actual · Grieta | **21** | 61 | 🔨 los más jugados |
| Archivo S1 + S2 | 3 | ~15 | 🔨 |
| **Total** | **148** | ~215 | |

### Pendiente
- **LoL Actual: 40 campeones** sin build del parche vivo. Los 21 hechos cubren a los más jugados
  (Lux, Vayne, Jax, Katarina, Malphite, Lee Sin, Morgana, Ashe, Yi, Garen, Soraka, Blitzcrank,
  Nasus, Amumu, Tristana, Veigar, Ezreal, Taric, Ahri). Faltan los de nicho.
  Cada una necesita `runasModernas` (hay 7 presets en `RM.*`) e itemización verificada.
- **Segundos roles en Classic** (~15): Annie support, Kayle mid, Twitch jungla, Nunu support,
  Fiddlesticks support, Alistar jungla, Cho'Gath mid, Heimerdinger top, Urgot top, Gragas jungla…
- **Archivo S1/S2** (~12): AP Yi (S1), AP Sion (S2), Malphite AD (S1), la trinidad de soportes S2…
  *Límite:* Data Dragon no archiva antes del parche 3.6.14.
- **Los 7 post-lanzamiento**: Akali, Caitlyn, Fiora, Graves, Irelia, LeBlanc, Mordekaiser —
  cuando Riot los active en Classic.

---

## 2. Otras secciones

| Ítem | Estado |
|---|---|
| Tier list Grieta Clásica (61/61) | ✅ |
| Tier list ARAM Clásico (61/61) | ✅ |
| **Tier list Grieta Actual (61/61)** | ✅ |
| Filtro por rol en la tier list | ✅ |
| **Counters por campeón (61/61)** | ✅ con notas |
| **Kit de habilidades (61/61)** | ✅ P/Q/W/E/R |
| Estadísticas reales por build | ⬜ 2 de 148 las tienen |

---

## 3. Funcionalidad

| Ítem | Estado |
|---|---|
| Selector de era y modo (persistente) | ✅ |
| Búsqueda con autocompletado | ✅ |
| Filtro por rol en el roster | ✅ |
| Enlaces compartibles + botón atrás | ✅ |
| Botón "copiar enlace" | ✅ |
| **Favoritos** (se ordenan primero) | ✅ |
| **Ordenar el roster** (relevancia, A–Z, nº builds, tier) | ✅ |
| **Copiar build al portapapeles** | ✅ formato para el chat |
| **Modo claro** | ✅ persistente |
| Comparador de builds lado a lado | ⬜ |

---

## 4. Calidad técnica

| Ítem | Estado |
|---|---|
| Sin errores de consola | ✅ verificado en cada despliegue |
| Iconos verificados | ✅ 272 URLs, 0 fallos |
| Responsive móvil | ✅ |
| Accesibilidad por teclado | ✅ |
| Enlace de salto + `aria-live` + foco visible | ✅ |
| `prefers-reduced-motion` | ✅ |
| Open Graph / Twitter / canonical | ✅ |
| Manifest PWA (instalable) | ✅ |
| **Service worker (offline)** | ✅ |
| **robots.txt + sitemap.xml** | ✅ |
| **Validador automático** | ✅ `node scripts/validar.js` |
| **Logo y favicon** | ✅ blasón con gema y escalones |

---

## 5. Riesgos conocidos

- Los datos de LoL Classic son **previos al lanzamiento** (29/07/2026): habrá que revisar
  tier lists y builds cuando existan estadísticas reales.
- Las builds `ACT` envejecen con cada parche (hoy `16.14.1`). Revisar cada pocos parches.
- Data Dragon no archiva antes de `3.6.14`: las builds S1 usan iconos algo posteriores.
- Las estadísticas en vivo no se pueden leer desde una web estática (CORS): son enlaces,
  o haría falta un backend que las cachee.

---

## 6. Orden de ejecución

1. ✅ Roster completo de Classic (61/61)
2. ✅ Tier lists completas (61/61 × 2 modos)
3. ✅ Rutas compartibles + accesibilidad + SEO + manifest
4. ✅ ARAM completo (61/61)
5. ✅ Favoritos, filtro por rol, service worker, sitemap
6. ✅ Counters y kit de habilidades de los 61, con capa de datos por defecto + anulaciones
7. ✅ Tier list Actual, orden del roster, modo claro, copiar build, validador, logo nuevo
8. 🔨 LoL Actual (21/61) ← siguiente: los 40 restantes
9. ⬜ Segundos roles + archivo S1/S2 + comparador

---

## 7. De dónde salen los datos

| Dato | Origen | Verificado |
|---|---|---|
| Iconos de campeones, objetos, hechizos, runas y **maestrías** | **Data Dragon**, el CDN oficial de Riot | ✅ `scripts/validar.js` |
| Nombres e IDs de objetos | `cdn/<parche>/data/es_ES/item.json` | ✅ contra el parche de cada build |
| Catálogo de maestrías clásicas (57 talentos, rangos e iconos) | `cdn/3.15.5/data/es_ES/mastery.json` | ✅ |
| Runas modernas (árboles, piedras angulares, iconos) | `cdn/<parche>/data/es_ES/runesReforged.json` | ✅ |
| Roster de LoL Classic | Cobertura del lanzamiento (3DJuegos, Movistar eSports) | ✅ contrastado entre fuentes |
| **Repartos de puntos, builds, tier lists, counters y consejos** | Criterio propio sobre el meta documentado de cada era, contrastado con MetaSRC/U.GG donde hay datos | ⚠️ interpretación, no dato oficial |

Es decir: **todo lo numérico y visual sale de Riot**; lo editorial (qué comprar, en qué orden,
qué tier) es criterio propio y así se marca. Las builds enlazan sus fuentes en vivo al pie.

---

## 8. Arquitectura de componentes

Todas las secciones se construyen con la misma envoltura, `panel(titulo, cuerpo, opciones)`:

```js
panel('Maestrías', masteryComponent(build.maestrias, ver))
panel('Enfrentamientos', html, { nota: 'aclaración' })
panel('Objetos', html, { ancho: true })   // ocupa las dos columnas
```

Encima del panel se montan los componentes concretos: `runePageComponent`,
`modernRunesComponent`, `masteryComponent`, `skillOrderComponent`, `kitComponent`,
`countersComponent`. Añadir una sección nueva es escribir su cuerpo y envolverlo en `panel()`.

El detalle de campeón usa un **layout de dos columnas**: a la izquierda *la build*
(objetos, runas, maestrías, habilidades), a la derecha *cómo jugarla* (plan, kit,
enfrentamientos, consejos). Por debajo de 1000px se apila en una sola columna.

---

## 9. Arquitectura de los datos

Los datos que valen para **cualquier era y modo** (kits, counters) viven a nivel de campeón,
con un valor por defecto y anulaciones opcionales por contexto:

```js
KITS.taric = {
  P: ['Fuerza Imbuida', '…'], Q: […], W: […], E: […], R: […],
  porEra:  { actual: { Q: ['Destello Imbuido', '…'] } },   // opcional
  porModo: { aram:   { … } }                                // opcional
}
```

`kitDe(champ, edicion, modo)` y `countersDe(champ, edicion, modo)` mezclan el valor por
defecto con la anulación que corresponda. Así se declara una sola vez lo que no cambia
y solo se detalla lo que sí. Las builds siguen siendo por contexto (`season` + `modo`).
