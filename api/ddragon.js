/**
 * Función serverless de Vercel: capa de datos en vivo sobre Data Dragon.
 *
 *   /api/ddragon?recurso=version                     → último parche publicado
 *   /api/ddragon?recurso=campeones                   → roster completo del parche actual
 *   /api/ddragon?recurso=campeones&parche=3.15.5     → roster de un parche concreto
 *   /api/ddragon?recurso=campeon&id=Taric&parche=…   → habilidades de un campeón
 *   /api/ddragon?recurso=objetos&parche=…            → catálogo de objetos
 *
 * Por qué existe, si el navegador ya puede llamar a Data Dragon:
 *  - Devuelve solo lo que la app necesita, no el JSON entero (el de objetos
 *    del parche actual pesa 600 KB; aquí van unos pocos KB).
 *  - Se cachea en la red de Vercel, así que una sola petición sirve a todos
 *    los visitantes durante horas en vez de una por persona.
 *  - Si mañana se añade otra fuente, se enchufa aquí sin tocar el cliente.
 *
 * No necesita ninguna clave: Data Dragon es público.
 */

const DD = 'https://ddragon.leagueoflegends.com';
const IDIOMA = 'es_ES';

// Los tags de Riot no son carriles, pero orientan bien para el filtro
const ROL_POR_TAG = {
  Fighter: 'Top', Tank: 'Top', Mage: 'Mid', Assassin: 'Mid',
  Marksman: 'ADC', Support: 'Support'
};

async function json(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  return r.json();
}

const ultimaVersion = async () => (await json(`${DD}/api/versions.json`))[0];

export default async function handler(req, res) {
  const { recurso = 'version', parche, id } = req.query;

  try {
    const version = parche || await ultimaVersion();
    let datos;

    switch (recurso) {
      case 'version':
        datos = { version };
        break;

      case 'campeones': {
        const j = await json(`${DD}/cdn/${version}/data/${IDIOMA}/champion.json`);
        datos = {
          version,
          total: Object.keys(j.data).length,
          campeones: Object.values(j.data).map(c => ({
            dd: c.id,
            nombre: c.name,
            titulo: c.title,
            tags: c.tags,
            roles: [...new Set(c.tags.map(t => ROL_POR_TAG[t]).filter(Boolean))]
          }))
        };
        break;
      }

      case 'campeon': {
        if (!id) return res.status(400).json({ error: 'Falta el parámetro id' });
        const j = await json(`${DD}/cdn/${version}/data/${IDIOMA}/champion/${id}.json`);
        const c = j.data[id];
        const limpiar = t => (t || '').replace(/<[^>]+>/g, '').trim();
        datos = {
          version,
          dd: c.id,
          nombre: c.name,
          titulo: c.title,
          habilidades: [
            { tecla: 'P', nombre: c.passive.name, desc: limpiar(c.passive.description),
              icono: `${DD}/cdn/${version}/img/passive/${c.passive.image.full}` },
            ...c.spells.map((s, i) => ({
              tecla: ['Q', 'W', 'E', 'R'][i], nombre: s.name, desc: limpiar(s.description),
              icono: `${DD}/cdn/${version}/img/spell/${s.image.full}`
            }))
          ]
        };
        break;
      }

      case 'objetos': {
        const j = await json(`${DD}/cdn/${version}/data/${IDIOMA}/item.json`);
        datos = {
          version,
          objetos: Object.entries(j.data).map(([oid, it]) => ({
            id: Number(oid), nombre: it.name, oro: it.gold ? it.gold.total : 0
          }))
        };
        break;
      }

      default:
        return res.status(400).json({ error: `Recurso desconocido: ${recurso}` });
    }

    // Cache en la red de Vercel: 1 hora fresco, 24 h sirviendo lo viejo mientras revalida
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(datos);

  } catch (e) {
    return res.status(502).json({ error: 'No se pudo consultar Data Dragon', detalle: String(e.message) });
  }
}
