// ============ ShadowMeta — Datos ============
// Builds, runas, maestrías y tier lists de League of Legends a través de sus eras.
// Iconos oficiales servidos desde Data Dragon (CDN de Riot):
//   Campeón:  dd 'Taric'          -> cdn/<ver>/img/champion/Taric.png
//   Objeto:   [id, 'Nombre']      -> cdn/<ver>/img/item/<id>.png
//   Hechizo:  ['SummonerX','N']   -> cdn/<ver>/img/spell/SummonerX.png
//   Runa:     img 'r_1_1.png'     -> cdn/<ver>/img/rune/<img>.png
//
// Cada build declara:
//   season : 'S1' | 'S2' | 'S3' | 'ACT'     (define el parche de iconos por defecto)
//   modo   : 'grieta' | 'aram'              (por defecto 'grieta')
//   ediciones: [...]                        (opcional; si falta se deriva de la season)
//   parche : '3.6.14'                       (opcional; fuerza los iconos de un parche concreto)

const DD_HOST = 'https://ddragon.leagueoflegends.com/cdn';

// Parche de Data Dragon usado para los iconos de cada era
const PATCHES = {
  S1: '3.6.14',   // el más antiguo archivado por Riot
  S2: '3.6.14',
  S3: '3.15.5',   // base de LoL Classic
  ACT: '16.14.1'  // parche vivo
};

const DD_VER = PATCHES.S3;
const DD = DD_HOST + '/' + DD_VER + '/img';

// ---------- Ediciones (selector de época) ----------
const EDICIONES = {
  classic: {
    nombre: 'LoL Classic',
    corto: 'Classic',
    icono: '⚔️',
    patch: PATCHES.S3,
    desc: 'El modo retro oficial de Riot (lanzamiento 29/07/2026): 60 campeones con kits pre-rework sobre itemización, runas y maestrías de la Season 3.'
  },
  s3: {
    nombre: 'Season 3',
    corto: 'S3',
    icono: '🏆',
    patch: PATCHES.S3,
    desc: '2013. Trinkets recién llegados, objetos de oro para soportes, espíritus de jungla y Tenaza de Muerte Ígnea en cada mago. El meta más querido de la historia del juego.'
  },
  s2: {
    nombre: 'Season 2',
    corto: 'S2',
    icono: '📜',
    patch: PATCHES.S2,
    desc: '2011–2012. La era de la visión y los primeros junglas modernos: Piedra Filosofal, Armadura de Tela + 5 pociones y soportes que compraban todos los wards del equipo.'
  },
  s1: {
    nombre: 'Season 1',
    corto: 'S1',
    icono: '🕯️',
    patch: PATCHES.S1,
    desc: '2010–2011. Los orígenes: sin trinkets, sin objetos de soporte, penetración de armadura reinando en las runas y peleas caóticas en mid desde el minuto 20.'
  },
  actual: {
    nombre: 'LoL Actual',
    corto: 'Actual',
    icono: '⚡',
    patch: PATCHES.ACT,
    desc: 'El League de hoy (parche ' + PATCHES.ACT + '): runas modernas, objetos legendarios y el meta vivo. Las builds clásicas no aplican aquí — este es otro juego.'
  }
};

// ---------- Modos de juego ----------
const MODOS = {
  grieta: { nombre: 'Grieta del Invocador', corto: 'Grieta', icono: '⚔️', desc: '5v5 en la Grieta: tres carriles, jungla y objetivos neutrales.' },
  aram: { nombre: 'ARAM', corto: 'ARAM', icono: '❄️', desc: 'Todos aleatorios, todos a mid: un solo carril, sin retorno a base y peleas constantes.' }
};

// ---------- Roster de lanzamiento de LoL Classic ----------
// [ddragonId, Nombre, Título clásico, roles]
const ROSTER = [
  ['Ahri', 'Ahri', 'la Mujer Zorro de Nueve Colas', ['Mid']],
  ['Alistar', 'Alistar', 'el Minotauro', ['Support', 'Jungla']],
  ['Amumu', 'Amumu', 'la Momia Triste', ['Jungla']],
  ['Anivia', 'Anivia', 'la Criofénix', ['Mid']],
  ['Annie', 'Annie', 'Hija de la Oscuridad', ['Mid', 'Support']],
  ['Ashe', 'Ashe', 'la Arquera de Hielo', ['ADC']],
  ['Blitzcrank', 'Blitzcrank', 'el Gran Gólem de Vapor', ['Support']],
  ['Brand', 'Brand', 'la Venganza Ardiente', ['Mid', 'Support']],
  ['Chogath', "Cho'Gath", 'el Terror del Vacío', ['Top', 'Mid']],
  ['Corki', 'Corki', 'el Bombardero Osado', ['ADC', 'Mid']],
  ['DrMundo', 'Dr. Mundo', 'el Loco de Zaun', ['Top', 'Jungla']],
  ['Evelynn', 'Evelynn', 'Hacedora de Viudas', ['Jungla']],
  ['Ezreal', 'Ezreal', 'el Explorador Pródigo', ['ADC', 'Mid']],
  ['FiddleSticks', 'Fiddlesticks', 'el Espantapájaros Siniestro', ['Jungla', 'Support']],
  ['Gangplank', 'Gangplank', 'el Azote de los Mares', ['Top']],
  ['Garen', 'Garen', 'El poder de Demacia', ['Top']],
  ['Gragas', 'Gragas', 'el Camorrista', ['Mid', 'Jungla']],
  ['Heimerdinger', 'Heimerdinger', 'el Inventor Venerado', ['Mid', 'Top']],
  ['Janna', 'Janna', 'la Furia de la Tormenta', ['Support']],
  ['JarvanIV', 'Jarvan IV', 'el Ejemplo de Demacia', ['Jungla', 'Top']],
  ['Jax', 'Jax', 'Maestro de armas', ['Top', 'Jungla']],
  ['Karthus', 'Karthus', 'el Liche', ['Mid']],
  ['Kassadin', 'Kassadin', 'el Cazador del Vacío', ['Mid']],
  ['Katarina', 'Katarina', 'la Cuchilla Siniestra', ['Mid']],
  ['Kayle', 'Kayle', 'La Justiciera', ['Top', 'Mid']],
  ['KogMaw', "Kog'Maw", 'la Boca del Abismo', ['ADC', 'Mid']],
  ['LeeSin', 'Lee Sin', 'el Monje Ciego', ['Jungla']],
  ['Leona', 'Leona', 'Amanecer Radiante', ['Support']],
  ['Lulu', 'Lulu', 'el Hada Hechicera', ['Support', 'Mid']],
  ['Lux', 'Lux', 'la Dama Luminosa', ['Mid', 'Support']],
  ['Malphite', 'Malphite', 'Fragmento del monolito', ['Top']],
  ['Malzahar', 'Malzahar', 'el Profeta del Vacío', ['Mid']],
  ['MasterYi', 'Maestro Yi', 'el Espadachín Wuju', ['Jungla']],
  ['MissFortune', 'Miss Fortune', 'la Cazarrecompensas', ['ADC']],
  ['MonkeyKing', 'Wukong', 'el Rey de los Monos', ['Top', 'Jungla']],
  ['Morgana', 'Morgana', 'Ángel caído', ['Mid', 'Support']],
  ['Nasus', 'Nasus', 'el Guardián de las Arenas', ['Top']],
  ['Nidalee', 'Nidalee', 'la Cazadora bestial', ['Top', 'Mid']],
  ['Nunu', 'Nunu', 'el Jinete de Yetis', ['Jungla', 'Support']],
  ['Olaf', 'Olaf', 'el Berserker', ['Jungla', 'Top']],
  ['Pantheon', 'Pantheon', 'el Artesano de la Guerra', ['Top', 'Mid']],
  ['Rammus', 'Rammus', 'el Armadurillo', ['Jungla']],
  ['Ryze', 'Ryze', 'el Hechicero Rebelde', ['Mid', 'Top']],
  ['Shaco', 'Shaco', 'el Bufón Siniestro', ['Jungla']],
  ['Singed', 'Singed', 'el Químico Loco', ['Top']],
  ['Sion', 'Sion', 'Abominación no muerta', ['Top', 'Mid']],
  ['Sivir', 'Sivir', 'Señora de la Batalla', ['ADC']],
  ['Skarner', 'Skarner', 'la Vanguardia de Cristal', ['Jungla']],
  ['Sona', 'Sona', 'Virtuosa de las cuerdas', ['Support']],
  ['Soraka', 'Soraka', 'la Hija de las Estrellas', ['Support']],
  ['Taric', 'Taric', 'el Caballero Gema', ['Top', 'Support']],
  ['Teemo', 'Teemo', 'el Explorador Veloz', ['Top']],
  ['Tristana', 'Tristana', 'la Artillera Megling', ['ADC']],
  ['Tryndamere', 'Tryndamere', 'el Rey Bárbaro', ['Top', 'Jungla']],
  ['TwistedFate', 'Twisted Fate', 'el Maestro de las Cartas', ['Mid']],
  ['Twitch', 'Twitch', 'la Rata Apestada', ['ADC', 'Jungla']],
  ['Urgot', 'Urgot', 'el Orgullo del Verdugo', ['ADC', 'Top']],
  ['Vayne', 'Vayne', 'la Cazadora Noctívaga', ['ADC']],
  ['Veigar', 'Veigar', 'el Pequeño Maestro del Mal', ['Mid']],
  ['Warwick', 'Warwick', 'el Cazador Sanguinario', ['Jungla', 'Top']],
  ['Zilean', 'Zilean', 'el Guardián del Tiempo', ['Mid', 'Support']]
];

// Confirmados para después del lanzamiento
const PROXIMOS = [
  ['Akali', 'Akali', 'el Puño de la Sombra'],
  ['Caitlyn', 'Caitlyn', 'la Sheriff de Piltover'],
  ['Fiora', 'Fiora', 'Estocada Excelsa'],
  ['Graves', 'Graves', 'el Forajido'],
  ['Irelia', 'Irelia', 'la Voluntad de las Cuchillas'],
  ['Leblanc', 'LeBlanc', 'la Embaucadora'],
  ['Mordekaiser', 'Mordekaiser', 'el Maestro del Metal']
];

// Colores de acento para los campeones con builds detalladas (el resto se autogenera)
const COLORS = {
  taric: '#c94fd6', garen: '#3b82d6', malphite: '#7d8a99', leesin: '#d68f3b',
  masteryi: '#e0c341', ahri: '#e06fa8', lux: '#f2d16b', ashe: '#7ec8e3', soraka: '#b48ae0',
  jax: '#8a6f3d', vayne: '#8b3a4a', blitzcrank: '#d4a03c', kassadin: '#4a6fd4',
  katarina: '#c0392b', amumu: '#6b9b45', sona: '#5ec4d6', tristana: '#4a9bd4', ezreal: '#e8c547'
};

// Lemas de los campeones con builds
const LEMAS = {
  taric: '«Las gemas son verdaderamente inquebrantables.»',
  garen: '«¡DEMACIA!»',
  malphite: '«Roca sólida.»',
  leesin: '«Domina el yo y dominarás al enemigo.»',
  masteryi: '«Mi espada es tuya.»',
  ahri: '«El corazón humano es un laberinto delicioso.»',
  lux: '«¡A iluminar el campo de batalla!»',
  ashe: '«Un disparo, una diana.»',
  soraka: '«Caí de las estrellas para salvaros.»',
  jax: '«¡Imagina si tuviera un arma de verdad!»',
  vayne: '«Los malvados deben temer la noche.»',
  blitzcrank: '«Metal y acero, al servicio de la ciencia.»',
  kassadin: '«El equilibrio es una mentira: somos la mano que inclina la balanza.»',
  katarina: '«La muerte florece con cada cuchilla.»',
  amumu: '«¿Quieres... ser mi amigo?»',
  sona: '«Solo la música dice la verdad.»',
  tristana: '«¡Quiero volar por los aires algo GRANDE!»',
  ezreal: '«¿Mapas? Los mapas son para los que se pierden.»'
};

// ---------- Builds detalladas por campeón ----------
const BUILDS = {
  taric: [
    {
      name: 'Top — Guantelete (Tanque)',
      season: 'S3',
      role: 'Top',
      style: 'Tanque / Peleador',
      difficulty: 'Media',
      resumen: 'El Taric top clásico convierte su kit de soporte en una máquina de intercambios: cada hechizo activa el Guantelete de Hielo, cubriendo la línea de zonas de escarcha mientras Destello (E) garantiza que ningún intercambio empiece sin ventaja. Escala hacia un frontline inmortal con presión constante de aturdimientos.',
      items: {
        inicio: [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3025, 'Guantelete de Hielo'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
        situacionales: [[3110, 'Corazón de Hielo'], [3075, 'Malla de Espinas'], [3065, 'Rostro Espiritual'], [3083, 'Armadura de Warmog'], [3143, 'Presagio de Randuin']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura. Neutralizan el daño físico del carril superior y hacen rentable cada intercambio corto.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura. El estándar innegociable de todo top laner de la Season 3.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al nivel 18. Preparan el mid game contra los magos del equipo rival.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5% de velocidad. Cierran la distancia hasta el objetivo del aturdimiento y permiten rotar antes.' }
      },
      maestrias: {
        reparto: '9/21/0',
        clave: 'Defensa profunda con presencia de línea',
        arboles: [
          { arbol: 'Ofensa', puntos: 9, detalle: 'Hechicería, Carnicero, Conocimiento Arcano — el mínimo para que Destello duela en línea.' },
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Inflexible, Guardia de Honor.' }
        ]
      },
      hechizos: [['SummonerTeleport', 'Teleportación'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'W', 'Q'],
      plan: {
        early: 'Juega alrededor del maná: intercambia solo con E disponible (E → 2 autos → retirada). Destroza su armadura con la activa de W antes de cada intercambio largo.',
        mid: 'Con Guantelete y Capa de Fuego Solar completados eres el rey de los intercambios extendidos. Usa Teleportación para aparecer en las peleas 2v2 de bot con tu ultimate activa.',
        late: 'Inicia con E sobre el carry enemigo y planta la escarcha del Guantelete en medio de su equipo. Radiance (R) es un buff de área para todo tu equipo: ábrela al empezar la pelea, no la guardes.'
      },
      tips: [
        'El Guantelete de Hielo procea con Q, W y E: alterna hechizo y ataque básico para renovar la zona de ralentización sin gastar todo el maná.',
        'La activa de W (Destrozar) reduce la armadura del rival: úsala siempre justo antes del intercambio, no durante.',
        'Contra composiciones de daño mágico adelanta el Rostro Espiritual: potencia además la curación de tu Q.',
        'Tu nivel 6 con Radiance gana casi cualquier 1v1: fuerza la pelea antes de que el rival complete su primer objeto grande.'
      ]
    },
    {
      name: 'Top — AP (Tenaza + burst)',
      season: 'S3',
      role: 'Top',
      style: 'Burst mágico',
      difficulty: 'Alta',
      resumen: 'La build off-meta por excelencia: Taric AP con Tenaza de Muerte Ígnea. Destello (E) y Radiance (R) escalan con poder de habilidad, y la Tenaza amplifica todo el combo un 20%. Un aturdimiento bien colocado borra a un carry de la pantalla — el rival nunca lo espera de un "soporte".',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3128, 'Tenaza de Muerte Ígnea'], [3020, 'Botas de Hechicero'], [3157, 'Reloj de Arena de Zhonya']],
        situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3135, 'Bastón del Vacío'], [3001, 'Cetro Abisal'], [3116, 'Cetro de Cristal de Rylai']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica. Atraviesan la RM base para que el combo completo entre limpio.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura. Sobrevivir la fase de líneas contra luchadores AD es el único requisito de la build.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Poder de Habilidad x9', detalle: '+11 de AP plano. Destello duele desde el nivel 2.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP. Burst inmediato sin sacrificar el early.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Ofensa arcana completa',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza — colchón mínimo para el carril.' }
        ]
      },
      hechizos: [['SummonerDot', 'Ignición'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'R', 'W'],
      plan: {
        early: 'Farmea con seguridad y castiga cada last hit del rival con E + auto. No tienes sustain de mago: administra las cargas del Anillo de Doran y respeta los ganks.',
        mid: 'La Tenaza de Muerte Ígnea marca tu primer pico de poder real: busca al mid o al ADC rival en rotaciones. Combo completo: Tenaza → E → R → W → Q → Ignición.',
        late: 'Eres un asesino de un solo objetivo con Zhonya de seguro: entra con Destello, borra al carry y congela el reloj mientras tu equipo limpia.'
      },
      tips: [
        'La activa de la Tenaza amplifica TODO el daño posterior un 20%: ábrela siempre antes del aturdimiento, nunca después.',
        'Radiance (R) también da AD y AP a los aliados cercanos: incluso fallando el combo, aporta a la pelea.',
        'Zhonya entre tu combo y el enfriamiento de E te hace intocable los segundos críticos.',
        'Es una build de nicho: si la partida va mal, pivota a la versión Guantelete a partir del segundo objeto.'
      ]
    },
    {
      name: 'Support — Clásico (Piedra + Solari)',
      season: 'S3',
      role: 'Support',
      style: 'Tanque / Protector',
      difficulty: 'Baja',
      resumen: 'El Taric de botlane de toda la vida: armadura para tu tirador con W, aturdimientos de 1.5 segundos que deciden el 2v2 y visión permanente del río. Simple, honesto y devastadoramente efectivo en la Season 3.',
      items: {
        inicio: [[3301, 'Moneda Antigua'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
        situacionales: [[3050, 'Heraldo de Zeke'], [3222, 'Crisol de Mikael'], [3069, 'Emblema de la Ascensión'], [3110, 'Corazón de Hielo']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura contra los ataques básicos del ADC rival.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18. Cuerpo para tanquear los ganchos y habilidades dirigidas al carry.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano contra soportes de poke mágico.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Oro x3', detalle: '+3 de oro por 10 segundos. La economía clásica del soporte sin farm.' }
      },
      maestrias: {
        reparto: '0/9/21',
        clave: 'Utilidad total: oro, visión y enfriamientos',
        arboles: [
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' },
          { arbol: 'Utilidad', puntos: 21, detalle: 'Perspicacia del Invocador, Meditación, Explorador, Avaricia, Riqueza, Carterista, Cerebro.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      stats: 'B Tier · 50.49% WR · LoL Classic parche 26.15',
      fuentes: [
        ['https://www.metasrc.com/lol/classic/champions/taric/build', 'MetaSRC — Taric Support en LoL Classic'],
      ],
      plan: {
        early: 'Nivel 2 antes que el rival = aturdimiento gratis. Mantén el arbusto del río con visión desde el minuto 2 y castiga cada posicionamiento agresivo con E + Agotamiento.',
        mid: 'Rota con tu equipo pegado al tirador. La Piedra de Visión convierte cada base en tres wards nuevos: el mapa es tu responsabilidad.',
        late: 'Guarda E para el asesino que salte sobre tu carry y el Medallón Solari para el pico de daño en área. Un solo aturdimiento tuyo en el objetivo correcto gana la pelea.'
      },
      tips: [
        'Aturde (E) cuando el enemigo gaste su dash o esté fijado en un last hit: 1.5 segundos dan para el combo entero de tu ADC.',
        'La activa de W destroza armadura en área: úsala en cada 2v2, no la reserves.',
        'Radiance también es herramienta defensiva: el burst de área bajo torre disuade cualquier dive.',
        'Con Botas de Movilidad puedes wardear el río enemigo entre oleadas sin perder experiencia.'
      ]
    },
    {
      name: 'Support — Filosofal + Shurelya',
      season: 'S2',
      parche: '3.6.14',
      role: 'Support',
      style: 'Tanque / Utility',
      difficulty: 'Baja',
      resumen: 'El soporte de la vieja escuela, cuando los wards se compraban de cinco en cinco y el oro caía gota a gota de la Piedra Filosofal. Aegis para el aura, Shurelya para las cargas de equipo y bolsillos siempre vacíos: todo el oro era para la visión.',
      items: {
        inicio: [[3096, 'Piedra Filosofal'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[3105, 'Protección de la Legión'], [3117, 'Botas de Movilidad'], [3069, 'Ensueño de Shurelya'], [2045, 'Piedra de Visión de Rubí']],
        situacionales: [[3190, 'Medallón Solari de Hierro'], [3110, 'Corazón de Hielo'], [3222, 'Crisol de Mikael'], [3060, 'Estandarte de Mando']]
      },
      stats: 'Itemización recomendada también por MetaSRC en Classic 26.15',
      fuentes: [
        ['https://www.metasrc.com/lol/classic/champions/taric/build', 'MetaSRC — Taric Support en LoL Classic (Shurelya, Aegis, Solari)'],
      ],
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura: el 2v2 de bot de la Season 2 era una guerra de autoataques.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Oro x9', detalle: 'Oro por segundo en runas: la economía del soporte antes de los objetos de misión.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Oro x3', detalle: '+3 de oro por 10 segundos. Combinadas con la Filosofal, tu sueldo fijo.' }
      },
      maestrias: {
        reparto: '0/9/21',
        clave: 'La página de utilidad de la vieja guardia',
        arboles: [
          { arbol: 'Defensa', puntos: 9, detalle: 'Resistencia, Dureza, Perseverancia.' },
          { arbol: 'Utilidad', puntos: 21, detalle: 'Avaricia, Perspicacia del Invocador, Meditación, Explorador, Riqueza, Fuerza Espiritual, Cerebro.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Piedra Filosofal al minuto 1 y a vivir de las regeneraciones. Cada viaje a base son 2-3 wards: el río y el trybush viven iluminados.',
        mid: 'Aegis antes del minuto 20 convierte cada pelea por dragón en un 5v5 con ventaja de auras. Camina delante de tu carry, siempre.',
        late: 'La activa de Shurelya decide persecuciones y retiradas enteras: úsala para iniciar en bloque o para deshacer una iniciación rival.'
      },
      tips: [
        'En la era S2 el soporte compraba TODOS los wards: presupuesta 300-400 de oro por base y el resto es lujo.',
        'La Piedra Filosofal se recicla más tarde en Shurelya: no es oro perdido, es una inversión.',
        'El aura de Aegis apila con el Medallón Solari: tu botlane se vuelve inmune al poke en el 2v2.',
        'Agotamiento sobre el ADC rival en cada pelea larga: en esta época no había Cimitarra que lo limpiara.'
      ]
    }
  ],

  garen: [
    {
      name: 'Top — Warmog + Atma (Clásico)',
      season: 'S3',
      role: 'Top',
      style: 'Tanque / Juggernaut',
      difficulty: 'Baja',
      resumen: 'El combo más icónico de la época clásica: Armadura de Warmog para la vida y Empalador de Atma para convertir esa vida en daño de ataque. Garen gira, aguanta y ejecuta, con una fase de líneas casi imposible de perder gracias a su pasiva.',
      items: {
        inicio: [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3068, 'Capa de Fuego Solar'], [3111, 'Botas de Mercurio'], [3083, 'Armadura de Warmog'], [3005, 'Empalador de Atma']],
        situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3075, 'Malla de Espinas'], [3071, 'La Cuchilla Negra']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD. Decisivo (Q) castiga desde el nivel 1 y el last hit se vuelve trivial.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura. Intercambios gratis contra cualquier top AD.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18 para el mid game.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD. Más presión en cada Decisivo.' }
      },
      maestrias: {
        reparto: '9/21/0',
        clave: 'Muro demaciano con toque ofensivo',
        arboles: [
          { arbol: 'Ofensa', puntos: 9, detalle: 'Furia, Carnicero, Pericia con las Armas.' },
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Inflexible, Guardia de Honor.' }
        ]
      },
      hechizos: [['SummonerTeleport', 'Teleportación'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'Q', 'W'],
      plan: {
        early: 'Intercambia con Q (rompe ralentizaciones y silencia) y sal girando con E. Entre intercambios, retírate a los arbustos: tu pasiva regenera lo que el rival no puede recuperar.',
        mid: 'Con Capa de Fuego Solar + Warmog eres imparable en línea. Empuja y usa Teleportación para llegar el primero a cada pelea por el dragón.',
        late: 'Tu trabajo es girar sobre sus carries y ejecutar con R al que huya con la vida justa. Atma convierte tus ~4000 de vida en un AD sorprendente.'
      },
      tips: [
        'La ejecución de Justicia Demaciana (R) hace daño verdadero según la vida que le falte al rival: apréndete el umbral y remata bajo torre sin miedo.',
        'Q elimina ralentizaciones al activarla: guárdala para escapar de redes y trampas antes que para iniciar.',
        'Girar (E) hace daño máximo a un solo objetivo: pégate al carry, no al tanque.',
        'Si el top rival es AP (Vladimir, Rumble), cambia el orden: Rostro Espiritual antes que Warmog.'
      ]
    }
  ],

  malphite: [
    {
      name: 'Top — Roca anti-AD',
      season: 'S3',
      role: 'Top',
      style: 'Tanque / Iniciador',
      difficulty: 'Baja',
      resumen: 'La pesadilla de todo tirador: armadura que alimenta el daño de Golpe Sísmico, un debuff de velocidad de ataque del 50% y la iniciación más limpia del juego. Contra composiciones AD, Malphite convierte la pelea en un monólogo.',
      items: {
        inicio: [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3068, 'Capa de Fuego Solar'], [3047, 'Tabi de Ninja'], [3110, 'Corazón de Hielo']],
        situacionales: [[3075, 'Malla de Espinas'], [3143, 'Presagio de Randuin'], [3001, 'Cetro Abisal'], [3065, 'Rostro Espiritual']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura. Cada punto alimenta el escudo de tu pasiva y el daño de tu E.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura. Tu W la convierte directamente en daño de área.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18 — tu único punto débil, cubierto.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Armadura x3', detalle: '+12.9 de armadura. Full roca, sin disculpas.' }
      },
      maestrias: {
        reparto: '0/21/9',
        clave: 'Tanque puro con utilidad',
        arboles: [
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
        ]
      },
      hechizos: [['SummonerTeleport', 'Teleportación'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'Q', 'W'],
      plan: {
        early: 'Contra AD, intercambia con E (les corta la velocidad de ataque a la mitad) y mantén el escudo de la pasiva entre oleadas. Contra AP, farmea a distancia con Q y espera objetos.',
        mid: 'Corazón de Hielo + Capa de Fuego Solar te hacen literalmente inmune al top AD. Busca la Fuerza Imparable (R) sobre dos o más en cada pelea de dragón.',
        late: 'Tu única misión: R sobre el carry enemigo en el momento exacto. No la gastes en iniciar 1v0 — espera a que tu equipo esté a rango de seguimiento.'
      },
      tips: [
        'Fuerza Imparable es exactamente eso: imparable. Ni aturdimientos ni desplazamientos la cortan una vez lanzada.',
        'Destello + R en el mismo instante no da tiempo de reacción: practícalo en el modo práctica.',
        'Tu Q roba velocidad de movimiento: es tu herramienta anti-kiteo y de persecución.',
        'Contra un carril perdido, recuerda: escalas con solo comprar armadura. El mid game te espera.'
      ]
    }
  ],

  leesin: [
    {
      name: 'Jungla — Lagarto Anciano (Early)',
      season: 'S3',
      role: 'Jungla',
      style: 'Peleador / Gank',
      difficulty: 'Alta',
      resumen: 'El rey de la jungla de la Season 3. El Espíritu del Lagarto Anciano añade daño verdadero ardiente a un kit que ya gana cualquier intercambio antes del minuto 20. Ganks desde el nivel 2, mecánicas infinitas y la patada que define partidas.',
      items: {
        inicio: [[1039, 'Machete del Cazador'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[1080, 'Piedra Espiritual'], [3209, 'Espíritu del Lagarto Anciano'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
        situacionales: [[3026, 'Ángel de la Guarda'], [3068, 'Capa de Fuego Solar'], [3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD. Clear más rápido y ganks nivel 2-3 que ya quitan media vida.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura. Imprescindibles para sobrevivir a los campamentos tempranos.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM para invadir sin miedo al mid rival.' },
        quinta: { img: 'bl_2_1.png', nombre: 'Quintaesencias de Velocidad de Ataque x3', detalle: '+10.2% de velocidad de ataque. La pasiva de doble golpe fluye entre habilidades.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Daño físico y sostenimiento en jungla',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Letalidad, Hendidura, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Piel Dura.' }
        ]
      },
      hechizos: [['SummonerSmite', 'Castigo'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Ruta roja → azul → gank. Antes del minuto 10 deberías haber visitado los tres carriles: tu early es tu ventana, y cada gank convertido es una línea ganada.',
        mid: 'Con Lagarto Anciano y Cuchilla Negra sigues ganando cualquier 1v1. Controla la visión del dragón y castiga cada error de posicionamiento con Q-Q.',
        late: 'Tu daño decae: conviértete en el iniciador. Un insec limpio sobre el ADC rival vale más que cualquier cifra de daño.'
      },
      tips: [
        'Ward-jump (W a un guardián propio) es tu herramienta de entrada Y de salida: compra siempre un ward de más.',
        'El insec: salta detrás del carry (ward o Destello) y patéalo (R) hacia tu equipo. Decide peleas enteras.',
        'Q tiene dos partes: la segunda hace más daño cuanta menos vida tenga el objetivo. Para ejecutar, retrasa la reactivación.',
        'La E revela y ralentiza: úsala en arbustos y sobre invisibles (Shaco, Evelynn) antes que como daño.'
      ]
    },
    {
      name: 'Jungla — Wriggle (Vieja escuela)',
      season: 'S2',
      parche: '3.6.14',
      role: 'Jungla',
      style: 'Peleador / Contra-jungla',
      difficulty: 'Alta',
      resumen: 'El Lee Sin que rompió la Season 2: Armadura de Tela y cinco pociones, Farol Inquieto para el sustain y el ward gratis, y El Embrutecedor para que cada Q escociera. La jungla de la época era pobre en oro y experiencia — Lee la ignoraba viviendo en los carriles y en la jungla enemiga.',
      items: {
        inicio: [[1029, 'Armadura de Tela'], [2003, 'Poción de Vida'], [2003, 'Poción de Vida'], [2003, 'Poción de Vida']],
        core: [[3154, 'Farol Inquieto'], [3111, 'Botas de Mercurio'], [3134, 'El Embrutecedor'], [3083, 'Armadura de Warmog']],
        situacionales: [[3026, 'Ángel de la Guarda'], [3068, 'Capa de Fuego Solar'], [3005, 'Empalador de Atma'], [3123, 'Llamada del Verdugo']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración de Armadura x9', detalle: 'La firma de la S2: tu Q y tus autos ignoraban la armadura runeada del rival.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: 'Imprescindibles con los campamentos de la época, que pegaban como campeones.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: 'RM plana para invadir al mid rival sin despeinarse.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: 'En la S2 la velocidad de movimiento en jungla valía más que el oro.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Ofensa física de la vieja guardia',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Fuerza Bruta, Letalidad, Hendidura, Verdugo — el 21 de ofensa de 2012.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Resistencia, Dureza, Perseverancia — para sobrevivir al primer clear.' }
        ]
      },
      hechizos: [['SummonerSmite', 'Castigo'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Clear mínimo y a invadir: el Lee de la S2 vivía en la jungla enemiga. El ward del Farol Inquieto en su azul te avisa de cada rotación.',
        mid: 'Con Embrutecedor y botas eres el matón del río. Cada dragón es tuyo: Castigo + el daño del Farol lo aseguran antes que nadie.',
        late: 'Warmog + Atma te reciclan en peleador tardío: inicia con la patada al carry y deja que los fed limpien.'
      },
      tips: [
        'En la S2 los junglas iban permanentemente pobres: cada kill de contra-jungla vale doble.',
        'El Farol Inquieto pone un ward gratis cada 3 minutos: dragón al empezar, luego el paso del río.',
        'El Embrutecedor era el objeto de todos los AD de la época: barato, con pen. de armadura y CDR.',
        'Ward-jump ya existía y ya era injusto: la mecánica que definió a Lee Sin nació aquí.'
      ],
      fuentes: [
        ['https://leagueoflegends.fandom.com/es/wiki/Lee_Sin', 'Wiki de LoL — historial de Lee Sin']
      ]
    }
  ],

  masteryi: [
    {
      name: 'Jungla — Wriggle + Crítico',
      season: 'S3',
      role: 'Jungla',
      style: 'Asesino / Hipercarry',
      difficulty: 'Baja',
      resumen: 'El hipercarry clásico de jungla: Farol Inquieto para farmear sin despeinarse y una curva de crítico que termina en pentakills. Alpha Strike esquiva lo inesquivable y Highlander convierte cada asesinato en el siguiente.',
      items: {
        inicio: [[1039, 'Machete del Cazador'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3154, 'Farol Inquieto'], [3006, 'Grebas de Berserker'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral']],
        situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras'], [3172, 'Céfiro']]
      },
      runas: {
        marca: { img: 'r_3_1.png', nombre: 'Marcas de Velocidad de Ataque x9', detalle: '+15.3% de velocidad de ataque. Campamentos enteros fundidos en segundos.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para el primer clear sin sangrar.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD que multiplica el crítico del Filo Infinito.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Crítico, frenesí y ejecución',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Frenesí, Letalidad, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Piel Dura.' }
        ]
      },
      hechizos: [['SummonerSmite', 'Castigo'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Farmea. En serio: farmea. El Farol Inquieto te da sustain infinito y un ward gratis. Gankea solo carriles ya ganados o con CC garantizado.',
        mid: 'Con Filo Infinito eres una amenaza real. Sigue farmeando la jungla enemiga y entra a las peleas que tu equipo ya haya iniciado.',
        late: 'Espera. Deja que gasten el CC en tu frontline, entra por el flanco, y deja que Highlander encadene los resets. Nadie limpia una pelea como Yi.'
      },
      tips: [
        'Alpha Strike (Q) te saca del juego un instante: úsala para esquivar la ultimate de Malphite o la jaula de Veigar.',
        'Cada asesinato o asistencia reduce los enfriamientos de Highlander: piensa en cadena, no en objetivo único.',
        'Meditar (W) reduce muchísimo daño: canalízala bajo torre para tanquear un disparo o dos y sorprender.',
        'El ward gratuito del Farol Inquieto en el dragón te da control de objetivos sin gastar oro.'
      ]
    }
  ],

  ahri: [
    {
      name: 'Mid — Tenaza + Encanto (Asesina)',
      season: 'S3',
      role: 'Mid',
      style: 'Maga / Asesina',
      difficulty: 'Media',
      resumen: 'El terror del mid clásico: Encanto seguido de Tenaza de Muerte Ígnea significa que cualquier campeón sin flash está muerto. Tres dashes de ultimate para entrar, ejecutar y salir con una sonrisa.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3128, 'Tenaza de Muerte Ígnea'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3001, 'Cetro Abisal']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica para que el combo entre sin descuentos.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura contra asesinos AD que dominan el mid clásico.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18. Escalado puro para el mid game.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP planos desde el minuto 1.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Ofensa arcana con movilidad',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Errante.' }
        ]
      },
      hechizos: [['SummonerDot', 'Ignición'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Empuja con Q (el retorno hace daño verdadero) y busca el Encanto cuando el rival pise tu mitad del carril. Encanto acertado antes del 6 = Ignición y first blood.',
        mid: 'Con la Tenaza completada, un Encanto es una sentencia: Tenaza → E → Q → W → Ignición. Rota a los laterales con la ultimate disponible.',
        late: 'Caza al carry con R: dos dashes para entrar y ejecutar, uno SIEMPRE reservado para salir. La avaricia con el tercer dash es la única forma de morir con Ahri.'
      },
      tips: [
        'El daño verdadero del retorno de Q ignora toda resistencia: golpea con las dos direcciones siempre que puedas.',
        'Encanto interrumpe dashes en curso: puedes parar la carga de Malphite con el proyectil justo.',
        'La activa de la Tenaza antes del combo amplifica todo un 20%: orden estricto, Tenaza primero.',
        'Sin Encanto disponible no hay pelea: es tu iniciación, tu peel y tu sentencia, todo en un proyectil lento.'
      ]
    }
  ],

  lux: [
    {
      name: 'Mid — Artillería (Athene + Rabadon)',
      season: 'S3',
      role: 'Mid',
      style: 'Maga / Poke',
      difficulty: 'Baja',
      resumen: 'Artillería demaciana de largo alcance: el Grial de Athene soluciona el maná para siempre y a partir de ahí cada Chispa Final que cruza la pantalla borra una barra de vida. Raíz doble, escudo de área y ejecuciones desde la niebla de guerra.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3128, 'Tenaza de Muerte Ígnea'], [3116, 'Cetro de Cristal de Rylai']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica en cada chispa.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para aguantar asesinos y ganks.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP para que el poke escueza desde el nivel 1.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Burst a máxima distancia',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
        ]
      },
      hechizos: [['SummonerBarrier', 'Barrera'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'Q', 'W'],
      plan: {
        early: 'Poke con E detonada al máximo alcance y guarda Q para cuando la jungla asome. Con Athene a los ~20 minutos, el maná deja de existir como concepto.',
        mid: 'Agrupa con tu equipo y castiga cada agrupación enemiga: E + auto + Q + R borra al 60% de vida. Tu alcance decide dónde se pelea.',
        late: 'Chispa Final con enfriamiento mínimo: úsala para abrir peleas, robar barones o ejecutar fugitivos a través del mapa. Nunca camines delante de tu frontline.'
      },
      tips: [
        'Detona la pasiva con un ataque básico tras CADA habilidad: es un tercio de tu daño total.',
        'Q atrapa a dos: raíz doble en peleas apretadas vale una ultimate.',
        'R revela el área: úsala como ward de emergencia sobre el dragón antes de que tu equipo llegue.',
        'Barrera anula el burst de los asesinos del mid clásico: guárdala exactamente para eso.'
      ]
    }
  ],

  ashe: [
    {
      name: 'ADC — Utility carry',
      season: 'S3',
      role: 'ADC',
      style: 'Tiradora / Utility',
      difficulty: 'Baja',
      resumen: 'La reina del kiteo clásico: ralentización permanente con Escarcha, visión gratuita con el Halcón y una flecha global que inicia peleas desde la pantalla de carga. No necesita mecánicas imposibles — necesita posicionamiento perfecto.',
      items: {
        inicio: [[1055, 'Espada de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3031, 'Filo Infinito'], [3006, 'Grebas de Berserker'], [3046, 'Bailarín Espectral']],
        situacionales: [[3072, 'La Sanguinaria'], [3035, 'Últimas Palabras'], [3026, 'Ángel de la Guarda'], [3139, 'Cimitarra Mercurial']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD. Last hits limpios y poke con Disparo Certero.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para el 2v2 eterno de la botlane.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18, cuando los magos empiezan a buscarte.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Daño sostenido y ejecución',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Frenesí, Letalidad, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
        ]
      },
      hechizos: [['SummonerHeal', 'Curación'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      plan: {
        early: 'Farmea con la ralentización de Escarcha activa: nadie puede intercambiar contigo si no te alcanza. Halcón al río antes de cada oleada importante.',
        mid: 'Tu flecha abre el mapa: coordinada con tu jungla convierte cualquier pick en 5v4. Kitea siempre hacia tu equipo, nunca en línea recta hacia atrás.',
        late: 'Eres el daño principal Y la iniciación: flecha al carry, kiteo perfecto y deja que Bailarín Espectral haga su magia entre las colisiones.'
      },
      tips: [
        'La Flecha de Cristal Encantado aturde más segundos cuanto más lejos viaje: desde media pantalla son 3.5 segundos.',
        'El Halcón (E) es un ward gratis: dragón, barón y arbustos antes de cada objetivo, siempre.',
        'Volea (W) aplica la ralentización de Escarcha en cono: es tu herramienta de poke y de kiteo masivo.',
        'Sin escapes en el kit: tu Destello es sagrado. Guárdalo para el asesino, no para ganar 200 de oro.'
      ]
    },
    {
      name: 'ADC — Old School (crítico)',
      season: 'S1',
      parche: '3.6.14',
      role: 'ADC',
      style: 'Tiradora / Crítico',
      difficulty: 'Baja',
      resumen: 'La Ashe de los orígenes, cuando el juego se decidía a base de ataques básicos y la palabra "kiteo" acababa de inventarse. Botas y tres pociones, Filo Infinito directo y a rezar para que el crítico saliera en el momento justo. Sin trinkets, sin objetos de soporte: solo tú, tu arco y el mapa a oscuras.',
      items: {
        inicio: [[1001, 'Botas de Velocidad'], [2003, 'Poción de Vida'], [2003, 'Poción de Vida'], [2003, 'Poción de Vida']],
        core: [[3006, 'Grebas de Berserker'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral'], [3072, 'La Sanguinaria']],
        situacionales: [[3035, 'Últimas Palabras'], [3026, 'Ángel de la Guarda'], [2043, 'Guardián de Visión Total']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración de Armadura x9', detalle: 'La marca reina de la Season 1: atravesaba la armadura base de todo el mundo.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: 'Armadura plana, el único seguro de vida de la época.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: 'RM plana contra los nukes mágicos que dominaban el juego primitivo.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Vida x3', detalle: '+78 de vida al nivel 1: en la S1 los first bloods se regalaban.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'El árbol de Ofensa primitivo',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Conocimiento Arcaico, Letalidad, Precisión, Golpe de Gracia — la ofensa de 2010, sin florituras.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Avaricia, Buena Fortuna, Perspicacia — oro y regeneración para no volver a base.' }
        ]
      },
      hechizos: [['SummonerHeal', 'Curación'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      plan: {
        early: 'En la S1 la botlane ni siquiera era estándar: farmea donde te dejen y compra un Guardián de Visión Total si sospechas de ganks — nadie más wardea por ti.',
        mid: 'Filo Infinito completado = empieza tu partida. Agrupa con tu equipo: las peleas de la S1 eran 5v5 caóticos en mid desde el minuto 20.',
        late: 'Kitea alrededor de tu frontline y deja que los críticos del 250% decidan. Tu flecha sigue siendo la mejor iniciación del juego... desde 2010.'
      },
      tips: [
        'En la Season 1 los tiradores no tenían soporte pegado: la visión propia era cuestión de supervivencia.',
        'La Sanguinaria con cargas completas daba más AD que cualquier objeto: protégela como si fuera tu vida.',
        'El crítico de la época era puro azar sin pity timer: Filo Infinito lo subía al 250% de daño.',
        'Volea aplicaba Escarcha ya entonces: el kiteo eterno de Ashe es literalmente fundacional.'
      ],
      fuentes: [
        ['https://leagueoflegends.fandom.com/es/wiki/Ashe', 'Wiki de LoL — historial de Ashe desde la beta']
      ]
    }
  ],

  soraka: [
    {
      name: 'Support — Batería de maná (Clásica)',
      season: 'S3',
      role: 'Support',
      style: 'Enchanter / Sostenimiento',
      difficulty: 'Baja',
      resumen: 'La Soraka original, la de verdad: Infundir da maná al aliado o silencia al rival, Bendición Astral cura Y da armadura, y Llamada Estelar destroza la resistencia mágica en área. La botlane nunca se queda sin recursos con la Hija de las Estrellas.',
      items: {
        inicio: [[3301, 'Moneda Antigua'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
        situacionales: [[3222, 'Crisol de Mikael'], [3050, 'Heraldo de Zeke'], [3069, 'Emblema de la Ascensión'], [3028, 'Cáliz de Armonía']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica: Llamada Estelar pokea de verdad.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18 para aguantar el foco enemigo.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Oro x3', detalle: '+3 de oro por 10 segundos.' }
      },
      maestrias: {
        reparto: '0/9/21',
        clave: 'Curación, maná y economía',
        arboles: [
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' },
          { arbol: 'Utilidad', puntos: 21, detalle: 'Perspicacia del Invocador, Meditación, Fuerza Espiritual, Avaricia, Riqueza, Inteligencia, Cerebro.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'E', 'Q'],
      plan: {
        early: 'Infusión (E) sobre tu ADC cada vez que baje de la mitad de maná: tu tirador lanza el doble de habilidades que el suyo. Cura (W) fuera del rango de poke.',
        mid: 'Con el Medallón y la Piedra de Visión eres una fortaleza de sostenimiento. Apila Llamada Estelar en las peleas: el shred de RM multiplica el daño de tus magos.',
        late: 'Deseo (R) es global: vigila TODAS las barras de vida del mapa. Silencia al asesino en el instante en que salte y deja que tu equipo haga el resto.'
      },
      tips: [
        'Infundir sobre un rival lo silencia: corta la teleportación de Twisted Fate o la canalización de Katarina.',
        'Cada impacto de Llamada Estelar apila la reducción de RM: en peleas largas tu poke se vuelve exponencial.',
        'Bendición Astral da armadura además de vida: cúrate a ti misma ANTES del intercambio, al aliado DURANTE.',
        'Un Deseo global en el momento justo deshace la ignición del top rival al otro lado del mapa. Mirar el minimapa es tu mecánica.'
      ]
    }
  ],

  jax: [
    {
      name: 'Top — Trinidad + Guinsoo',
      season: 'S3',
      role: 'Top',
      style: 'Peleador / Hipercarry',
      difficulty: 'Media',
      resumen: 'El duelista definitivo de la Season 3: Fuerza de Trinidad para el proc de Brillo tras cada habilidad y Hoja de Furia de Guinsoo para escalar hacia el 1v5. Contraataque (E) esquiva todos los autoataques mientras tú devuelves cada golpe multiplicado — con Jax no existen los intercambios justos.',
      items: {
        inicio: [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3124, 'Hoja de Furia de Guinsoo']],
        situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3153, 'Hoja del Rey Arruinado']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD. El Golpe Potenciado (W) y cada proc de Trinidad escalan directo.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para la guerra de desgaste del carril superior.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18 — tu ultimate ya te da resistencias al pelear.' },
        quinta: { img: 'bl_2_1.png', nombre: 'Quintaesencias de Velocidad de Ataque x3', detalle: '+10.2% de velocidad de ataque: más pasiva, más Guinsoo, más dolor.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Ofensa híbrida de duelista',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Frenesí, Hendidura, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
        ]
      },
      hechizos: [['SummonerDot', 'Ignición'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      plan: {
        early: 'Respeta los niveles 1-3 y pesca intercambios con E (aturde) + W + Q de salida. Tu pasiva convierte los intercambios largos en victorias automáticas.',
        mid: 'Con Trinidad completada, dueleas a cualquiera: fuerza el 1v1 en top y usa el aturdimiento de Contraataque contra los ganks dobles.',
        late: 'Salta al carry con Q, esquiva su equipo entero con E y deja que Guinsoo apile. Si te enfocan, tu equipo limpia gratis; si no, limpias tú.'
      },
      tips: [
        'Contraataque (E) esquiva TODOS los ataques básicos durante 2 segundos: actívalo justo cuando el ADC rival empiece a atacarte.',
        'El Salto (Q) también funciona sobre wards y aliados: la vía de escape que nadie espera.',
        'La ultimate pasiva pega cada tercer golpe: cuenta los autos antes de iniciar el intercambio.',
        'Contra Teemo o Jayce, adelanta las Botas de Mercurio y espera al 6: tu ultimate activa da armadura y RM.'
      ]
    }
  ],

  vayne: [
    {
      name: 'ADC — Rey Arruinado (Cazadora)',
      season: 'S3',
      role: 'ADC',
      style: 'Tiradora / Hipercarry',
      difficulty: 'Alta',
      resumen: 'La cazadora nocturna que define el término hipercarry: daño verdadero porcentual con la W, redoble invisible con la ultimate y un rodar que esquiva lo imposible. La Hoja del Rey Arruinado la convierte en la ejecutora de tanques por excelencia de la Season 3.',
      items: {
        inicio: [[1055, 'Espada de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3153, 'Hoja del Rey Arruinado'], [3006, 'Grebas de Berserker'], [3046, 'Bailarín Espectral'], [3031, 'Filo Infinito']],
        situacionales: [[3026, 'Ángel de la Guarda'], [3072, 'La Sanguinaria'], [3035, 'Últimas Palabras'], [3139, 'Cimitarra Mercurial']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD. Tu rango corto exige que cada auto robado en línea cuente.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura: sobrevivir el early es tu única misión.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
        quinta: { img: 'bl_2_1.png', nombre: 'Quintaesencias de Velocidad de Ataque x3', detalle: '+10.2% de velocidad de ataque: más procs de Filos de Plata (W).' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Daño sostenido y ejecución',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Frenesí, Letalidad, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
        ]
      },
      hechizos: [['SummonerHeal', 'Curación'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Tu fase de líneas es la peor del juego: roba autos con Q cuando el rival farmee, y jamás pelees sin la Condena (E) lista para clavarlo contra un muro.',
        mid: 'Rey Arruinado completado = empiezas a existir. Los 3 procs de W hacen daño verdadero del 8% de vida máxima: los tanques dejan de ser un problema.',
        late: 'Eres la razón por la que tu equipo gana o pierde. Rodar entre autos, ultimate para el sigilo en el caos y a fundir todo lo que se mueva — el posicionamiento lo es todo.'
      },
      tips: [
        'Condena (E) contra muro aturde 1.5 segundos: es tu anti-asesino, no una herramienta de daño.',
        'Rodar (Q) resetea el temporizador del autoataque: auto → Q → auto es tu combo básico eterno.',
        'Durante la ultimate, Rodar te hace invisible un instante: los clicks del rival se pierden.',
        'Nunca uses Rodar para entrar: es tu única salida. Entrar entra tu equipo; tú ejecutas desde atrás.'
      ]
    }
  ],

  blitzcrank: [
    {
      name: 'Support — El Gancho (Playmaker)',
      season: 'S3',
      role: 'Support',
      style: 'Tanque / Pick',
      difficulty: 'Media',
      resumen: 'El soporte más aterrador de la botlane clásica: un gancho acertado es un kill al 80% en cualquier minuto de la partida. Blitzcrank no juega a proteger — juega a decidir quién muere y cuándo, y toda la línea enemiga farmea temblando detrás de sus súbditos.',
      items: {
        inicio: [[3301, 'Moneda Antigua'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
        situacionales: [[3110, 'Corazón de Hielo'], [3050, 'Heraldo de Zeke'], [3222, 'Crisol de Mikael'], [3069, 'Emblema de la Ascensión']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura para plantarte delante de su ADC sin miedo.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18: tu escudo pasivo escala con el maná, tu cuerpo con esto.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: sumada a Sobrecarga (W), nadie escapa del robot.' }
      },
      maestrias: {
        reparto: '0/9/21',
        clave: 'Utilidad con presencia física',
        arboles: [
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' },
          { arbol: 'Utilidad', puntos: 21, detalle: 'Perspicacia del Invocador, Meditación, Explorador, Avaricia, Riqueza, Carterista, Cerebro.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Cada gancho lanzado es presión aunque falle: el ADC rival pierde farm solo por esquivarlo. Gancho → Golpe de Poder (E) → Agotamiento es first blood en el 90% de las botlanes.',
        mid: 'Rota por el río buscando picks: un gancho en niebla de guerra convierte cualquier objetivo neutral en un 5v4. Tu ultimate silencia en área: úsala sobre el mid en cada escaramuza.',
        late: 'Un solo gancho al carry gana la partida — y todos lo saben. A veces tu mejor jugada es amenazarlo sin lanzarlo: el miedo también controla zonas.'
      },
      tips: [
        'Agarre de Cohete + Destello en el aire reposiciona el gancho: la mecánica más asesina del soporte clásico.',
        'Golpe de Poder (E) resetea tu autoataque: gancho → auto → E es daño doble instantáneo.',
        'Tu pasiva te da un escudo del 50% del maná al llegar bajo: a veces tanquear la torre un segundo más gana el dive.',
        'La ultimate rompe escudos pasivos (Banshee) desde lejos: ábrela antes del gancho importante.'
      ]
    }
  ],

  kassadin: [
    {
      name: 'Mid — Caminante del Vacío',
      season: 'S3',
      role: 'Mid',
      style: 'Asesino mágico / Escalado',
      difficulty: 'Media',
      resumen: 'El anti-mago definitivo de la Season 3: pasa el early a base de Lágrima y paciencia, y a partir del nivel 11 se teletransporta cada 4 segundos borrando carries. Contra un Kassadin con objetos, la única estrategia era acabar la partida antes — y con Bastón del Arcángel, nadie llegaba a tiempo.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3070, 'Lágrima de la Diosa'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3001, 'Cetro Abisal'], [3116, 'Cetro de Cristal de Rylai']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica para que la Esfera del Vacío ejecute limpio.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura contra los AD que te buscan antes del 11.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM: junto a tu pasiva y tu Q, los magos no pueden contigo.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP para que el early duela un poco menos.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Escalado arcano con maná',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida — maná, maná y más maná.' }
        ]
      },
      hechizos: [['SummonerDot', 'Ignición'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Sobrevive. Lágrima al primer retorno, Q para farmear a distancia y su escudo para absorber el poke. Los niveles 1-10 son tu peaje: págalo con humildad.',
        mid: 'Nivel 11 con dos puntos en R: empiezas a existir en todo el mapa. Roama con Paso del Vacío a los laterales — cada asesinato fuera de mid acelera tu bola de nieve.',
        late: 'Riftwalk apilada + Arcángel lleno = borras a un carry cada 4 segundos desde ángulos imposibles. Entra, mata, sal; si hay problemas, Zhonya y tu equipo llega.'
      },
      tips: [
        'La Esfera del Vacío (Q) interrumpe canalizaciones y da un escudo mágico: tu counter natural contra Katarina.',
        'Cada carga de Riftwalk duplica su coste pero suma daño: gestiona el maná como munición.',
        'El Bastón del Arcángel convierte todo ese maná en AP: Lágrima temprana, siempre, aunque retrase las botas.',
        'Contra ganks, guarda SIEMPRE maná para un Riftwalk: eres el campeón más difícil de atrapar del juego... si tienes azul.'
      ]
    }
  ],

  katarina: [
    {
      name: 'Mid — Reseteos (Asesina)',
      season: 'S3',
      role: 'Mid',
      style: 'Asesina / Área',
      difficulty: 'Alta',
      resumen: 'La asesina sin maná que convierte una pelea igualada en una pentakill: cada asesinato o asistencia resetea todas sus habilidades. Con Zhonya para sobrevivir el foco y la Muerte de Loto girando en el momento exacto, Katarina no busca peleas justas — busca peleas empezadas.',
      items: {
        inicio: [[1001, 'Botas de Velocidad'], [2003, 'Poción de Vida'], [2003, 'Poción de Vida'], [2003, 'Poción de Vida']],
        core: [[3020, 'Botas de Hechicero'], [3157, 'Reloj de Arena de Zhonya'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3135, 'Bastón del Vacío'], [3001, 'Cetro Abisal'], [3128, 'Tenaza de Muerte Ígnea'], [3026, 'Ángel de la Guarda']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica en cada daga y cada giro.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para el cuerpo a cuerpo constante del kit.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18: tu mid game es tu ventana, tu late la remata.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP: el Shunpo del nivel 3 ya asusta.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Burst mágico sin recursos',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza — vas a vivir dentro de su equipo.' }
        ]
      },
      hechizos: [['SummonerDot', 'Ignición'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Sin maná, farmeas con Q sin coste alguno. Busca el nivel 5: Q → Shunpo → W → auto ya quita un tercio de vida y tú vuelves a tu torre riéndote.',
        mid: 'Roama sin parar: cada kill en bot o top con tu ultimate es un reset y una línea rota. Espera a que gasten los CC antes de girar — la Muerte de Loto se canaliza.',
        late: 'Entra la SEGUNDA en cada pelea: primer kill → reset → Shunpo al siguiente → R → reset → limpieza. Zhonya en medio del caos cuando todos te miren.'
      },
      tips: [
        'Tu ultimate se interrumpe con cualquier CC: cuenta los aturdimientos enemigos antes de canalizarla.',
        'Shunpo también salta a aliados, súbditos y wards: llevar un ward encima es llevar un Flash extra.',
        'La pasiva resetea con asistencias, no solo kills: toca a todos los que puedas en la pelea.',
        'Contra silencios (Soraka, Kassadin) espera a que los gasten: una Kata silenciada es una minion cara.'
      ]
    }
  ],

  amumu: [
    {
      name: 'Jungla — Gólem Antiguo (Iniciador)',
      season: 'S3',
      role: 'Jungla',
      style: 'Tanque / Iniciador AP',
      difficulty: 'Baja',
      resumen: 'La momia que gana teamfights llorando: el Espíritu del Gólem Antiguo lo hace incansable en la jungla y su Ofrenda al Dolor es la mejor iniciación de área de la Season 3. Un Vendaje + R sobre tres rivales y la pelea termina antes de empezar.',
      items: {
        inicio: [[1039, 'Machete del Cazador'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[1080, 'Piedra Espiritual'], [3207, 'Espíritu del Gólem Antiguo'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
        situacionales: [[3001, 'Cetro Abisal'], [3157, 'Reloj de Arena de Zhonya'], [3110, 'Corazón de Hielo'], [3143, 'Presagio de Randuin']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: todo tu kit es daño mágico en área.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura, obligatorios para el primer clear.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: llegar al gank medio segundo antes es un Vendaje que sí entra.' }
      },
      maestrias: {
        reparto: '0/21/9',
        clave: 'Tanque de área con utilidad',
        arboles: [
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Celeridad.' }
        ]
      },
      hechizos: [['SummonerSmite', 'Castigo'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'W', 'Q'],
      plan: {
        early: 'Clear completo con E tanqueando los campamentos (reduce el daño físico recibido y se recarga al ser golpeado). Gank solo con Vendaje garantizado: fallar la Q es no gankear.',
        mid: 'Gólem Antiguo + Capa de Fuego Solar: ya eres imparable en la jungla. Vive en el río, controla dragón y castiga cada oleada empujada con Vendaje desde niebla de guerra.',
        late: 'Tu única jugada, y la mejor del juego: Vendaje o Destello sobre 3+, Ofrenda al Dolor, y tu equipo colecciona los cuerpos. Ningún carry pega mientras llora.'
      },
      tips: [
        'La ultimate enraíza Y desarma: los tiradores atrapados no pueden ni autoatacar durante 2 segundos.',
        'Vendaje (Q) se puede lanzar sobre súbditos para reposicionarte: el "insec de pobres" también gana peleas.',
        'Tu W quema % de vida máxima por segundo: contra tanques eres también el daño principal.',
        'Destello + R instantáneo cuando el Vendaje esté en enfriamiento: la momia siempre tiene un plan B.'
      ]
    }
  ],

  sona: [
    {
      name: 'Support — Acordes de Poder',
      season: 'S3',
      role: 'Support',
      style: 'Enchanter / Poke',
      difficulty: 'Baja',
      resumen: 'La virtuosa que gana la línea a base de acordes: poke gratuito con la Q potenciada, curaciones en área y el Crescendo, la ultimate que convierte cinco rivales en espectadores de su propia muerte. Fácil de jugar, imposible de jugar perfecto.',
      items: {
        inicio: [[3301, 'Moneda Antigua'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
        situacionales: [[3222, 'Crisol de Mikael'], [3028, 'Cáliz de Armonía'], [3050, 'Heraldo de Zeke'], [3069, 'Emblema de la Ascensión']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: el poke del Himno del Valor escuece de verdad.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18: eres el objetivo más blando del mapa.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Oro x3', detalle: '+3 de oro por 10 segundos: la economía del soporte clásico.' }
      },
      maestrias: {
        reparto: '0/9/21',
        clave: 'Utilidad y auras',
        arboles: [
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' },
          { arbol: 'Utilidad', puntos: 21, detalle: 'Perspicacia del Invocador, Meditación, Explorador, Avaricia, Riqueza, Carterista, Cerebro.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Q + acorde de poder sobre el ADC rival en cada enfriamiento: ganas la línea a base de sangrías de 100 de vida. El acorde de la Q duplica el daño en el objetivo marcado.',
        mid: 'Alterna auras según la situación: Q para el poke de asedio, W cuando llueva daño, E para las rotaciones. La Piedra de Visión sigue siendo tu trabajo sucio.',
        late: 'El Crescendo decide la partida: guárdalo para 3+ o para el asesino que salte a tu carry. Un buen Flash + R es una teamfight ganada por un solo botón.'
      },
      tips: [
        'Los acordes (cada 3 hechizos) tienen efectos distintos según la canción activa: el de la W reduce el daño del rival marcado.',
        'Tu rango de auras es corto: bailar dentro y fuera de la pelea sin morir es el verdadero arte de Sona.',
        'Crescendo atraviesa toda la pelea: lánzala en línea contra equipos agrupados, no al primero que veas.',
        'Agotamiento + acorde de W sobre el hipercarry rival lo borra del daño de la pelea entera.'
      ]
    }
  ],

  tristana: [
    {
      name: 'ADC — Cañonera (Escalado)',
      season: 'S3',
      role: 'ADC',
      style: 'Tiradora / Hipercarry',
      difficulty: 'Baja',
      resumen: 'La artillera que empieza disparando desde la esquina y termina disparando desde otra pantalla: su alcance crece con cada nivel hasta ser el mayor del juego. Salto de Cohete para escapar (o rematar), y el Puñal de Statikk convirtiendo cada oleada en confeti.',
      items: {
        inicio: [[1055, 'Espada de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3006, 'Grebas de Berserker'], [3087, 'Puñal de Statikk'], [3031, 'Filo Infinito'], [3035, 'Últimas Palabras']],
        situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3046, 'Bailarín Espectral'], [3139, 'Cimitarra Mercurial']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD para el last hit y el poke con la E explosiva.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para el 2v2 de bot.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Crítico y velocidad de ataque',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Frenesí, Letalidad, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
        ]
      },
      hechizos: [['SummonerHeal', 'Curación'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Nivel 1-5 eres fuerte: empuja con la E pasiva (los súbditos explotan) y castiga con saltos agresivos SOLO si el kill es seguro — el salto resetea con cada asesinato.',
        mid: 'Statikk + Filo Infinito y tu alcance ya supera al de cualquier rival: asedia torres desde fuera de su rango de respuesta. Nadie desmonta estructuras como Trist.',
        late: 'Alcance máximo: dispara desde donde ni te ven. Salto de Cohete es tu seguro de vida — guárdalo para el asesino, y recuerda que resetea si consigues la kill.'
      },
      tips: [
        'El Salto de Cohete se reinicia con cada kill o asistencia: en peleas caóticas puedes saltar dos y tres veces.',
        'Tu W + R es un empujón doble: dispara al asesino lejos de ti y salta en dirección contraria.',
        'La carga explosiva (E) en la torre + un par de autos la desmonta en segundos: eres la mejor split-pusher de los ADC.',
        'La ultimate empuja también a los que estén pegados al objetivo: un peel en área disfrazado de daño.'
      ]
    }
  ],

  ezreal: [
    {
      name: 'ADC — Trinidad + Muramana',
      season: 'S3',
      role: 'ADC',
      style: 'Tirador / Poke',
      difficulty: 'Media',
      resumen: 'El explorador que nunca está donde le disparan: Disparo Místico procea la Fuerza de Trinidad a 1100 de rango mientras la Muramana convierte su maná en munición extra. El Ezreal de la Season 3 no gana peleando — gana desgastando hasta que la pelea ya está ganada.',
      items: {
        inicio: [[1055, 'Espada de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3070, 'Lágrima de la Diosa'], [3078, 'Fuerza de Trinidad'], [3006, 'Grebas de Berserker'], [3004, 'Manamune']],
        situacionales: [[3072, 'La Sanguinaria'], [3035, 'Últimas Palabras'], [3026, 'Ángel de la Guarda'], [3139, 'Cimitarra Mercurial']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD: cada Disparo Místico escala al 110% del daño de ataque.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD para el poke desde el minuto 1.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Daño físico a base de habilidades',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Letalidad, Hendidura, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
        ]
      },
      hechizos: [['SummonerBarrier', 'Barrera'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Lágrima temprana y a apilar: cada Q que impacta reduce tus enfriamientos y carga la Lágrima. Farmea con autos, pokea con Q — nunca al revés.',
        mid: 'Trinidad completada: cada Q procea Brillo (+200% del AD base). Tu patrón es Q → auto → reposición eterna. La ultimate limpia oleadas lejanas y abre peleas a través del mapa.',
        late: 'Muramana activa + Q spam = poke de 400 por proyectil. Con Desplazamiento Arcano sobre el hombro eres imposible de atrapar: castiga, desplázate, repite.'
      },
      tips: [
        'Desplazamiento Arcano (E) es tu vida entera: jamás lo uses para dañar si puede servir para escapar.',
        'La Q aplica efectos de objeto (Trinidad, Cuchilla Negra): es un autoataque disfrazado de habilidad.',
        'Apunta la ultimate a las peleas que empiezan a lo lejos: llega antes que tú y ya va haciendo daño.',
        'Tu W acelera la velocidad de ataque aliada: tírasela al Kog\'Maw o al Yi de tu equipo en las peleas.'
      ]
    },
    {
      name: 'Mid — Actual (Primer Golpe)',
      season: 'ACT',
      modo: 'grieta',
      role: 'Mid',
      style: 'Tirador de habilidades',
      difficulty: 'Media',
      resumen: 'El Ezreal moderno vive de Primer Golpe: cada Q que abre un intercambio genera oro extra, y el Cintomisil hextech convierte ese oro en un poke que nadie puede sostener. Sigue siendo el campeón que nunca está donde le disparan.',
      items: {
        inicio: [[1055, 'Espada de Doran'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']],
        core: [[3152, 'Cintomisil hextech'], [3006, 'Grebas de berserker'], [3078, 'Fuerza de trinidad'], [3042, 'Muramana']],
        situacionales: [[6694, 'Rencor de Serylda'], [3036, 'Recuerdos de lord Dominik'], [3139, 'Cimitarra mercurial'], [3026, 'Ángel de la guarda']]
      },
      runasModernas: {
        principal: {
          arbol: 'Inspiración', icon: 'perk-images/Styles/7203_Whimsy.png',
          runas: [
            [8369, 'Primer golpe', 'perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png'],
            [8304, 'Calzado mágico', 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png'],
            [8321, 'Reembolso', 'perk-images/Styles/Inspiration/CashBack/CashBack2.png'],
            [8347, 'Perspicacia cósmica', 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png']
          ]
        },
        secundario: {
          arbol: 'Precisión', icon: 'perk-images/Styles/7201_Precision.png',
          runas: [
            [9111, 'Triunfo', 'perk-images/Styles/Precision/Triumph.png'],
            [9104, 'Leyenda: Presteza', 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png']
          ]
        },
        fragmentos: ['Velocidad de ataque', 'Fuerza adaptativa', 'Vida escalada']
      },
      hechizos: [['SummonerFlash', 'Destello'], ['SummonerDot', 'Ignición']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Abre siempre los intercambios con Q para activar Primer Golpe: el oro extra acelera tu Cintomisil, que es el objeto que define la partida.',
        mid: 'Con Cintomisil y Trinidad, cada Q pega como un objeto entero. Asedia torres desde fuera de rango y rota con la ultimate para asistir a los laterales.',
        late: 'Muramana activa convierte tu maná en daño puro. Nunca entres: castiga desde 1100 de rango y guarda la E como tu único escape real.'
      },
      tips: [
        'Primer Golpe se activa al golpear primero en un combate: la Q a máximo rango es el activador perfecto.',
        'El Cintomisil escala con el oro que ganas: es literalmente un objeto que premia jugar bien la fase de líneas.',
        'La Q sigue aplicando efectos de objeto: cada proyectil procea Trinidad y Muramana.',
        'Con Calzado mágico ahorras 300 de oro en botas: úsalo para llegar antes al primer objeto legendario.'
      ]
    }
  ],

  karthus: [
    {
      name: 'Mid — Requiem global',
      season: 'S3',
      modo: 'grieta',
      role: 'Mid',
      style: 'Mago de área / Ejecución',
      difficulty: 'Media',
      resumen: 'El liche que mata desde la tumba: farmea con Laceración a distancia segura, apila poder de habilidad hasta que su Réquiem ejecute a media pantalla del mapa, y cuando muere sigue lanzando hechizos durante siete segundos más. Karthus no juega peleas: juega números.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3070, 'Lágrima de la Diosa'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3001, 'Cetro Abisal']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica en cada Laceración y en el Réquiem.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura: eres el objetivo más lento del mapa.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18: tu escalado es tu identidad.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP desde el minuto uno.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Escalado arcano con maná',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
        ]
      },
      hechizos: [['SummonerTeleport', 'Teleportación'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'Farmea con la Q pequeña sobre súbditos individuales: cada impacto directo cura tu maná con la pasiva de la E. Lágrima al primer retorno, siempre.',
        mid: 'Empuja oleadas en segundos con E activa y roba camps. Cada Réquiem disponible es presión global: los rivales heridos no pueden quedarse en el mapa.',
        late: 'Muere en el sitio correcto. Tu pasiva te da siete segundos de hechizos gratis sin coste de maná: entra, muere y borra a su equipo desde el más allá.'
      },
      tips: [
        'La Q hace daño doble si golpea a un solo objetivo: apunta a los campeones aislados, no al centro de la oleada.',
        'El Muro de Dolor (W) ralentiza brutalmente y reduce RM: colócalo para cortar la retirada, no para frenar la entrada.',
        'Réquiem se canaliza 3 segundos y todo el mapa lo oye: úsalo tras la primera muerte de una pelea, cuando ya están heridos.',
        'Con el Bastón del Arcángel lleno, tu Réquiem al nivel 16 remata a casi cualquier carry por debajo del 30% de vida.'
      ]
    },
    {
      name: 'ARAM — Bomba de área',
      season: 'S3',
      modo: 'aram',
      role: 'Mid',
      style: 'Mago de área / Poke',
      difficulty: 'Baja',
      resumen: 'Karthus fue diseñado para ARAM sin saberlo: un solo carril, cinco rivales apretados y una Q que no falla nunca. Suma la pasiva de muerte y tienes al campeón que gana peleas incluso cuando pierde el 1v5.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida']],
        core: [[3070, 'Lágrima de la Diosa'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel'], [3116, 'Cetro de Cristal de Rylai']],
        situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3135, 'Bastón del Vacío'], [3165, 'Morellonomicón'], [3157, 'Reloj de Arena de Zhonya']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: en ARAM nadie compra resistencia mágica pronto.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18: en el carril único todo el mundo te pokea.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP para dominar el poke desde el nivel 1.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Poke arcano sostenido',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
        ]
      },
      hechizos: [['SummonerMana', 'Claridad'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Q sin parar sobre la línea de súbditos y campeones: en ARAM no hay retorno a base, así que cada punto de vida que quites es permanente.',
        mid: 'Rylai convierte tu Q en una ralentización constante en área: su equipo no puede ni acercarse a tu torre.',
        late: 'Réquiem tras cada pelea reñida: los supervivientes con poca vida no llegan vivos a su torre. Y si mueres, sigues lanzando hechizos gratis.'
      },
      tips: [
        'Claridad en ARAM es el hechizo estrella de Karthus: maná infinito significa Q infinita.',
        'Tu pasiva es una ventaja enorme en ARAM: morir iniciando una pelea puede ser la jugada correcta.',
        'El Muro de Dolor bloquea el paso del carril entero: es el mejor peel del modo.',
        'Con Rylai y el Muro, un equipo que intente asediar tu torre simplemente no puede avanzar.'
      ]
    }
  ],

  morgana: [
    {
      name: 'Support — Escudo Negro',
      season: 'S3',
      modo: 'grieta',
      role: 'Support',
      style: 'Maga / Control',
      difficulty: 'Baja',
      resumen: 'El soporte que anula composiciones enteras: el Escudo Negro absorbe todo el control de masas mágico del equipo rival, y el Lazo Oscuro deja tres segundos de raíz a quien se atreva a acercarse. Contra ganchos, aturdimientos y supresiones, Morgana es un botón de "no".',
      items: {
        inicio: [[3301, 'Moneda Antigua'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3174, 'Grial Impuro de Athene']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3190, 'Medallón Solari de Hierro'], [3222, 'Crisol de Mikael'], [3116, 'Cetro de Cristal de Rylai']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: el Suelo Atormentado castiga de verdad.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para el 2v2 de la botlane.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Oro x3', detalle: '+3 de oro por 10 segundos.' }
      },
      maestrias: {
        reparto: '0/9/21',
        clave: 'Utilidad con presencia mágica',
        arboles: [
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' },
          { arbol: 'Utilidad', puntos: 21, detalle: 'Perspicacia del Invocador, Meditación, Explorador, Avaricia, Riqueza, Carterista, Cerebro.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      plan: {
        early: 'El Suelo Atormentado (W) sobre la oleada empuja y castiga a la vez. Guarda el Lazo (Q) para el gank de tu jungla o para el que se acerque demasiado.',
        mid: 'Escudo Negro sobre el iniciador enemigo prioritario: si Blitzcrank o Amumu no pueden iniciar, la pelea no existe. Tu Piedra de Visión ilumina el río.',
        late: 'Zhonya + ultimate es una jugada de todo o nada preciosa: entra, aturde a tres con Alma Encadenada y congela el reloj mientras tu equipo limpia.'
      },
      tips: [
        'El Escudo Negro bloquea TODO el CC mágico mientras aguante: ponlo ANTES del gancho, no después.',
        'El Lazo Oscuro atraviesa súbditos si están muy juntos: apunta a los huecos entre la oleada.',
        'La ultimate aturde solo si aguantas cerca los 3 segundos completos: Zhonya justo después es la jugada estándar.',
        'Con la Q disponible controlas un pasillo entero del mapa: los rivales no cruzan el río contigo mirando.'
      ]
    }
  ],

  annie: [
    {
      name: 'Mid — Tibbers (Burst)',
      season: 'S3',
      modo: 'grieta',
      role: 'Mid',
      style: 'Maga / Burst',
      difficulty: 'Baja',
      resumen: 'La niña con el oso: cuatro hechizos y tienes un aturdimiento garantizado. Annie no tiene mecánicas complejas — tiene un botón que aturde a todo el equipo enemigo y un oso que se queda ardiendo encima. La curva de aprendizaje más honesta del mid.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3128, 'Tenaza de Muerte Ígnea'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3001, 'Cetro Abisal']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica para que el combo entero entre limpio.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura contra los asesinos AD del mid.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Poder de Habilidad x9', detalle: '+11 de AP plano: tu burst del nivel 6 ya mata.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Burst mágico directo',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
        ]
      },
      hechizos: [['SummonerDot', 'Ignición'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Farmea con Q (te devuelve el maná si mata) y cuenta siempre tus cargas de pasiva: con 4 hechizos lanzados, el siguiente aturde.',
        mid: 'Nivel 6 con aturdimiento cargado = kill garantizado: Destello → R (Tibbers aturde) → W → Q → Ignición. Roama a los laterales, nadie sobrevive a eso.',
        late: 'Eres la iniciación del equipo: un Tibbers sobre tres rivales aturdidos gana la teamfight antes de que empiece. Nunca gastes el aturdimiento farmeando.'
      },
      tips: [
        'Lleva SIEMPRE la pasiva cargada al entrar a una pelea: es la diferencia entre una kill y morir tú.',
        'Puedes cargar el escudo (E) sobre ti mismo para acumular el aturdimiento sin gastar maná ofensivo.',
        'Tibbers sigue haciendo daño de área mientras está vivo: colócalo en medio de su equipo, no sobre el tanque.',
        'Con la Tenaza de Muerte Ígnea, tu combo completo borra a cualquier carry sin defensas mágicas.'
      ]
    }
  ],

  nasus: [
    {
      name: 'Top — Apilar la Q (Escalado)',
      season: 'S3',
      modo: 'grieta',
      role: 'Top',
      style: 'Juggernaut / Split push',
      difficulty: 'Baja',
      resumen: 'El guardián que juega a un juego distinto al resto: mientras todos pelean, Nasus cuenta súbditos. Cada last hit con Golpe Devastador es permanente, y llegado el minuto 30 con 400 cargas su Q golpea más fuerte que cualquier ultimate del juego.',
      items: {
        inicio: [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar'], [3083, 'Armadura de Warmog']],
        situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3075, 'Malla de Espinas'], [3025, 'Guantelete de Hielo']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura: tu única misión temprana es no morir mientras apilas.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para aguantar el acoso del top rival.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: llegar al last hit y salir es todo tu early game.' }
      },
      maestrias: {
        reparto: '9/21/0',
        clave: 'Supervivencia hasta el late',
        arboles: [
          { arbol: 'Ofensa', puntos: 9, detalle: 'Fuerza Bruta, Carnicero, Pericia con las Armas.' },
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' }
        ]
      },
      hechizos: [['SummonerTeleport', 'Teleportación'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'No pelees. Apila. Usa la E para farmear a distancia cuando te acosen y consigue todas las cargas de Q que puedas — 100 al minuto 15 es un buen ritmo.',
        mid: 'Con 200 cargas y Capa de Fuego Solar puedes 1v1 a casi cualquiera. Empieza a hacer split push: eres el mejor derribador de torres del juego.',
        late: 'Furia Impía (R) te da vida, alcance y CDR masivo: entras a la pelea como un tanque inmortal cuya Q hace 700 de daño. Split push hasta el nexo.'
      },
      tips: [
        'La Q ignora el enfriamiento si el súbdito muere con ella: nunca falles un last hit con la Q disponible.',
        'La E reduce la armadura y hace daño en área: es tu herramienta de farmeo seguro bajo torre.',
        'La ultimate no da daño directo pero sí supervivencia y CDR: actívala al ENTRAR, no cuando ya estés bajo.',
        'Tu debilidad es el minuto 10-20: pide ayuda a tu jungla y juega bajo torre sin vergüenza.'
      ]
    }
  ],

  twistedfate: [
    {
      name: 'Mid — Destino global',
      season: 'S3',
      modo: 'grieta',
      role: 'Mid',
      style: 'Mago / Presión global',
      difficulty: 'Alta',
      resumen: 'El maestro de las cartas no gana su carril: gana el mapa. Con Destino revela a los cinco rivales y aparece en cualquier pelea del mapa, y con la carta dorada convierte cada pick en un 5v4. Es un campeón de macrojuego disfrazado de mago.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3100, 'Perdición del Liche']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: la carta azul pokea de verdad.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: llegar a la pelea tras el Destino, medio segundo antes.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Presión global con burst',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Errante.' }
        ]
      },
      hechizos: [['SummonerTeleport', 'Teleportación'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      plan: {
        early: 'Farmea con la carta roja (daño en área) y castiga con la azul, que te devuelve maná. Guarda la dorada para cuando tu jungla venga.',
        mid: 'A partir del nivel 6, tu Destino es el mejor hechizo del juego: revela a los cinco enemigos, avisa a tu equipo, y teletranspórtate a un 2v2 para hacerlo 3v2.',
        late: 'Eres el iniciador silencioso: Destino + carta dorada sobre el carry rival abre cualquier pelea. Empuja un lateral y amenaza con aparecer en el otro extremo.'
      },
      tips: [
        'Elegir la carta (W) tiene su propio ritmo: para la dorada, para el ciclo en el momento exacto — practica el timing en la herramienta de práctica.',
        'La ultimate revela el mapa entero 8 segundos aunque no la uses para viajar: es información gratis para tomar barón.',
        'Comunica SIEMPRE el Destino a tu equipo antes de canalizarlo: un TF sin seguimiento es una ultimate perdida.',
        'La carta azul devuelve maná al impactar: úsala para el farmeo sostenido en carriles difíciles.'
      ]
    }
  ],

  sivir: [
    {
      name: 'ADC — Escudo Mágico',
      season: 'S3',
      modo: 'grieta',
      role: 'ADC',
      style: 'Tiradora / Push',
      difficulty: 'Baja',
      resumen: 'La tiradora que empuja oleadas más rápido que nadie y anula el hechizo clave del rival con su Escudo Mágico. Sumado a Marcha Implacable, Sivir convierte a todo su equipo en un pelotón que llega antes a cada objetivo del mapa.',
      items: {
        inicio: [[1055, 'Espada de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3006, 'Grebas de Berserker'], [3087, 'Puñal de Statikk'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral']],
        situacionales: [[3072, 'La Sanguinaria'], [3035, 'Últimas Palabras'], [3026, 'Ángel de la Guarda'], [3085, 'Huracán de Runaan']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD para el last hit y el bumerán.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD.' }
      },
      maestrias: {
        reparto: '21/9/0',
        clave: 'Daño sostenido y empuje',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Frenesí, Letalidad, Verdugo.' },
          { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
        ]
      },
      hechizos: [['SummonerHeal', 'Curación'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      plan: {
        early: 'El Escudo Mágico (E) es tu superpoder de línea: bloquea el gancho de Blitzcrank, el lazo de Morgana o el aturdimiento de Leona y el 2v2 se vuelve tuyo gratis.',
        mid: 'Con Statikk y la W activa, empujas cualquier oleada en dos segundos. Rota inmediatamente después: tu equipo consigue objetivos gratis mientras el rival farmea.',
        late: 'Marcha Implacable (R) es una iniciación de equipo: activa antes de entrar y todo tu equipo cae encima del suyo a la vez.'
      },
      tips: [
        'El Escudo Mágico absorbe UN hechizo dirigido: acertarlo es lo que separa a una Sivir buena de una excelente.',
        'El bumerán (Q) hace menos daño con cada objetivo que atraviesa: apunta a los rivales aislados.',
        'La W rebota entre objetivos: activarla antes de derribar una torre acelera el asedio muchísimo.',
        'Tu ultimate es utilidad, no daño: úsala para agrupar y llegar, o para huir de un mal enfrentamiento.'
      ]
    }
  ],

  alistar: [
    {
      name: 'Support — Combo W-Q',
      season: 'S3',
      modo: 'grieta',
      role: 'Support',
      style: 'Tanque / Iniciador',
      difficulty: 'Media',
      resumen: 'El minotauro que hace el combo más antiguo y más letal de la botlane: embestir al rival contra tu torre y lanzarlo por los aires antes de que aterrice. Con la ultimate activa, Alistar entra en la torre enemiga, saca a su carry y sale caminando.',
      items: {
        inicio: [[3302, 'Escudo Reliquia'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
        situacionales: [[3110, 'Corazón de Hielo'], [3050, 'Heraldo de Zeke'], [3222, 'Crisol de Mikael'], [3075, 'Malla de Espinas']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura para plantarte encima del ADC rival.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18: tu ultimate reduce el daño, esto lo multiplica.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: llegar al combo W-Q antes de que reaccionen.' }
      },
      maestrias: {
        reparto: '0/21/9',
        clave: 'Tanque iniciador',
        arboles: [
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Explorador.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['W', 'Q', 'E'],
      plan: {
        early: 'El combo W → Q lanzado casi a la vez encadena dos controles seguidos: practícalo hasta que sea muscular. Un solo combo bien hecho gana la línea.',
        mid: 'Con la ultimate reduces el 70% del daño recibido: puedes iniciar dentro de su torre y sobrevivir. Sé el que abre todas las peleas.',
        late: 'Tu trabajo es apartar al asesino de tu carry con la Q y ser imposible de matar mientras tanto. Un Alistar con ulti es un muro que camina.'
      },
      tips: [
        'El combo Destello + Q lanza a los rivales hacia tu equipo: es la iniciación más limpia del juego clásico.',
        'La W empuja al rival: si te colocas detrás de él, lo empujas HACIA tu torre, no lejos de ella.',
        'Tu ultimate limpia ralentizaciones y reduce daño: actívala ANTES de entrar, no cuando ya estés a media vida.',
        'La E cura en área al golpear súbditos: te da un sustain enorme en la fase de líneas.'
      ]
    }
  ],

  veigar: [
    {
      name: 'Mid — AP infinito',
      season: 'S3',
      modo: 'grieta',
      role: 'Mid',
      style: 'Mago / Escalado infinito',
      difficulty: 'Media',
      resumen: 'El único campeón del juego con escalado sin techo: cada Materia Oscura sobre un súbdito suma poder de habilidad permanente. Con la Jaula del Terror para atrapar y una ultimate que escala con el AP del RIVAL, Veigar borra magos enteros de un solo botón.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[3070, 'Lágrima de la Diosa'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3001, 'Cetro Abisal']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: con tu AP acumulado, cada punto se multiplica.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura: eres pequeño, lento y muy apetecible.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP para empezar a apilar antes.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Escalado arcano puro',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
        ]
      },
      hechizos: [['SummonerBarrier', 'Barrera'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Apila con cada Q sobre súbditos moribundos: 60-80 cargas al minuto 15 es tu objetivo. Juega bajo torre sin complejos, tu momento llega después.',
        mid: 'La Jaula (E) es tu combo entero: atrapa → W (Materia Oscura) → Q → R. Cualquier mago rival muere de una sola ultimate, porque escala con SU poder de habilidad.',
        late: 'Con 800+ de AP eres una torreta de un disparo. Colócate detrás de todo, atrapa con la jaula al que se acerque y borra a quien entre en tu rango.'
      },
      tips: [
        'La Jaula del Terror aturde solo si el rival la cruza desde dentro hacia fuera: colócala DETRÁS del objetivo.',
        'La Materia Oscura (W) tarda 1.2 segundos en caer: lánzala sobre el rival ya atrapado, nunca antes.',
        'Tu ultimate hace más daño cuanto más AP tenga el rival: contra un Rabadon enemigo es una ejecución garantizada.',
        'La Q apila con cualquier unidad que mates: los camps de jungla también cuentan.'
      ]
    }
  ],

  jarvaniv: [
    {
      name: 'Jungla — Bandera y Dragón',
      season: 'S3',
      modo: 'grieta',
      role: 'Jungla',
      style: 'Peleador / Iniciador',
      difficulty: 'Media',
      resumen: 'El ejemplo de Demacia y su combo E-Q, la iniciación más limpia del juego: bandera al suelo, salto hacia ella, aturdimiento en área. Con Cataclismo encierra al carry rival en una arena de la que nadie sale vivo.',
      items: {
        inicio: [[1039, 'Machete del Cazador'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
        core: [[1080, 'Piedra Espiritual'], [3209, 'Espíritu del Lagarto Anciano'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
        situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3026, 'Ángel de la Guarda'], [3071, 'La Cuchilla Negra']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD: tu Q pega un % de vida máxima, pero el AD acelera el clear.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura, obligatorios en jungla.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: llegar al gank sin ser visto.' }
      },
      maestrias: {
        reparto: '9/21/0',
        clave: 'Iniciador resistente',
        arboles: [
          { arbol: 'Ofensa', puntos: 9, detalle: 'Fuerza Bruta, Carnicero, Pericia con las Armas.' },
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' }
        ]
      },
      hechizos: [['SummonerSmite', 'Castigo'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'E', 'W'],
      plan: {
        early: 'El E-Q es tu gank: lanza la bandera por detrás del rival y salta hacia ella para empujarlo hacia tu carril. Funciona desde el nivel 3.',
        mid: 'Con el Lagarto Anciano y Capa de Fuego Solar eres un peleador completo. Controla dragón: tu Q hace daño porcentual, así que los objetivos caen rápido.',
        late: 'Tu Cataclismo aísla al carry rival dentro de un muro: úsalo para separar, no solo para atrapar. Un buen R decide la partida entera.'
      },
      tips: [
        'La bandera (E) también sirve de escape: lánzala hacia un muro y salta para atravesar terreno.',
        'El Cataclismo se puede cancelar reactivándolo: si atrapas al equipo equivocado, ábrelo antes de encerrar a tu propio equipo.',
        'Tu Q reduce la armadura y hace daño porcentual: eres excelente contra tanques y contra objetivos neutrales.',
        'El escudo pasivo de la W te da sustain en el clear: úsala cada vez que esté disponible en los campamentos.'
      ]
    }
  ],

  leona: [
    {
      name: 'Support — Amanecer (Iniciadora)',
      season: 'S3',
      modo: 'grieta',
      role: 'Support',
      style: 'Tanque / Control de masas',
      difficulty: 'Baja',
      resumen: 'La tanque solar que encadena tres controles seguidos y no suelta nunca: E para acercarse, Q para aturdir, R para clavar en el sitio. Leona no pokea ni cura — Leona señala a un rival y ese rival deja de existir.',
      items: {
        inicio: [[3302, 'Escudo Reliquia'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']],
        core: [[2049, 'Piedra de Visión'], [3111, 'Botas de Mercurio'], [3190, 'Medallón Solari de Hierro']],
        situacionales: [[3110, 'Corazón de Hielo'], [3075, 'Malla de Espinas'], [3050, 'Heraldo de Zeke'], [3143, 'Presagio de Randuin']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura para el intercambio agresivo constante.' },
        sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura: vas a comer todos los autos del ADC rival.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: pegarte al objetivo es literalmente tu kit entero.' }
      },
      maestrias: {
        reparto: '0/21/9',
        clave: 'Tanque de iniciación',
        arboles: [
          { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Explorador.' }
        ]
      },
      hechizos: [['SummonerExhaust', 'Agotamiento'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'Q', 'W'],
      plan: {
        early: 'Nivel 2 con E disponible: salta al ADC rival, Q para aturdir y deja que tu tirador haga el resto. Cada intercambio con tu combo completo lo ganas tú.',
        mid: 'Con el Medallón y la Piedra de Visión eres un muro andante. Busca picks por el río: tu E desde niebla de guerra es un kill garantizado.',
        late: 'Elige un objetivo y encadena: R (aturde en área) → E (llegar) → Q (aturdir). Nadie se libra de tres controles seguidos.'
      },
      tips: [
        'La pasiva marca al objetivo: tus aliados hacen daño extra al golpear al marcado. Comunica a quién marcas.',
        'El escudo (W) te da armadura y RM mientras dura: actívalo antes de saltar, no después.',
        'El Amanecer Solar (R) tiene alcance enorme: puedes iniciar peleas desde detrás de tu propia frontline.',
        'Tu E te acerca pero también te compromete: sin Destello disponible, piensa dos veces antes de saltar.'
      ]
    }
  ],

};

// ---------- Builds adicionales para campeones ya definidos arriba ----------
// (se añaden con push para no sobrescribir sus builds existentes)
BUILDS.lux.push(
    {
      name: 'ARAM — Artillería pura',
      season: 'S3',
      modo: 'aram',
      role: 'Mid',
      style: 'Maga / Poke',
      difficulty: 'Baja',
      resumen: 'Lux en ARAM es sencillamente injusta: un carril recto, cinco rivales sin escapatoria y una Chispa Final que atraviesa la pantalla entera. Si el enemigo no puede acercarse, no puede ganar.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida']],
        core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
        situacionales: [[3135, 'Bastón del Vacío'], [3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3165, 'Morellonomicón']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: en ARAM nadie compra RM a tiempo.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18 para aguantar el poke rival.' },
        glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al 18.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP: el poke duele desde el minuto 1.' }
      },
      maestrias: {
        reparto: '21/0/9',
        clave: 'Poke a máxima distancia',
        arboles: [
          { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
          { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
        ]
      },
      hechizos: [['SummonerMana', 'Claridad'], ['SummonerFlash', 'Destello']],
      habilidades: ['E', 'Q', 'W'],
      plan: {
        early: 'E al máximo alcance sin parar. En ARAM cada punto de vida quitado es permanente hasta que muera alguien: el desgaste ES la estrategia.',
        mid: 'Tu escudo (W) protege a todo el equipo en línea recta: en un solo carril alcanza a los cinco. Es tan valioso como tu daño.',
        late: 'Chispa Final con enfriamiento reducido: ejecuta a cualquiera que se retire con menos de media vida. Nunca camines delante de tu frontline.'
      },
      tips: [
        'Claridad es el hechizo de ARAM por excelencia para Lux: maná infinito significa poke infinito.',
        'La Q atrapa a varios en el carril estrecho de ARAM: una raíz doble es una pelea ganada.',
        'Detona la pasiva con un auto tras cada habilidad, incluso en el poke a distancia.',
        'Tu W en línea recta escuda a todo el equipo agrupado: úsalo antes de cada choque, no después.'
      ]
    }
);

BUILDS.sona.push(
    {
      name: 'ARAM — Auras y Crescendo',
      season: 'S3',
      modo: 'aram',
      role: 'Support',
      style: 'Enchanter / Poke',
      difficulty: 'Baja',
      resumen: 'Sona en ARAM es una batería infinita: poke con el Himno del Valor, curación en área que mantiene a cinco aliados en pie, y un Crescendo que atraviesa todo el carril y aturde al equipo entero. El soporte que gana ARAMs sola.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida']],
        core: [[3174, 'Grial Impuro de Athene'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
        situacionales: [[3116, 'Cetro de Cristal de Rylai'], [3222, 'Crisol de Mikael'], [3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya']]
      },
      runas: {
        marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de pen. mágica: tu Q pokea a cinco a la vez.' },
        sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18: eres el objetivo prioritario de todo el equipo rival.' },
        glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
        quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP: curas y poke escalan a la vez.' }
      },
      maestrias: {
        reparto: '9/0/21',
        clave: 'Auras, curación y enfriamientos',
        arboles: [
          { arbol: 'Ofensa', puntos: 9, detalle: 'Hechicería, Conocimiento Arcano — CDR y penetración para el poke.' },
          { arbol: 'Utilidad', puntos: 21, detalle: 'Perspicacia del Invocador, Meditación, Fuerza Espiritual, Riqueza, Inteligencia, Cerebro.' }
        ]
      },
      hechizos: [['SummonerMana', 'Claridad'], ['SummonerFlash', 'Destello']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'Q sin parar desde la línea trasera: alcanza a dos rivales cada vez y el acorde duplica el daño. Nadie puede acercarse a la torre contigo detrás.',
        mid: 'Alterna auras: W cuando te pokeen, E cuando el equipo necesite reposicionarse, Q el resto del tiempo. Tu presencia sostiene a cinco personas a la vez.',
        late: 'El Crescendo es la teamfight: un aturdimiento en línea sobre cinco rivales es la victoria. Guárdalo, no lo malgastes en el primero que veas.'
      },
      tips: [
        'Claridad mantiene tus auras funcionando sin parar: en ARAM el maná es el único límite de Sona.',
        'Mantente al borde del rango de tus auras: dan efecto a los aliados pero tú sigues fuera del peligro.',
        'El acorde de la W reduce el daño del rival marcado: úsalo sobre el hipercarry enemigo.',
        'Destello + Crescendo por el flanco pilla a todo el equipo agrupado: la jugada que gana ARAMs.'
      ]
    }
);

BUILDS.garen.push(
    {
      name: 'Top — Actual (Conquistador)',
      season: 'ACT',
      modo: 'grieta',
      role: 'Top',
      style: 'Juggernaut',
      difficulty: 'Baja',
      resumen: 'El Garen moderno cambia Warmog + Atma por Fuerza de Trinidad y Sterak: sigue girando, sigue ejecutando, pero ahora con Conquistador apilando curación en cada intercambio largo. La fantasía es la misma; los números, otro juego.',
      items: {
        inicio: [[1054, 'Escudo de Doran'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']],
        core: [[3078, 'Fuerza de trinidad'], [3047, 'Botas blindadas'], [3053, 'Calibrador de Sterak'], [3742, 'Coraza del muerto']],
        situacionales: [[3065, 'Rostro espiritual'], [3143, 'Presagio de Randuin'], [3075, 'Malla de espinas'], [6333, 'Baile de la muerte']]
      },
      runasModernas: {
        principal: {
          arbol: 'Precisión', icon: 'perk-images/Styles/7201_Precision.png',
          runas: [
            [8010, 'Conquistador', 'perk-images/Styles/Precision/Conqueror/Conqueror.png'],
            [9111, 'Triunfo', 'perk-images/Styles/Precision/Triumph.png'],
            [9104, 'Leyenda: Presteza', 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png'],
            [8014, 'Golpe de gracia', 'perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png']
          ]
        },
        secundario: {
          arbol: 'Valor', icon: 'perk-images/Styles/7204_Resolve.png',
          runas: [
            [8473, 'Revestimiento de huesos', 'perk-images/Styles/Resolve/BonePlating/BonePlating.png'],
            [8451, 'Sobrecrecimiento', 'perk-images/Styles/Resolve/Overgrowth/Overgrowth.png']
          ]
        },
        fragmentos: ['Fuerza adaptativa', 'Fuerza adaptativa', 'Vida escalada']
      },
      hechizos: [['SummonerFlash', 'Destello'], ['SummonerTeleport', 'Teleportación']],
      habilidades: ['E', 'Q', 'W'],
      plan: {
        early: 'Conquistador quiere intercambios largos: entra con Q para el silencio, gira con E y deja que las cargas se apilen. Tu pasiva sigue regenerando lo que ellos no pueden.',
        mid: 'Trinidad completada es tu pico: cada Q procea Brillo. Empuja el lateral y obliga a que manden a dos — con Sterak sobrevives a cualquier 2v1.',
        late: 'Sigue girando sobre sus carries y ejecutando con R. Golpe de gracia amplifica tu daño contra objetivos bajos: el remate llega antes de lo que creen.'
      },
      tips: [
        'Golpe de gracia hace un 8% más de daño contra rivales por debajo del 40%: se combina perfectamente con la ejecución de tu R.',
        'Botas blindadas contra composiciones de autoataques: el 12% de reducción es enorme para un juggernaut.',
        'Sterak evita que te borren en el burst: es tu objeto anti-asesino obligatorio.',
        'La ejecución de la R sigue siendo daño verdadero: apréndete el umbral en el parche actual, ha cambiado.'
      ]
    }
);

BUILDS.ahri.push(
    {
      name: 'Mid — Actual (Cometa arcano)',
      season: 'ACT',
      modo: 'grieta',
      role: 'Mid',
      style: 'Maga / Asesina',
      difficulty: 'Media',
      resumen: 'La Ahri de hoy sustituye la Tenaza por el Eco de Luden y el Cometa arcano: sigue siendo el Encanto lo que decide, pero ahora la movilidad de la ultimate se recarga con asesinatos y el burst llega desde ángulos que en Season 3 no existían.',
      items: {
        inicio: [[1056, 'Anillo de Doran'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']],
        core: [[6655, 'Eco de Luden'], [3020, 'Botas de hechicero'], [3089, 'Sombrero mortal de Rabadon']],
        situacionales: [[3157, 'Reloj de arena de Zhonya'], [3135, 'Bastón del Vacío'], [3165, 'Morellonomicón'], [3116, 'Cetro de cristal de Rylai']]
      },
      runasModernas: {
        principal: {
          arbol: 'Brujería', icon: 'perk-images/Styles/7202_Sorcery.png',
          runas: [
            [8229, 'Cometa arcano', 'perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png'],
            [8226, 'Banda de maná', 'perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png'],
            [8210, 'Trascendencia', 'perk-images/Styles/Sorcery/Transcendence/Transcendence.png'],
            [8237, 'Piroláser', 'perk-images/Styles/Sorcery/Scorch/Scorch.png']
          ]
        },
        secundario: {
          arbol: 'Inspiración', icon: 'perk-images/Styles/7203_Whimsy.png',
          runas: [
            [8304, 'Calzado mágico', 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png'],
            [8347, 'Perspicacia cósmica', 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png']
          ]
        },
        fragmentos: ['Velocidad de habilidad', 'Fuerza adaptativa', 'Vida escalada']
      },
      hechizos: [['SummonerFlash', 'Destello'], ['SummonerDot', 'Ignición']],
      habilidades: ['Q', 'W', 'E'],
      plan: {
        early: 'El Cometa arcano se activa fácil con el Encanto: E acertado significa cometa garantizado y medio combo gratis. Empuja con Q y busca la línea de visión.',
        mid: 'Eco de Luden marca tu primer pico. Con Encanto + combo completo borras a cualquier objetivo blando; rota a los laterales con la ultimate cargada.',
        late: 'Tu ultimate recarga cargas al conseguir asesinatos: entra por el flanco, ejecuta al carry y sal con los dashes restantes. Nunca gastes los tres entrando.'
      },
      tips: [
        'Piroláser premia el poke con hechizos: usa la Q sobre el rival aunque solo roce, el daño extra se acumula toda la fase de líneas.',
        'Banda de maná resuelve el problema de maná de Ahri en el early: aprovecha para pokear sin miedo desde el nivel 3.',
        'El Encanto sigue siendo tu única iniciación real: sin él disponible, no hay pelea.',
        'La ultimate resetea cargas con cada asesinato o asistencia: en peleas de equipo puedes atravesar el mapa entero.'
      ]
    }
);

// ---------- Montaje final ----------
function autoColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h}, 45%, 48%)`;
}

// Una build de la Season 3 vale también para LoL Classic (mismo meta base).
// Si la build declara `ediciones` explícitamente, se respeta.
const EDICIONES_POR_SEASON = {
  S3: ['classic', 's3'],
  S2: ['s2'],
  S1: ['s1'],
  ACT: ['actual']
};

function normalizarBuild(b) {
  const season = b.season || 'S3';
  return Object.assign({}, b, {
    season,
    modo: b.modo || 'grieta',
    ediciones: b.ediciones || EDICIONES_POR_SEASON[season] || ['classic'],
    parche: b.parche || PATCHES[season] || DD_VER
  });
}

const CHAMPIONS = ROSTER.map(([dd, name, title, roles]) => {
  const id = dd.toLowerCase();
  return {
    id, dd, name, title, roles,
    color: COLORS[id] || autoColor(dd),
    lema: LEMAS[id] || '',
    builds: (BUILDS[id] || []).map(normalizarBuild)
  };
});

// Devuelve las builds que encajan con la edición y el modo seleccionados
function buildsDe(champ, edicion, modo) {
  return champ.builds.filter(b =>
    (edicion === 'todas' || b.ediciones.includes(edicion)) &&
    (modo === 'todos' || b.modo === modo));
}

// ---------- Metadatos de seasons ----------
const SEASONS_META = {
  S1: {
    nombre: 'Season 1',
    años: '2010 – 2011',
    desc: 'Los orígenes: sin trinkets, sin objetos de soporte, con la penetración de armadura reinando en las runas y peleas caóticas en mid desde el minuto 20. La visión era un lujo que se pagaba de tu bolsillo.'
  },
  S2: {
    nombre: 'Season 2',
    años: '2011 – 2012',
    desc: 'La era de la visión y los primeros junglas modernos: Piedra Filosofal, Armadura de Tela + 5 pociones, El Embrutecedor en cada AD y soportes pobres que compraban todos los wards del equipo.'
  },
  S3: {
    nombre: 'Season 3',
    años: '2013 — base de LoL Classic',
    desc: 'La temporada que LoL Classic toma como base: trinkets recién llegados, objetos de oro para soportes, espíritus de jungla, Tenaza de Muerte Ígnea en cada mago y el meta más querido de la historia del juego.'
  }
};

// ---------- Tier list por modos ----------
// Curada para el lanzamiento de LoL Classic a partir del meta clásico S3 y las
// primeras estadísticas del modo (MetaSRC Classic 26.15). Verificado: Taric Support B.
const TIERLIST = {
  grieta: {
    nombre: 'Grieta Clásica',
    icono: '⚔️',
    desc: 'Tier list curada para el 5v5 de LoL Classic (parche 26.15): kits pre-rework sobre itemización Season 3. Contrasta siempre con las fuentes en vivo — el meta del modo evoluciona cada semana con El Consejo.',
    tiers: {
      'S+': ['leesin', 'jax', 'vayne', 'blitzcrank', 'kassadin'],
      'S': ['ahri', 'katarina', 'malphite', 'amumu', 'sona', 'tristana', 'ezreal', 'garen'],
      'A': ['ashe', 'lux', 'masteryi', 'soraka', 'annie', 'morgana', 'gragas', 'olaf', 'sivir', 'nasus', 'jarvaniv', 'twistedfate'],
      'B': ['taric', 'karthus', 'anivia', 'ryze', 'veigar', 'missfortune', 'corki', 'janna', 'leona', 'alistar', 'monkeyking', 'tryndamere', 'drmundo', 'warwick'],
      'C': ['heimerdinger', 'urgot', 'sion', 'teemo', 'kayle', 'zilean', 'skarner', 'evelynn', 'fiddlesticks', 'singed']
    },
    notas: { taric: 'B verificado: 50.49% WR como support en Classic 26.15 (MetaSRC).' }
  },
  aram: {
    nombre: 'ARAM Clásico',
    icono: '❄️',
    desc: 'Si el modo incorpora ARAM con reglas clásicas, este es el orden natural: poke, área y sostenimiento mandan en el carril único. Lista curada por arquetipos — sin datos en vivo todavía.',
    tiers: {
      'S+': ['lux', 'sona', 'karthus', 'ashe'],
      'S': ['morgana', 'veigar', 'missfortune', 'ahri', 'soraka', 'anivia'],
      'A': ['annie', 'ryze', 'gragas', 'kogmaw', 'janna', 'taric', 'amumu'],
      'B': ['garen', 'malphite', 'leona', 'sivir', 'tristana', 'corki'],
      'C': ['masteryi', 'leesin', 'evelynn', 'shaco', 'singed']
    },
    notas: {}
  }
};

// Fuentes generales de meta en vivo (se mantienen actualizadas solas al ser enlaces)
const FUENTES_META = [
  ['https://www.metasrc.com/lol/classic', 'MetaSRC — LoL Classic: stats y tier list en vivo'],
  ['https://coachless.gg/builds', 'Coachless — builds analíticas actualizadas'],
  ['https://mobalytics.gg/lol/classic', 'Mobalytics — guías y tier lists de LoL Classic'],
  ['https://op.gg/lol/classic', 'OP.GG — campeones y objetos de LoL Classic']
];
