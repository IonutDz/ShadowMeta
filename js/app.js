// ============ ShadowLOLClassic — Lógica de la app ============
// Vistas: Campeones (roster LoL Classic) · Tier List (por modos) · Seasons (builds por era)
// Búsqueda con autocomplete entre campeones, builds, modos y secciones.
// Iconos oficiales de época (Data Dragon); cada build puede fijar su parche.

const grid = document.getElementById('championGrid');
const detail = document.getElementById('championDetail');
const tierlistView = document.getElementById('tierlistView');
const seasonsView = document.getElementById('seasonsView');
const searchInput = document.getElementById('searchInput');
const autocompleteBox = document.getElementById('autocomplete');
const roleFilter = document.getElementById('roleFilter');
const mainNav = document.getElementById('mainNav');
const logoHome = document.getElementById('logoHome');
const classicBanner = document.getElementById('classicBanner');

let currentRole = 'all';
let currentSearch = '';
let currentView = 'champions';
let currentTierMode = 'grieta';
let acIndex = -1;

// ---------- Iconos Data Dragon ----------
const champIconUrl = c => `${DD}/champion/${c.dd}.png`;
const itemIconUrl = (id, ver) => `${DD_HOST}/${ver || DD_VER}/img/item/${id}.png`;
const spellIconUrl = (id, ver) => `${DD_HOST}/${ver || DD_VER}/img/spell/${id}.png`;
const runeIconUrl = (img, ver) => `${DD_HOST}/${ver || DD_VER}/img/rune/${img}`;

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

// ---------- Cambio de vista ----------
function switchView(view) {
  currentView = view;
  detail.classList.add('hidden');
  grid.classList.toggle('hidden', view !== 'champions');
  roleFilter.classList.toggle('hidden', view !== 'champions');
  tierlistView.classList.toggle('hidden', view !== 'tierlist');
  seasonsView.classList.toggle('hidden', view !== 'seasons');
  classicBanner.classList.toggle('hidden', view !== 'champions');
  mainNav.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.view === view));
  window.scrollTo(0, 0);
  if (view === 'champions') renderGrid();
  if (view === 'tierlist') renderTierlist();
  if (view === 'seasons') renderSeasons();
}

// ---------- Vista: roster de campeones ----------
function champCard(c) {
  const hasBuilds = c.builds.length > 0;
  return `
    <div class="champ-card ${hasBuilds ? 'has-builds' : ''}" data-id="${c.id}" style="--champ-color:${c.color}">
      ${hasBuilds ? `<span class="builds-badge" title="${c.builds.length} build(s) detalladas">★ ${c.builds.length}</span>` : ''}
      <div class="champ-portrait">
        ${iconImg(champIconUrl(c), c.name, 'portrait-img', initials(c.name))}
      </div>
      <div class="champ-name">${c.name}</div>
      <div class="champ-title">${c.title}</div>
      <div class="champ-roles">${c.roles.map(r => `<span class="role-tag">${r}</span>`).join('')}</div>
    </div>`;
}

function renderGrid() {
  const term = currentSearch.trim().toLowerCase();
  const filtered = CHAMPIONS.filter(c => {
    const matchRole = currentRole === 'all' || c.roles.includes(currentRole);
    const matchSearch = !term || c.name.toLowerCase().includes(term) || c.title.toLowerCase().includes(term);
    return matchRole && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) =>
    (b.builds.length > 0) - (a.builds.length > 0) || a.name.localeCompare(b.name, 'es'));

  let html = sorted.length === 0
    ? '<div class="no-results">Ningún campeón invocado con ese nombre.</div>'
    : sorted.map(champCard).join('');

  if (currentRole === 'all' && !term) {
    html += `
      <div class="soon-divider"><span>Próximamente en LoL Classic</span></div>
      ${PROXIMOS.map(([dd, name, title]) => `
        <div class="champ-card soon-card" style="--champ-color:#3a4a63">
          <div class="champ-portrait">
            ${iconImg(`${DD}/champion/${dd}.png`, name, 'portrait-img', name.slice(0, 2))}
          </div>
          <div class="champ-name">${name}</div>
          <div class="champ-title">${title}</div>
          <div class="champ-roles"><span class="role-tag soon-tag">Tras el lanzamiento</span></div>
        </div>
      `).join('')}`;
  }

  grid.innerHTML = html;
  grid.querySelectorAll('.champ-card[data-id]').forEach(card => {
    card.addEventListener('click', () => showChampion(card.dataset.id));
  });
}

// ---------- Vista: tier list ----------
const TIER_ORDER = ['S+', 'S', 'A', 'B', 'C'];

function renderTierlist() {
  const mode = TIERLIST[currentTierMode];
  tierlistView.innerHTML = `
    <div class="view-header">
      <h2>Tier List — LoL Classic</h2>
      <div class="mode-tabs">
        ${Object.entries(TIERLIST).map(([key, m]) => `
          <button class="mode-tab ${key === currentTierMode ? 'active' : ''}" data-mode="${key}">${m.icono} ${m.nombre}</button>
        `).join('')}
      </div>
    </div>
    <p class="view-desc">${mode.desc}</p>
    <div class="tier-rows">
      ${TIER_ORDER.map(tier => {
        const ids = mode.tiers[tier] || [];
        if (!ids.length) return '';
        return `
          <div class="tier-row">
            <div class="tier-label tier-${tier.replace('+', 'plus').toLowerCase()}">${tier}</div>
            <div class="tier-champs">
              ${ids.map(id => {
                const c = CHAMPIONS.find(ch => ch.id === id);
                if (!c) return '';
                const nota = mode.notas[id];
                return `
                  <div class="tier-champ ${c.builds.length ? 'clickable' : ''}" data-id="${c.id}" title="${nota || c.name + ' — ' + c.roles.join('/')}">
                    ${iconImg(champIconUrl(c), c.name, 'tier-icon', initials(c.name))}
                    <span class="tier-champ-name">${c.name}${nota ? ' ✓' : ''}</span>
                  </div>`;
              }).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>
    <div class="build-section sources-section">
      <h3>Fuentes de meta en vivo</h3>
      <div class="sources-list">
        ${FUENTES_META.map(([url, label]) => `
          <a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer">🔗 ${label}</a>
        `).join('')}
      </div>
      <p class="sources-note">Lista curada para el lanzamiento (parche 26.15). El "✓" marca datos verificados con estadísticas reales. Los enlaces de arriba son páginas en vivo: siempre reflejan el meta actual del modo.</p>
    </div>
  `;

  tierlistView.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentTierMode = tab.dataset.mode;
      renderTierlist();
    });
  });
  tierlistView.querySelectorAll('.tier-champ.clickable').forEach(el => {
    el.addEventListener('click', () => showChampion(el.dataset.id));
  });
}

// ---------- Vista: builds por season ----------
function renderSeasons() {
  const seasonBuilds = {};
  for (const c of CHAMPIONS) {
    c.builds.forEach((b, i) => {
      const s = b.season || 'S3';
      (seasonBuilds[s] = seasonBuilds[s] || []).push({ champ: c, build: b, index: i });
    });
  }

  seasonsView.innerHTML = `
    <div class="view-header"><h2>Builds por Season</h2></div>
    <p class="view-desc">El archivo histórico del proyecto: cada build pertenece a una era y usa los iconos del parche de SU temporada. LoL Classic toma la Season 3 como base, pero el viaje empieza antes.</p>
    ${Object.keys(SEASONS_META).map(sKey => {
      const meta = SEASONS_META[sKey];
      const entries = seasonBuilds[sKey] || [];
      return `
        <div class="season-block">
          <div class="season-head">
            <span class="season-badge s-${sKey.toLowerCase()}">${sKey}</span>
            <h3>${meta.nombre} <span class="season-years">· ${meta.años}</span></h3>
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
                      <span class="role-tag">${build.style}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p class="season-empty">Aún no hay builds archivadas de esta era — próximamente.</p>'}
        </div>`;
    }).join('')}
  `;

  seasonsView.querySelectorAll('.season-build-card').forEach(card => {
    card.addEventListener('click', () => showChampion(card.dataset.id, Number(card.dataset.index)));
  });
}

// ---------- Vista: detalle de campeón ----------
function showChampion(id, buildIdx = 0) {
  const champ = CHAMPIONS.find(c => c.id === id);
  if (!champ) return;

  grid.classList.add('hidden');
  roleFilter.classList.add('hidden');
  tierlistView.classList.add('hidden');
  seasonsView.classList.add('hidden');
  detail.classList.remove('hidden');
  window.scrollTo(0, 0);

  const hasBuilds = champ.builds.length > 0;

  detail.innerHTML = `
    <button class="back-btn" id="backBtn">← Volver</button>
    <div class="detail-header" style="--champ-color:${champ.color}">
      <div class="detail-portrait">
        ${iconImg(champIconUrl(champ), champ.name, 'portrait-img-lg', initials(champ.name))}
      </div>
      <div class="detail-info">
        <h1>${champ.name}</h1>
        <div class="champ-title">${champ.title}</div>
        ${champ.lema ? `<div class="champ-lema">${champ.lema}</div>` : ''}
        <div class="champ-roles">${champ.roles.map(r => `<span class="role-tag">${r}</span>`).join('')}</div>
      </div>
    </div>
    ${hasBuilds ? `
      <div class="build-tabs" id="buildTabs">
        ${champ.builds.map((b, i) => `
          <button class="build-tab ${i === buildIdx ? 'active' : ''}" data-index="${i}">
            <span class="season-badge s-${(b.season || 'S3').toLowerCase()}">${b.season || 'S3'}</span>${b.name}
          </button>`).join('')}
      </div>
      <div class="build-content" id="buildContent"></div>
    ` : `
      <div class="no-builds">
        <p><strong>${champ.name}</strong> está confirmado en el roster de lanzamiento de LoL Classic,
        pero aún no hemos escrito sus builds clásicas.</p>
        <p class="no-builds-sub">Mientras tanto, consulta su build actualizada en las fuentes en vivo:</p>
        <div class="sources-list no-builds-sources">
          <a class="source-link" href="https://www.metasrc.com/lol/classic/champions/${champ.dd === 'MonkeyKing' ? 'wukong' : champ.dd.toLowerCase()}/build" target="_blank" rel="noopener noreferrer">🔗 MetaSRC Classic — ${champ.name}</a>
          <a class="source-link" href="https://coachless.gg/builds" target="_blank" rel="noopener noreferrer">🔗 Coachless — builds actualizadas</a>
        </div>
      </div>
    `}
  `;

  document.getElementById('backBtn').addEventListener('click', () => switchView(currentView));

  if (hasBuilds) {
    const tabs = detail.querySelectorAll('.build-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderBuild(champ.builds[Number(tab.dataset.index)], champ);
      });
    });
    renderBuild(champ.builds[buildIdx], champ);
  }
}

// Fuentes por defecto de cada campeón + las específicas de la build
function buildSources(build, champ) {
  const metasrcId = champ.dd === 'MonkeyKing' ? 'wukong' : champ.dd.toLowerCase();
  const defaults = [
    [`https://www.metasrc.com/lol/classic/champions/${metasrcId}/build`, `MetaSRC Classic — ${champ.name} (meta en vivo del modo)`],
    ['https://coachless.gg/builds', 'Coachless — builds analíticas actualizadas'],
    [`https://leagueoflegends.fandom.com/es/wiki/${encodeURIComponent(champ.name.replace(/ /g, '_'))}`, `Wiki de LoL — ${champ.name} (kit e historial de parches)`],
    ['https://movistaresports.com/asi-va-a-ser-league-of-legends-classic/', 'Movistar eSports — sistemas de runas y maestrías de LoL Classic']
  ];
  const all = [...(build.fuentes || []), ...defaults];
  const seen = new Set();
  return all.filter(([url]) => !seen.has(url) && seen.add(url));
}

function itemPill(pair, ver) {
  const [id, nombre] = pair;
  return `<span class="item-pill" title="${nombre}">
    ${iconImg(itemIconUrl(id, ver), nombre, 'item-icon', nombre[0])}
    <span class="item-name">${nombre}</span>
  </span>`;
}

function renderBuild(build, champ) {
  const content = document.getElementById('buildContent');
  const ver = build.parche || DD_VER;
  const r = build.runas;
  const runeTypes = [
    { key: 'marca', label: 'Marcas · Rojas' },
    { key: 'sello', label: 'Sellos · Amarillos' },
    { key: 'glifo', label: 'Glifos · Azules' },
    { key: 'quinta', label: 'Quintaesencias' }
  ];
  const treeClass = { 'Ofensa': 'ofensa', 'Defensa': 'defensa', 'Utilidad': 'utilidad' };
  const phases = [
    { key: 'early', label: 'Early game', ico: '🌅' },
    { key: 'mid', label: 'Mid game', ico: '⚔️' },
    { key: 'late', label: 'Late game', ico: '👑' }
  ];
  const seasonNames = { S1: 'Season 1', S2: 'Season 2', S3: 'Season 3', S4: 'Season 4', S5: 'Season 5' };

  content.innerHTML = `
    <div class="build-meta">
      <span class="meta-chip chip-season">${seasonNames[build.season] || build.season || 'Season 3'} · parche ${ver}</span>
      <span class="meta-chip chip-role">${build.role}</span>
      <span class="meta-chip chip-style">${build.style}</span>
      <span class="meta-chip chip-diff">Dificultad: ${build.difficulty}</span>
      ${build.stats ? `<span class="meta-chip chip-stats">📊 ${build.stats}</span>` : ''}
    </div>

    ${build.resumen ? `<p class="build-resumen">${build.resumen}</p>` : ''}

    <div class="build-section">
      <h3>Build de objetos</h3>
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
      </div>
    </div>

    <div class="build-section">
      <h3>Runas clásicas</h3>
      <div class="runes-grid">
        ${runeTypes.map(t => `
          <div class="rune-card ${t.key}">
            <div class="rune-head">
              ${iconImg(runeIconUrl(r[t.key].img, ver), t.label, 'rune-icon', '◆')}
              <div>
                <div class="rune-type">${t.label}</div>
                <div class="rune-name">${r[t.key].nombre}</div>
              </div>
            </div>
            <div class="rune-detail">${r[t.key].detalle}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="build-section">
      <h3>Maestrías — ${seasonNames[build.season] || 'clásicas'}</h3>
      <div class="mastery-summary">
        <div class="mastery-dist">${build.maestrias.reparto}</div>
        <div class="mastery-key">${build.maestrias.clave}</div>
      </div>
      <div class="mastery-trees">
        ${build.maestrias.arboles.map(a => `
          <div class="mastery-tree-row">
            <div class="tree-name ${treeClass[a.arbol] || ''}">${a.arbol} · ${a.puntos}</div>
            <div class="tree-points">${a.detalle}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="build-section">
      <h3>Hechizos y habilidades</h3>
      <div class="spells-skills">
        <div class="ss-card">
          <div class="label">Hechizos de invocador</div>
          <div class="spell-row">
            ${build.hechizos.map(([sid, sn]) => `
              <span class="spell-chip">${iconImg(spellIconUrl(sid, ver), sn, 'spell-icon', sn[0])}<span>${sn}</span></span>
            `).join('')}
          </div>
        </div>
        <div class="ss-card">
          <div class="label">Orden de habilidades — maximizar</div>
          <div class="skill-order">
            ${build.habilidades.map(h => `<span class="skill-key">${h}</span>`).join('<span class="arrow-sep">›</span>')}
          </div>
        </div>
      </div>
    </div>

    ${build.plan ? `
    <div class="build-section">
      <h3>Plan de partida</h3>
      <div class="plan-grid">
        ${phases.map(p => `
          <div class="plan-card plan-${p.key}">
            <div class="plan-label">${p.ico} ${p.label}</div>
            <p>${build.plan[p.key]}</p>
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    <div class="build-section">
      <h3>Consejos del invocador</h3>
      <ul class="tips-list">
        ${build.tips.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>

    <div class="build-section sources-section">
      <h3>Fuentes</h3>
      <div class="sources-list">
        ${buildSources(build, champ).map(([url, label]) => `
          <a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer">🔗 ${label}</a>
        `).join('')}
      </div>
      <p class="sources-note">Mezcla de fuentes: estadísticas en vivo (MetaSRC, Coachless), documentación del kit clásico (Wiki) y cobertura del lanzamiento. Los enlaces siempre muestran el meta actual. Iconos de Data Dragon (parche ${ver}).</p>
    </div>
  `;
}

// ---------- Búsqueda con autocomplete ----------
function buildSearchIndex() {
  const idx = [];
  for (const c of CHAMPIONS) {
    idx.push({ tipo: 'Campeón', label: c.name, sub: `${c.title} · ${c.roles.join('/')}`, icon: champIconUrl(c), go: () => showChampion(c.id) });
    c.builds.forEach((b, i) => {
      idx.push({ tipo: 'Build', label: `${c.name}: ${b.name}`, sub: `${b.season || 'S3'} · ${b.role} · ${b.style}`, icon: champIconUrl(c), go: () => showChampion(c.id, i) });
    });
  }
  idx.push({ tipo: 'Sección', label: 'Tier List — Grieta Clásica', sub: 'Modo 5v5 de LoL Classic', emoji: '⚔️', go: () => { currentTierMode = 'grieta'; switchView('tierlist'); } });
  idx.push({ tipo: 'Sección', label: 'Tier List — ARAM Clásico', sub: 'Modo carril único', emoji: '❄️', go: () => { currentTierMode = 'aram'; switchView('tierlist'); } });
  for (const [sKey, meta] of Object.entries(SEASONS_META)) {
    idx.push({ tipo: 'Sección', label: `Builds de ${meta.nombre}`, sub: meta.años, emoji: '📜', go: () => switchView('seasons') });
  }
  idx.push({ tipo: 'Sección', label: 'Roster de campeones', sub: 'LoL Classic — lanzamiento 26.15', emoji: '🏆', go: () => switchView('champions') });
  return idx;
}

const SEARCH_INDEX = buildSearchIndex();

function renderAutocomplete(term) {
  acIndex = -1;
  if (!term.trim()) { autocompleteBox.innerHTML = ''; autocompleteBox.classList.remove('open'); return; }
  const t = term.trim().toLowerCase();
  const matches = SEARCH_INDEX
    .map(e => {
      const l = e.label.toLowerCase();
      const s = (e.sub || '').toLowerCase();
      let score = -1;
      if (l.startsWith(t)) score = 0;
      else if (l.includes(t)) score = 1;
      else if (s.includes(t)) score = 2;
      return { e, score };
    })
    .filter(m => m.score >= 0)
    .sort((a, b) => a.score - b.score || a.e.label.localeCompare(b.e.label, 'es'))
    .slice(0, 8);

  if (!matches.length) { autocompleteBox.innerHTML = '<div class="ac-empty">Sin resultados</div>'; autocompleteBox.classList.add('open'); return; }

  autocompleteBox.innerHTML = matches.map(({ e }, i) => `
    <div class="ac-item" data-i="${i}">
      ${e.icon ? iconImg(e.icon, e.label, 'ac-icon', e.label[0]) : `<span class="ac-emoji">${e.emoji || '◆'}</span>`}
      <div class="ac-text">
        <div class="ac-label">${e.label}</div>
        <div class="ac-sub">${e.sub || ''}</div>
      </div>
      <span class="ac-type">${e.tipo}</span>
    </div>
  `).join('');
  autocompleteBox.classList.add('open');

  const items = autocompleteBox.querySelectorAll('.ac-item');
  items.forEach((el, i) => {
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
    acIndex = e.key === 'ArrowDown'
      ? (acIndex + 1) % matches.length
      : (acIndex - 1 + matches.length) % matches.length;
    autocompleteBox.querySelectorAll('.ac-item').forEach((el, i) =>
      el.classList.toggle('active', i === acIndex));
  } else if (e.key === 'Enter') {
    if (acIndex >= 0 && matches[acIndex]) pickSuggestion(matches[acIndex].e);
    else if (matches.length) pickSuggestion(matches[0].e);
    else { switchView('champions'); renderGrid(); }
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

// Inicio
renderGrid();
