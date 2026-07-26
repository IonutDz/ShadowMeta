#!/usr/bin/env node
/**
 * Valida js/data.js contra Data Dragon y contra sus propias reglas internas.
 *
 *   node scripts/validar.js
 *
 * Comprueba:
 *  - Que todos los IDs de objetos existen en el parche que declara cada build.
 *  - Que los hechizos de invocador existen en ese parche.
 *  - Que los campeones del roster existen en Data Dragon.
 *  - Que cada build tiene todos sus campos obligatorios.
 *  - Que las tier lists cubren el roster exactamente una vez.
 *  - Que kits y counters cubren el roster y no apuntan a campeones inexistentes.
 *
 * Sale con código 1 si encuentra algún problema, para poder usarlo en CI.
 */

const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const fuente = fs.readFileSync(path.join(raiz, 'js', 'data.js'), 'utf8');

const D = new Function(fuente + `; return {
  CHAMPIONS, buildsDe, TIERLIST, KITS, COUNTERS, PATCHES, EDICIONES, MODOS, PROXIMOS
};`)();

const problemas = [];
const avisos = [];
const cacheParches = {};

async function catalogo(parche) {
  if (cacheParches[parche]) return cacheParches[parche];
  const base = `https://ddragon.leagueoflegends.com/cdn/${parche}/data/es_ES`;
  const [items, hechizos, campeones] = await Promise.all(
    ['item', 'summoner', 'champion'].map(f =>
      fetch(`${base}/${f}.json`).then(r => {
        if (!r.ok) throw new Error(`${f}.json del parche ${parche}: HTTP ${r.status}`);
        return r.json();
      }))
  );
  return (cacheParches[parche] = {
    items: new Set(Object.keys(items.data)),
    hechizos: new Set(Object.keys(hechizos.data)),
    campeones: new Set(Object.keys(campeones.data))
  });
}

// ---------- Reglas internas ----------
function validarEstructura() {
  for (const c of D.CHAMPIONS) {
    if (!c.builds.length) problemas.push(`${c.name}: sin ninguna build`);
    if (!D.KITS[c.id]) problemas.push(`${c.name}: sin kit de habilidades`);
    if (!D.COUNTERS[c.id]) problemas.push(`${c.name}: sin counters`);

    for (const b of c.builds) {
      const donde = `${c.name} / ${b.name}`;
      if (!b.items?.inicio?.length) problemas.push(`${donde}: sin objetos de inicio`);
      if (!b.items?.core?.length) problemas.push(`${donde}: sin objetos de núcleo`);
      if (!b.runas && !b.runasModernas) problemas.push(`${donde}: sin runas`);
      if (b.season !== 'ACT' && !b.maestrias) problemas.push(`${donde}: sin maestrías`);
      if ((b.hechizos || []).length !== 2) problemas.push(`${donde}: debe tener 2 hechizos`);
      if ((b.habilidades || []).length !== 3) problemas.push(`${donde}: debe tener 3 habilidades`);
      if ((b.tips || []).length < 3) problemas.push(`${donde}: menos de 3 consejos`);
      if (!b.plan?.early || !b.plan?.mid || !b.plan?.late) problemas.push(`${donde}: plan incompleto`);
      if (!b.resumen) problemas.push(`${donde}: sin resumen`);
      if (!D.MODOS[b.modo]) problemas.push(`${donde}: modo desconocido "${b.modo}"`);
      for (const ed of b.ediciones)
        if (!D.EDICIONES[ed]) problemas.push(`${donde}: edición desconocida "${ed}"`);
    }
  }

  const ids = new Set(D.CHAMPIONS.map(c => c.id));

  for (const [modo, tl] of Object.entries(D.TIERLIST)) {
    const puestos = Object.values(tl.tiers).flat();
    const faltan = [...ids].filter(i => !puestos.includes(i));
    const dups = puestos.filter((x, i) => puestos.indexOf(x) !== i);
    const raros = puestos.filter(p => !ids.has(p));
    if (faltan.length) problemas.push(`Tier list "${modo}": faltan ${faltan.join(', ')}`);
    if (dups.length) problemas.push(`Tier list "${modo}": duplicados ${dups.join(', ')}`);
    if (raros.length) problemas.push(`Tier list "${modo}": ids inexistentes ${raros.join(', ')}`);
  }

  for (const [id, c] of Object.entries(D.COUNTERS))
    for (const rival of [...(c.fuerte || []), ...(c.debil || [])])
      if (!ids.has(rival)) problemas.push(`Counters de ${id}: "${rival}" no está en el roster`);

  for (const [id, k] of Object.entries(D.KITS))
    for (const tecla of ['P', 'Q', 'W', 'E', 'R'])
      if (!k[tecla]) problemas.push(`Kit de ${id}: falta la habilidad ${tecla}`);
}

// ---------- Contraste con Data Dragon ----------
async function validarContraDataDragon() {
  const porParche = {};
  for (const c of D.CHAMPIONS)
    for (const b of c.builds)
      (porParche[b.parche] = porParche[b.parche] || []).push({ c, b });

  for (const [parche, entradas] of Object.entries(porParche)) {
    let cat;
    try {
      cat = await catalogo(parche);
    } catch (e) {
      problemas.push(`No se pudo descargar el catálogo: ${e.message}`);
      continue;
    }
    for (const { c, b } of entradas) {
      const donde = `${c.name} / ${b.name} (parche ${parche})`;
      for (const grupo of Object.values(b.items))
        for (const [id, nombre] of grupo)
          if (!cat.items.has(String(id)))
            problemas.push(`${donde}: el objeto ${id} ("${nombre}") no existe en ese parche`);
      for (const [sid, nombre] of b.hechizos)
        if (!cat.hechizos.has(sid))
          problemas.push(`${donde}: el hechizo "${sid}" ("${nombre}") no existe en ese parche`);
    }
  }

  // Los campeones se comprueban contra el parche clásico de referencia
  try {
    const cat = await catalogo(D.PATCHES.S3);
    for (const c of D.CHAMPIONS)
      if (!cat.campeones.has(c.dd)) problemas.push(`Campeón "${c.dd}" no existe en Data Dragon ${D.PATCHES.S3}`);
    for (const [dd] of D.PROXIMOS)
      if (!cat.campeones.has(dd)) avisos.push(`Próximo campeón "${dd}" no existe en Data Dragon ${D.PATCHES.S3}`);
  } catch (e) {
    problemas.push(`No se pudo comprobar el roster: ${e.message}`);
  }
}

// ---------- Informe ----------
(async () => {
  console.log('Validando ShadowMeta…\n');
  validarEstructura();
  await validarContraDataDragon();

  const builds = D.CHAMPIONS.reduce((n, c) => n + c.builds.length, 0);
  console.log(`Roster:  ${D.CHAMPIONS.length} campeones`);
  console.log(`Builds:  ${builds}`);
  for (const [k, e] of Object.entries(D.EDICIONES)) {
    const n = D.CHAMPIONS.reduce((s, c) => s + D.buildsDe(c, k, 'todos').length, 0);
    console.log(`  ${e.nombre.padEnd(12)} ${n}`);
  }
  for (const [k, m] of Object.entries(D.MODOS)) {
    const n = D.CHAMPIONS.reduce((s, c) => s + D.buildsDe(c, 'todas', k).length, 0);
    console.log(`  ${m.nombre.padEnd(12)} ${n}`);
  }

  if (avisos.length) {
    console.log(`\nAvisos (${avisos.length}):`);
    avisos.forEach(a => console.log('  · ' + a));
  }

  if (problemas.length) {
    console.log(`\n❌ ${problemas.length} problema(s):`);
    problemas.forEach(p => console.log('  · ' + p));
    process.exit(1);
  }
  console.log('\n✅ Todo correcto.');
})();
