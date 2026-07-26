# ShadowMeta — Hoja de ruta completa

Estado real del proyecto y todo lo que falta. Actualizado: 26/07/2026.

Leyenda: ✅ hecho · 🔨 en curso · ⬜ pendiente

---

## 1. Contenido — builds

| Contexto | Hoy | Objetivo | Falta | Estado |
|---|---|---|---|---|
| Classic/S3 · Grieta | 66 | ~80 | ~15 (2.º roles) | ✅ roster cubierto |
| Classic · **ARAM** | 18 | 61 | **43** | 🔨 tanda 1 ✅ |
| **LoL Actual** · Grieta | 3 | 61 | **58** | ⬜ |
| Archivo S1 + S2 | 3 | ~15 | ~12 | ⬜ |
| **Total builds** | **87** | **~215** | **~128** | |

### 1.1 ARAM — 43 builds restantes 🔨
Cuatro tandas de ~15, por orden de la tier list ARAM:
- ✅ **Tanda 1 (S+/S)** — hecha: Brand, Morgana, Veigar, Miss Fortune, Ahri, Soraka, Anivia, Heimerdinger, Fiddlesticks, Zilean, Ezreal, Malzahar, Annie, Ryze, Gragas.
- **Tanda 2 (A)**: Kog'Maw, Janna, Amumu, Nidalee, Twisted Fate, Gangplank, Cho'Gath, Garen, Malphite, Leona, Sivir, Tristana, Corki, Jarvan IV, Pantheon.
- **Tanda 3 (B)**: Alistar, Blitzcrank, Lulu, Urgot, Twitch, Nunu, Kayle, Teemo, Taric, Ashe, Lux (ya), Sona (ya), Karthus (ya) → resto del tier B.
- **Tanda 4 (C)**: Master Yi, Lee Sin, Evelynn, Shaco, Singed, Jax, Kassadin, Katarina, Dr. Mundo, Nasus, Olaf, Rammus, Sion, Skarner, Tryndamere, Warwick, Wukong, Vayne.

Muchas comparten esqueleto con la build de Grieta: cambian inicio (sin trinket, sin objetos de oro), situacionales, hechizos (Claridad/Marca) y el plan de partida.

### 1.2 LoL Actual — 58 builds ⬜
Más costosas: requieren `runasModernas` (piedra angular + secundario + fragmentos) e
itemización verificada contra el `item.json` del parche vivo. Seis tandas de ~10, por
popularidad en ranked según U.GG.

### 1.3 Segundos roles en Classic — ~15 ⬜
Annie support · Kayle mid · Twitch jungla · Nunu support · Fiddlesticks support ·
Alistar jungla · Cho'Gath mid · Heimerdinger top · Urgot top · Gragas jungla ·
Morgana mid · Malzahar support · Sion mid AP · Nidalee jungla · Pantheon support.

### 1.4 Archivo histórico S1/S2 — ~12 ⬜
AP Master Yi (S1) · AP Sion (S2) · Malphite AD (S1) · la trinidad de soportes S2
(Janna/Soraka/Alistar con Filosofal) · Jungla Warwick S2 · Kassadin pre-nerf S2 ·
Twisted Fate S1 · Karthus S2 · Tryndamere S1 · Nunu S2 · Rammus S1.
*Límite técnico:* el parche más antiguo que archiva Riot es 3.6.14; todo lo anterior usa esos iconos.

### 1.5 Los 7 campeones post-lanzamiento ⬜
Akali, Caitlyn, Fiora, Graves, Irelia, LeBlanc, Mordekaiser — pasarlos de "Próximamente"
al roster cuando Riot los active en Classic.

---

## 2. Contenido — otras secciones

| Ítem | Estado |
|---|---|
| Tier list Grieta Clásica (61/61) | ✅ |
| Tier list ARAM Clásico (61/61) | ✅ |
| Tier list de **LoL Actual** | ⬜ con datos de U.GG |
| **Filtro por rol dentro de la tier list** | ⬜ |
| **Counters por campeón** (fuerte/débil contra) | ⬜ 61 campeones |
| **Kit de habilidades** (P/Q/W/E/R con nombre y descripción) | ⬜ 61 campeones |
| Estadísticas reales por build (winrate, pickrate) | ⬜ 2 de 72 las tienen |
| Guía de emparejamientos por carril | ⬜ |

---

## 3. Funcionalidad

| Ítem | Estado | Notas |
|---|---|---|
| Selector de era y modo | ✅ | persistente en localStorage |
| Búsqueda con autocompletado | ✅ | campeones, builds, eras, modos |
| Filtro por rol en el roster | ✅ | |
| **Enlaces compartibles (rutas)** | ✅ | `#/campeon/taric/1` · `#/tierlist/aram` · `#/eras` |
| **Botón atrás del navegador** | ✅ | restaura campeón y build exactos |
| **Botón "copiar enlace"** | ✅ | en la ficha de cada campeón |
| **Comparador de builds** | ⬜ | mismo campeón en S3 vs Actual, lado a lado |
| **Favoritos / mis campeones** | ⬜ | localStorage |
| Ordenar el roster (alfabético, tier, nº builds) | ⬜ | |
| Copiar build al portapapeles | ⬜ | para pegarla en el chat de la partida |
| Modo claro | ⬜ | hoy solo oscuro |

---

## 4. Calidad técnica

| Ítem | Estado | Detalle |
|---|---|---|
| Sin errores de consola | ✅ | verificado en cada despliegue |
| Iconos verificados | ✅ | 225 URLs, 0 fallos |
| Responsive móvil | ✅ | sin desbordamiento horizontal |
| **Accesibilidad por teclado** | ✅ | cartas, tier list y eras navegables con Tab/Enter/Espacio |
| **Enlace de salto al contenido** | ✅ | |
| **Anuncios para lectores de pantalla** | ✅ | `aria-live` en cambios de vista, contexto y build |
| Estados de foco visibles | ✅ | `:focus-visible` dorado en todo lo interactivo |
| `prefers-reduced-motion` | ✅ | |
| **Meta Open Graph / Twitter** | ✅ | 7 etiquetas OG + 4 Twitter, con imagen `og.svg` |
| **Canonical + theme-color** | ✅ | |
| **Manifest PWA (instalable)** | ✅ | falta el service worker para offline real |
| Service worker (offline) | ⬜ | |
| Sitemap + robots.txt | ⬜ | |
| Verificación automática de IDs de objetos | ⬜ | script que valide data.js contra Data Dragon |

---

## 5. Riesgos conocidos

- **Los datos de LoL Classic son previos al lanzamiento** (29/07/2026). Cuando el modo lleve
  semanas habrá estadísticas reales: habrá que revisar tier lists y builds.
- **El parche actual avanza**: las builds `ACT` y el `PATCHES.ACT` envejecen. Conviene revisar
  cada pocos parches.
- **Data Dragon no archiva antes de 3.6.14**: las builds S1 usan iconos ligeramente posteriores.
- Las estadísticas en vivo (U.GG, MetaSRC) no se pueden leer desde una web estática por CORS:
  serían enlaces, o haría falta un backend que las cachee.

---

## 6. Orden de ejecución acordado

1. ✅ Roster completo de Classic (61/61)
2. ✅ Tier lists completas (61/61 × 2 modos)
3. ✅ Rutas compartibles + accesibilidad + SEO + manifest
4. ✅ ARAM tanda 1 (15 builds de tier S+/S)
5. 🔨 **ARAM tandas 2–4** (43 builds) ← siguiente
6. ⬜ Counters y kit de habilidades de los 61
7. ⬜ LoL Actual, 6 tandas (58 builds)
8. ⬜ Segundos roles + archivo S1/S2
9. ⬜ Comparador, favoritos, service worker offline
