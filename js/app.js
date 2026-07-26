// ============ ShadowMeta — Lógica de la app ============
// Vistas: Campeones · Tier List · Línea del tiempo
// Selector global de Edición (Classic / S1 / S2 / S3 / Actual) y Modo (Grieta / ARAM).
// Componentes visuales: página de runas clásica (30 gemas), árboles de maestrías,
// runas modernas (keystone + fragmentos) y tabla de habilidades de 18 niveles.

const grid = document.getElementById('championGrid');
const detail = document.getElementById('championDetail');
const tierlistView = document.getElementById('tierlistView');
const seasonsView = document.getElementById('seasonsView');
const searchInput = document.getElementById('searchInput');
const autocompleteBox = document.getElementById('autocomplete');
const roleFilter = document.getElementById('roleFilter');
const mainNav = document.getElementById('mainNav');
const logoHome = document.getElementById('logoHome');
const contextBar = document.getElementById('contextBar');
const edicionSelect = document.getElementById('edicionSelect');
const modoSelect = document.getElementById('modoSelect');
const contextDesc = document.getElementById('contextDesc');
const liveRegion = document.getElementById('liveRegion');

// Anuncia un cambio a los lectores de pantalla
function anunciar(texto) {
  if (liveRegion) liveRegion.textContent = texto;
}

let currentRole = 'all';
let currentSearch = '';
let currentView = 'champions';
let currentTierMode = 'grieta';
let acIndex = -1;

// Estado del selector (persistente entre visitas)
let edicion = localStorage.getItem('sm_edicion') || 'classic';
let modo = localStorage.getItem('sm_modo') || 'grieta';

// ---------- Iconos ----------
const champIconUrl = c => `${DD}/champion/${c.dd}.png`;
const itemIconUrl = (id, ver) => `${DD_HOST}/${ver || DD_VER}/img/item/${id}.png`;
const spellIconUrl = (id, ver) => `${DD_HOST}/${ver || DD_VER}/img/spell/${id}.png`;
const runeIconUrl = (img, ver) => `${DD_HOST}/${ver || DD_VER}/img/rune/${img}`;
const perkIconUrl = path => `https://ddragon.leagueoflegends.com/cdn/img/${path}`;

function iconImg(url, alt, cls, fallbackText) {
  const fb = (fallbackText || alt || '?').slice(0, 2);
  return `<span class="icon-frame ${cls}">
    <img src="${url}" alt="${alt}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('icon-fallback')">
    <span class="icon-fb-text">${fb}</span>
  </span>`;
}

function initials(name) {
  const parts = name.split(' ');
  return parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
}

// Builds del campeón dentro del contexto seleccionado
const visibles = c => buildsDe(c, edicion, modo);

// ---------- Roster dinámico ----------
// El roster curado son los 61 de LoL Classic. Para la era actual se descarga
// el roster completo del parche vivo (173 campeones y subiendo), de modo que
// están TODOS aunque todavía no tengan build escrita.
let rosterActual = null;     // se rellena al vuelo
let cargandoRoster = false;

function cargarRosterActual() {
  if (rosterActual || cargandoRoster) return Promise.resolve(rosterActual);
  cargandoRoster = true;
  // Primero el backend propio (cacheado en la red); si falla, Data Dragon directo
  return fetch('/api/ddragon?recurso=campeones')
    .then(r => r.ok ? r.json() : Promise.reject())
    .catch(() => fetch(`${DD_HOST}/${PATCHES.ACT}/data/es_ES/champion.json`)
      .then(r => r.json())
      .then(j => ({
        version: PATCHES.ACT,
        campeones: Object.values(j.data).map(c => ({
          dd: c.id, nombre: c.name, titulo: c.title, tags: c.tags,
          roles: [...new Set(c.tags.map(t => ({
            Fighter: 'Top', Tank: 'Top', Mage: 'Mid', Assassin: 'Mid',
            Marksman: 'ADC', Support: 'Support'
          })[t]).filter(Boolean))]
        }))
      })))
    .then(datos => {
      const curados = new Map(CHAMPIONS.map(c => [c.dd, c]));
      rosterActual = datos.campeones.map(c => curados.get(c.dd) || {
        id: c.dd.toLowerCase(), dd: c.dd, name: c.nombre, title: c.titulo,
        roles: c.roles.length ? c.roles : ['Mid'],
        color: autoColor(c.dd), lema: '', builds: [], soloActual: true
      }).sort((a, b) => a.name.localeCompare(b.name, 'es'));
      cargandoRoster = false;
      return rosterActual;
    })
    .catch(() => { cargandoRoster = false; return null; });
}

// El roster que toca según la era elegida
function rosterVisible() {
  if (edicion === 'actual' && rosterActual) return rosterActual;
  return CHAMPIONS;
}

// ---------- Tema claro / oscuro ----------
const themeBtn = document.getElementById('themeBtn');
let tema = localStorage.getItem('sm_tema') || 'oscuro';

function aplicarTema() {
  document.documentElement.setAttribute('data-tema', tema);
  if (themeBtn) themeBtn.textContent = tema === 'claro' ? '☀️' : '🌙';
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', tema === 'claro' ? '#f4f1ea' : '#010a13');
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    tema = tema === 'claro' ? 'oscuro' : 'claro';
    localStorage.setItem('sm_tema', tema);
    aplicarTema();
    anunciar('Tema ' + tema);
  });
}
aplicarTema();

// ---------- Orden del roster ----------
let orden = localStorage.getItem('sm_orden') || 'relevancia';

const ORDENES = {
  relevancia: { etiqueta: 'Relevancia', fn: (a, b) =>
    (esFavorito(b.id) - esFavorito(a.id)) ||
    (visibles(b).length > 0) - (visibles(a).length > 0) ||
    a.name.localeCompare(b.name, 'es') },
  alfabetico: { etiqueta: 'A–Z', fn: (a, b) => a.name.localeCompare(b.name, 'es') },
  builds: { etiqueta: 'Nº de builds', fn: (a, b) =>
    (visibles(b).length - visibles(a).length) || a.name.localeCompare(b.name, 'es') },
  tier: { etiqueta: 'Tier', fn: (a, b) => tierIndice(a.id) - tierIndice(b.id) || a.name.localeCompare(b.name, 'es') }
};

// Posición de un campeón en la tier list del modo actual (para ordenar)
function tierIndice(id) {
  const lista = TIERLIST[currentTierMode] || TIERLIST.grieta;
  for (let i = 0; i < TIER_ORDER.length; i++) {
    const pos = (lista.tiers[TIER_ORDER[i]] || []).indexOf(id);
    if (pos >= 0) return i * 100 + pos;
  }
  return 9999;
}

// ---------- Favoritos ----------
let favoritos = new Set(JSON.parse(localStorage.getItem('sm_favs') || '[]'));

function esFavorito(id) { return favoritos.has(id); }

function alternarFavorito(id) {
  if (favoritos.has(id)) favoritos.delete(id); else favoritos.add(id);
  localStorage.setItem('sm_favs', JSON.stringify([...favoritos]));
  anunciar(favoritos.has(id) ? 'Añadido a favoritos' : 'Quitado de favoritos');
}

// ---------- Selector de contexto ----------
function initContextBar() {
  edicionSelect.innerHTML =
    '<option value="todas">Todas las eras</option>' +
    Object.entries(EDICIONES).map(([k, e]) =>
      `<option value="${k}">${e.icono} ${e.nombre}</option>`).join('');
  modoSelect.innerHTML =
    '<option value="todos">Todos los modos</option>' +
    Object.entries(MODOS).map(([k, m]) =>
      `<option value="${k}">${m.icono} ${m.nombre}</option>`).join('');

  edicionSelect.value = edicion;
  modoSelect.value = modo;

  edicionSelect.addEventListener('change', () => {
    edicion = edicionSelect.value;
    localStorage.setItem('sm_edicion', edicion);
    refreshContext();
  });
  modoSelect.addEventListener('change', () => {
    modo = modoSelect.value;
    localStorage.setItem('sm_modo', modo);
    refreshContext();
  });
  updateContextDesc();
}

function updateContextDesc() {
  const e = EDICIONES[edicion];
  const m = MODOS[modo];
  const lista = rosterVisible();
  const total = lista.reduce((n, c) => n + visibles(c).length, 0);
  const conBuild = lista.filter(c => visibles(c).length).length;
  contextDesc.innerHTML = `
    <span class="ctx-count">
      <strong>${total}</strong> build${total === 1 ? '' : 's'} ·
      <strong>${conBuild}</strong> de <strong>${lista.length}</strong> campeones
    </span>
    <span class="ctx-text">${e ? e.desc : 'Todas las eras del juego, de la Season 1 al parche actual.'}${m ? ' · ' + m.desc : ''}</span>`;
}

function refreshContext() {
  updateContextDesc();
  const e = EDICIONES[edicion], m = MODOS[modo];
  anunciar(`Contexto: ${e ? e.nombre : 'todas las eras'}, ${m ? m.nombre : 'todos los modos'}. ${document.querySelector('.ctx-count').textContent.trim()}`);
  if (!detail.classList.contains('hidden') && detail.dataset.champ) {
    return showChampion(detail.dataset.champ);
  }
  if (currentView === 'champions') renderGrid();
  if (currentView === 'seasons') renderSeasons();
  if (currentView === 'tierlist') renderTierlist();
}

// ---------- Cambio de vista ----------
function switchView(view) {
  currentView = view;
  detail.classList.add('hidden');
  grid.classList.toggle('hidden', view !== 'champions');
  roleFilter.classList.toggle('hidden', view !== 'champions');
  tierlistView.classList.toggle('hidden', view !== 'tierlist');
  seasonsView.classList.toggle('hidden', view !== 'seasons');
  mainNav.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.view === view));
  window.scrollTo(0, 0);
  if (view === 'champions') { renderGrid(); escribirRuta('#/campeones'); anunciar('Vista de campeones'); }
  if (view === 'tierlist') { renderTierlist(); escribirRuta('#/tierlist/' + currentTierMode); anunciar('Tier list de ' + TIERLIST[currentTierMode].nombre); }
  if (view === 'seasons') { renderSeasons(); escribirRuta('#/eras'); anunciar('Línea del tiempo de las eras'); }
}

// ---------- Vista: roster ----------
function champCard(c) {
  const n = visibles(c).length;
  const fav = esFavorito(c.id);
  const aria = `${c.name}, ${c.title}. ${c.roles.join(', ')}. ${n ? n + ' builds disponibles' : 'sin builds en este contexto'}`;
  return `
    <div class="champ-card ${n ? 'has-builds' : ''} ${fav ? 'es-favorito' : ''}" data-id="${c.id}" style="--champ-color:${c.color}"
         role="button" tabindex="0" aria-label="${aria}">
      <button class="fav-btn ${fav ? 'on' : ''}" data-fav="${c.id}"
              aria-label="${fav ? 'Quitar' : 'Añadir'} ${c.name} de favoritos" title="Favorito">${fav ? '★' : '☆'}</button>
      ${n ? `<span class="builds-badge" title="${n} build(s) en este contexto">★ ${n}</span>` : ''}
      <div class="champ-portrait">${iconImg(champIconUrl(c), c.name, 'portrait-img', initials(c.name))}</div>
      <div class="champ-name">${c.name}</div>
      <div class="champ-title">${c.title}</div>
      <div class="champ-roles">${c.roles.map(r => `<span class="role-tag">${r}</span>`).join('')}</div>
    </div>`;
}

// Activa un elemento con clic, Enter o Espacio (accesible por teclado)
function activable(el, fn) {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
  });
}

function renderGrid() {
  // En la era actual hacen falta los 173 campeones, no solo los 61 clásicos
  if (edicion === 'actual' && !rosterActual) {
    cargarRosterActual().then(r => { if (r) { renderGrid(); updateContextDesc(); } });
  }

  const term = currentSearch.trim().toLowerCase();
  const filtered = rosterVisible().filter(c => {
    const matchRole = currentRole === 'all' || c.roles.includes(currentRole);
    const matchSearch = !term || c.name.toLowerCase().includes(term) || c.title.toLowerCase().includes(term);
    return matchRole && matchSearch;
  });

  const sorted = [...filtered].sort((ORDENES[orden] || ORDENES.relevancia).fn);

  let html = `
    <div class="orden-bar">
      <span class="orden-label">Ordenar por</span>
      ${Object.entries(ORDENES).map(([k, o]) =>
        `<button class="role-btn ${k === orden ? 'active' : ''}" data-orden="${k}">${o.etiqueta}</button>`).join('')}
    </div>`;

  html += sorted.length === 0
    ? '<div class="no-results">Ningún campeón invocado con ese nombre.</div>'
    : sorted.map(champCard).join('');

  if (currentRole === 'all' && !term) {
    html += `
      <div class="soon-divider"><span>Próximamente en LoL Classic</span></div>
      ${PROXIMOS.map(([dd, name, title]) => `
        <div class="champ-card soon-card" style="--champ-color:#3a4a63">
          <div class="champ-portrait">${iconImg(`${DD}/champion/${dd}.png`, name, 'portrait-img', name.slice(0, 2))}</div>
          <div class="champ-name">${name}</div>
          <div class="champ-title">${title}</div>
          <div class="champ-roles"><span class="role-tag soon-tag">Tras el lanzamiento</span></div>
        </div>`).join('')}`;
  }

  grid.innerHTML = html;
  grid.querySelectorAll('.champ-card[data-id]').forEach(card => {
    activable(card, () => irACampeon(card.dataset.id));
  });
  grid.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();            // no abrir la ficha al marcar favorito
      alternarFavorito(btn.dataset.fav);
      renderGrid();
    });
  });
  grid.querySelectorAll('[data-orden]').forEach(btn => {
    btn.addEventListener('click', () => {
      orden = btn.dataset.orden;
      localStorage.setItem('sm_orden', orden);
      renderGrid();
      anunciar('Ordenado por ' + ORDENES[orden].etiqueta);
    });
  });
}

// ---------- Vista: tier list ----------
const TIER_ORDER = ['S+', 'S', 'A', 'B', 'C'];
const ROLES = ['Top', 'Jungla', 'Mid', 'ADC', 'Support'];
let tierRol = 'all';

function renderTierlist() {
  const mode = TIERLIST[currentTierMode];
  const enRol = id => {
    if (tierRol === 'all') return true;
    const c = CHAMPIONS.find(x => x.id === id);
    return c && c.roles.includes(tierRol);
  };

  tierlistView.innerHTML = `
    <div class="view-header">
      <h2>Tier List</h2>
      <div class="mode-tabs">
        ${Object.entries(TIERLIST).map(([key, m]) =>
          `<button class="mode-tab ${key === currentTierMode ? 'active' : ''}" data-mode="${key}">${m.icono} ${m.nombre}</button>`).join('')}
      </div>
    </div>
    <p class="view-desc">${mode.desc}</p>
    <div class="tier-role-filter">
      <button class="role-btn ${tierRol === 'all' ? 'active' : ''}" data-trol="all">Todos</button>
      ${ROLES.map(r => `<button class="role-btn ${tierRol === r ? 'active' : ''}" data-trol="${r}">${r}</button>`).join('')}
    </div>
    <div class="tier-rows">
      ${TIER_ORDER.map(tier => {
        const ids = (mode.tiers[tier] || []).filter(enRol);
        if (!ids.length) return '';
        return `
          <div class="tier-row">
            <div class="tier-label tier-${tier.replace('+', 'plus').toLowerCase()}">${tier}</div>
            <div class="tier-champs">
              ${ids.map(id => {
                const c = CHAMPIONS.find(ch => ch.id === id);
                if (!c) return '';
                const nota = mode.notas[id];
                const tiene = c.builds.length > 0;
                return `
                  <div class="tier-champ ${tiene ? 'clickable' : ''}" data-id="${c.id}" title="${nota || c.name + ' — ' + c.roles.join('/')}">
                    ${iconImg(champIconUrl(c), c.name, 'tier-icon', initials(c.name))}
                    <span class="tier-champ-name">${c.name}${nota ? ' ✓' : ''}</span>
                  </div>`;
              }).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>
    <p class="sources-note">Lista curada a partir del meta clásico y las primeras estadísticas del modo. El "✓" marca entradas contrastadas con datos reales.</p>`;

  tierlistView.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentTierMode = tab.dataset.mode;
      renderTierlist();
      escribirRuta('#/tierlist/' + currentTierMode);
      anunciar('Tier list de ' + TIERLIST[currentTierMode].nombre);
    });
  });
  tierlistView.querySelectorAll('.tier-champ.clickable').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    activable(el, () => irACampeon(el.dataset.id, 0, true));
  });
  tierlistView.querySelectorAll('[data-trol]').forEach(btn => {
    btn.addEventListener('click', () => {
      tierRol = btn.dataset.trol;
      renderTierlist();
      anunciar('Tier list filtrada por ' + (tierRol === 'all' ? 'todos los roles' : tierRol));
    });
  });
}

// ---------- Vista: línea del tiempo ----------
function renderSeasons() {
  const porEdicion = {};
  for (const c of CHAMPIONS) {
    c.builds.forEach((b, i) => {
      for (const ed of b.ediciones) {
        if (ed === 'classic') continue; // Classic tiene su propia edición en el selector
        (porEdicion[ed] = porEdicion[ed] || []).push({ champ: c, build: b, index: i });
      }
    });
  }
  const orden = ['s1', 's2', 's3', 'actual'];

  seasonsView.innerHTML = `
    <div class="view-header"><h2>La línea del tiempo</h2></div>
    <p class="view-desc">Cada build pertenece a una era y se renderiza con los iconos del parche de <em>su</em> temporada. De las botas y tres pociones de 2010 al meta de hoy.</p>
    ${orden.map(ed => {
      const meta = EDICIONES[ed];
      const entries = porEdicion[ed] || [];
      return `
        <div class="season-block">
          <div class="season-head">
            <span class="season-badge s-${ed}">${meta.icono} ${meta.corto}</span>
            <h3>${meta.nombre}</h3>
            <span class="season-years">parche ${meta.patch}</span>
          </div>
          <p class="season-desc">${meta.desc}</p>
          ${entries.length ? `
            <div class="season-builds">
              ${entries.map(({ champ, build, index }) => `
                <div class="season-build-card" data-id="${champ.id}" data-index="${index}" style="--champ-color:${champ.color}">
                  ${iconImg(champIconUrl(champ), champ.name, 'season-build-icon', initials(champ.name))}
                  <div class="season-build-info">
                    <div class="season-build-champ">${champ.name}</div>
                    <div class="season-build-name">${build.name}</div>
                    <div class="season-build-tags">
                      <span class="role-tag">${build.role}</span>
                      <span class="role-tag">${MODOS[build.modo].corto}</span>
                    </div>
                  </div>
                </div>`).join('')}
            </div>`
          : '<p class="season-empty">Aún no hay builds archivadas de esta era.</p>'}
        </div>`;
    }).join('')}`;

  seasonsView.querySelectorAll('.season-build-card').forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    activable(card, () => irACampeon(card.dataset.id, Number(card.dataset.index), true));
  });
}

// ---------- Detalle de campeón ----------
function showChampion(id, buildIdx = 0, todasLasBuilds = false) {
  const champ = rosterVisible().find(c => c.id === id) || CHAMPIONS.find(c => c.id === id)
    || (rosterActual || []).find(c => c.id === id);
  if (!champ) return;

  grid.classList.add('hidden');
  roleFilter.classList.add('hidden');
  tierlistView.classList.add('hidden');
  seasonsView.classList.add('hidden');
  detail.classList.remove('hidden');
  detail.dataset.champ = id;
  window.scrollTo(0, 0);

  // Desde la línea del tiempo o la tier list se muestran todas; si no, solo las del contexto
  const lista = todasLasBuilds ? champ.builds : visibles(champ);
  const idx = Math.min(buildIdx, Math.max(0, lista.length - 1));
  const hay = lista.length > 0;
  const otras = todasLasBuilds ? 0 : champ.builds.length - lista.length;

  anunciar(`${champ.name}. ${lista.length} build${lista.length === 1 ? '' : 's'} disponibles.`);

  detail.innerHTML = `
    <div class="detail-toolbar">
      <button class="back-btn" id="backBtn">← Volver</button>
      <button class="share-btn" id="shareBtn" title="Copiar enlace a este campeón">🔗 Copiar enlace</button>
    </div>
    <div class="detail-header con-arte" style="--champ-color:${champ.color}">
      <div class="detail-arte" aria-hidden="true"
           style="background-image:url('${DD_HOST.replace('/cdn', '')}/cdn/img/champion/splash/${champ.dd}_0.jpg')"></div>
      <div class="detail-portrait">${iconImg(champIconUrl(champ), champ.name, 'portrait-img-lg', initials(champ.name))}</div>
      <div class="detail-info">
        <h1>${champ.name}</h1>
        <div class="champ-title">${champ.title}</div>
        ${champ.lema ? `<div class="champ-lema">${champ.lema}</div>` : ''}
        <div class="champ-roles">${champ.roles.map(r => `<span class="role-tag">${r}</span>`).join('')}</div>
      </div>
    </div>
    ${hay ? `
      <div class="build-tabs" id="buildTabs">
        ${lista.map((b, i) => `
          <button class="build-tab ${i === idx ? 'active' : ''}" data-index="${i}">
            <span class="season-badge s-${b.ediciones[0]}">${EDICIONES[b.ediciones[0]].corto}</span>${b.name}
          </button>`).join('')}
      </div>
      <div class="build-content" id="buildContent"></div>
      ${otras > 0 ? `<p class="otras-builds">↕ ${champ.name} tiene ${otras} build${otras === 1 ? '' : 's'} más en otras eras o modos — cámbialos en el selector de arriba.</p>` : ''}
    ` : `
      <div class="no-builds">
        <p><strong>${champ.name}</strong> no tiene builds para
        <strong>${EDICIONES[edicion] ? EDICIONES[edicion].nombre : 'todas las eras'}</strong>
        en <strong>${MODOS[modo] ? MODOS[modo].nombre : 'todos los modos'}</strong>.</p>
        ${champ.builds.length
          ? `<p class="no-builds-sub">Pero sí tiene ${champ.builds.length} build${champ.builds.length === 1 ? '' : 's'} en otro contexto: cambia la edición o el modo en el selector de arriba.</p>`
          : '<p class="no-builds-sub">Todavía no hemos escrito sus builds. Llegarán en próximas actualizaciones.</p>'}
      </div>`}`;

  document.getElementById('backBtn').addEventListener('click', () => switchView(currentView));

  const shareBtn = document.getElementById('shareBtn');
  shareBtn.addEventListener('click', async () => {
    const activa = detail.querySelector('.build-tab.active');
    const i = activa ? Number(activa.dataset.index) : 0;
    const url = `${location.origin}${location.pathname}#/campeon/${id}${i ? '/' + i : ''}${todasLasBuilds ? (i ? '/todas' : '/0/todas') : ''}`;
    try {
      await navigator.clipboard.writeText(url);
      shareBtn.textContent = '✓ Enlace copiado';
    } catch {
      shareBtn.textContent = url;   // sin permiso de portapapeles: se muestra para copiar a mano
    }
    setTimeout(() => { shareBtn.textContent = '🔗 Copiar enlace'; }, 2200);
  });

  if (hay) {
    const tabs = detail.querySelectorAll('.build-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const i = Number(tab.dataset.index);
        renderBuild(lista[i], champ);
        escribirRuta(`#/campeon/${id}/${i}${todasLasBuilds ? '/todas' : ''}`);
        anunciar('Build: ' + lista[i].name);
      });
    });
    renderBuild(lista[idx], champ);
  }
}

// ============ LAYOUT BASE ============
// Todas las secciones se construyen con la misma envoltura: un panel con
// cabecera y cuerpo. Lo específico de cada sección va dentro del cuerpo, así
// el aspecto y el espaciado son idénticos en toda la app.
//
//   panel('Título', '<html>')                       → panel normal
//   panel('Título', '<html>', {ancho: true})        → ocupa las dos columnas
//   panel('Título', '<html>', {nota: 'aclaración'}) → con nota al pie

function panel(titulo, cuerpo, opciones = {}) {
  const { ancho = false, nota = '', clase = '' } = opciones;
  return `
    <section class="sm-panel ${ancho ? 'ancho' : ''} ${clase}">
      <h3 class="sm-panel__head">${titulo}</h3>
      <div class="sm-panel__body">${cuerpo}</div>
      ${nota ? `<p class="sm-panel__nota">${nota}</p>` : ''}
    </section>`;
}

// ============ COMPONENTES VISUALES ============

// --- Página de runas clásica: 9 marcas, 9 sellos, 9 glifos, 3 quintaesencias ---
function runePageComponent(runas, ver) {
  const filas = [
    { key: 'marca', label: 'Marcas', n: 9 },
    { key: 'sello', label: 'Sellos', n: 9 },
    { key: 'glifo', label: 'Glifos', n: 9 },
    { key: 'quinta', label: 'Quintaesencias', n: 3 }
  ];
  return `
    <div class="rune-page">
      ${filas.map(f => {
        const r = runas[f.key];
        return `
          <div class="rune-line ${f.key}">
            <div class="rune-slots">
              ${Array.from({ length: f.n }, () =>
                iconImg(runeIconUrl(r.img, ver), r.nombre, 'rune-slot', '◆')).join('')}
            </div>
            <div class="rune-line-info">
              <div class="rune-type">${f.label} <span class="rune-count">×${f.n}</span></div>
              <div class="rune-name">${r.nombre.replace(/\s*x\d+$/, '')}</div>
              <div class="rune-detail">${r.detalle}</div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// --- Runas modernas: el árbol completo, con las elegidas iluminadas ---
// Se descarga runesReforged.json del parche para pintar todas las opciones de
// cada fila, no solo las escogidas: así se ve dónde hay que pulsar.
const cacheArboles = {};

function cargarArbolesRunas(parche) {
  if (cacheArboles[parche]) return cacheArboles[parche];
  return (cacheArboles[parche] = fetch(`${DD_HOST}/${parche}/data/es_ES/runesReforged.json`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .catch(() => null));
}

function modernRunesComponent(rm, parche) {
  const elegidas = new Set([...rm.principal.runas, ...rm.secundario.runas].map(r => r[0]));

  // Vista inmediata (solo las elegidas); el árbol completo llega al descargarse
  const rama = (r, esPrincipal) => `
    <div class="mr-tree ${esPrincipal ? 'principal' : 'secundario'}">
      <div class="mr-tree-head">
        ${iconImg(perkIconUrl(r.icon), r.arbol, 'mr-tree-icon', r.arbol[0])}
        <span>${r.arbol}</span>
      </div>
      <div class="mr-runes">
        ${r.runas.map(([, nombre, icon], i) => `
          <div class="mr-rune ${esPrincipal && i === 0 ? 'keystone' : ''}">
            ${iconImg(perkIconUrl(icon), nombre, esPrincipal && i === 0 ? 'mr-keystone-icon' : 'mr-rune-icon', nombre[0])}
            <span>${nombre}</span>
          </div>`).join('')}
      </div>
    </div>`;

  cargarArbolesRunas(parche).then(arboles => {
    const destino = document.getElementById('runasModernas');
    if (!arboles || !destino) return;
    const pinta = (nombreArbol, esPrincipal) => {
      const a = arboles.find(x => x.name === nombreArbol);
      if (!a) return '';
      return `
        <div class="rtree ${esPrincipal ? 'principal' : 'secundario'}">
          <div class="rtree__head">
            ${iconImg(perkIconUrl(a.icon), a.name, 'rtree__icon', a.name[0])}
            <span>${a.name}</span>
            <span class="rtree__rol">${esPrincipal ? 'Principal' : 'Secundario'}</span>
          </div>
          ${a.slots.map((slot, fila) => `
            <div class="rtree__fila ${fila === 0 && esPrincipal ? 'keystones' : ''}">
              ${slot.runes.map(r => `
                <span class="rcell ${elegidas.has(r.id) ? 'on' : ''}" title="${r.name}">
                  ${iconImg(perkIconUrl(r.icon), r.name, fila === 0 && esPrincipal ? 'rcell__icon grande' : 'rcell__icon', r.name[0])}
                  <span class="rcell__nombre">${r.name}</span>
                </span>`).join('')}
            </div>`).join('')}
        </div>`;
    };
    destino.innerHTML = `
      <div class="rtree-board">
        ${pinta(rm.principal.arbol, true)}
        ${pinta(rm.secundario.arbol, false)}
      </div>
      <div class="mr-tree fragmentos">
        <div class="mr-tree-head"><span class="mr-frag-ico">◈</span><span>Fragmentos</span></div>
        <div class="mr-runes">
          ${rm.fragmentos.map(f => `<div class="mr-rune"><span class="mr-frag-dot"></span><span>${f}</span></div>`).join('')}
        </div>
      </div>`;
  });

  return `
    <div id="runasModernas">
      <div class="modern-runes">
        ${rama(rm.principal, true)}
        ${rama(rm.secundario, false)}
        <div class="mr-tree fragmentos">
          <div class="mr-tree-head"><span class="mr-frag-ico">◈</span><span>Fragmentos</span></div>
          <div class="mr-runes">
            ${rm.fragmentos.map(f => `<div class="mr-rune"><span class="mr-frag-dot"></span><span>${f}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

// --- Árboles de maestrías: qué talento y cuántos puntos, con iconos reales ---
const masteryIconUrl = (id, ver) => `${DD_HOST}/${ver || DD_VER}/img/mastery/${id}.png`;

// Un mago necesita el reparto de Brujería, no el de Furia. Si la build no lo
// declara, se deduce de sus runas y de su estilo.
function varianteDe(m, build) {
  if (m.variante) return m.variante;
  const r = build.runas;
  if (r) {
    const texto = [r.marca, r.glifo, r.quinta].map(x => x && x.nombre).join(' ');
    if (/Penetración Mágica|Poder de Habilidad/i.test(texto)) return 'ap';
  }
  if (/mág|maga|mago|AP\b|arcan/i.test(`${build.style} ${build.name}`)) return 'ap';
  return 'ad';
}

// El id de cada maestría codifica su casilla: 4 · árbol · fila · columna.
// Con eso se reconstruye la rejilla exacta del cliente clásico (4 col × 6 filas).
const ARBOL_NUM = { 'Ofensa': '1', 'Defensa': '2', 'Utilidad': '3' };

function masteryComponent(m, ver, build) {
  const clase = { 'Ofensa': 'ofensa', 'Defensa': 'defensa', 'Utilidad': 'utilidad' };
  const variante = varianteDe(m, build);
  const asignados = {};
  m.arboles.forEach(a => { asignados[a.arbol] = a; });

  return `
    <div class="mastery-summary">
      <div class="mastery-dist">${m.reparto}</div>
      <div class="mastery-key">${m.clave}</div>
    </div>

    <div class="mastery-board">
      ${['Ofensa', 'Defensa', 'Utilidad'].map(nombre => {
        const a = asignados[nombre];
        const pts = a ? a.puntos : 0;
        const talentos = a ? (a.talentos || talentosDe(nombre, pts, variante) || []) : [];
        const puestos = Object.fromEntries(talentos);   // idTalento -> puntos a poner
        const num = ARBOL_NUM[nombre];

        // 6 filas × 4 columnas; las casillas que no existen quedan huecas
        const filas = Array.from({ length: 6 }, (_, f) =>
          Array.from({ length: 4 }, (_, c) => {
            const id = `4${num}${f + 1}${c + 1}`;
            const t = TALENTOS[id];
            if (!t) return '<span class="mcell mcell--hueco"></span>';
            const puntos = puestos[id] || 0;
            const activa = puntos > 0;
            return `
              <span class="mcell ${activa ? 'on' : ''}" title="${t[0]} — ${activa ? puntos + ' de ' + t[1] + ' puntos' : 'sin puntos'}">
                ${iconImg(masteryIconUrl(id, ver), t[0], 'mcell__icon', t[0][0])}
                <span class="mcell__pts">${puntos}/${t[1]}</span>
              </span>`;
          }).join('')).join('');

        return `
          <div class="mtree ${clase[nombre]} ${pts ? '' : 'vacio'}">
            <div class="mtree__head">
              <span class="mtree__name">${nombre}</span>
              <span class="mtree__pts">${pts}</span>
            </div>
            <div class="mtree__grid">${filas}</div>
            ${pts ? `
              <ol class="mtree__orden">
                ${talentos.map(([id, puntos]) => {
                  const t = TALENTOS[id];
                  return t ? `<li><b>${puntos}</b> en ${t[0]}</li>` : '';
                }).join('')}
              </ol>` : '<p class="mtree__vacio">Sin puntos en este árbol</p>'}
          </div>`;
      }).join('')}
    </div>

    <p class="mastery-nota">Las casillas iluminadas son las que hay que subir. Sigue el orden numerado de cada árbol: cada fila pide 4 puntos invertidos en la anterior para desbloquearse.</p>`;
}

// --- Tabla de subida de habilidades por nivel (1-18) ---
function skillOrderComponent(prioridad) {
  const puntos = { Q: 0, W: 0, E: 0, R: 0 };
  const orden = [];
  const nivelesUlti = { 6: true, 11: true, 16: true };

  for (let nivel = 1; nivel <= 18; nivel++) {
    let sube;
    if (nivelesUlti[nivel] && puntos.R < 3) sube = 'R';
    else if (nivel <= 3) sube = prioridad[nivel - 1];       // una de cada al principio
    else sube = prioridad.find(h => puntos[h] < 5) || 'R';
    puntos[sube]++;
    orden.push(sube);
  }

  return `
    <div class="skill-table-wrap">
      <div class="skill-table">
        <div class="skill-row skill-head">
          <span class="skill-cell skill-key-label"></span>
          ${orden.map((_, i) => `<span class="skill-cell skill-lvl">${i + 1}</span>`).join('')}
        </div>
        ${['Q', 'W', 'E', 'R'].map(h => `
          <div class="skill-row">
            <span class="skill-cell skill-key-label key-${h}">${h}</span>
            ${orden.map(s => `<span class="skill-cell ${s === h ? 'on key-' + h : ''}">${s === h ? '◆' : ''}</span>`).join('')}
          </div>`).join('')}
      </div>
    </div>
    <div class="skill-priority">
      <span class="skill-priority-label">Prioridad de mejora</span>
      ${prioridad.map(h => `<span class="skill-key key-${h}">${h}</span>`).join('<span class="arrow-sep">›</span>')}
    </div>`;
}

// --- Kit de habilidades ---
// Nombres, descripciones e iconos reales de Riot, del parche de la build: así
// el kit clásico es el clásico de verdad y el actual es el actual. Si no hay
// conexión se usa el resumen propio de KITS como respaldo.
const cacheKits = {};

function cargarKitReal(dd, parche) {
  const clave = `${parche}/${dd}`;
  if (cacheKits[clave]) return cacheKits[clave];
  return (cacheKits[clave] = fetch(`${DD_HOST}/${parche}/data/es_ES/champion/${dd}.json`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(j => {
      const c = j.data[dd];
      const limpiar = t => (t || '').replace(/<[^>]+>/g, '').trim();
      return [
        { k: 'P', etiqueta: 'Pasiva', nombre: c.passive.name, desc: limpiar(c.passive.description),
          icono: `${DD_HOST}/${parche}/img/passive/${c.passive.image.full}` },
        ...c.spells.map((s, i) => ({
          k: ['Q', 'W', 'E', 'R'][i], etiqueta: ['Q', 'W', 'E', 'Ultimate'][i],
          nombre: s.name, desc: limpiar(s.description),
          icono: `${DD_HOST}/${parche}/img/spell/${s.image.full}`
        }))
      ];
    })
    .catch(() => null));
}

function filaKit(k, etiqueta, nombre, desc, icono) {
  return `
    <div class="kit-row">
      <span class="kit-key key-${k}">${k}</span>
      ${icono ? iconImg(icono, nombre, 'kit-icon', nombre[0]) : ''}
      <div class="kit-info">
        <div class="kit-name">${nombre} <span class="kit-slot">${etiqueta}</span></div>
        <div class="kit-desc">${desc}</div>
      </div>
    </div>`;
}

function kitComponent(champ, build) {
  const kit = kitDe(champ, build.ediciones[0], build.modo);
  const teclas = [['P', 'Pasiva'], ['Q', 'Q'], ['W', 'W'], ['E', 'E'], ['R', 'Ultimate']];
  // Se pinta el resumen propio y, cuando llegan los datos de Riot, se sustituye
  const respaldo = kit
    ? teclas.map(([k, etq]) => kit[k] ? filaKit(k, etq, kit[k][0], kit[k][1], null) : '').join('')
    : '<p class="kit-cargando">Cargando habilidades…</p>';

  cargarKitReal(champ.dd, build.parche).then(real => {
    const destino = document.getElementById('kitGrid');
    if (!real || !destino) return;
    destino.innerHTML = real.map(h => filaKit(h.k, h.etiqueta, h.nombre, h.desc, h.icono)).join('');
    const pie = document.getElementById('kitFuente');
    if (pie) pie.textContent = `Habilidades del parche ${build.parche}, tal cual las publica Riot.`;
  });

  return panel('Kit de habilidades', `<div class="kit-grid" id="kitGrid">${respaldo}</div>`,
    { nota: '<span id="kitFuente">Resumen propio; cargando las habilidades oficiales…</span>' });
}

// --- Counters (dato del campeón, con anulaciones por era/modo) ---
function countersComponent(champ, build) {
  const c = countersDe(champ, build.ediciones[0], build.modo);
  if (!c) return '';
  const lista = (ids, clase) => (ids || []).map(id => {
    const rival = CHAMPIONS.find(x => x.id === id);
    if (!rival) return '';
    return `<div class="counter-champ ${clase}" data-id="${rival.id}" role="button" tabindex="0" title="${rival.name}">
      ${iconImg(champIconUrl(rival), rival.name, 'counter-icon', initials(rival.name))}
      <span>${rival.name}</span>
    </div>`;
  }).join('');
  return panel('Enfrentamientos', `
    <div class="counters-grid">
      <div class="counter-col fuerte">
        <div class="counter-label">Fuerte contra</div>
        <div class="counter-list">${lista(c.fuerte, 'ok')}</div>
      </div>
      <div class="counter-col debil">
        <div class="counter-label">Débil contra</div>
        <div class="counter-list">${lista(c.debil, 'ko')}</div>
      </div>
    </div>`, { nota: c.nota });
}

function itemPill(pair, ver) {
  const [id, nombre] = pair;
  return `<span class="item-pill" title="${nombre}">
    ${iconImg(itemIconUrl(id, ver), nombre, 'item-icon', nombre[0])}
    <span class="item-name">${nombre}</span>
  </span>`;
}

// ---------- Render de una build ----------
function renderBuild(build, champ) {
  const content = document.getElementById('buildContent');
  const ver = build.parche;
  const esModerna = !!build.runasModernas;
  const edLabel = build.ediciones.map(e => EDICIONES[e].nombre).join(' · ');

  content.innerHTML = `
    <div class="build-meta">
      <span class="meta-chip chip-season">${edLabel} · parche ${ver}</span>
      <span class="meta-chip chip-modo">${MODOS[build.modo].icono} ${MODOS[build.modo].nombre}</span>
      <span class="meta-chip chip-role">${build.role}</span>
      <span class="meta-chip chip-style">${build.style}</span>
      <span class="meta-chip chip-diff">Dificultad: ${build.difficulty}</span>
      ${build.stats ? `<span class="meta-chip chip-stats">📊 ${build.stats}</span>` : ''}
      <button class="copy-build-btn" id="copiarBuild" title="Copiar la build como texto">📋 Copiar build</button>
    </div>

    ${build.resumen ? `<p class="build-resumen">${build.resumen}</p>` : ''}

    <div class="build-layout">
      <div class="build-col build-col--principal">
        ${panel('Build de objetos', `
          <div class="item-group">
            <div class="item-group-label">Inicio</div>
            <div class="item-list">${build.items.inicio.map(p => itemPill(p, ver)).join('')}</div>
          </div>
          <div class="item-group">
            <div class="item-group-label">Núcleo — en orden de compra</div>
            <div class="item-list">${build.items.core.map(p => itemPill(p, ver)).join('<span class="arrow-sep">›</span>')}</div>
          </div>
          <div class="item-group">
            <div class="item-group-label">Situacionales</div>
            <div class="item-list">${build.items.situacionales.map(p => itemPill(p, ver)).join('')}</div>
          </div>`)}

        ${panel(esModerna ? 'Árbol de runas' : 'Página de runas',
          esModerna ? modernRunesComponent(build.runasModernas, ver) : runePageComponent(build.runas, ver),
          esModerna ? { nota: 'Las runas iluminadas son las que hay que elegir; el resto son las demás opciones de cada fila.' } : {})}

        ${build.maestrias ? panel('Maestrías', masteryComponent(build.maestrias, ver, build)) : ''}

        ${panel('Hechizos y habilidades', `
          <div class="ss-card spell-card">
            <div class="label">Hechizos de invocador</div>
            <div class="spell-row">
              ${build.hechizos.map(([sid, sn]) =>
                `<span class="spell-chip">${iconImg(spellIconUrl(sid, ver), sn, 'spell-icon', sn[0])}<span>${sn}</span></span>`).join('')}
            </div>
          </div>
          ${skillOrderComponent(build.habilidades)}`)}
      </div>

      <div class="build-col build-col--lateral">
        ${build.plan ? panel('Plan de partida', `
          <div class="plan-grid">
            ${[{ k: 'early', l: 'Early game', i: '🌅' }, { k: 'mid', l: 'Mid game', i: '⚔️' }, { k: 'late', l: 'Late game', i: '👑' }]
              .map(p => `
                <div class="plan-card plan-${p.k}">
                  <div class="plan-label">${p.i} ${p.l}</div>
                  <p>${build.plan[p.k]}</p>
                </div>`).join('')}
          </div>`) : ''}

        ${kitComponent(champ, build)}
        ${countersComponent(champ, build)}
        ${panel('Consejos', `<ul class="tips-list">${build.tips.map(t => `<li>${t}</li>`).join('')}</ul>`)}
      </div>
    </div>

    <details class="sources-details" id="fuentesDetalle">
      <summary>Fuentes y créditos</summary>
      <div class="sources-list">
        ${(build.fuentes || []).map(([url, label]) =>
          `<a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('')}
        ${FUENTES_META.map(([url, label]) =>
          `<a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('')}
      </div>
      <p class="sources-note">Iconos oficiales de Data Dragon (parche ${ver}). Proyecto de fan, sin relación con Riot Games.</p>
    </details>`;

  // Los rivales de la sección de enfrentamientos llevan a su ficha
  content.querySelectorAll('.counter-champ').forEach(el => {
    activable(el, () => irACampeon(el.dataset.id, 0, true));
  });

  // Copiar la build como texto para pegarla en el chat de la partida
  const copiar = content.querySelector('#copiarBuild');
  if (copiar) {
    copiar.addEventListener('click', async () => {
      const linea = g => g.map(([, n]) => n).join(', ');
      const texto = [
        `${champ.name} — ${build.name} (${edLabel}, ${MODOS[build.modo].nombre})`,
        `Inicio: ${linea(build.items.inicio)}`,
        `Núcleo: ${linea(build.items.core)}`,
        `Situacionales: ${linea(build.items.situacionales)}`,
        `Habilidades: ${build.habilidades.join(' > ')}`,
        `Hechizos: ${build.hechizos.map(h => h[1]).join(' + ')}`,
        build.maestrias ? `Maestrías: ${build.maestrias.reparto}` : '',
        `— ShadowMeta`
      ].filter(Boolean).join('\n');
      try {
        await navigator.clipboard.writeText(texto);
        copiar.textContent = '✓ Build copiada';
      } catch {
        copiar.textContent = 'No se pudo copiar';
      }
      setTimeout(() => { copiar.textContent = '📋 Copiar build'; }, 2200);
    });
  }
}

// ---------- Búsqueda con autocomplete ----------
function buildSearchIndex() {
  const idx = [];
  for (const c of CHAMPIONS) {
    idx.push({ tipo: 'Campeón', label: c.name, sub: `${c.title} · ${c.roles.join('/')}`, icon: champIconUrl(c), go: () => showChampion(c.id, 0, true) });
    c.builds.forEach((b, i) => {
      idx.push({
        tipo: EDICIONES[b.ediciones[0]].corto,
        label: `${c.name}: ${b.name}`,
        sub: `${EDICIONES[b.ediciones[0]].nombre} · ${MODOS[b.modo].nombre} · ${b.style}`,
        icon: champIconUrl(c),
        go: () => showChampion(c.id, i, true)
      });
    });
  }
  for (const [k, m] of Object.entries(TIERLIST)) {
    idx.push({ tipo: 'Tier List', label: `Tier List — ${m.nombre}`, sub: 'Ranking de campeones', emoji: m.icono, go: () => { currentTierMode = k; switchView('tierlist'); } });
  }
  for (const [k, e] of Object.entries(EDICIONES)) {
    idx.push({
      tipo: 'Era', label: e.nombre, sub: `Ver todas las builds de ${e.nombre}`, emoji: e.icono,
      go: () => aplicarContexto(k, 'todos')
    });
  }
  for (const [k, m] of Object.entries(MODOS)) {
    idx.push({
      tipo: 'Modo', label: m.nombre, sub: m.desc, emoji: m.icono,
      go: () => aplicarContexto('todas', k)
    });
  }
  idx.push({ tipo: 'Sección', label: 'La línea del tiempo', sub: 'Builds de todas las eras', emoji: '📜', go: () => switchView('seasons') });
  return idx;
}

function aplicarContexto(nuevaEdicion, nuevoModo) {
  edicion = nuevaEdicion;
  modo = nuevoModo;
  edicionSelect.value = edicion;
  modoSelect.value = modo;
  localStorage.setItem('sm_edicion', edicion);
  localStorage.setItem('sm_modo', modo);
  updateContextDesc();
  switchView('champions');
}

let SEARCH_INDEX = [];

function renderAutocomplete(term) {
  acIndex = -1;
  if (!term.trim()) { autocompleteBox.innerHTML = ''; autocompleteBox.classList.remove('open'); autocompleteBox._matches = []; return; }
  const t = term.trim().toLowerCase();
  const matches = SEARCH_INDEX
    .map(e => {
      const l = e.label.toLowerCase(), s = (e.sub || '').toLowerCase();
      let score = -1;
      if (l.startsWith(t)) score = 0;
      else if (l.includes(t)) score = 1;
      else if (s.includes(t)) score = 2;
      return { e, score };
    })
    .filter(m => m.score >= 0)
    .sort((a, b) => a.score - b.score || a.e.label.localeCompare(b.e.label, 'es'))
    .slice(0, 8);

  if (!matches.length) {
    autocompleteBox.innerHTML = '<div class="ac-empty">Sin resultados</div>';
    autocompleteBox.classList.add('open');
    autocompleteBox._matches = [];
    return;
  }

  autocompleteBox.innerHTML = matches.map(({ e }, i) => `
    <div class="ac-item" data-i="${i}">
      ${e.icon ? iconImg(e.icon, e.label, 'ac-icon', e.label[0]) : `<span class="ac-emoji">${e.emoji || '◆'}</span>`}
      <div class="ac-text">
        <div class="ac-label">${e.label}</div>
        <div class="ac-sub">${e.sub || ''}</div>
      </div>
      <span class="ac-type">${e.tipo}</span>
    </div>`).join('');
  autocompleteBox.classList.add('open');
  autocompleteBox.querySelectorAll('.ac-item').forEach((el, i) => {
    el.addEventListener('mousedown', ev => { ev.preventDefault(); pickSuggestion(matches[i].e); });
  });
  autocompleteBox._matches = matches;
}

function pickSuggestion(entry) {
  searchInput.value = '';
  currentSearch = '';
  autocompleteBox.classList.remove('open');
  entry.go();
}

searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value;
  renderAutocomplete(currentSearch);
  if (currentView === 'champions' && detail.classList.contains('hidden')) renderGrid();
});

searchInput.addEventListener('keydown', e => {
  const matches = autocompleteBox._matches || [];
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!matches.length) return;
    acIndex = e.key === 'ArrowDown' ? (acIndex + 1) % matches.length : (acIndex - 1 + matches.length) % matches.length;
    autocompleteBox.querySelectorAll('.ac-item').forEach((el, i) => el.classList.toggle('active', i === acIndex));
  } else if (e.key === 'Enter') {
    if (acIndex >= 0 && matches[acIndex]) pickSuggestion(matches[acIndex].e);
    else if (matches.length) pickSuggestion(matches[0].e);
  } else if (e.key === 'Escape') {
    autocompleteBox.classList.remove('open');
    acIndex = -1;
  }
});

searchInput.addEventListener('blur', () => setTimeout(() => autocompleteBox.classList.remove('open'), 150));
searchInput.addEventListener('focus', () => { if (searchInput.value) renderAutocomplete(searchInput.value); });

// ---------- Eventos globales ----------
mainNav.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

roleFilter.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    roleFilter.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRole = btn.dataset.role;
    renderGrid();
  });
});

logoHome.addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  switchView('champions');
});

// "/" enfoca el buscador desde cualquier parte, como en GitHub
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput &&
      !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// ============ RUTAS COMPARTIBLES ============
// #/campeon/taric/1 · #/tierlist/aram · #/eras · #/campeones
// Permiten enviar un enlace directo a una build y que el botón atrás funcione.

let navegandoPorRuta = false;

function escribirRuta(hash) {
  if (location.hash === hash) return;
  navegandoPorRuta = true;
  location.hash = hash;
  setTimeout(() => { navegandoPorRuta = false; }, 0);
}

function irACampeon(id, idx = 0, todas = false) {
  escribirRuta(`#/campeon/${id}${idx ? '/' + idx : ''}${todas ? '/todas' : ''}`);
  showChampion(id, idx, todas);
}

function leerRuta() {
  const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!partes.length) { switchView('champions'); return; }

  const [seccion, a, b, c] = partes;
  if (seccion === 'campeon' && a) {
    const champ = CHAMPIONS.find(x => x.id === a);
    if (champ) return showChampion(a, Number(b) || 0, b === 'todas' || c === 'todas');
  }
  if (seccion === 'tierlist') {
    if (a && TIERLIST[a]) currentTierMode = a;
    return switchView('tierlist');
  }
  if (seccion === 'eras') return switchView('seasons');
  switchView('champions');
}

window.addEventListener('hashchange', () => {
  if (navegandoPorRuta) return;   // la ruta la escribimos nosotros: ya está renderizada
  leerRuta();
});

// ---------- Inicio ----------
initContextBar();
SEARCH_INDEX = buildSearchIndex();
if (location.hash) leerRuta(); else renderGrid();

// Uso sin conexión (solo sirve sobre http/https, no con file://)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sin conexión offline: la app sigue funcionando */ });
  });
}
