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
| Filtro por rol en la tier list | ✅ |
| Tier list de LoL Actual | ⬜ con datos de U.GG |
| Counters por campeón | ⬜ 61 campeones |
| Kit de habilidades (P/Q/W/E/R) | ⬜ 61 campeones |
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
| Comparador de builds lado a lado | ⬜ |
| Ordenar el roster (tier, nº de builds) | ⬜ |
| Copiar build al portapapeles para el chat | ⬜ |
| Modo claro | ⬜ |

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
| Script que valide IDs contra Data Dragon | ⬜ |

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
6. 🔨 LoL Actual (21/61) ← siguiente: los 40 restantes
7. ⬜ Counters y kit de habilidades
8. ⬜ Segundos roles + archivo S1/S2
9. ⬜ Comparador, orden del roster, modo claro
