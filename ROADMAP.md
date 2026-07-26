# ShadowMeta — Hoja de ruta

Estado y plan del proyecto. Actualizado: 26/07/2026.

## ✅ Hecho

| Área | Estado |
|---|---|
| Roster de LoL Classic | **61/61 campeones**, todos con al menos una build |
| Builds Grieta (Classic/S3) | **66 builds** — roster completo + roles extra en Taric, Lee Sin, Ashe |
| Tier list Grieta Clásica | **61/61 clasificados** (S+ → C, con notas en casos especiales) |
| Tier list ARAM Clásico | **61/61 clasificados** |
| Componentes visuales | Página de runas (30 gemas), maestrías con pips, runas modernas, tabla de habilidades 1–18 |
| Selector de era y modo | Classic · S1 · S2 · S3 · Actual × Grieta · ARAM, persistente |
| Eras / línea del tiempo | Vista con las 4 eras y sus builds archivadas |
| Búsqueda | Autocompletado entre campeones, builds, eras, modos y secciones |
| Publicación | shadowmeta.vercel.app + GitHub Pages, deploy por CLI |

## 🔨 Pendiente (por orden de prioridad)

### 1. Builds de ARAM — la mayor laguna
**Faltan 58 de 61** (solo Karthus, Lux y Sona tienen).
Plan: 4 tandas de ~15 campeones, empezando por los tiers altos de la tier list ARAM
(Brand, Morgana, Veigar, Miss Fortune, Ahri, Soraka, Anivia, Heimerdinger, Fiddlesticks, Zilean, Ezreal, Malzahar...).
Muchas comparten esqueleto con su build de Grieta (cambia inicio, situacionales, hechizos y plan).

### 2. Builds de LoL Actual (parche vivo)
**Faltan 58 de 61** (solo Ahri, Garen y Ezreal tienen).
Más trabajo por build: requieren `runasModernas` (piedra angular + fragmentos) e itemización
del parche actual verificada contra el item.json vivo. Plan: 6 tandas de ~10, empezando por
los campeones más jugados en ranked según U.GG.

### 3. Segundos roles en Classic
~15 builds de roles alternativos que eran meta en la época: Annie support, Kayle mid,
Twitch jungla, Nunu support, Fiddlesticks support, Alistar jungla, Cho'Gath mid,
Heimerdinger top, Urgot top, Gragas jungla...

### 4. Archivo histórico S1/S2
Hoy: 1 build S1 y 2 S2. Plan: ~12 builds emblemáticas más (AP Yi S1, AP Sion S2,
AD Malphite S1, la trinidad de soportes S2...). Límite técnico: los iconos más antiguos
que archiva Riot son del parche 3.6.14 — todo lo anterior usa esos.

### 5. Tier lists restantes
- Tier list de **LoL Actual** (Grieta) para los 61 del roster — con datos de U.GG.
- Filtro **por rol** dentro de cada tier list (Top/Jungla/Mid/ADC/Support).
- Revisión de las tier lists de Classic cuando el modo lleve semanas y haya estadísticas reales.

### 6. Los 7 campeones confirmados post-lanzamiento
Akali, Caitlyn, Fiora, Graves, Irelia, LeBlanc y Mordekaiser: pasarlos de la sección
"Próximamente" al roster con sus builds cuando Riot los active en Classic.

### 7. Ideas para más adelante
- Counters por campeón ("fuerte contra / débil contra").
- Comparador de builds lado a lado entre eras (el mismo campeón en S3 vs Actual).
- Estadísticas en vivo embebidas (requeriría un pequeño backend que cachee las fuentes).
- PWA para instalarla en el móvil y usarla offline.

## Recuento rápido

| Contexto | Builds hoy | Objetivo | Falta |
|---|---|---|---|
| Classic/S3 · Grieta | 66 | ~80 (con 2.º roles) | ~15 |
| Classic · ARAM | 3 | 61 | **58** |
| Actual · Grieta | 3 | 61 | **58** |
| S1 + S2 (archivo) | 3 | ~15 | ~12 |
| **Total** | **72** | **~215** | **~143** |
