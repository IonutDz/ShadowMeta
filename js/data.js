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

// ---------- Presets de runas clásicas ----------
// Las páginas de runas de la Season 3 se repetían por arquetipo: estas son las
// estándar de cada rol. Una build puede usar un preset o declarar las suyas.
const R = {
  apMid: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica: los magos clásicos viven de atravesar la RM base del rival.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura contra los asesinos AD y los ganks tempranos.' },
    glifo: { img: 'b_4_1.png', nombre: 'Glifos de Poder de Habilidad Progresivo x9', detalle: '+27.7 de AP al nivel 18: escalado puro hacia el mid game.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP planos desde el minuto uno.' }
  },
  apMidPlano: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica para que el combo entre sin descuentos.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura.' },
    glifo: { img: 'b_3_1.png', nombre: 'Glifos de Poder de Habilidad x9', detalle: '+11 de AP plano: tu burst duele desde el nivel 2.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Poder de Habilidad x3', detalle: '+15 de AP.' }
  },
  adTop: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD: last hits limpios e intercambios que ganas tú.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura, el estándar innegociable del carril superior.' },
    glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18, preparando el mid game.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD.' }
  },
  tankTop: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura: neutralizan el daño físico del carril superior.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para ganar la guerra de desgaste.' },
    glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: pegarte al rival y rotar antes.' }
  },
  jungla: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD: clear más rápido y ganks que ya duelen al nivel 3.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura, imprescindibles con los campamentos clásicos.' },
    glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM para invadir sin miedo.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5%: llegar al gank medio segundo antes lo cambia todo.' }
  },
  junglaAP: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica: todo tu daño de clear y gank es mágico.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para sobrevivir al primer clear.' },
    glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Velocidad de Movimiento x3', detalle: '+4.5% para los ganks desde niebla de guerra.' }
  },
  adc: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Daño de Ataque x9', detalle: '+8.5 de AD: cada last hit y cada intercambio del 2v2 dependen de esto.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura para el duelo eterno de la botlane.' },
    glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18, cuando los magos empiezan a buscarte.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD.' }
  },
  adcVelocidad: {
    marca: { img: 'r_3_1.png', nombre: 'Marcas de Velocidad de Ataque x9', detalle: '+15.3% de velocidad de ataque: tu daño está en los autos, no en las habilidades.' },
    sello: { img: 'y_1_1.png', nombre: 'Sellos de Armadura x9', detalle: '+12.7 de armadura.' },
    glifo: { img: 'b_4_1.png', nombre: 'Glifos de Resistencia Mágica Progresiva x9', detalle: '+24.3 RM al 18.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Daño de Ataque x3', detalle: '+6.75 de AD.' }
  },
  support: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Armadura x9', detalle: '+8.2 de armadura contra los ataques básicos del ADC rival.' },
    sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18: cuerpo para tanquear lo que va dirigido a tu carry.' },
    glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano contra el poke mágico.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Oro x3', detalle: '+3 de oro por 10 segundos: la economía clásica del soporte sin farm.' }
  },
  supportAP: {
    marca: { img: 'r_1_1.png', nombre: 'Marcas de Penetración Mágica x9', detalle: '+7.8 de penetración mágica: tu poke de línea escuece de verdad.' },
    sello: { img: 'y_3_1.png', nombre: 'Sellos de Vida Progresiva x9', detalle: '+175 de vida al 18 para aguantar el foco enemigo.' },
    glifo: { img: 'b_3_1.png', nombre: 'Glifos de Resistencia Mágica x9', detalle: '+12 de RM plano.' },
    quinta: { img: 'bl_1_1.png', nombre: 'Quintaesencias de Oro x3', detalle: '+3 de oro por 10 segundos.' }
  }
};

// ---------- Presets de maestrías clásicas (30 puntos) ----------
const M = {
  ap: {
    reparto: '21/0/9', clave: 'Ofensa arcana con utilidad',
    arboles: [
      { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
      { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Mente Expandida.' }
    ]
  },
  apDef: {
    reparto: '21/9/0', clave: 'Ofensa arcana con colchón',
    arboles: [
      { arbol: 'Ofensa', puntos: 21, detalle: 'Hechicería, Mente Arcana, Conocimiento Arcano, Poder Arcano, Estragos, Verdugo.' },
      { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
    ]
  },
  ad: {
    reparto: '21/9/0', clave: 'Ofensa física completa',
    arboles: [
      { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Frenesí, Letalidad, Verdugo.' },
      { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' }
    ]
  },
  adPen: {
    reparto: '21/9/0', clave: 'Ofensa física con penetración',
    arboles: [
      { arbol: 'Ofensa', puntos: 21, detalle: 'Furia, Carnicero, Pericia con las Armas, Letalidad, Hendidura, Verdugo.' },
      { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Piel Dura.' }
    ]
  },
  bruiser: {
    reparto: '9/21/0', clave: 'Aguante con presencia ofensiva',
    arboles: [
      { arbol: 'Ofensa', puntos: 9, detalle: 'Fuerza Bruta, Carnicero, Pericia con las Armas.' },
      { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' }
    ]
  },
  tank: {
    reparto: '0/21/9', clave: 'Tanque puro con utilidad',
    arboles: [
      { arbol: 'Defensa', puntos: 21, detalle: 'Durabilidad, Perseverancia, Dureza, Armadura Afilada, Cicatrices de Veterano, Guardia de Honor.' },
      { arbol: 'Utilidad', puntos: 9, detalle: 'Perspicacia del Invocador, Meditación, Celeridad.' }
    ]
  },
  support: {
    reparto: '0/9/21', clave: 'Utilidad total: oro, visión y enfriamientos',
    arboles: [
      { arbol: 'Defensa', puntos: 9, detalle: 'Durabilidad, Perseverancia, Dureza.' },
      { arbol: 'Utilidad', puntos: 21, detalle: 'Perspicacia del Invocador, Meditación, Explorador, Avaricia, Riqueza, Carterista, Cerebro.' }
    ]
  }
};

// Objetos que se repiten en casi todas las builds clásicas
const START_TOP = [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']];
const START_AP = [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']];
const START_AD = [[1055, 'Espada de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']];
const START_JG = [[1039, 'Machete del Cazador'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']];
const START_SUP = [[3301, 'Moneda Antigua'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']];
const START_SUP_T = [[3302, 'Escudo Reliquia'], [2003, 'Poción de Vida'], [2044, 'Guardián Invisible']];

const SS = {
  flash: ['SummonerFlash', 'Destello'],
  ignite: ['SummonerDot', 'Ignición'],
  tp: ['SummonerTeleport', 'Teleportación'],
  smite: ['SummonerSmite', 'Castigo'],
  exhaust: ['SummonerExhaust', 'Agotamiento'],
  heal: ['SummonerHeal', 'Curación'],
  barrier: ['SummonerBarrier', 'Barrera'],
  ghost: ['SummonerHaste', 'Fantasmal'],
  clarity: ['SummonerMana', 'Claridad']
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
        situacionales: [[6694, 'Rencor de Serylda'], [3035, 'Últimas Palabras'], [3139, 'Cimitarra mercurial'], [3026, 'Ángel de la guarda']]
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

// ---------- Roster completo: carril superior ----------
Object.assign(BUILDS, {
  chogath: [{
    name: 'Top — Acumular pila',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Tanque / Devorador', difficulty: 'Baja',
    resumen: 'El terror del Vacío crece literalmente: cada Festín devora a un rival o monstruo y suma vida máxima permanente. Con seis pilas y la Vara de las Edades, Cho\'Gath se convierte en una montaña con aturdimiento, silencio y una ejecución de daño verdadero.',
    items: {
      inicio: START_TOP,
      core: [[3027, 'Vara de las Edades'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
      situacionales: [[3065, 'Rostro Espiritual'], [3143, 'Presagio de Randuin'], [3083, 'Armadura de Warmog'], [3157, 'Reloj de Arena de Zhonya']]
    },
    runas: R.tankTop, maestrias: M.bruiser,
    hechizos: [SS.tp, SS.flash], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Farmea con la E (daño en área a los súbditos) y devora con R cada oleada grande: cada pila son 90 de vida permanente que el rival no puede quitarte.',
      mid: 'Con Vara de las Edades y seis pilas eres un muro con control de masas. Tu Q (pinchos) y W (silencio) encadenan a cualquiera que intente pasar.',
      late: 'Guarda el Festín para ejecutar al carry: es daño verdadero que ignora toda resistencia. Iniciar con Q sobre su backline es tu jugada de teamfight.'
    },
    tips: [
      'El Festín hace daño verdadero: contra tanques con 4000 de vida sigue siendo la ejecución más fiable del juego.',
      'Devora súbditos grandes y monstruos de jungla cuando no haya campeones: la vida máxima es la vida máxima.',
      'La Q eleva por los aires: úsala para cortar dashes y persecuciones, no solo por el daño.',
      'El silencio de la W dura casi 2 segundos: reserva la habilidad para el mago rival, no para farmear.'
    ]
  }],

  drmundo: [{
    name: 'Top — Va donde quiere',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Tanque / Sustain', difficulty: 'Baja',
    resumen: 'El loco de Zaun paga sus habilidades con vida y las recupera todas con su ultimate. Con Visaje Espiritual amplificando esa regeneración y Warmog encima, Mundo se vuelve un problema imposible de matar que va exactamente donde le da la gana.',
    items: {
      inicio: START_TOP,
      core: [[3111, 'Botas de Mercurio'], [3065, 'Rostro Espiritual'], [3083, 'Armadura de Warmog']],
      situacionales: [[3068, 'Capa de Fuego Solar'], [3143, 'Presagio de Randuin'], [3075, 'Malla de Espinas'], [3110, 'Corazón de Hielo']]
    },
    runas: R.tankTop, maestrias: M.tank,
    hechizos: [SS.tp, SS.flash], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Acosa con la cuchilla (Q): cuesta un porcentaje de vida actual, así que nunca te mata. Cada impacto ralentiza y te devuelve vida.',
      mid: 'Visaje Espiritual multiplica la curación de tu ultimate. A partir de aquí ganas casi cualquier 1v1 del carril superior por pura resistencia.',
      late: 'Eres el iniciador que absorbe todo: entra el primero con la ultimate activa, absorbe el CC y deja que tu equipo limpie mientras te persiguen sin éxito.'
    },
    tips: [
      'La Q cuesta vida ACTUAL, no máxima: nunca te suicidas usándola, por muy bajo que estés.',
      'Rostro Espiritual antes que Warmog: la sinergia con tu R es enorme y además te da RM.',
      'Tu W (incinerar) es tu daño de clear y de persecución: mantenla activa mientras persigas.',
      'La ultimate te da velocidad de movimiento además de la regeneración: es escape Y persecución.'
    ]
  }],

  gangplank: [{
    name: 'Top — Parrrley (oro infinito)',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Peleador / Poke', difficulty: 'Media',
    resumen: 'El azote de los mares farmea a distancia con Parrrley y gana oro extra por cada last hit robado. Con Fuerza de Trinidad procea el Brillo en cada disparo y su Naranjas limpia todo el control de masas del rival: un top laner que nunca se queda quieto ni sin dinero.',
    items: {
      inicio: START_AD,
      core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
      situacionales: [[3031, 'Filo Infinito'], [3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3072, 'La Sanguinaria']]
    },
    runas: R.adTop, maestrias: M.ad,
    hechizos: [SS.tp, SS.flash], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Parrrley (Q) los súbditos a distancia: es oro extra en cada last hit y poke gratis al rival. Nunca te acerques si no hace falta.',
      mid: 'Con la ventaja de oro de Parrrley llegas a Trinidad antes que nadie. Tu ultimate global asiste a los otros carriles: es ralentización y daño en área en todo el mapa.',
      late: 'Divide y presiona: tu Q sigue farmeando oro y tu R decide peleas al otro lado del mapa. Con Naranjas eres inmune a la iniciación clave del rival.'
    },
    tips: [
      'Parrrley da oro extra SOLO si mata: acostúmbrate al ritmo de last hit con la Q.',
      'Las Naranjas (W) limpian TODO el CC además de curar: guárdalas para el aturdimiento importante, no para el poke.',
      'La ultimate revela y ralentiza en área: úsala para asegurar objetivos y cortar retiradas globalmente.',
      'La W también cura veneno e igniciones: contra Teemo o un Ignite mal usado, ganas el intercambio gratis.'
    ]
  }],

  kayle: [{
    name: 'Top — Híbrida (Nashor)',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Híbrida / Escalado', difficulty: 'Media',
    resumen: 'La Justiciera escala como pocos: sus autoataques a distancia con el Reproche Divino convierten cada intercambio en una victoria, y su ultimate hace INVULNERABLE a cualquier aliado durante 3 segundos. Con Diente de Nashor, sus autos híbridos derriten todo.',
    items: {
      inicio: START_AP,
      core: [[3115, 'Diente de Nashor'], [3020, 'Botas de Hechicero'], [3100, 'Perdición del Liche']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3026, 'Ángel de la Guarda']]
    },
    runas: R.apMid, maestrias: M.apDef,
    hechizos: [SS.tp, SS.flash], habilidades: ['E', 'Q', 'W'],
    plan: {
      early: 'Con la E activa atacas a distancia y con daño mágico extra: acosa al rival cuerpo a cuerpo sin recibir nada a cambio. Es el intercambio más injusto del top.',
      mid: 'Nashor completado es tu pico: autos rapidísimos con daño mágico en área. Tu ultimate salva a cualquier aliado de la muerte segura — vale más que cualquier kill.',
      late: 'Eres una carry a distancia con inmunidad de bolsillo. Usa la ulti sobre el que enfoquen, no sobre ti, y castiga desde detrás con la E siempre activa.'
    },
    tips: [
      'Intervención (R) da invulnerabilidad total: úsala en el aliado clave, incluso si eso significa morir tú.',
      'Con la E activa tus autos son a distancia: es tu botón de "gano este intercambio" en la fase de líneas.',
      'La Q reduce armadura y RM: lánzala antes del intercambio largo, no durante.',
      'Escalas muchísimo: si el early va mal, farmea seguro. Kayle a los 15 es otra campeona.'
    ]
  }],

  singed: [{
    name: 'Top — Veneno y caos',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Tanque / Split push', difficulty: 'Media',
    resumen: 'El químico loco no juega a lo mismo que tú: corre en círculos dejando veneno, lanza por los aires al que le persiga y convierte cada gank en tres muertes enemigas. Vara de las Edades y Rylai lo hacen imposible de alcanzar e imposible de escapar.',
    items: {
      inicio: [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida'], [3340, 'Tótem Guardián']],
      core: [[3027, 'Vara de las Edades'], [3111, 'Botas de Mercurio'], [3116, 'Cetro de Cristal de Rylai']],
      situacionales: [[3151, 'Tormento de Liandry'], [3065, 'Rostro Espiritual'], [3143, 'Presagio de Randuin'], [3157, 'Reloj de Arena de Zhonya']]
    },
    runas: R.tankTop, maestrias: M.tank,
    hechizos: [SS.tp, SS.ghost], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Enciende el veneno y camina. Literalmente: farmea pasando por encima de la oleada y castiga cualquier acercamiento con el Lanzamiento (E).',
      mid: 'Vara de las Edades + Rylai y ya nadie te alcanza. Tu trabajo es empujar un lateral eternamente y sobrevivir a los 2v1 y 3v1 que provoques.',
      late: 'Eres el mejor split pusher del juego clásico. Con la ultimate activa, corre entre su equipo dejando veneno: el que te persiga acaba lanzado hacia los tuyos.'
    },
    tips: [
      'El Lanzamiento (E) tiene el alcance justo para sorprender: gira en seco a mitad de una huida y lánzalo hacia tu torre.',
      'La Cola Adhesiva (W) sobre el punto de fuga del rival lo condena: colócala DELANTE de él, no bajo sus pies.',
      'Tu ultimate da estadísticas masivas: actívala antes de entrar a cualquier pelea o persecución.',
      'La estrategia del "Singed proxy": farmea entre las torres enemigas para desquiciar al rival. Alto riesgo, alta recompensa.'
    ]
  }],

  sion: [{
    name: 'Top — Hacha acumulada (pre-rework)',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Peleador / Escalado AD', difficulty: 'Baja',
    resumen: 'El Sion clásico, antes de su reforma: cada asesinato con Enfurecer suma daño de ataque permanente, y su ultimate le devuelve vida con cada golpe. Un juggernaut sencillo y brutal que apila hacha hasta volverse imparable.',
    items: {
      inicio: START_TOP,
      core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
      situacionales: [[3083, 'Armadura de Warmog'], [3005, 'Empalador de Atma'], [3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual']]
    },
    runas: R.adTop, maestrias: M.bruiser,
    hechizos: [SS.tp, SS.flash], habilidades: ['W', 'Q', 'E'],
    plan: {
      early: 'Apila con Enfurecer: cada súbdito que mates suma AD permanente. Usa el Golpe Poderoso (Q) para aturdir cuando el rival se acerque a la oleada.',
      mid: 'Con las pilas acumuladas y Trinidad, tus intercambios son demoledores. Tu ultimate te da chupavidas masivo: entra a los 2v2 sin miedo.',
      late: 'Eres un peleador de sostenimiento puro: la ulti convierte todo tu daño en curación. Aturde al carry y quédate encima hasta que caiga.'
    },
    tips: [
      'Cada last hit con Enfurecer activo suma AD para el resto de la partida: nunca lo desactives mientras farmeas.',
      'El escudo (W) explota al terminar haciendo daño en área: úsalo al inicio del intercambio para el escudo Y el daño.',
      'La ultimate da chupavidas y velocidad de ataque: actívala ANTES del combate, no cuando ya estés bajo.',
      'Este es el Sion pre-rework de LoL Classic: nada que ver con el tanque moderno que carga con la Q.'
    ]
  }],

  teemo: [{
    name: 'Top — Setas y veneno',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Poke / Trampas', difficulty: 'Baja',
    resumen: 'El demonio del Yordle: ciega a los AD dejándolos inofensivos, envenena a distancia y siembra el mapa entero de setas invisibles. Con Liandry y Nashor, cada trampa de Teemo hace un daño desproporcionado, y el mapa deja de ser seguro para el rival.',
    items: {
      inicio: START_AP,
      core: [[3115, 'Diente de Nashor'], [3020, 'Botas de Hechicero'], [3151, 'Tormento de Liandry']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3116, 'Cetro de Cristal de Rylai'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío']]
    },
    runas: R.apMid, maestrias: M.apDef,
    hechizos: [SS.ignite, SS.flash], habilidades: ['E', 'Q', 'W'],
    plan: {
      early: 'Ciega (Q) al top rival cada vez que intente autoatacarte: si es un AD como Tryndamere o Jax, la línea es tuya gratis.',
      mid: 'Siembra setas en cada arbusto del río y en las entradas de tu jungla. Con Liandry, cada seta pisada quema un porcentaje de vida enorme.',
      late: 'No pelees de frente: envenena, siembra y empuja el lateral. Tu mapa minado gana peleas en las que ni siquiera estás presente.'
    },
    tips: [
      'La ceguera anula TODOS los autoataques: contra un ADC en teamfight vale más que cualquier daño.',
      'Las setas duran 5 minutos: siembra antes de barón y dragón, no cuando ya esté empezando la pelea.',
      'Liandry se combina con el veneno de tu E: es daño porcentual continuo contra tanques.',
      'Tu W te da un pico de velocidad al salir de combate: úsala para reposicionarte, no para perseguir.'
    ]
  }],

  tryndamere: [{
    name: 'Top — Furia y crítico',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Duelista / Split push', difficulty: 'Baja',
    resumen: 'El rey bárbaro no puede morir durante 5 segundos, y en 5 segundos con Filo Infinito puede matar a cualquiera. Un duelista puro que acumula Furia con cada crítico y convierte cualquier 1v1 en un asunto ya resuelto.',
    items: {
      inicio: START_AD,
      core: [[3006, 'Grebas de Berserker'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral']],
      situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras'], [3143, 'Presagio de Randuin']]
    },
    runas: R.adTop, maestrias: M.ad,
    hechizos: [SS.tp, SS.flash], habilidades: ['E', 'W', 'Q'],
    plan: {
      early: 'Acumula Furia con los críticos sobre súbditos: al 100 de Furia tu Q cura muchísimo. Intercambia solo con la barra llena.',
      mid: 'Filo Infinito y a hacer split push. Tu ultimate te hace invulnerable: puedes torretear bajo torre enemiga y salir vivo con el dash de la E.',
      late: 'Presiona un lateral eternamente y obliga a que manden dos. Si te encierran, R + E es una fuga que casi nadie puede castigar.'
    },
    tips: [
      'Furia Incontenible (R) evita la muerte 5 segundos, no cura: úsala ANTES del golpe letal, no después.',
      'La Q cura más cuanta más Furia tengas: gasta la barra solo cuando lo necesites de verdad.',
      'Tu W reduce el AD del rival y su velocidad de movimiento si mira hacia otro lado: úsala al iniciar cada duelo.',
      'La E resetea con cada kill: en el caos de una pelea puedes atravesar el mapa entero saltando.'
    ]
  }],

  monkeyking: [{
    name: 'Top — Engaño y ciclón',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Peleador / Burst', difficulty: 'Media',
    resumen: 'El rey de los monos entra con un clon, aparece por detrás y lanza a todo el equipo enemigo por los aires con el Ciclón. Con Fuerza de Trinidad y La Cuchilla Negra su combo borra a cualquier objetivo blando en dos segundos.',
    items: {
      inicio: START_TOP,
      core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
      situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3068, 'Capa de Fuego Solar'], [3072, 'La Sanguinaria']]
    },
    runas: R.adTop, maestrias: M.adPen,
    hechizos: [SS.tp, SS.flash], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Tu pasiva te da armadura y regeneración al lado de enemigos: los intercambios largos te favorecen. Q reduce armadura, así que ábrelos siempre con ella.',
      mid: 'Con Trinidad, el combo E → Q → auto → R borra a un carry. Usa el clon (W) para engañar en los ganks: el rival siempre persigue al falso.',
      late: 'Tu Ciclón sobre 3+ rivales agrupados gana la teamfight. Entra por el flanco con la E, ulti y deja que tu equipo recoja.'
    },
    tips: [
      'El clon (W) te hace invisible un instante y él imita tu último ataque: es escape, engaño e iniciación.',
      'La E ataca a todos los objetivos que atraviesa: salta sobre un súbdito para alcanzar al rival detrás.',
      'El Ciclón te da velocidad de movimiento mientras gira: puedes perseguir mientras haces el daño.',
      'Tu pasiva escala con el número de enemigos cerca: en teamfight eres mucho más duro de lo que parece.'
    ]
  }],

  nidalee: [{
    name: 'Top — Lanza y felina',
    season: 'S3', modo: 'grieta', role: 'Top', style: 'Híbrida / Poke', difficulty: 'Alta',
    resumen: 'Dos campeonas en una: en forma humana pokea con lanzas que atraviesan media pantalla y cura a sus aliados; en forma de puma salta, muerde y ejecuta. La Nidalee clásica premia la puntería como ninguna otra.',
    items: {
      inicio: START_AP,
      core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3100, 'Perdición del Liche']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío']]
    },
    runas: R.apMid, maestrias: M.apDef,
    hechizos: [SS.ignite, SS.flash], habilidades: ['Q', 'W', 'E'],
    plan: {
      early: 'Pokea con la lanza desde el máximo alcance y cúrate con la W. La trampa (E) da visión y ralentiza: colócala en el arbusto del río.',
      mid: 'Athene resuelve tu maná y a partir de ahí es lanza sin parar. Cambia a puma solo para rematar: salto → garra → mordisco es una ejecución.',
      late: 'Eres artillería con escape: pokea desde fuera de rango, y si alguien salta, cambias a puma y desapareces por los muros.'
    },
    tips: [
      'La lanza hace más daño cuanto más lejos viaje: castiga desde el máximo alcance posible, no de cerca.',
      'El mordisco de puma hace daño extra según la vida que le falte al rival: es una ejecución pura.',
      'Cambiar de forma resetea los enfriamientos de la otra forma: alterna para tener siempre algo disponible.',
      'Tus trampas dan visión permanente: siémbralas en las entradas de tu jungla como wards gratis.'
    ]
  }]
});

// ---------- Roster completo: jungla ----------
Object.assign(BUILDS, {
  evelynn: [{
    name: 'Jungla — Acecho invisible',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Asesina / Sigilo', difficulty: 'Media',
    resumen: 'La Hacedora de Viudas de la era clásica se movía invisible por todo el mapa sin necesidad de ultimate. Con la Tenaza de Muerte Ígnea aparecía detrás del carry rival y lo borraba antes de que la barra de vida terminara de bajar.',
    items: {
      inicio: START_JG,
      core: [[1080, 'Piedra Espiritual'], [3128, 'Tenaza de Muerte Ígnea'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
      situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3026, 'Ángel de la Guarda']]
    },
    runas: R.junglaAP, maestrias: M.ap,
    hechizos: [SS.smite, SS.flash], habilidades: ['Q', 'W', 'E'],
    plan: {
      early: 'Tu sigilo permanente es información: merodea por los carriles sin ser vista y castiga cualquier posicionamiento adelantado. Los rivales sin visión juegan a ciegas.',
      mid: 'Con la Tenaza, tu combo mata a cualquier objetivo blando: Tenaza → R (ralentiza en área) → Q → W → auto. Caza a los que roten solos.',
      late: 'El late es tu enemigo: los rivales compran visión. Fuerza objetivos y peleas antes de que el mapa se llene de wards rosas.'
    },
    tips: [
      'El sigilo clásico se rompe al atacar: acércate del todo antes de empezar el combo.',
      'La Tenaza amplifica todo el daño posterior un 20%: ábrela SIEMPRE antes del resto del combo.',
      'Tu ultimate ralentiza en área y hace daño: sirve para iniciar y para escapar.',
      'Los wards rosas son tu perdición: acompaña a tu equipo para limpiarlos antes de cada objetivo.'
    ]
  }],

  fiddlesticks: [{
    name: 'Jungla — Tormenta de cuervos',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Mago de área / Emboscada', difficulty: 'Media',
    resumen: 'El espantapájaros espera en un arbusto y cae sobre el equipo entero con la Tormenta de Cuervos. Con el Espíritu del Gólem Antiguo aguanta la jungla sin despeinarse, y su Terror deja sin jugar al carry rival durante segundos eternos.',
    items: {
      inicio: START_JG,
      core: [[1080, 'Piedra Espiritual'], [3207, 'Espíritu del Gólem Antiguo'], [3020, 'Botas de Hechicero'], [3157, 'Reloj de Arena de Zhonya']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío'], [3165, 'Morellonomicon']]
    },
    runas: R.junglaAP, maestrias: M.apDef,
    hechizos: [SS.smite, SS.flash], habilidades: ['W', 'E', 'Q'],
    plan: {
      early: 'Tu clear es lento pero tu Drenaje (W) te mantiene arriba. Gankea con el Terror (Q): dos segundos sin control es una kill garantizada.',
      mid: 'Escóndete en un arbusto junto al objetivo y espera. La Tormenta de Cuervos sobre un equipo agrupado gana peleas antes de que empiecen.',
      late: 'Eres el iniciador sorpresa: Destello + R en medio de su formación, y Zhonya inmediatamente después para sobrevivir a la canalización.'
    },
    tips: [
      'El Terror (Q) es el CC más largo del juego clásico: úsalo sobre el que peor te venga, no sobre el más cercano.',
      'Zhonya justo después de la R te permite seguir haciendo daño mientras eres intocable.',
      'La Tormenta se canaliza 1.5 segundos y es visible: hazlo desde un arbusto o niebla de guerra.',
      'Tu Silencio (E) rebota entre objetivos: es tu farmeo de campamentos y tu corte de canalizaciones.'
    ]
  }],

  nunu: [{
    name: 'Jungla — Robaobjetivos',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Tanque / Utilidad', difficulty: 'Baja',
    resumen: 'El jinete de yetis clásico era el rey de los objetivos: su Devorar hace daño fijo enorme a los monstruos y roba dragones y barones desde el otro lado del muro. Encima acelera a su carry con Hervir Sangre y congela equipos enteros con el Cero Absoluto.',
    items: {
      inicio: START_JG,
      core: [[1080, 'Piedra Espiritual'], [3207, 'Espíritu del Gólem Antiguo'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
      situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3075, 'Malla de Espinas'], [3110, 'Corazón de Hielo']]
    },
    runas: R.jungla, maestrias: M.tank,
    hechizos: [SS.smite, SS.flash], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Devorar (Q) hace daño fijo y te cura: tu clear es rapidísimo y puedes invadir la jungla rival robándole los campamentos.',
      mid: 'Eres el mejor ladrón de objetivos del juego: Castigo + Devorar roba cualquier dragón. Hervir Sangre sobre tu ADC lo convierte en una ametralladora.',
      late: 'El Cero Absoluto es una amenaza en sí misma: cánalo desde detrás de un muro. Aunque no complete, ralentiza el 95% y desmonta la formación rival.'
    },
    tips: [
      'Devorar hace 500+ de daño fijo a monstruos: sumado a Castigo, roba objetivos imposibles.',
      'Hervir Sangre (W) da velocidad de ataque y movimiento a un aliado: es un buff de carry, úsalo siempre en peleas.',
      'El Cero Absoluto ralentiza desde el primer instante aunque lo canceles: cánalo para desmontar una iniciación.',
      'Tu bola de nieve (E) es un aturdimiento a distancia... si aciertas. Practica el liderazgo del proyectil.'
    ]
  }],

  olaf: [{
    name: 'Jungla — Ragnarok imparable',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Peleador / Duelista', difficulty: 'Baja',
    resumen: 'El berserker que se vuelve inmune al control de masas: con Ragnarok activo, ningún aturdimiento, raíz ni supresión lo detiene. Cuanta menos vida tiene, más rápido ataca. Un jungla de early game que simplemente corre hacia ti y no hay forma de pararlo.',
    items: {
      inicio: START_JG,
      core: [[1080, 'Piedra Espiritual'], [3209, 'Espíritu del Lagarto Anciano'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
      situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3072, 'La Sanguinaria'], [3153, 'Hoja del Rey Arruinado']]
    },
    runas: R.jungla, maestrias: M.adPen,
    hechizos: [SS.smite, SS.flash], habilidades: ['E', 'Q', 'W'],
    plan: {
      early: 'Tu clear con la E (daño de vida verdadera) es de los más rápidos. Gankea pronto y a menudo: recoger el hacha (Q) reduce su enfriamiento y te acelera.',
      mid: 'Con el Lagarto Anciano ganas cualquier duelo. Tu Ragnarok te hace inmune al CC: eres el mejor perseguidor y el peor rival para los tanques con control.',
      late: 'Tu papel es entrar sobre el carry e ignorar todo lo que le tiren. Nadie te puede frenar — literalmente — así que elige objetivo y ve a por él.'
    },
    tips: [
      'Recoger el hacha (Q) tras lanzarla reduce mucho su enfriamiento: apunta a donde vayas a caminar.',
      'Ragnarok limpia y previene TODO el CC mientras dura, pero baja tu armadura: es ofensivo, no defensivo.',
      'La E cuesta vida y hace daño verdadero: es tu clear y tu daño contra tanques.',
      'Tu pasiva te da velocidad de ataque según la vida que te falte: pelear al límite es literalmente tu fantasía.'
    ]
  }],

  rammus: [{
    name: 'Jungla — Bola rodante (anti-AD)',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Tanque / Iniciador', difficulty: 'Baja',
    resumen: 'OK. El armadurillo rueda desde el otro lado del mapa, aturde, provoca al carry rival y devuelve el daño con Malla de Espinas y su Caparazón Espinoso. Contra composiciones de ataques básicos es directamente injusto.',
    items: {
      inicio: START_JG,
      core: [[1080, 'Piedra Espiritual'], [3207, 'Espíritu del Gólem Antiguo'], [3047, 'Tabi de Ninja'], [3075, 'Malla de Espinas']],
      situacionales: [[3143, 'Presagio de Randuin'], [3068, 'Capa de Fuego Solar'], [3065, 'Rostro Espiritual'], [3110, 'Corazón de Hielo']]
    },
    runas: R.jungla, maestrias: M.tank,
    hechizos: [SS.smite, SS.flash], habilidades: ['E', 'W', 'Q'],
    plan: {
      early: 'Tu Q (Bola Rodante) necesita distancia para acelerar: empieza el gank desde muy atrás y llega a máxima velocidad para el aturdimiento.',
      mid: 'Con Malla de Espinas y armadura eres inmune al daño físico. Provoca (E) al hipercarry rival y deja que se mate solo pegándote.',
      late: 'Tu única misión: rodar hasta el ADC enemigo, aturdirlo y provocarlo lejos de su equipo. La Provocación gana peleas por sí sola.'
    },
    tips: [
      'La Bola Rodante acelera con la distancia recorrida: nunca la actives justo al lado del objetivo.',
      'La Provocación (E) obliga al rival a autoatacarte 3 segundos: úsala sobre el carry, nunca sobre el tanque.',
      'Tu W devuelve daño y aumenta resistencias: actívala al recibir el foco, no antes.',
      'Tu pasiva convierte armadura en daño de ataque: comprar armadura te hace más fuerte en todos los sentidos.'
    ]
  }],

  shaco: [{
    name: 'Jungla — Cajas y engaño',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Asesino / Emboscada', difficulty: 'Alta',
    resumen: 'El bufón siniestro clona su jungla con cajas, aparece invisible detrás del carry y lo apuñala por la espalda con daño crítico garantizado. El Farol Inquieto sostiene su clear y El Embrutecedor convierte cada puñalada en una sentencia.',
    items: {
      inicio: START_JG,
      core: [[3154, 'Farol Inquieto'], [3111, 'Botas de Mercurio'], [3134, 'El Embrutecedor'], [3071, 'La Cuchilla Negra']],
      situacionales: [[3031, 'Filo Infinito'], [3026, 'Ángel de la Guarda'], [3142, 'Filo Fantasmal de Youmuu'], [3072, 'La Sanguinaria']]
    },
    runas: R.jungla, maestrias: M.adPen,
    hechizos: [SS.smite, SS.flash], habilidades: ['E', 'Q', 'W'],
    plan: {
      early: 'Coloca cajas en los campamentos antes de que aparezcan: tu primer clear es el más rápido del juego. Gankea al nivel 3 desde un arbusto con Engaño (Q).',
      mid: 'Tu daño está en el primer golpe: Q por detrás (crítico garantizado) → E → auto. Si el rival sobrevive, retrocede y espera al siguiente enfriamiento.',
      late: 'Las cajas defienden objetivos y cortan huidas. Tu clon (R) engaña y hace daño en área al morir: úsalo para escapar o para simular una entrada.'
    },
    tips: [
      'Engaño (Q) desde detrás garantiza crítico: siempre aparece por la espalda del objetivo.',
      'Las cajas hacen que el rival huya aterrorizado: colócalas en el paso estrecho, no en campo abierto.',
      'Tu clon imita tus movimientos: úsalo para dividir la atención en las peleas confusas.',
      'Eres un campeón de snowball: si el early no funciona, tu impacto cae en picado. Prioriza los carriles ganables.'
    ]
  }],

  skarner: [{
    name: 'Jungla — Empalar y arrastrar',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Peleador / Control', difficulty: 'Media',
    resumen: 'La vanguardia de cristal tiene la ultimate más injusta del juego clásico: suprime a un rival y lo ARRASTRA consigo. Un solo Empalar sobre el carry enemigo lo saca de su equipo y lo mete en el tuyo. No hay contrajugada.',
    items: {
      inicio: START_JG,
      core: [[1080, 'Piedra Espiritual'], [3209, 'Espíritu del Lagarto Anciano'], [3111, 'Botas de Mercurio'], [3025, 'Guantelete de Hielo']],
      situacionales: [[3068, 'Capa de Fuego Solar'], [3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3110, 'Corazón de Hielo']]
    },
    runas: R.jungla, maestrias: M.bruiser,
    hechizos: [SS.smite, SS.flash], habilidades: ['Q', 'W', 'E'],
    plan: {
      early: 'Tu clear con Q es sostenido y rápido gracias a la pasiva de cristal, que te acelera cerca de tu jungla. Gankea con la E (ralentiza) antes del 6.',
      mid: 'Con el nivel 6 cada gank es una kill: Empalar al rival y arrastrarlo hasta tu torre. Con el Guantelete, nadie escapa de tu ralentización.',
      late: 'Eres un secuestrador: espera a que el carry rival se posicione un pelo adelantado y llévatelo. La pelea se convierte en 5v4 al instante.'
    },
    tips: [
      'Empalar (R) es supresión: solo la Cimitarra Mercurial o Limpiar lo cancelan.',
      'Sigue moviéndote durante la ultimate: el rival va contigo hacia donde tú vayas.',
      'Tu pasiva te da velocidad cerca de los cristales de tu jungla: rota por dentro, no por el río.',
      'La Q resetea el autoataque y se recarga rápido: alterna Q y auto para el máximo daño sostenido.'
    ]
  }],

  warwick: [{
    name: 'Jungla — Sed de sangre (pre-rework)',
    season: 'S3', modo: 'grieta', role: 'Jungla', style: 'Tanque / Duelista', difficulty: 'Baja',
    resumen: 'El Warwick clásico: sustain infinito con Sed de Sangre, un clear que nunca baja de vida y la Represión Infinita, cinco segundos de supresión que sacan a un campeón entero de la pelea. Sencillo, sólido y con la mejor supervivencia de la jungla clásica.',
    items: {
      inicio: START_JG,
      core: [[1080, 'Piedra Espiritual'], [3209, 'Espíritu del Lagarto Anciano'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
      situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3075, 'Malla de Espinas'], [3083, 'Armadura de Warmog']]
    },
    runas: R.jungla, maestrias: M.bruiser,
    hechizos: [SS.smite, SS.flash], habilidades: ['W', 'Q', 'E'],
    plan: {
      early: 'Tu clear no pierde vida: la Q te cura un porcentaje y la W te da velocidad de ataque. Puedes farmear la jungla entera sin volver a base.',
      mid: 'Con el Lagarto Anciano ganas los duelos prolongados. Tu ultimate sobre el carry rival lo saca 5 segundos de la pelea: es una ejecución garantizada.',
      late: 'Eres un tanque con supresión de bolsillo. Entra sobre el objetivo prioritario, suprímelo y deja que tu equipo haga el resto mientras tú te curas.'
    },
    tips: [
      'La Represión Infinita es supresión pura: solo la Cimitarra Mercurial la limpia.',
      'Tu pasiva te acelera hacia los rivales con poca vida: eres el mejor perseguidor del juego clásico.',
      'La W da velocidad de ataque a ti y a los aliados cercanos: es un buff de equipo, no solo tuyo.',
      'Este es el Warwick pre-rework de LoL Classic: sin el aullido ni el salto largo del actual.'
    ]
  }]
});

// ---------- Roster completo: carril central ----------
Object.assign(BUILDS, {
  anivia: [{
    name: 'Mid — Muro y combo',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Maga / Control', difficulty: 'Alta',
    resumen: 'La criofénix controla el mapa con un muro que parte peleas por la mitad, aturde con su Ráfaga Glacial y ejecuta con el combo Q-R-E. Y si la matan, renace de su huevo. Con la Vara de las Edades y su maná infinito, Anivia no cede terreno jamás.',
    items: {
      inicio: START_AP,
      core: [[3027, 'Vara de las Edades'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
      situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3151, 'Tormento de Liandry']]
    },
    runas: R.apMid, maestrias: M.ap,
    hechizos: [SS.flash, SS.ignite], habilidades: ['E', 'Q', 'W'],
    plan: {
      early: 'Eres lenta y frágil hasta el 6: farmea con la E y guarda la Q. Tu Muro de Hielo (W) es tu salvavidas contra cualquier gank.',
      mid: 'El combo completo es Q (aturde al detonar) → R (tormenta) → E (daño extra a congelados). Vara de las Edades te da el cuerpo y el maná para repetirlo sin parar.',
      late: 'Controlas el campo de batalla: parte a su equipo con el muro, congela la zona con la R y ejecuta con la E. Tu huevo te da una vida extra en cada pelea.'
    },
    tips: [
      'La E hace DOBLE daño contra objetivos congelados por tu Q o tu R: ese es todo tu daño.',
      'El Muro de Hielo puede encerrar a un rival contra la pared o cortar a medio equipo: es la habilidad más decisiva del kit.',
      'Tu pasiva (huevo) tiene enfriamiento largo: no juegues agresivo solo porque esté disponible.',
      'La ultimate es un aura permanente: mantenla activa para farmear oleadas y desgastar en asedios.'
    ]
  }],

  brand: [{
    name: 'Mid — Incendio en cadena',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Mago / Área', difficulty: 'Media',
    resumen: 'La venganza ardiente encadena hechizos: cada habilidad aplica Ceniza, y con tres cargas el rival explota aturdido. Su ultimate rebota entre objetivos multiplicando el daño en las peleas agrupadas. Un mago de área que castiga a los equipos que se juntan.',
    items: {
      inicio: START_AP,
      core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
      situacionales: [[3151, 'Tormento de Liandry'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai']]
    },
    runas: R.apMid, maestrias: M.ap,
    hechizos: [SS.flash, SS.ignite], habilidades: ['W', 'Q', 'E'],
    plan: {
      early: 'Farmea con la W (Pilar de Llamas) y guarda la Q para cuando el rival esté marcado con Ceniza: así aturde de verdad.',
      mid: 'Athene resuelve tu maná. El combo de kill es W → E → Q sobre un rival ya con Ceniza: aturdimiento y burst completo.',
      late: 'Tu ultimate rebota más cuanto más agrupado esté su equipo: espera al choque y lánzala en medio. Puedes hacer daño a los cinco a la vez.'
    },
    tips: [
      'La Q aturde SOLO si el objetivo ya tiene Ceniza: aplica primero con W o E.',
      'La ultimate rebota más veces si hay más objetivos cerca: nunca la uses contra un rival aislado.',
      'La W hace daño extra a los objetivos con Ceniza: es tu daño principal de farmeo y de pelea.',
      'La pasiva explota al matar con Ceniza: farmear oleadas con la E es instantáneo.'
    ]
  }],

  gragas: [{
    name: 'Mid — Barril y empujón',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Mago / Peleador', difficulty: 'Media',
    resumen: 'El camorrista mezcla daño mágico, aguante y desplazamientos: rueda el barril, se lanza en Golpe de Cuerpo y manda a todo un equipo por los aires con el Barril Explosivo. Con Vara de las Edades es un mago que además tanquea.',
    items: {
      inicio: START_AP,
      core: [[3027, 'Vara de las Edades'], [3020, 'Botas de Hechicero'], [3116, 'Cetro de Cristal de Rylai']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3151, 'Tormento de Liandry']]
    },
    runas: R.apMid, maestrias: M.apDef,
    hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Farmea con el barril (Q) desde lejos y bebe (W) para reducir el daño de los intercambios. Tu sustain de línea es de los mejores del mid clásico.',
      mid: 'El combo E (embestida) → Q → auto con W activa hace muchísimo daño. Roama a los laterales: tu desplazamiento atraviesa muros.',
      late: 'El Barril Explosivo desmonta formaciones: úsalo para separar al carry de su equipo o para empujar a los rivales hacia los tuyos.'
    },
    tips: [
      'El barril (Q) hace más daño cuanto más tiempo fermente antes de detonarlo: cuenta hasta dos si puedes.',
      'La W reduce el daño recibido mientras bebes y potencia tu siguiente ataque: bébela antes de la embestida.',
      'La R empuja en dirección contraria al centro de la explosión: apunta DETRÁS del rival para traértelo.',
      'La E atraviesa paredes: es escape, iniciación y rotación por la jungla.'
    ]
  }],

  heimerdinger: [{
    name: 'Mid — Torretas y asedio',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Mago / Zonificación', difficulty: 'Media',
    resumen: 'El inventor venerado no lucha: coloca torretas y deja que el carril se defienda solo. Con tres torretas activas y granadas aturdidoras, la línea de Heimerdinger es un territorio en el que el rival simplemente no puede pisar.',
    items: {
      inicio: START_AP,
      core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
      situacionales: [[3151, 'Tormento de Liandry'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai']]
    },
    runas: R.apMid, maestrias: M.ap,
    hechizos: [SS.flash, SS.barrier], habilidades: ['Q', 'W', 'E'],
    plan: {
      early: 'Coloca las torretas y farmea sin acercarte. Guarda las cargas para reponerlas: una línea con tres torretas es inatacable.',
      mid: 'Las torretas defienden tu torre sola mientras rotas. La granada (E) aturde si golpea directo: es tu único CC, no lo malgastes.',
      late: 'Eres el rey del asedio y de la defensa de objetivos: coloca torretas en el foso del barón y en las entradas. Tu ultimate potencia la habilidad siguiente enormemente.'
    },
    tips: [
      'La ultimate potencia la SIGUIENTE habilidad: R + E es una granada gigante; R + Q es una torreta que hace daño de área masivo.',
      'Las torretas heredan tu poder de habilidad: cada objeto AP las hace más peligrosas.',
      'La granada aturde con impacto directo y solo ralentiza si es indirecta: apunta con cuidado.',
      'Tus torretas dan visión: colócalas en arbustos del río como sistema de alerta temprana.'
    ]
  }],

  malzahar: [{
    name: 'Mid — Supresión y esbirros',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Mago / Control', difficulty: 'Baja',
    resumen: 'El profeta del Vacío borra oleadas con el Enjambre y anula un campeón entero con Reino Aterrador: una supresión de 2.5 segundos que además hace un daño brutal. Simple, seguro y con la mejor herramienta anti-asesino del juego clásico.',
    items: {
      inicio: START_AP,
      core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3151, 'Tormento de Liandry']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai']]
    },
    runas: R.apMid, maestrias: M.ap,
    hechizos: [SS.flash, SS.ignite], habilidades: ['W', 'E', 'Q'],
    plan: {
      early: 'Farmea con el Enjambre (W) y el Visiones Malignas (E): limpias oleadas enteras sin exponerte y empujas al rival bajo su torre.',
      mid: 'Tu ultimate es una sentencia sobre cualquier campeón sin Cimitarra: R sobre el asesino que salte a tu equipo lo saca de la pelea entero.',
      late: 'Eres el seguro anti-hipercarry: guarda la R para el Master Yi, el Tryndamere o el Katarina que entre. Un solo botón desactiva su partida.'
    },
    tips: [
      'Reino Aterrador es supresión: ni la Fajín de Mercurio la limpia, solo la Cimitarra Mercurial.',
      'La E se propaga al morir el objetivo: colócala en un súbdito para limpiar la oleada en cadena.',
      'Los Vacíolings de tu pasiva atacan solos: empujan la línea sin que tú estés presente.',
      'Tu W y E juntos hacen que empujar sea trivial: aprovecha para rotar y ayudar mientras la oleada avanza sola.'
    ]
  }],

  ryze: [{
    name: 'Mid — Cadena de hechizos',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Mago / Escalado con maná', difficulty: 'Media',
    resumen: 'El hechicero rebelde convierte su maná en poder de habilidad: cuanto más maná acumula con la Lágrima y la Vara de las Edades, más pega cada hechizo. Su ciclo Q-W-E-Q sin enfriamientos apreciables lo convierte en una ametralladora mágica.',
    items: {
      inicio: START_AP,
      core: [[3070, 'Lágrima de la Diosa'], [3027, 'Vara de las Edades'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai']]
    },
    runas: R.apMid, maestrias: M.ap,
    hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Lágrima al primer retorno y a apilar con cada hechizo. Eres débil hasta tener maná: farmea con la Q y respeta a los asesinos.',
      mid: 'Con Vara de las Edades y Arcángel empieza tu partida: la cadena Q → W (raíz) → E → Q borra a los objetivos blandos.',
      late: 'Tu maná es tu daño: con el Arcángel lleno cada Q pega como una ultimate. Encadena hechizos sin parar; el enfriamiento apenas existe.'
    },
    tips: [
      'Cada hechizo reduce el enfriamiento de la Q: el ciclo correcto es Q → W → Q → E → Q.',
      'La E se propaga entre objetivos cercanos: es tu limpieza de oleadas y tu daño de área en pelea.',
      'La ultimate te da velocidad de movimiento a ti y a tu equipo: úsala para llegar a peleas o para huir en grupo.',
      'Cada punto de maná máximo suma AP: los objetos de maná son objetos de daño para ti.'
    ]
  }],

  zilean: [{
    name: 'Mid — Bombas y resurrección',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Mago / Utilidad', difficulty: 'Media',
    resumen: 'El guardián del tiempo aturde con dos bombas encadenadas, acelera a su equipo o ralentiza al rival, y resucita a un aliado muerto con Deformación Temporal. Su ultimate convierte cada teamfight en un 6v5 efectivo.',
    items: {
      inicio: START_AP,
      core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3116, 'Cetro de Cristal de Rylai']],
      situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3222, 'Crisol de Mikael']]
    },
    runas: R.apMid, maestrias: M.ap,
    hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'El combo de bomba doble (Q → W → Q) aturde: es tu única forma de presionar, pero es muy fuerte al nivel 3.',
      mid: 'Tu E acelera al aliado o ralentiza al rival: es peel y persecución constante. Con Athene tienes maná infinito para el poke.',
      late: 'Tu ultimate sobre el carry o el tanque principal decide peleas: ponla ANTES de que muera, con margen. Es una vida extra para tu equipo.'
    },
    tips: [
      'Deformación Temporal (R) se pone antes de morir, no después: anticípate al burst.',
      'La W reinicia los enfriamientos: es lo que permite el aturdimiento de doble bomba.',
      'La bomba también acelera a los aliados si se la lanzas a ellos... y detona igual: úsala con cabeza.',
      'Tu pasiva da experiencia extra a un aliado cercano: quédate junto a tu jungla o carry para adelantarlos de nivel.'
    ]
  }],

  pantheon: [{
    name: 'Mid — Lanza y salto global',
    season: 'S3', modo: 'grieta', role: 'Mid', style: 'Asesino / Presión global', difficulty: 'Baja',
    resumen: 'El artesano de la guerra domina el early como pocos: su lanza (Q) es poke gratis, su Golpe Escudo aturde, y sus críticos garantizados contra objetivos heridos rematan. Y desde el 6, su Gran Caída del Cielo amenaza el mapa entero.',
    items: {
      inicio: START_AD,
      core: [[3134, 'El Embrutecedor'], [3047, 'Tabi de Ninja'], [3071, 'La Cuchilla Negra']],
      situacionales: [[3142, 'Filo Fantasmal de Youmuu'], [3026, 'Ángel de la Guarda'], [3072, 'La Sanguinaria'], [3035, 'Últimas Palabras']]
    },
    runas: R.adTop, maestrias: M.adPen,
    hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Domina con la lanza (Q): es gratis en maná relativo y castiga cada last hit del rival. Tu pasiva bloquea un autoataque cada pocos segundos.',
      mid: 'Con El Embrutecedor tu combo W (aturde) → Q → E mata a la mayoría de magos. Usa la R para aparecer en los ganks de los laterales.',
      late: 'Tu daño cae: conviértete en el iniciador global. Aterriza detrás de su equipo o corta las retiradas — la amenaza de tu ulti obliga a jugar agrupados.'
    },
    tips: [
      'Tu pasiva bloquea el siguiente autoataque tras 4 hechizos o autos: intercambia sabiendo cuándo está lista.',
      'La Q hace crítico garantizado contra objetivos por debajo del 15% de vida: es una ejecución a distancia.',
      'La Gran Caída del Cielo tarda en aterrizar y es visible: úsala sobre rivales ya controlados o para llegar tras una pelea iniciada.',
      'Tu E (Corazón del Coloso) bloquea daño frontal mientras canaliza: úsala mirando al rival, no de espaldas.'
    ]
  }]
});

// ---------- Roster completo: tiradores y soportes ----------
Object.assign(BUILDS, {
  corki: [{
    name: 'ADC — Bombardeo híbrido',
    season: 'S3', modo: 'grieta', role: 'ADC', style: 'Tirador híbrido', difficulty: 'Media',
    resumen: 'El bombardero osado mezcla daño físico y mágico: su pasiva convierte parte de sus autos en daño mágico, y sus misiles teledirigidos pokean desde media pantalla. Con Fuerza de Trinidad, Corki es el tirador más completo de la Season 3.',
    items: {
      inicio: START_AD,
      core: [[3078, 'Fuerza de Trinidad'], [3006, 'Grebas de Berserker'], [3031, 'Filo Infinito']],
      situacionales: [[3046, 'Bailarín Espectral'], [3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras']]
    },
    runas: R.adc, maestrias: M.ad,
    hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Tu pasiva hace que parte de tus autos sea daño mágico: nadie puede contrarrestarte solo con armadura. Pokea con la Q en el 2v2.',
      mid: 'Trinidad completada y a asediar: tus misiles (R) farmean oleadas lejanas y pokean desde fuera de rango. La Valkiria (W) es escape e iniciación.',
      late: 'Eres artillería con movilidad. Kitea con la Valkiria y usa los misiles grandes (cada 3 cargas) para el poke de asedio antes de los objetivos.'
    },
    tips: [
      'Cada 3 misiles disparas un Misil Grande que hace mucho más daño: cuenta las cargas antes de la pelea.',
      'La Valkiria deja un rastro de fuego: úsala para cortar la persecución además de escapar.',
      'Tu E (Cortina de Gas) reduce la armadura y ralentiza: es la apertura de todos tus intercambios.',
      'Trinidad es el objeto de Corki por excelencia: procea con todo y le da la movilidad que necesita.'
    ]
  }],

  kogmaw: [{
    name: 'ADC — Hipercarry porcentual',
    season: 'S3', modo: 'grieta', role: 'ADC', style: 'Tirador / Late game', difficulty: 'Media',
    resumen: 'La boca del abismo no tiene escapes ni defensas: solo el mayor daño sostenido del juego. Su W le da un alcance absurdo y sus autoataques hacen daño porcentual de vida máxima. Con protección, Kog\'Maw derrite equipos enteros desde una distancia obscena.',
    items: {
      inicio: START_AD,
      core: [[3006, 'Grebas de Berserker'], [3153, 'Hoja del Rey Arruinado'], [3085, 'Huracán de Runaan'], [3031, 'Filo Infinito']],
      situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3046, 'Bailarín Espectral'], [3035, 'Últimas Palabras']]
    },
    runas: R.adcVelocidad, maestrias: M.ad,
    hechizos: [SS.flash, SS.heal], habilidades: ['W', 'Q', 'E'],
    plan: {
      early: 'Eres muy vulnerable: farmea seguro detrás de tu soporte y usa la W solo cuando el intercambio sea claramente tuyo.',
      mid: 'Con Rey Arruinado y velocidad de ataque, tus autos con W activa hacen daño porcentual: los tanques se derriten igual que los carries.',
      late: 'Tu alcance con la W supera al de las torres. Quédate detrás de todo tu equipo y dispara: tu pasiva sigue haciendo daño incluso después de morir.'
    },
    tips: [
      'La W hace daño mágico porcentual de vida máxima: contra tanques eres el mejor ADC del juego.',
      'Tu pasiva te deja explotar tras morir: si vas a caer, camina hacia ellos y llévate a alguien.',
      'La R es artillería de larga distancia: farmea oleadas lejanas y remata fugitivos con ella.',
      'No tienes escape: tu posicionamiento y tu soporte son literalmente tu supervivencia.'
    ]
  }],

  missfortune: [{
    name: 'ADC — Lluvia de balas',
    season: 'S3', modo: 'grieta', role: 'ADC', style: 'Tiradora / Área', difficulty: 'Baja',
    resumen: 'La cazarrecompensas hace más daño con el primer disparo a cada objetivo nuevo, empuja líneas con la Bala Rebotada y termina peleas enteras con el Tiempo de Bala: una lluvia de balas en cono que borra equipos agrupados.',
    items: {
      inicio: START_AD,
      core: [[3031, 'Filo Infinito'], [3006, 'Grebas de Berserker'], [3087, 'Puñal de Statikk']],
      situacionales: [[3072, 'La Sanguinaria'], [3046, 'Bailarín Espectral'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras']]
    },
    runas: R.adc, maestrias: M.ad,
    hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Tu pasiva (Amor Golpeador) hace daño extra al golpear a un objetivo nuevo: alterna entre súbdito y campeón para el poke gratis del 2v2.',
      mid: 'La Q rebota y hace más daño en el segundo objetivo: apunta a un súbdito con el rival justo detrás. Statikk acelera tu empuje de líneas.',
      late: 'El Tiempo de Bala gana teamfights: canalízalo desde detrás de tu frontline sobre el máximo de rivales. La E ralentiza para asegurar que no salgan del cono.'
    },
    tips: [
      'La Q rebota al enemigo DETRÁS del primer objetivo y hace más daño: es tu poke de línea principal.',
      'Tu ultimate se puede cancelar: úsala solo cuando el rival tenga el CC gastado.',
      'La E (Lluvia de Balas) ralentiza y desactiva la regeneración: colócala en la zona de escape, no encima de ellos.',
      'Tu pasiva premia cambiar de objetivo: no te obsesiones con un solo rival en las peleas.'
    ]
  }],

  twitch: [{
    name: 'ADC — Emboscada y veneno',
    season: 'S3', modo: 'grieta', role: 'ADC', style: 'Tirador / Sigilo', difficulty: 'Media',
    resumen: 'La rata apestada se acerca invisible, envenena y con Pulverizar y Rezar dispara flechas que atraviesan a todo el equipo enemigo. Un ADC que empieza cada teamfight desde una posición imposible y termina con una tetrakill.',
    items: {
      inicio: START_AD,
      core: [[3031, 'Filo Infinito'], [3006, 'Grebas de Berserker'], [3046, 'Bailarín Espectral']],
      situacionales: [[3072, 'La Sanguinaria'], [3085, 'Huracán de Runaan'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras']]
    },
    runas: R.adc, maestrias: M.ad,
    hechizos: [SS.flash, SS.heal], habilidades: ['E', 'W', 'Q'],
    plan: {
      early: 'Tu sigilo (Q) es una amenaza constante: el rival no puede posicionarse tranquilo sabiendo que puedes aparecer detrás con tu soporte.',
      mid: 'Apila veneno con los autos y detona con la E cuando tenga 5-6 cargas: es un burst enorme. Empieza a merodear por el río.',
      late: 'Tu ultimate atraviesa a todos en línea: colócate en un flanco desde sigilo y dispara a través de su equipo entero. Un buen ángulo vale la partida.'
    },
    tips: [
      'La E (Expurgar) hace más daño cuantas más cargas de veneno haya: nunca la uses con 1 o 2 pilas.',
      'Con la R activa tus autos atraviesan a TODOS los rivales en línea: busca el ángulo donde estén alineados.',
      'La W (Emboscada de Contaminación) ralentiza y revela: úsala para cortar la huida.',
      'Tu sigilo se rompe al atacar: usa el tiempo invisible para posicionarte, no para llegar más lejos.'
    ]
  }],

  urgot: [{
    name: 'ADC — Misiles teledirigidos (pre-rework)',
    season: 'S3', modo: 'grieta', role: 'ADC', style: 'Tirador / Poke', difficulty: 'Alta',
    resumen: 'El Urgot clásico, el de los misiles: su Q se autodirige a los rivales marcados por su E, y su ultimate INTERCAMBIA posiciones con un enemigo, dejando al carry rival en medio de tu equipo. Con Manamune, un poke que nunca se queda sin munición.',
    items: {
      inicio: START_AD,
      core: [[3070, 'Lágrima de la Diosa'], [3004, 'Manamune'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
      situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3035, 'Últimas Palabras'], [3072, 'La Sanguinaria']]
    },
    runas: R.adc, maestrias: M.adPen,
    hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'E', 'W'],
    plan: {
      early: 'Marca con la E (granada corrosiva) y luego tu Q se dirige sola al objetivo: es poke garantizado que no se puede esquivar. Dominas la fase de líneas.',
      mid: 'Con Manamune, tu poke es infinito. La E además reduce el daño del rival marcado: es un debuff ofensivo y defensivo a la vez.',
      late: 'Tu ultimate cambia posiciones con el objetivo: sácalo de su equipo y mételo en el tuyo. Es una de las jugadas más decisivas del juego clásico.'
    },
    tips: [
      'La Q se autodirige SOLO contra objetivos marcados por tu E: el orden es siempre E primero.',
      'La ultimate te da resistencias durante el intercambio: puedes sobrevivir al estar en su posición.',
      'Tu W (escudo) hace que tus autos disparen sin fallar y reduce daño: actívalo en cada intercambio.',
      'Este es el Urgot pre-rework de LoL Classic: nada que ver con el juggernaut de piernas actuales.'
    ]
  }],

  janna: [{
    name: 'Support — Vientos y escudos',
    season: 'S3', modo: 'grieta', role: 'Support', style: 'Enchanter / Peel', difficulty: 'Media',
    resumen: 'La furia de la tormenta es el mejor peel del juego clásico: escuda y da AD a su carry, lanza por los aires a quien se acerque y con el Monzón separa a todo un equipo mientras cura. Contra composiciones de entrada, Janna es la respuesta.',
    items: {
      inicio: START_SUP,
      core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3069, 'Emblema de la Ascensión']],
      situacionales: [[3190, 'Medallón Solari de Hierro'], [3222, 'Crisol de Mikael'], [3174, 'Grial Impuro de Athene'], [3060, 'Estandarte de Mando']]
    },
    runas: R.support, maestrias: M.support,
    hechizos: [SS.flash, SS.exhaust], habilidades: ['W', 'E', 'Q'],
    plan: {
      early: 'Tu escudo (E) da AD al aliado además de absorber daño: es ofensivo y defensivo. Acosa con la W, que ralentiza y hace buen daño en línea.',
      mid: 'La pasiva te da velocidad de movimiento a ti y a los cercanos: eres la mejor soporte para rotar. Mantén el río iluminado.',
      late: 'Eres el seguro de vida del carry: guarda la Q para el asesino que salte y el Monzón para deshacer la iniciación enemiga por completo.'
    },
    tips: [
      'La Q se puede cargar: cuanto más tiempo, más alto y más lejos lanza. Suéltala pronto contra un dash inminente.',
      'El Monzón (R) empuja a TODOS y cura mientras canalizas: úsalo para separar, no solo para curar.',
      'El escudo da AD al objetivo: pónselo a tu ADC antes de un intercambio, no solo cuando le peguen.',
      'Puedes cancelar el Monzón antes de tiempo: no hace falta canalizarlo entero si ya has separado.'
    ]
  }],

  lulu: [{
    name: 'Support — Polimorfia y gigante',
    season: 'S3', modo: 'grieta', role: 'Support', style: 'Enchanter / Peel', difficulty: 'Media',
    resumen: 'El hada hechicera convierte al asesino rival en una ardilla indefensa, escuda y acelera a su carry, y con Crecimiento Salvaje lo hace gigante dándole vida extra y un empujón en área. Utilidad pura en cada botón.',
    items: {
      inicio: START_SUP,
      core: [[2049, 'Piedra de Visión'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
      situacionales: [[3069, 'Emblema de la Ascensión'], [3222, 'Crisol de Mikael'], [3174, 'Grial Impuro de Athene'], [3050, 'Heraldo de Zeke']]
    },
    runas: R.supportAP, maestrias: M.support,
    hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'Q', 'W'],
    plan: {
      early: 'Tu E (Ayúdame, Pix!) sobre tu ADC hace que Pix le dispare: es daño extra en cada auto. Acosa con la Q a través del carril.',
      mid: 'La W es doble: polimorfia al rival o acelera al aliado. Un polimorfismo sobre el iniciador enemigo desactiva su jugada por completo.',
      late: 'Crecimiento Salvaje sobre el carry enfocado le da vida máxima y lanza por los aires a los que le rodean: es peel y contrainiciación en un botón.'
    },
    tips: [
      'La polimorfia no permite atacar ni usar habilidades: es el CC más frustrante del juego clásico.',
      'La ultimate da vida MÁXIMA, así que también cura proporcionalmente: úsala antes del burst, no después.',
      'Tu E sobre un aliado lo escuda y le da a Pix; sobre un enemigo hace daño: es tu botón más flexible.',
      'La Q ralentiza a los enemigos y acelera a los aliados que atraviesa: apunta a través de tu propio carry.'
    ]
  }]
});

// ---------- ARAM: tanda 1 (tiers S+ y S) ----------
// En ARAM no hay retorno a base ni objetos de oro: el inicio es distinto, los
// hechizos cambian (Claridad manda) y el plan gira en torno al desgaste continuo.
const ARAM_INICIO_AP = [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida']];
const ARAM_INICIO_AD = [[1055, 'Espada de Doran'], [2003, 'Poción de Vida']];

function aramBuild(o) {
  return Object.assign({ season: 'S3', modo: 'aram', difficulty: 'Media' }, o);
}

BUILDS.brand.push(aramBuild({
  name: 'ARAM — Incendio en cadena', role: 'Mid', style: 'Mago de área',
  resumen: 'Brand es el rey indiscutible del carril único: su ultimate rebota entre cinco rivales apretados multiplicando el daño, y su Ceniza convierte cada hechizo en un aturdimiento. En ARAM no hay dónde esconderse de él.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3151, 'Tormento de Liandry']],
    situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío'], [3157, 'Reloj de Arena de Zhonya']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'Pilar de Llamas (W) sobre la oleada y sobre quien esté detrás: el daño en área es constante y gratuito. Cada punto de vida quitado es permanente.',
    mid: 'Con Liandry, tu quemadura hace daño porcentual: los tanques se derriten igual que los magos. Aplica Ceniza con la E y aturde con la Q.',
    late: 'Guarda la ultimate para el choque: con cinco rivales agrupados rebota sin parar y puede hacer un pentakill sola. Nunca la uses contra uno aislado.'
  },
  tips: [
    'La R rebota más veces cuanto más agrupado esté el equipo rival: el carril de ARAM es su escenario perfecto.',
    'Claridad resuelve tu único límite: con maná infinito, tu poke no para nunca.',
    'La Q solo aturde a objetivos con Ceniza: aplica siempre primero con la W o la E.',
    'Liandry se combina con tu quemadura pasiva: es el objeto que multiplica todo tu kit.'
  ]
}));

BUILDS.morgana.push(aramBuild({
  name: 'ARAM — Lazo y escudo', role: 'Mid', style: 'Maga / Control', difficulty: 'Baja',
  resumen: 'En un carril recto y estrecho, el Lazo Oscuro de Morgana casi no se puede esquivar. Y su Escudo Negro anula el control de masas del equipo rival entero, que en ARAM es lo que decide las peleas.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3151, 'Tormento de Liandry']],
    situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'El Suelo Atormentado (W) sobre la oleada es farmeo y desgaste a la vez. El lazo en un carril estrecho acierta casi siempre.',
    mid: 'Escudo Negro sobre el aliado que vayan a enganchar: en ARAM el CC lo es todo, y anularlo gana el choque.',
    late: 'Zhonya + ultimate en medio de su equipo: aturdes a los cinco y sobrevives. Es la jugada que cierra las partidas.'
  },
  tips: [
    'El Escudo Negro bloquea todo el CC mágico: ponlo ANTES del choque, no cuando ya hayan enganchado.',
    'El lazo dura 3 segundos al máximo rango: es una eternidad en una pelea de ARAM.',
    'Tu W hace daño creciente a quien se quede dentro: colócalo en el punto de paso obligatorio.',
    'La ultimate te cura por cada rival cercano: entrar puede ser más seguro de lo que parece.'
  ]
}));

BUILDS.veigar.push(aramBuild({
  name: 'ARAM — Jaula y AP infinito', role: 'Mid', style: 'Mago / Escalado',
  resumen: 'Veigar apila poder de habilidad sin techo, y en ARAM tiene oleadas infinitas que farmear sin riesgo. Su Jaula del Terror cierra el carril entero y su ultimate ejecuta a cualquier mago rival de un solo botón.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3070, 'Lágrima de la Diosa'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3151, 'Tormento de Liandry']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Apila con la Q sobre cada súbdito que puedas rematar: en ARAM las oleadas no paran, así que tu AP tampoco.',
    mid: 'La Jaula (E) en un carril estrecho atrapa a medio equipo. Combo: E → W → Q → R sobre el objetivo más peligroso.',
    late: 'Con 700+ de AP eres una torreta de un disparo. Colócate detrás de todo y ejecuta a quien se acerque; tu R escala con el AP del rival.'
  },
  tips: [
    'La Jaula aturde solo a quien la cruce de dentro hacia fuera: colócala DETRÁS del grupo enemigo.',
    'Claridad te permite farmear con la Q sin parar: cada carga cuenta para el resto de la partida.',
    'La Materia Oscura (W) tarda en caer: úsala sobre rivales ya atrapados por la jaula.',
    'Contra el mago rival tu ultimate es una ejecución: cuanto más AP tenga él, más daño hace ella.'
  ]
}));

BUILDS.missfortune.push(aramBuild({
  name: 'ARAM — Lluvia de balas', role: 'ADC', style: 'Tiradora / Área', difficulty: 'Baja',
  resumen: 'El Tiempo de Bala en un carril donde nadie puede dispersarse es sencillamente devastador. Y hasta el nivel 6, su Bala Rebotada pokea a través de los súbditos sin coste ni riesgo.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3031, 'Filo Infinito'], [3006, 'Grebas de Berserker'], [3087, 'Puñal de Statikk']],
    situacionales: [[3072, 'La Sanguinaria'], [3046, 'Bailarín Espectral'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras']]
  },
  runas: R.adc, maestrias: M.ad, hechizos: [SS.heal, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'La Q rebota del súbdito al campeón que esté detrás: es poke gratis y constante en la línea de ARAM.',
    mid: 'Statikk acelera tu limpieza de oleadas. Tu pasiva hace daño extra al cambiar de objetivo: reparte los autos, no te fijes en uno.',
    late: 'El Tiempo de Bala desde detrás de tu frontline sobre los cinco: pon antes la E para que no salgan del cono.'
  },
  tips: [
    'La ultimate se cancela con cualquier CC: espera a que gasten sus aturdimientos.',
    'La E ralentiza y corta la regeneración: colócala en su zona de retirada, no encima de ellos.',
    'Tu Q hace más daño al SEGUNDO objetivo: apunta al súbdito con el rival justo detrás.',
    'Sin escapes: en ARAM tu posicionamiento detrás de la frontline es toda tu supervivencia.'
  ]
}));

BUILDS.ahri.push(aramBuild({
  name: 'ARAM — Encanto y movilidad', role: 'Mid', style: 'Maga / Asesina',
  resumen: 'El Encanto es casi imposible de esquivar en un carril estrecho, y los tres dashes de la ultimate dan a Ahri algo que casi nadie tiene en ARAM: la capacidad de entrar, ejecutar y salir viva.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3128, 'Tenaza de Muerte Ígnea']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'La Q atraviesa el carril entero y su vuelta hace daño verdadero: es el mejor poke sostenido del early en ARAM.',
    mid: 'Encanto acertado es media pelea: E → Q → W borra a cualquier objetivo blando. Athene te da maná para no parar nunca.',
    late: 'Usa dos dashes para entrar y ejecutar, y guarda SIEMPRE el tercero para salir. La avaricia es la única forma de morir con Ahri.'
  },
  tips: [
    'El daño verdadero de la vuelta de la Q ignora toda resistencia: acierta con las dos direcciones.',
    'En ARAM tu curación por daño de la pasiva sostiene el carril entero: pokea sin miedo.',
    'El Encanto interrumpe dashes en curso: es tu botón anti-iniciación.',
    'Nunca entres sin Encanto disponible: es tu apertura y tu seguro.'
  ]
}));

BUILDS.soraka.push(aramBuild({
  name: 'ARAM — Curación infinita', role: 'Support', style: 'Enchanter / Sostenimiento', difficulty: 'Baja',
  resumen: 'En un modo sin retorno a base, la que cura gana. Soraka mantiene a cinco aliados en pie indefinidamente mientras pokea con Llamada Estelar, y su Deseo global cura al equipo entero en el momento crítico.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
    situacionales: [[3222, 'Crisol de Mikael'], [3116, 'Cetro de Cristal de Rylai'], [3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya']]
  },
  runas: R.supportAP, maestrias: M.support, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Llamada Estelar (Q) sobre el grupo enemigo: te cura a ti y les desgasta a ellos. Es sostenimiento y poke en un solo botón.',
    mid: 'Tu W cuesta vida propia: por eso el orden es Q primero (para recuperar) y luego curar. Con Athene, el maná deja de existir.',
    late: 'El Deseo (R) cura a los cinco a la vez: en un choque de ARAM equivale a revivir a medio equipo. Guárdalo para el momento exacto.'
  },
  tips: [
    'Cada Q que impacta te devuelve vida: pokea antes de curar, siempre en ese orden.',
    'El silencio de la E corta canalizaciones e iniciaciones: úsalo sobre el mago rival.',
    'La Q apila reducción de resistencia mágica: tus magos aliados pegan más con cada impacto tuyo.',
    'En ARAM eres el objetivo prioritario del rival: quédate detrás de la frontline aunque tu rango de curación sea corto.'
  ]
}));

BUILDS.anivia.push(aramBuild({
  name: 'ARAM — Muro en el carril', role: 'Mid', style: 'Maga / Control', difficulty: 'Alta',
  resumen: 'El Muro de Hielo en un carril de un solo camino es directamente injusto: parte al equipo rival en dos y les impide avanzar o retirarse. Sumado al combo Q-R-E, Anivia controla el ritmo entero de la partida.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3027, 'Vara de las Edades'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3151, 'Tormento de Liandry'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'Farmea con la E y mantén la tormenta (R) sobre la oleada: desgaste continuo sin exponerte. Tu huevo te da un margen de error enorme.',
    mid: 'El combo es Q (detonar para aturdir) → R → E: la E hace DOBLE daño contra congelados. Vara de las Edades te da el cuerpo para aguantar.',
    late: 'El muro decide los choques: parte su equipo por la mitad y quédate con los tres que hayan pasado. Es la habilidad más decisiva de ARAM.'
  },
  tips: [
    'La E hace el doble contra objetivos congelados por tu Q o tu R: ese es todo tu daño.',
    'El muro puede encerrar a un rival contra la pared del carril: es una sentencia de muerte.',
    'Mantén la ultimate activa mientras pokeas: ralentiza y prepara el doble daño de la E.',
    'Tu huevo es una segunda vida en cada pelea: úsalo para posicionarte más agresivo de lo normal.'
  ]
}));

BUILDS.heimerdinger.push(aramBuild({
  name: 'ARAM — Torretas en el carril', role: 'Mid', style: 'Zonificación', difficulty: 'Baja',
  resumen: 'Tres torretas en un carril de un solo camino son un muro que el equipo rival simplemente no puede cruzar. Heimerdinger convierte ARAM en un asedio permanente en el que él siempre defiende.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3151, 'Tormento de Liandry'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.barrier], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Coloca las tres torretas en el punto estrecho del carril y quédate detrás. Guarda una carga para reponer la que caiga.',
    mid: 'Los misiles (W) pokean a través de la oleada. La granada (E) aturde con impacto directo: es tu único CC, no lo desperdicies.',
    late: 'Tu ultimate potencia la siguiente habilidad: R + Q pone una torreta gigante que sola gana el choque. R + E es una granada enorme en área.'
  },
  tips: [
    'R + Q crea una torreta enorme con daño de área: es tu jugada de teamfight en ARAM.',
    'Las torretas heredan tu AP: cada objeto las hace más peligrosas.',
    'La granada aturde solo con impacto directo; indirecta solo ralentiza. Apunta con cuidado.',
    'Defender es tu fuerte: deja que se estrellen contra tus torretas y contraataca después.'
  ]
}));

BUILDS.fiddlesticks.push(aramBuild({
  name: 'ARAM — Tormenta en el choque', role: 'Mid', style: 'Mago de área / Emboscada',
  resumen: 'La Tormenta de Cuervos sobre cinco rivales agrupados en un carril estrecho es de las jugadas más rentables del modo. Y su Terror deja fuera de la pelea al campeón más peligroso durante segundos eternos.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3157, 'Reloj de Arena de Zhonya']],
    situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3151, 'Tormento de Liandry'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío']]
  },
  runas: R.apMid, maestrias: M.apDef, hechizos: [SS.clarity, SS.flash], habilidades: ['W', 'E', 'Q'],
  plan: {
    early: 'El Drenaje (W) sobre la oleada te mantiene arriba sin volver a base. El Silencio (E) rebota entre objetivos: es tu poke de área.',
    mid: 'Athene te da maná infinito. Usa el Terror sobre el que más daño haga en cada choque: dos segundos sin control es media pelea.',
    late: 'Destello + Tormenta de Cuervos en medio de su formación, y Zhonya inmediatamente después. Sobrevives la canalización y ellos no la pelea.'
  },
  tips: [
    'Zhonya justo después de la ultimate: sigues haciendo daño mientras eres intocable.',
    'La canalización de la R es visible y lenta: hazla desde detrás de tu equipo o tras un Destello.',
    'El Terror es el CC más largo del juego clásico: úsalo sobre el hipercarry, no sobre el tanque.',
    'Tu W te cura mucho: en un modo sin retorno a base, eso es una ventaja enorme.'
  ]
}));

BUILDS.zilean.push(aramBuild({
  name: 'ARAM — Bombas y segunda vida', role: 'Support', style: 'Utilidad / Poke', difficulty: 'Media',
  resumen: 'La Deformación Temporal de Zilean resucita al aliado que caiga en el peor momento, lo que en un modo sin retorno a base cambia el resultado de cada choque. Y su doble bomba aturde a todo el que se acerque.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3116, 'Cetro de Cristal de Rylai']],
    situacionales: [[3222, 'Crisol de Mikael'], [3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3190, 'Medallón Solari de Hierro']]
  },
  runas: R.supportAP, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'La bomba sobre la oleada pokea y farmea a la vez. El combo Q → W → Q aturde en área desde el nivel 3.',
    mid: 'Tu E acelera a tu iniciador o ralentiza al rival que persiga: en ARAM ese control de ritmo vale tanto como el daño.',
    late: 'La ultimate sobre el carry o el tanque ANTES de que muera: una resurrección en el momento justo gana el choque y la partida.'
  },
  tips: [
    'La R se pone antes de morir, con margen: anticípate al burst, no reacciones a él.',
    'La W reinicia enfriamientos y es lo que permite el aturdimiento de doble bomba.',
    'Puedes poner la bomba sobre un aliado para acelerarlo: sigue detonando, úsalo con cabeza.',
    'Tu pasiva da experiencia extra a un aliado cercano: quédate junto al carry para adelantarlo de nivel.'
  ]
}));

BUILDS.ezreal.push(aramBuild({
  name: 'ARAM — Poke con Muramana', role: 'ADC', style: 'Tirador / Poke',
  resumen: 'El Disparo Místico a 1100 de rango en un carril recto es poke puro y sin riesgo, y con Muramana cada proyectil pega como un objeto entero. Ezreal desgasta al equipo rival hasta que la pelea ya está ganada.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3070, 'Lágrima de la Diosa'], [3078, 'Fuerza de Trinidad'], [3006, 'Grebas de Berserker'], [3004, 'Manamune']],
    situacionales: [[3072, 'La Sanguinaria'], [3035, 'Últimas Palabras'], [3026, 'Ángel de la Guarda'], [3046, 'Bailarín Espectral']]
  },
  runas: R.adc, maestrias: M.adPen, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Q sin parar desde el máximo alcance. Cada impacto reduce tus enfriamientos y apila la Lágrima: el poke se retroalimenta.',
    mid: 'Con Trinidad, cada Q procea Brillo. Tu patrón es Q → reposición → Q: nunca te dejes alcanzar.',
    late: 'Muramana activa convierte tu maná en daño. La ultimate limpia oleadas y pokea desde el otro extremo del carril.'
  },
  tips: [
    'La Q aplica efectos de objeto: es un autoataque disfrazado de habilidad.',
    'El Desplazamiento (E) es tu vida: nunca lo uses para dañar si puede servir para escapar.',
    'Claridad mantiene la Lágrima apilando y el poke sin pausa.',
    'La W acelera la velocidad de ataque de un aliado: tírasela al hipercarry de tu equipo antes del choque.'
  ]
}));

BUILDS.malzahar.push(aramBuild({
  name: 'ARAM — Supresión y enjambre', role: 'Mid', style: 'Mago / Control', difficulty: 'Baja',
  resumen: 'El Enjambre del Vacío limpia oleadas enteras solo y el Reino Aterrador desactiva por completo al campeón más peligroso del equipo rival durante 2.5 segundos. Simple, seguro y decisivo.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3151, 'Tormento de Liandry']],
    situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['W', 'E', 'Q'],
  plan: {
    early: 'El Enjambre (W) y las Visiones (E) limpian la oleada sin que te acerques. En ARAM eso es control del carril gratis.',
    mid: 'Tu R sobre el asesino o el hipercarry rival lo saca entero del choque: es el mejor botón anti-carry del modo.',
    late: 'Guarda la ultimate para el que más daño haga. Con Liandry, además del control, la supresión hace un daño porcentual enorme.'
  },
  tips: [
    'Reino Aterrador es supresión: solo la Cimitarra Mercurial lo limpia.',
    'La E se propaga al morir su objetivo: colócala sobre un súbdito para limpiar la oleada en cadena.',
    'Los Vacíolings de tu pasiva empujan el carril solos mientras tú te reposicionas.',
    'Claridad te da el maná para mantener W y E activos permanentemente.'
  ]
}));

BUILDS.annie.push(aramBuild({
  name: 'ARAM — Tibbers en el choque', role: 'Mid', style: 'Maga / Burst', difficulty: 'Baja',
  resumen: 'Un aturdimiento en área sobre cinco rivales apretados, y un oso que se queda ardiendo encima de ellos. Annie no necesita más: en ARAM, su nivel 6 con la pasiva cargada decide el primer choque y con él la partida.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai'], [3151, 'Tormento de Liandry']]
  },
  runas: R.apMidPlano, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Farmea con la Q, que te devuelve el maná al matar. Cuenta siempre tus cargas: con 4 hechizos lanzados, el siguiente aturde.',
    mid: 'Nunca entres al choque sin la pasiva cargada. Destello + R sobre los cinco es el momento que gana la partida.',
    late: 'Tibbers hace daño de área mientras esté vivo: déjalo dentro de su formación. Tu W y tu Q siguen pegando mientras él aguanta.'
  },
  tips: [
    'Carga el aturdimiento con el escudo (E) sobre ti misma: no gastes maná ofensivo para prepararlo.',
    'Tu R aturde en área: en ARAM alcanza a todo el equipo con facilidad.',
    'Con la pasiva descargada eres inofensiva: cuenta los hechizos antes de cada choque.',
    'Claridad te permite mantener las cargas siempre listas sin quedarte sin maná.'
  ]
}));

BUILDS.ryze.push(aramBuild({
  name: 'ARAM — Cadena de hechizos', role: 'Mid', style: 'Mago / Escalado con maná',
  resumen: 'Ryze convierte maná en daño, y en ARAM tiene oleadas infinitas para apilar la Lágrima sin arriesgar nada. Su ciclo Q-W-E encadenado es daño en área continuo que ningún equipo puede aguantar mucho tiempo.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3070, 'Lágrima de la Diosa'], [3027, 'Vara de las Edades'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel']],
    situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Apila la Lágrima con cada hechizo sobre la oleada. Eres débil hasta tener maná: juega detrás y farmea.',
    mid: 'Con Vara de las Edades y Arcángel empieza tu partida de verdad. La cadena Q → W (raíz) → E → Q borra objetivos blandos.',
    late: 'Tu maná es tu daño: cada Q pega como una ultimate. La E se propaga en área, así que en un carril estrecho pegas a los cinco.'
  },
  tips: [
    'Cada hechizo reduce el enfriamiento de la Q: el ciclo correcto es Q → W → Q → E → Q.',
    'La E se propaga entre objetivos cercanos: en ARAM siempre están cerca.',
    'Tu ultimate acelera a todo el equipo: úsala para iniciar en grupo o retirarse tras un choque perdido.',
    'Claridad + Lágrima es la combinación perfecta: apilas más rápido y nunca te quedas seco.'
  ]
}));

BUILDS.gragas.push(aramBuild({
  name: 'ARAM — Barril y desplazamiento', role: 'Mid', style: 'Mago / Peleador',
  resumen: 'Gragas aguanta como un tanque, pega como un mago y con el Barril Explosivo desmonta la formación rival entera. En un carril estrecho su ultimate empuja a los cinco a la vez.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3027, 'Vara de las Edades'], [3020, 'Botas de Hechicero'], [3116, 'Cetro de Cristal de Rylai']],
    situacionales: [[3151, 'Tormento de Liandry'], [3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío']]
  },
  runas: R.apMid, maestrias: M.apDef, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'El barril (Q) pokea desde lejos y la W reduce el daño que recibes: tu sostenimiento en el carril es de los mejores del modo.',
    mid: 'El combo E (embestida) → Q → auto con la W activa hace un daño enorme. Vara de las Edades te da cuerpo para entrar y salir vivo.',
    late: 'El Barril Explosivo separa a su equipo o empuja al carry hacia el tuyo: colócalo DETRÁS del objetivo para traértelo.'
  },
  tips: [
    'El barril hace más daño cuanto más fermente: cuenta hasta dos antes de detonarlo si puedes.',
    'La R empuja en dirección contraria al centro de la explosión: apunta detrás del rival.',
    'La W reduce el daño recibido mientras bebes: actívala justo antes de la embestida.',
    'La E atraviesa las paredes del carril de ARAM: es entrada y escape a la vez.'
  ]
}));

// ---------- ARAM: tanda 2 (tiers S+ y A restantes) ----------
const ARAM_INICIO_TANK = [[1054, 'Escudo de Doran'], [2003, 'Poción de Vida']];
const ARAM_INICIO_SUP = [[1056, 'Anillo de Doran'], [2003, 'Poción de Vida']];

BUILDS.ashe.push(aramBuild({
  name: 'ARAM — Flecha y ralentización', role: 'ADC', style: 'Tiradora / Utility', difficulty: 'Baja',
  resumen: 'Escarcha ralentiza a todo el que se acerque y la Flecha de Cristal atraviesa el carril entero: en ARAM, Ashe controla quién puede pelear y quién no.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3031, 'Filo Infinito'], [3006, 'Grebas de Berserker'], [3046, 'Bailarín Espectral']],
    situacionales: [[3072, 'La Sanguinaria'], [3085, 'Huracán de Runaan'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras']]
  },
  runas: R.adc, maestrias: M.ad, hechizos: [SS.heal, SS.flash], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'Volea (W) en cono sobre el grupo: pokea a varios a la vez y les deja la ralentización de Escarcha encima.',
    mid: 'Tu ralentización permanente hace que nadie pueda acercarse a tu equipo. Dispara la flecha por el carril: casi siempre acierta a alguien.',
    late: 'Kitea detrás de tu frontline. Con Runaan tus autos ralentizan a todo el equipo rival a la vez.'
  },
  tips: [
    'La flecha aturde más cuanto más viaje: en un carril recto son siempre 3+ segundos.',
    'La W es tu poke principal en ARAM: alcanza a varios en cono y no cuesta casi nada.',
    'Sin escapes, tu Destello es sagrado: guárdalo para el asesino, no para avanzar.'
  ]
}));

BUILDS.kogmaw.push(aramBuild({
  name: 'ARAM — Alcance obsceno', role: 'ADC', style: 'Tirador / Late game',
  resumen: 'Con la W activa, Kog\'Maw dispara desde más lejos que nadie y su daño porcentual derrite hasta a los tanques. Si su equipo lo protege, gana la partida solo.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3006, 'Grebas de Berserker'], [3153, 'Hoja del Rey Arruinado'], [3085, 'Huracán de Runaan'], [3031, 'Filo Infinito']],
    situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3046, 'Bailarín Espectral'], [3035, 'Últimas Palabras']]
  },
  runas: R.adcVelocidad, maestrias: M.ad, hechizos: [SS.heal, SS.flash], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'Pokea con la R (artillería) desde el extremo del carril: es gratis, seguro y desgasta sin parar.',
    mid: 'Con Rey Arruinado y velocidad de ataque, la W convierte tus autos en daño porcentual: todo se derrite.',
    late: 'Quédate lo más atrás posible y dispara. Tu pasiva sigue haciendo daño tras morir: camina hacia ellos al caer.'
  },
  tips: [
    'La R apila cargas: cuantas más lances seguidas, más daño hace cada una.',
    'La W te da más alcance que las torres: úsala para asediar sin recibir nada.',
    'No tienes escape: en ARAM tu vida depende de estar detrás de todos.'
  ]
}));

BUILDS.janna.push(aramBuild({
  name: 'ARAM — Peel y monzón', role: 'Support', style: 'Enchanter / Peel',
  resumen: 'Janna escuda, acelera y separa: en un carril donde todos pelean a la vez, su Monzón deshace la iniciación rival entera mientras cura a los cinco.',
  items: {
    inicio: ARAM_INICIO_SUP,
    core: [[3174, 'Grial Impuro de Athene'], [3117, 'Botas de Movilidad'], [3069, 'Emblema de la Ascensión']],
    situacionales: [[3190, 'Medallón Solari de Hierro'], [3222, 'Crisol de Mikael'], [3116, 'Cetro de Cristal de Rylai'], [3089, 'Gorra Mortal de Rabadon']]
  },
  runas: R.supportAP, maestrias: M.support, hechizos: [SS.clarity, SS.flash], habilidades: ['W', 'E', 'Q'],
  plan: {
    early: 'La W (Ráfaga) pokea en línea recta: en ARAM alcanza a varios. El escudo da AD además de absorber.',
    mid: 'Tu pasiva acelera a todo el equipo cercano: sois los primeros en llegar a cada choque.',
    late: 'El Monzón empuja a los cinco y cura mientras canalizas: es el mejor botón defensivo del modo.'
  },
  tips: [
    'La Q cargada lanza más lejos y más alto: suéltala pronto contra un dash entrante.',
    'El escudo da AD al aliado: pónselo al carry ANTES del choque, no durante.',
    'Puedes cancelar el Monzón cuando quieras: no hace falta canalizarlo entero.'
  ]
}));

BUILDS.taric.push(aramBuild({
  name: 'ARAM — Aturdir y curar', role: 'Support', style: 'Tanque / Protector', difficulty: 'Baja',
  resumen: 'Taric cura con la Q, da armadura con la W y aturde con la E. En ARAM su Radiance es un buff de equipo que convierte cada choque en una victoria por desgaste.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3174, 'Grial Impuro de Athene'], [3111, 'Botas de Mercurio'], [3190, 'Medallón Solari de Hierro']],
    situacionales: [[3110, 'Corazón de Hielo'], [3222, 'Crisol de Mikael'], [3069, 'Emblema de la Ascensión'], [3068, 'Capa de Fuego Solar']]
  },
  runas: R.support, maestrias: M.support, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'La Q cura en área a los aliados cercanos: en un carril apretado alcanza a todo el equipo. Es sostenimiento gratis.',
    mid: 'Vincula la W a tu carry para darle armadura y que tus hechizos salgan también desde él.',
    late: 'Radiance al empezar el choque: da AD y AP a los cinco. El aturdimiento va sobre el que más daño haga.'
  },
  tips: [
    'La Q cura a todos los aliados cerca, no solo a ti: colócate en medio del grupo.',
    'La activa de la W destroza armadura en área: úsala en cada choque.',
    'Radiance es un aura de equipo: ábrela al inicio de la pelea, nunca la guardes.'
  ]
}));

BUILDS.amumu.push(aramBuild({
  name: 'ARAM — Ultimate garantizada', role: 'Jungla', style: 'Tanque / Iniciador AP', difficulty: 'Baja',
  resumen: 'La Ofrenda al Dolor de Amumu enraíza y desarma a todo el equipo enemigo, y en un carril estrecho es imposible fallarla. Uno de los mejores iniciadores del modo.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar'], [3151, 'Tormento de Liandry']],
    situacionales: [[3001, 'Cetro Abisal'], [3157, 'Reloj de Arena de Zhonya'], [3143, 'Presagio de Randuin'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.junglaAP, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'W', 'Q'],
  plan: {
    early: 'La E hace daño en área y reduce el físico que recibes: es tu poke y tu defensa a la vez.',
    mid: 'Con Fuego Solar y Liandry, tu W quema un porcentaje de vida a todo el que esté cerca.',
    late: 'Destello + R sobre los cinco: enraíza, desarma y tu equipo limpia. Esa es toda tu partida.'
  },
  tips: [
    'La R desarma además de enraizar: los tiradores rivales no pueden ni autoatacar 2 segundos.',
    'El Vendaje (Q) sobre un súbdito te reposiciona: es tu entrada alternativa si la R está lista.',
    'Liandry se combina con tu W: daño porcentual continuo a todo el equipo rival.'
  ]
}));

BUILDS.nidalee.push(aramBuild({
  name: 'ARAM — Lanzas a ciegas', role: 'Mid', style: 'Híbrida / Poke', difficulty: 'Alta',
  resumen: 'Una lanza a máximo alcance en un carril recto es medio kit sin respuesta posible. Nidalee desgasta desde una distancia a la que nadie puede contestarle.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3100, 'Perdición del Liche'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Lanza sin parar desde el fondo del carril: cuanto más viaje, más daño hace. Cúrate con la W entre lanzas.',
    mid: 'Athene te da maná infinito para el poke. Cambia a puma solo para rematar a alguien muy bajo.',
    late: 'Eres artillería pura con escape: pokea, y si saltan sobre ti, forma puma y desaparece.'
  },
  tips: [
    'La lanza escala su daño con la distancia recorrida: castiga siempre desde el máximo alcance.',
    'Cambiar de forma resetea los enfriamientos de la otra: alterna para tener siempre algo listo.',
    'El mordisco de puma ejecuta a objetivos bajos: es tu remate, no tu apertura.'
  ]
}));

BUILDS.twistedfate.push(aramBuild({
  name: 'ARAM — Carta dorada', role: 'Mid', style: 'Mago / Control',
  resumen: 'La carta dorada es un aturdimiento a distancia sin coste y sin contrajugada, y en ARAM Twisted Fate la tiene disponible en cada choque. Control puro cada pocos segundos.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3174, 'Grial Impuro de Athene'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3100, 'Perdición del Liche'], [3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'La carta roja hace daño en área sobre la oleada; la azul te devuelve maná. Alterna según lo que necesites.',
    mid: 'Guarda la dorada para el inicio de cada choque: aturdir al carry rival dos segundos decide la pelea.',
    late: 'Tu ultimate revela el carril entero y te deja elegir el momento: úsala para reposicionarte y caer por el flanco.'
  },
  tips: [
    'Parar el ciclo de cartas en la dorada requiere ritmo: practícalo, es el 80% de tu valor.',
    'La Q (tres cartas) es tu poke de área cuando la W está en enfriamiento.',
    'La carta azul devuelve maná: úsala para sostener el poke sin quedarte seco.'
  ]
}));

BUILDS.gangplank.push(aramBuild({
  name: 'ARAM — Parrrley eterno', role: 'Top', style: 'Peleador / Poke',
  resumen: 'Parrrley pokea a distancia sin riesgo y da oro extra, y las Naranjas limpian todo el control rival. En ARAM, Gangplank desgasta y nunca queda atrapado.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
    situacionales: [[3031, 'Filo Infinito'], [3026, 'Ángel de la Guarda'], [3072, 'La Sanguinaria'], [3143, 'Presagio de Randuin']]
  },
  runas: R.adTop, maestrias: M.ad, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Parrrley al rival cada vez que esté a rango: es poke gratis que además te da oro extra por cada muerte.',
    mid: 'Con Trinidad cada disparo procea Brillo. Tu ultimate cubre el carril entero de cañonazos.',
    late: 'La R en el choque es daño y ralentización en área masiva: lánzala justo cuando choquen los dos equipos.'
  },
  tips: [
    'Las Naranjas limpian TODO el CC: guárdalas para el aturdimiento clave, no para el poke.',
    'Parrrley da oro extra solo si mata: acostúmbrate al ritmo de last hit con la Q.',
    'Tu R en ARAM es enorme: cubre casi todo el carril con ralentización.'
  ]
}));

BUILDS.chogath.push(aramBuild({
  name: 'ARAM — Festín permanente', role: 'Top', style: 'Tanque / Devorador', difficulty: 'Baja',
  resumen: 'En ARAM las oleadas son infinitas y Cho\'Gath nunca deja de crecer. Con seis pilas es una montaña con aturdimiento, silencio y una ejecución de daño verdadero.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3027, 'Vara de las Edades'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3065, 'Rostro Espiritual'], [3151, 'Tormento de Liandry'], [3143, 'Presagio de Randuin'], [3157, 'Reloj de Arena de Zhonya']]
  },
  runas: R.tankTop, maestrias: M.bruiser, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Devora súbditos con la R en cuanto esté lista: cada pila son 90 de vida permanente. La E limpia la oleada sola.',
    mid: 'Con seis pilas y Vara de las Edades eres un muro. Tu Q eleva por los aires y tu W silencia: dos controles seguidos.',
    late: 'Guarda el Festín para ejecutar al carry rival: es daño verdadero que ignora todas sus resistencias.'
  },
  tips: [
    'El Festín hace daño verdadero: contra cualquier vida máxima sigue siendo la mejor ejecución del modo.',
    'Devora súbditos si no hay campeón a rango: la vida máxima es lo que te hace ganar.',
    'La Q corta dashes y persecuciones: úsala como control, no solo por el daño.'
  ]
}));

// ---------- ARAM: tanda 3 (tier B) ----------
BUILDS.garen.push(aramBuild({
  name: 'ARAM — Girar y ejecutar', role: 'Top', style: 'Juggernaut', difficulty: 'Baja',
  resumen: 'Garen gira en medio del grupo haciendo daño a todos y ejecuta con la R al primero que baje. Su pasiva le permite entrar y salir sin volver a base.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3068, 'Capa de Fuego Solar'], [3111, 'Botas de Mercurio'], [3083, 'Armadura de Warmog'], [3005, 'Empalador de Atma']],
    situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3075, 'Malla de Espinas'], [3071, 'La Cuchilla Negra']]
  },
  runas: R.adTop, maestrias: M.bruiser, hechizos: [SS.flash, SS.ignite], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'Gira (E) sobre la oleada y el rival a la vez: es farmeo y poke sin coste de maná.',
    mid: 'Con Fuego Solar y Warmog aguantas el choque entero girando en medio de su equipo.',
    late: 'Busca el remate: la R ejecuta con daño verdadero según la vida que le falte al objetivo.'
  },
  tips: [
    'La Q rompe ralentizaciones y silencia: úsala para llegar al carry o para escapar.',
    'Girar hace daño máximo a un solo objetivo: pégate al más blando, no al tanque.',
    'Tu pasiva regenera fuera de combate: retrocede unos segundos entre choques.'
  ]
}));

BUILDS.malphite.push(aramBuild({
  name: 'ARAM — Roca imparable', role: 'Top', style: 'Tanque / Iniciador', difficulty: 'Baja',
  resumen: 'La Fuerza Imparable en un carril donde los cinco rivales van juntos es la mejor iniciación del modo. Y de paso, Malphite es inmune al daño físico.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3068, 'Capa de Fuego Solar'], [3047, 'Tabi de Ninja'], [3110, 'Corazón de Hielo']],
    situacionales: [[3001, 'Cetro Abisal'], [3143, 'Presagio de Randuin'], [3075, 'Malla de Espinas'], [3157, 'Reloj de Arena de Zhonya']]
  },
  runas: R.tankTop, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'La E reduce la velocidad de ataque de todos los cercanos: en ARAM anula a los tiradores rivales.',
    mid: 'Tu escudo pasivo se recarga fuera de combate: entra, absorbe y retrocede a recargar.',
    late: 'R sobre los cinco. No hay más plan y no hace falta: nada la detiene una vez lanzada.'
  },
  tips: [
    'Fuerza Imparable es imparable de verdad: ni aturdimientos ni desplazamientos la cortan.',
    'Destello + R en el mismo instante no da tiempo de reacción.',
    'Tu Q roba velocidad de movimiento: úsala para llegar antes al choque.'
  ]
}));

BUILDS.leona.push(aramBuild({
  name: 'ARAM — Cadena de controles', role: 'Support', style: 'Tanque / Control', difficulty: 'Baja',
  resumen: 'Leona encadena tres controles seguidos y no suelta jamás. En un carril único, su ultimate aturde a medio equipo antes de que empiece la pelea.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3190, 'Medallón Solari de Hierro'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3110, 'Corazón de Hielo'], [3143, 'Presagio de Randuin'], [3075, 'Malla de Espinas'], [3069, 'Emblema de la Ascensión']]
  },
  runas: R.support, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'Tu escudo (W) te da armadura y RM: aguanta el poke delante de tu equipo mientras ellos responden.',
    mid: 'El Amanecer Solar (R) tiene alcance enorme: ábrelo desde detrás de tu frontline sobre el grupo rival.',
    late: 'Encadena R → E → Q sobre el carry enemigo: tres controles seguidos y no vuelve a jugar.'
  },
  tips: [
    'Tu pasiva marca al objetivo y tus aliados le hacen daño extra: avisa a quién marcas.',
    'El escudo se activa antes de saltar, no después de recibir el golpe.',
    'La R aturde en área: en ARAM alcanza a todo el equipo con facilidad.'
  ]
}));

BUILDS.sivir.push(aramBuild({
  name: 'ARAM — Bumerán y escudo', role: 'ADC', style: 'Tiradora / Poke', difficulty: 'Baja',
  resumen: 'El bumerán de Sivir atraviesa el carril entero y su Escudo Mágico anula el gancho o el aturdimiento clave del rival. Poke seguro y contrajugada en un solo kit.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3006, 'Grebas de Berserker'], [3087, 'Puñal de Statikk'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral']],
    situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3085, 'Huracán de Runaan'], [3035, 'Últimas Palabras']]
  },
  runas: R.adc, maestrias: M.ad, hechizos: [SS.heal, SS.flash], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'El bumerán ida y vuelta pokea a todo el que esté en línea: es tu daño principal del early.',
    mid: 'La W rebota entre objetivos: en un grupo apretado multiplica tu daño por cinco.',
    late: 'La ultimate acelera a todo el equipo: úsala para iniciar en bloque o retirarse tras un choque perdido.'
  },
  tips: [
    'El Escudo Mágico absorbe UN hechizo dirigido: acertarlo cambia el resultado del choque.',
    'El bumerán pierde daño con cada objetivo que atraviesa: apunta a los rivales aislados.',
    'Tu ultimate es utilidad de equipo, no daño: piensa en ella como una iniciación.'
  ]
}));

BUILDS.tristana.push(aramBuild({
  name: 'ARAM — Alcance y explosión', role: 'ADC', style: 'Tiradora / Hipercarry', difficulty: 'Baja',
  resumen: 'El alcance de Tristana crece con cada nivel hasta superar al de todos, y su carga explosiva convierte cada oleada en confeti. Salto de Cohete es entrada, escape y remate.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3006, 'Grebas de Berserker'], [3087, 'Puñal de Statikk'], [3031, 'Filo Infinito'], [3035, 'Últimas Palabras']],
    situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3046, 'Bailarín Espectral'], [3085, 'Huracán de Runaan']]
  },
  runas: R.adc, maestrias: M.ad, hechizos: [SS.heal, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'La E sobre el rival explota al recibir autoataques: aplícala y pega. Es tu poke y tu remate.',
    mid: 'Con Statikk limpias oleadas al instante. Tu alcance ya supera al de casi todos: dispara desde fuera.',
    late: 'El salto resetea con cada asesinato: en el caos del choque puedes encadenar varios. La W empuja al asesino lejos.'
  },
  tips: [
    'El Salto de Cohete se reinicia con cada kill o asistencia: úsalo sin miedo si el remate es seguro.',
    'Tu W + R es un peel doble: empuja lejos al que salte sobre ti y salta tú en dirección contraria.',
    'La E explota antes si le pegas: coordina con tu equipo para detonarla rápido.'
  ]
}));

BUILDS.corki.push(aramBuild({
  name: 'ARAM — Misiles sin parar', role: 'ADC', style: 'Tirador híbrido',
  resumen: 'Los misiles de Corki pokean todo el carril y su daño mixto (físico y mágico) hace que ninguna resistencia lo pare. La Valkiria le da la movilidad que casi nadie tiene en ARAM.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3078, 'Fuerza de Trinidad'], [3006, 'Grebas de Berserker'], [3031, 'Filo Infinito']],
    situacionales: [[3046, 'Bailarín Espectral'], [3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras']]
  },
  runas: R.adc, maestrias: M.ad, hechizos: [SS.flash, SS.heal], habilidades: ['R', 'Q', 'E'],
  plan: {
    early: 'Los misiles (R) son poke gratuito de largo alcance: dispáralos en cuanto haya carga disponible.',
    mid: 'Cada 3 misiles sale el Misil Grande, que pega muchísimo más: cuenta las cargas antes del choque.',
    late: 'La Valkiria (W) deja un rastro de fuego: úsala para cortar la persecución además de para escapar.'
  },
  tips: [
    'Tu pasiva convierte parte de tus autos en daño mágico: nadie puede pararte solo con armadura.',
    'La E reduce armadura y ralentiza: es la apertura de cada intercambio.',
    'Maximiza la R en ARAM: el poke a distancia es más valioso que el daño cuerpo a cuerpo.'
  ]
}));

BUILDS.jarvaniv.push(aramBuild({
  name: 'ARAM — Bandera y jaula', role: 'Jungla', style: 'Peleador / Iniciador',
  resumen: 'El combo E-Q de Jarvan atraviesa el carril y su Cataclismo encierra al carry rival en una arena de la que no puede salir. Iniciación limpia y sentencia.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar'], [3071, 'La Cuchilla Negra']],
    situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3026, 'Ángel de la Guarda'], [3083, 'Armadura de Warmog']]
  },
  runas: R.jungla, maestrias: M.bruiser, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'El E-Q es tu apertura: bandera por detrás del grupo y salto hacia ella para llegar al carry.',
    mid: 'Tu Q hace daño porcentual y reduce armadura: eres bueno contra cualquier tanque rival.',
    late: 'El Cataclismo aísla al objetivo prioritario. Si atrapas al equipo equivocado, reactívalo para abrirlo.'
  },
  tips: [
    'La bandera también sirve de escape: lánzala hacia atrás y salta para huir.',
    'El Cataclismo se puede cancelar reactivándolo: no te encierres tú con cinco.',
    'El escudo de la W te da sustain: úsalo cada vez que esté disponible.'
  ]
}));

BUILDS.pantheon.push(aramBuild({
  name: 'ARAM — Lanzas y caída', role: 'Mid', style: 'Asesino / Poke', difficulty: 'Baja',
  resumen: 'La lanza de Pantheon es poke barato y constante, su pasiva bloquea autoataques enteros, y la Gran Caída del Cielo aterriza en medio del grupo enemigo con daño en área.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3134, 'El Embrutecedor'], [3047, 'Tabi de Ninja'], [3071, 'La Cuchilla Negra']],
    situacionales: [[3142, 'Filo Fantasmal de Youmuu'], [3026, 'Ángel de la Guarda'], [3072, 'La Sanguinaria'], [3035, 'Últimas Palabras']]
  },
  runas: R.adTop, maestrias: M.adPen, hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Lanza (Q) sin parar: es barata y castiga a todo el que asome. Tu pasiva bloquea un auto cada pocos segundos.',
    mid: 'El combo W (aturde) → Q → E borra a los magos rivales. Con El Embrutecedor pegas muchísimo.',
    late: 'La R aterriza en medio del grupo: úsala tras un control aliado o para llegar desde la base tras morir.'
  },
  tips: [
    'La Q hace crítico garantizado contra objetivos por debajo del 15% de vida: es una ejecución a distancia.',
    'Tu E bloquea el daño frontal mientras canaliza: mira hacia el rival, no de espaldas.',
    'La R es visible y lenta: lánzala sobre rivales ya controlados.'
  ]
}));

BUILDS.alistar.push(aramBuild({
  name: 'ARAM — Combo W-Q', role: 'Support', style: 'Tanque / Iniciador',
  resumen: 'El combo W-Q de Alistar lanza al carry rival por los aires en medio de tu equipo, y con la ultimate activa reduce el 70% del daño recibido: entra en el grupo y sale caminando.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3190, 'Medallón Solari de Hierro'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3110, 'Corazón de Hielo'], [3143, 'Presagio de Randuin'], [3069, 'Emblema de la Ascensión'], [3075, 'Malla de Espinas']]
  },
  runas: R.support, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'La E cura en área al golpear súbditos: es sostenimiento gratis para ti en un modo sin retorno a base.',
    mid: 'El combo W → Q casi simultáneo encadena dos controles: practícalo hasta que salga solo.',
    late: 'Con la R activa entra sobre el carry, empújalo hacia los tuyos y aguanta todo lo que te tiren.'
  },
  tips: [
    'Destello + Q lanza a varios hacia tu equipo: la mejor iniciación del modo.',
    'La W empuja en la dirección en la que estés: colócate detrás del rival para empujarlo hacia ti.',
    'La ultimate limpia ralentizaciones y reduce daño: actívala ANTES de entrar.'
  ]
}));

BUILDS.blitzcrank.push(aramBuild({
  name: 'ARAM — Gancho en el carril', role: 'Support', style: 'Tanque / Pick',
  resumen: 'En un carril recto y estrecho el gancho de Blitzcrank casi no se puede esquivar, y un solo acierto saca al carry rival de su equipo y lo mete en el tuyo.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3190, 'Medallón Solari de Hierro'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3110, 'Corazón de Hielo'], [3143, 'Presagio de Randuin'], [3069, 'Emblema de la Ascensión'], [3157, 'Reloj de Arena de Zhonya']]
  },
  runas: R.support, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Amenaza con el gancho desde detrás de tus súbditos: aunque falles, el rival no puede posicionarse tranquilo.',
    mid: 'Un gancho acertado es un kill: Q → E → tu equipo remata. Tu pasiva te escuda al bajar de vida.',
    late: 'Elige siempre al carry, nunca al tanque. Tu ultimate silencia en área y rompe escudos como Banshee.'
  },
  tips: [
    'Gancho + Destello en pleno vuelo reposiciona el agarre: la mecánica más letal del soporte clásico.',
    'La E resetea tu autoataque: gancho → auto → E es daño doble instantáneo.',
    'La W te acelera para alcanzar al objetivo: úsala antes de lanzar el gancho, no después.'
  ]
}));

BUILDS.lulu.push(aramBuild({
  name: 'ARAM — Polimorfia y escudos', role: 'Support', style: 'Enchanter / Peel',
  resumen: 'Lulu convierte al asesino rival en una ardilla, escuda a su equipo y con Crecimiento Salvaje da vida máxima al carry y lanza por los aires a quien le rodee.',
  items: {
    inicio: ARAM_INICIO_SUP,
    core: [[3174, 'Grial Impuro de Athene'], [3117, 'Botas de Movilidad'], [3190, 'Medallón Solari de Hierro']],
    situacionales: [[3069, 'Emblema de la Ascensión'], [3222, 'Crisol de Mikael'], [3089, 'Gorra Mortal de Rabadon'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.supportAP, maestrias: M.support, hechizos: [SS.clarity, SS.flash], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'La Q atraviesa el carril ralentizando a los rivales y acelerando a los tuyos: apúntala a través de tu propio equipo.',
    mid: 'La polimorfia sobre el iniciador rival desactiva su jugada por completo: es tu botón más valioso.',
    late: 'Crecimiento Salvaje sobre el aliado enfocado: vida máxima extra y empujón en área a los que le rodeen.'
  },
  tips: [
    'La polimorfia impide atacar y usar habilidades: es el CC más frustrante del juego.',
    'La ultimate da vida máxima y por tanto cura proporcionalmente: úsala antes del burst.',
    'Tu E escuda al aliado y le da a Pix, que dispara con él: es daño extra permanente.'
  ]
}));

BUILDS.urgot.push(aramBuild({
  name: 'ARAM — Misiles autodirigidos', role: 'ADC', style: 'Tirador / Poke', difficulty: 'Alta',
  resumen: 'Marca con la granada y tus misiles se dirigen solos: poke imposible de esquivar en un carril recto. Y la ultimate intercambia posiciones con el carry rival.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3070, 'Lágrima de la Diosa'], [3004, 'Manamune'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
    situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3035, 'Últimas Palabras'], [3072, 'La Sanguinaria']]
  },
  runas: R.adc, maestrias: M.adPen, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'E (granada) para marcar y luego Q: los misiles se dirigen solos y no se pueden esquivar. Poke garantizado.',
    mid: 'Con Manamune tu poke es infinito. La E además reduce el daño del rival marcado.',
    late: 'La R saca al carry de su equipo y lo mete en el tuyo: la jugada más decisiva que tienes.'
  },
  tips: [
    'La Q solo se autodirige contra objetivos marcados por la E: siempre en ese orden.',
    'La ultimate te da resistencias durante el intercambio: sobrevives a estar en su posición.',
    'Tu W hace que los autos no fallen y reduce daño: mantenlo activo en cada intercambio.'
  ]
}));

BUILDS.twitch.push(aramBuild({
  name: 'ARAM — Veneno y ultimate', role: 'ADC', style: 'Tirador / Área',
  resumen: 'Con Pulverizar y Rezar, los autos de Twitch atraviesan a todo el equipo enemigo en línea — y en ARAM siempre están alineados. Una ultimate bien colocada es una tetrakill.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3006, 'Grebas de Berserker'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral']],
    situacionales: [[3072, 'La Sanguinaria'], [3085, 'Huracán de Runaan'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras']]
  },
  runas: R.adc, maestrias: M.ad, hechizos: [SS.heal, SS.flash], habilidades: ['E', 'W', 'Q'],
  plan: {
    early: 'Apila veneno con los autos y detona con la E cuando tenga 5-6 cargas: es un burst enorme y gratuito.',
    mid: 'Tu sigilo (Q) te permite reposicionarte en el carril y aparecer por un flanco inesperado.',
    late: 'La R atraviesa a todos en línea: colócate donde estén alineados y dispara. En ARAM eso es siempre.'
  },
  tips: [
    'La E hace más daño cuantas más cargas de veneno haya: nunca la uses con una o dos.',
    'Con la R activa cada auto pega a todo el equipo: el ángulo lo es todo.',
    'La W ralentiza en área y revela: úsala para cortar la retirada del grupo.'
  ]
}));

BUILDS.nunu.push(aramBuild({
  name: 'ARAM — Cero absoluto', role: 'Jungla', style: 'Tanque / Utilidad', difficulty: 'Baja',
  resumen: 'El Cero Absoluto en un carril del que no se puede salir es una amenaza permanente, y Hervir Sangre convierte al carry aliado en una ametralladora.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar'], [3083, 'Armadura de Warmog']],
    situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3110, 'Corazón de Hielo'], [3157, 'Reloj de Arena de Zhonya']]
  },
  runas: R.jungla, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'W', 'Q'],
  plan: {
    early: 'La bola de nieve (E) aturde a distancia: es tu poke y tu apertura. Devorar te cura si hay súbditos.',
    mid: 'Hervir Sangre sobre tu ADC en cada choque: velocidad de ataque y movimiento gratis para él.',
    late: 'Canaliza el Cero Absoluto detrás de tu frontline: aunque lo cancelen, la ralentización del 95% ya ha roto su formación.'
  },
  tips: [
    'El Cero Absoluto ralentiza desde el primer instante: cánalo aunque no vayas a completarlo.',
    'Devorar hace daño fijo enorme: úsalo sobre súbditos para curarte sin volver a base.',
    'La E aturde si acierta a distancia: practica el liderazgo del proyectil.'
  ]
}));

BUILDS.kayle.push(aramBuild({
  name: 'ARAM — Invulnerabilidad', role: 'Top', style: 'Híbrida / Escalado',
  resumen: 'La Intervención de Kayle hace invulnerable a un aliado 3 segundos, lo que en ARAM salva la pelea entera. Y con la E activa ataca a distancia con daño mágico en área.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3115, 'Diente de Nashor'], [3020, 'Botas de Hechicero'], [3100, 'Perdición del Liche']],
    situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.apMid, maestrias: M.apDef, hechizos: [SS.flash, SS.heal], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'Con la E activa atacas a distancia y en área: pokea la oleada y al grupo rival a la vez.',
    mid: 'Nashor te da velocidad de ataque y AP: tus autos híbridos empiezan a derretir a todo el mundo.',
    late: 'Guarda la R para el aliado que vayan a enfocar: 3 segundos de invulnerabilidad ganan cualquier choque.'
  },
  tips: [
    'La Intervención salva a un aliado de la muerte segura: vale más que cualquier daño que hagas.',
    'La Q reduce armadura y RM del objetivo: úsala antes del intercambio.',
    'Escalas mucho: si el early es duro, quédate atrás con la E y espera a Nashor.'
  ]
}));

BUILDS.teemo.push(aramBuild({
  name: 'ARAM — Setas en el carril', role: 'Top', style: 'Poke / Trampas', difficulty: 'Baja',
  resumen: 'En un carril único, cada seta de Teemo está en el camino obligatorio del rival. Y su ceguera anula al tirador enemigo durante los segundos clave del choque.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3115, 'Diente de Nashor'], [3020, 'Botas de Hechicero'], [3151, 'Tormento de Liandry']],
    situacionales: [[3089, 'Gorra Mortal de Rabadon'], [3116, 'Cetro de Cristal de Rylai'], [3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'Envenena con los autos (E) y ciega al que intente pegarte. El veneno hace daño continuo sin coste.',
    mid: 'Siembra setas en el punto estrecho del carril: es el único camino, así que las pisan sí o sí.',
    late: 'Con Liandry, cada seta quema un porcentaje de vida. No pelees de frente: envenena y siembra.'
  },
  tips: [
    'La ceguera anula todos los autoataques: úsala sobre el ADC rival en el choque, no en el poke.',
    'Las setas duran 5 minutos: siembra sin parar, el carril acaba siendo un campo de minas.',
    'Tu W te acelera al salir de combate: úsala para reposicionarte, no para perseguir.'
  ]
}));

// ---------- ARAM: tanda 4 (tier C — cuerpo a cuerpo y asesinos) ----------
// En ARAM los campeones que necesitan llegar al carry lo tienen crudo: no hay
// flancos ni niebla de guerra. Estas builds priorizan aguante y sostenimiento.
BUILDS.masteryi.push(aramBuild({
  name: 'ARAM — Limpiar los restos', role: 'Jungla', style: 'Asesino / Late game',
  resumen: 'Yi lo tiene difícil sin flancos, pero su Alpha Strike esquiva habilidades clave y Highlander encadena asesinatos en cuanto el choque se desordena.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3006, 'Grebas de Berserker'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral'], [3072, 'La Sanguinaria']],
    situacionales: [[3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras'], [3153, 'Hoja del Rey Arruinado'], [3139, 'Cimitarra Mercurial']]
  },
  runas: R.adcVelocidad, maestrias: M.ad, hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Farmea con la Q sobre la oleada, que además te vuelve inobjetivable un instante. No entres al choque todavía.',
    mid: 'Meditar (W) reduce muchísimo daño: canalízala para sobrevivir al poke rival y aguantar en el carril.',
    late: 'Entra el último, cuando ya hayan gastado el CC, y deja que Highlander encadene los reinicios.'
  },
  tips: [
    'Alpha Strike te saca del juego un instante: esquiva la ultimate rival con ella.',
    'Cimitarra Mercurial es casi obligatoria: sin ella, un solo control te mata.',
    'Nunca inicies tú: en ARAM el que entra primero cuerpo a cuerpo muere primero.'
  ]
}));

BUILDS.leesin.push(aramBuild({
  name: 'ARAM — Patada al carry', role: 'Jungla', style: 'Peleador / Pick', difficulty: 'Alta',
  resumen: 'Lee Sin no puede hacer insec sin wards, pero su Q a distancia sigue siendo poke y su patada saca al carry rival de la formación o lo empuja hacia los tuyos.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3153, 'Hoja del Rey Arruinado']]
  },
  runas: R.jungla, maestrias: M.adPen, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'La Q a máximo alcance es poke seguro: lánzala, y solo salta si el remate está claro.',
    mid: 'El escudo de la W te sostiene en el carril. La E revela y ralentiza al grupo entero.',
    late: 'Tu patada (R) es peel: empuja lejos al que salte sobre tu carry, o mándalo hacia tu equipo.'
  },
  tips: [
    'Sin wards no hay ward-jump: tu movilidad en ARAM depende del Destello y de la W sobre aliados.',
    'La segunda parte de la Q hace más daño a objetivos bajos: retrásala para rematar.',
    'La patada sobre alguien lo lanza contra los que tenga detrás, aturdiéndolos: busca el ángulo.'
  ]
}));

BUILDS.evelynn.push(aramBuild({
  name: 'ARAM — Ralentizar y rematar', role: 'Jungla', style: 'Asesina / Área',
  resumen: 'Sin niebla de guerra, Evelynn juega distinto: su ultimate ralentiza en área a todo el equipo y su combo AP remata a quien haya quedado bajo.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3128, 'Tenaza de Muerte Ígnea'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío'], [3151, 'Tormento de Liandry']]
  },
  runas: R.junglaAP, maestrias: M.ap, hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Pokea con la Q desde el borde del grupo. No entres: sin sigilo útil eres muy frágil.',
    mid: 'La R ralentiza en área: úsala para iniciar desde atrás o para escapar de una mala posición.',
    late: 'Espera a que el choque se desordene y entra con Tenaza + combo sobre el carry ya tocado.'
  },
  tips: [
    'La Tenaza amplifica todo el daño posterior un 20%: siempre primero.',
    'Tu R ralentiza a los cinco: vale tanto como iniciación que como huida.',
    'En ARAM tu sigilo apenas sirve: juégala como maga de área, no como asesina.'
  ]
}));

BUILDS.shaco.push(aramBuild({
  name: 'ARAM — Cajas en el paso', role: 'Jungla', style: 'Trampas / Emboscada',
  resumen: 'Las cajas de Shaco en el único camino del carril aterrorizan al equipo entero, y su clon con daño de área al morir es una bomba disfrazada.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3128, 'Tenaza de Muerte Ígnea'], [3020, 'Botas de Hechicero'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3116, 'Cetro de Cristal de Rylai'], [3135, 'Bastón del Vacío'], [3151, 'Tormento de Liandry']]
  },
  runas: R.junglaAP, maestrias: M.ap, hechizos: [SS.flash, SS.ignite], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'Siembra cajas en el paso estrecho: el equipo rival tiene que cruzarlas sí o sí.',
    mid: 'Con AP, cada caja hace un daño enorme al activarse y el terror rompe su formación.',
    late: 'El clon (R) explota al morir: mándalo al grupo enemigo como una bomba mientras tú pokeas con la E.'
  },
  tips: [
    'Las cajas AP hacen daño real y aterrorizan: colócalas antes del choque, no durante.',
    'Tu E (puñal) es daño a distancia que ejecuta a objetivos bajos.',
    'El clon imita tus movimientos: úsalo para dividir el foco enemigo.'
  ]
}));

BUILDS.singed.push(aramBuild({
  name: 'ARAM — Veneno constante', role: 'Top', style: 'Tanque / Desgaste',
  resumen: 'Singed camina entre los rivales dejando veneno y lanza por los aires a quien intente perseguirle. En un carril estrecho, su rastro cubre todo el paso.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3027, 'Vara de las Edades'], [3111, 'Botas de Mercurio'], [3116, 'Cetro de Cristal de Rylai']],
    situacionales: [[3151, 'Tormento de Liandry'], [3065, 'Rostro Espiritual'], [3143, 'Presagio de Randuin'], [3157, 'Reloj de Arena de Zhonya']]
  },
  runas: R.tankTop, maestrias: M.tank, hechizos: [SS.flash, SS.ghost], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Enciende el veneno y camina por delante de tu equipo: el desgaste es constante y no cuesta nada.',
    mid: 'Con Rylai, tu veneno ralentiza a todo el que lo pise: el equipo rival no puede avanzar.',
    late: 'Corre entre ellos con la ultimate activa: el que te persiga acaba lanzado hacia tu equipo.'
  },
  tips: [
    'El Lanzamiento (E) tiene más alcance del que parece: gira en seco y lanza al perseguidor.',
    'La cola adhesiva (W) delante del rival, no bajo sus pies.',
    'Tu ultimate da estadísticas masivas: actívala antes de cada choque.'
  ]
}));

BUILDS.jax.push(aramBuild({
  name: 'ARAM — Contraatacar', role: 'Top', style: 'Peleador / Duelista',
  resumen: 'Contraataque esquiva TODOS los autoataques durante 2 segundos: en un choque de ARAM con cinco tiradores disparando, eso es una barbaridad.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3124, 'Hoja de Furia de Guinsoo']],
    situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3153, 'Hoja del Rey Arruinado']]
  },
  runas: R.adTop, maestrias: M.ad, hechizos: [SS.flash, SS.exhaust], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'Salta (Q) sobre un súbdito para pokear al rival detrás y sal. No te quedes en medio.',
    mid: 'Activa la E cuando te enfoquen: esquivas todos los autos del equipo y aturdes al terminar.',
    late: 'Con Trinidad y Guinsoo eres un duelista imparable: entra cuando su CC esté gastado.'
  },
  tips: [
    'Contraataque esquiva todos los autoataques: actívalo justo cuando empiecen a dispararte.',
    'Tu Q salta también a súbditos: es tu forma de acercarte y de escapar.',
    'Tu ultimate te da armadura y RM al pegar: pelea, no huyas, para mantenerla activa.'
  ]
}));

BUILDS.kassadin.push(aramBuild({
  name: 'ARAM — Riftwalk sin fin', role: 'Mid', style: 'Asesino mágico',
  resumen: 'La Esfera del Vacío escuda contra magia y su Riftwalk le permite entrar y salir sin parar. En un modo lleno de magos, la resistencia mágica de Kassadin brilla.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3070, 'Lágrima de la Diosa'], [3020, 'Botas de Hechicero'], [3003, 'Bastón del Arcángel'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de Arena de Zhonya'], [3135, 'Bastón del Vacío'], [3001, 'Cetro Abisal'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.apMid, maestrias: M.ap, hechizos: [SS.clarity, SS.flash], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Farmea con la Q y aprovecha su escudo mágico contra el poke rival: eres el que mejor aguanta a los magos.',
    mid: 'A partir del 11 con dos puntos en R empiezas a existir: entra, mata a un objetivo y sal.',
    late: 'Con Arcángel lleno, cada Riftwalk suma daño. Entra por el flanco, borra al mago rival y sal.'
  },
  tips: [
    'Tu pasiva te da RM permanente: eres el counter natural de los magos en ARAM.',
    'La Q interrumpe canalizaciones: úsala sobre Fiddlesticks o Katarina.',
    'Cada carga de Riftwalk duplica el coste: gestiona el maná como munición.'
  ]
}));

BUILDS.katarina.push(aramBuild({
  name: 'ARAM — Reseteos en cadena', role: 'Mid', style: 'Asesina / Área',
  resumen: 'La Muerte de Loto en medio de cinco rivales hace un daño absurdo, y cada asesinato resetea todo su kit. Pero cualquier control la interrumpe: hay que elegir el momento.',
  items: {
    inicio: ARAM_INICIO_AP,
    core: [[3020, 'Botas de Hechicero'], [3157, 'Reloj de Arena de Zhonya'], [3089, 'Gorra Mortal de Rabadon']],
    situacionales: [[3135, 'Bastón del Vacío'], [3001, 'Cetro Abisal'], [3128, 'Tenaza de Muerte Ígnea'], [3116, 'Cetro de Cristal de Rylai']]
  },
  runas: R.apMid, maestrias: M.apDef, hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Sin coste de maná, farmea y pokea con la Q sin parar. Es daño gratuito toda la fase inicial.',
    mid: 'Entra SEGUNDA, nunca primera: espera a que gasten los aturdimientos y luego gira.',
    late: 'Q → Shunpo → W → R en medio del grupo, y Zhonya en cuanto te miren. Cada kill resetea todo.'
  },
  tips: [
    'Tu ultimate se interrumpe con cualquier CC: cuenta los controles rivales antes de girar.',
    'Shunpo salta a aliados y súbditos: es tu entrada y tu escape.',
    'Zhonya justo después de girar te salva y deja que el daño siga aplicándose.'
  ]
}));

BUILDS.drmundo.push(aramBuild({
  name: 'ARAM — Va donde quiere', role: 'Top', style: 'Tanque / Sustain', difficulty: 'Baja',
  resumen: 'La cuchilla de Mundo cuesta vida actual, así que nunca se queda sin munición, y su ultimate le devuelve toda la vida. En un modo sin retorno a base, es una pesadilla.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3065, 'Rostro Espiritual'], [3083, 'Armadura de Warmog']],
    situacionales: [[3068, 'Capa de Fuego Solar'], [3143, 'Presagio de Randuin'], [3075, 'Malla de Espinas'], [3110, 'Corazón de Hielo']]
  },
  runas: R.tankTop, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Pokea con la cuchilla (Q) sin parar: cuesta vida actual, así que jamás te mata y ralentiza al rival.',
    mid: 'Visaje Espiritual amplifica la curación de tu ultimate: eres imposible de matar sin daño real concentrado.',
    late: 'Entra el primero, absorbe todo el CC y regenera con la R mientras tu equipo hace el trabajo.'
  },
  tips: [
    'La Q cuesta vida ACTUAL: nunca te suicidas usándola, por muy bajo que estés.',
    'Rostro Espiritual antes que nada: la sinergia con tu ultimate es enorme.',
    'La W (incinerar) es tu daño sostenido: mantenla activa durante todo el choque.'
  ]
}));

BUILDS.nasus.push(aramBuild({
  name: 'ARAM — Apilar como se pueda', role: 'Top', style: 'Juggernaut / Escalado', difficulty: 'Baja',
  resumen: 'Sin farm tranquilo la Q de Nasus tarda mucho en despegar, pero su E limita zonas y su ultimate lo convierte en un tanque enorme con reducción de armadura en área.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar'], [3083, 'Armadura de Warmog']],
    situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3025, 'Guantelete de Hielo'], [3075, 'Malla de Espinas']]
  },
  runas: R.tankTop, maestrias: M.bruiser, hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'W', 'Q'],
  plan: {
    early: 'Maximiza la E, no la Q: en ARAM el farm es escaso y la E hace daño en área y reduce armadura.',
    mid: 'Apila la Q en cada súbdito que puedas rematar, pero tu valor está en la W (ralentización brutal) sobre el carry.',
    late: 'Furia Impía te da vida, alcance y CDR: entra como un tanque enorme y ralentiza a quien más pegue.'
  },
  tips: [
    'En ARAM maximiza la E antes que la Q: el farm no da para apilar como en la Grieta.',
    'La W ralentiza un 95%: es una sentencia de muerte para cualquier objetivo sin escape.',
    'La ultimate es supervivencia y CDR: actívala al entrar, no cuando ya estés bajo.'
  ]
}));

BUILDS.olaf.push(aramBuild({
  name: 'ARAM — Inmune al control', role: 'Jungla', style: 'Peleador / Duelista', difficulty: 'Baja',
  resumen: 'Ragnarok hace a Olaf inmune a todo el control de masas, que es exactamente lo que mata a los cuerpo a cuerpo en ARAM. Elige objetivo y nada puede pararle.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra'], [3072, 'La Sanguinaria']],
    situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3153, 'Hoja del Rey Arruinado'], [3065, 'Rostro Espiritual']]
  },
  runas: R.jungla, maestrias: M.adPen, hechizos: [SS.flash, SS.ghost], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'El hacha (Q) es poke a distancia: lánzala y recógela para reducir su enfriamiento y acelerarte.',
    mid: 'La E hace daño verdadero a cambio de vida: es tu daño contra los tanques rivales.',
    late: 'Ragnarok y a por el carry: ningún aturdimiento, raíz ni supresión te detiene mientras dure.'
  },
  tips: [
    'Ragnarok previene TODO el CC, pero baja tu armadura: es ofensivo, no defensivo.',
    'Recoger el hacha reduce mucho su enfriamiento: lánzala hacia donde vayas a caminar.',
    'Tu pasiva te da velocidad de ataque según la vida que te falte: pelear al límite es tu fantasía.'
  ]
}));

BUILDS.rammus.push(aramBuild({
  name: 'ARAM — Provocar y devolver', role: 'Jungla', style: 'Tanque / Anti-AD', difficulty: 'Baja',
  resumen: 'Contra una composición de tiradores, Rammus provoca al carry y le deja matándose solo contra la Malla de Espinas. Y su bola rodante llega desde el otro extremo del carril.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3047, 'Tabi de Ninja'], [3075, 'Malla de Espinas'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3143, 'Presagio de Randuin'], [3110, 'Corazón de Hielo'], [3065, 'Rostro Espiritual'], [3083, 'Armadura de Warmog']]
  },
  runas: R.jungla, maestrias: M.tank, hechizos: [SS.flash, SS.exhaust], habilidades: ['E', 'W', 'Q'],
  plan: {
    early: 'La bola rodante necesita distancia para acelerar: arranca desde el fondo del carril.',
    mid: 'Con Malla de Espinas y armadura, provocar al tirador rival es matarlo con su propio daño.',
    late: 'Q para llegar y aturdir, E para provocar al carry lejos de los suyos. Tu W devuelve el daño recibido.'
  },
  tips: [
    'La Provocación obliga a autoatacarte 3 segundos: siempre sobre el carry, nunca sobre el tanque.',
    'Tu pasiva convierte armadura en daño: comprar defensa te hace pegar más.',
    'La W aumenta resistencias y devuelve daño: actívala cuando te enfoquen.'
  ]
}));

BUILDS.sion.push(aramBuild({
  name: 'ARAM — Escudo y aturdimiento', role: 'Top', style: 'Peleador / Sustain', difficulty: 'Baja',
  resumen: 'El Sion clásico apila AD con cada muerte y su ultimate le da chupavidas masivo: en el desgaste continuo de ARAM, eso lo mantiene en pie eternamente.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3083, 'Armadura de Warmog'], [3005, 'Empalador de Atma'], [3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual']]
  },
  runas: R.adTop, maestrias: M.bruiser, hechizos: [SS.flash, SS.exhaust], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'El escudo (W) absorbe poke y explota haciendo daño en área: úsalo al principio de cada intercambio.',
    mid: 'Apila con Enfurecer sobre los súbditos: cada muerte suma AD permanente para el resto de la partida.',
    late: 'Con la ultimate activa todo tu daño te cura: aturde al carry con la Q y quédate encima.'
  },
  tips: [
    'El escudo explota al caducar: actívalo pronto para aprovechar las dos partes.',
    'La ultimate da chupavidas y velocidad de ataque: actívala ANTES del choque.',
    'Este es el Sion pre-rework: nada que ver con el tanque moderno que carga con la Q.'
  ]
}));

BUILDS.skarner.push(aramBuild({
  name: 'ARAM — Secuestrar al carry', role: 'Jungla', style: 'Peleador / Control',
  resumen: 'Empalar suprime y ARRASTRA al objetivo: en ARAM, sacar al carry rival del grupo y meterlo en el tuyo decide el choque al instante.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3025, 'Guantelete de Hielo'], [3068, 'Capa de Fuego Solar']],
    situacionales: [[3143, 'Presagio de Randuin'], [3065, 'Rostro Espiritual'], [3110, 'Corazón de Hielo'], [3083, 'Armadura de Warmog']]
  },
  runas: R.jungla, maestrias: M.bruiser, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'La Q se recarga rápido y resetea el autoataque: alterna Q y auto para el daño sostenido.',
    mid: 'La E ralentiza a distancia y prepara el Empalar. Con el Guantelete, nadie escapa de tu zona.',
    late: 'Espera a que el carry rival se adelante un pelo y llévatelo. Sigue moviéndote durante la ultimate.'
  },
  tips: [
    'Empalar es supresión: solo la Cimitarra Mercurial lo cancela.',
    'Muévete mientras suprimes: el rival va contigo hacia donde tú vayas.',
    'Tu pasiva te acelera cerca de los cristales: en ARAM depende de tu propia zona.'
  ]
}));

BUILDS.tryndamere.push(aramBuild({
  name: 'ARAM — Cinco segundos', role: 'Top', style: 'Duelista / Crítico', difficulty: 'Baja',
  resumen: 'Furia Incontenible impide morir durante 5 segundos, y con Filo Infinito eso es tiempo de sobra para llevarse a alguien por delante en cada choque.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3006, 'Grebas de Berserker'], [3031, 'Filo Infinito'], [3046, 'Bailarín Espectral']],
    situacionales: [[3072, 'La Sanguinaria'], [3026, 'Ángel de la Guarda'], [3035, 'Últimas Palabras'], [3139, 'Cimitarra Mercurial']]
  },
  runas: R.adTop, maestrias: M.ad, hechizos: [SS.flash, SS.ghost], habilidades: ['E', 'W', 'Q'],
  plan: {
    early: 'Acumula Furia con los críticos sobre la oleada: al 100, tu Q te cura muchísimo.',
    mid: 'Entra con la E, gasta la Furia curándote y sal. Repite en cada enfriamiento.',
    late: 'Activa la R antes del golpe letal (no después) y usa esos 5 segundos para matar al carry.'
  },
  tips: [
    'La R evita la muerte 5 segundos pero no cura: actívala ANTES de recibir el golpe.',
    'La E resetea con cada asesinato: puedes encadenar saltos en el caos del choque.',
    'Cimitarra Mercurial contra composiciones con mucho control: sin ella te bloquean.'
  ]
}));

BUILDS.warwick.push(aramBuild({
  name: 'ARAM — Suprimir y curar', role: 'Jungla', style: 'Tanque / Duelista', difficulty: 'Baja',
  resumen: 'Warwick se cura con cada golpe y su Represión Infinita saca 5 segundos al carry rival de la pelea. Sostenimiento puro para un modo sin retorno a base.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3111, 'Botas de Mercurio'], [3068, 'Capa de Fuego Solar'], [3065, 'Rostro Espiritual']],
    situacionales: [[3143, 'Presagio de Randuin'], [3083, 'Armadura de Warmog'], [3075, 'Malla de Espinas'], [3153, 'Hoja del Rey Arruinado']]
  },
  runas: R.jungla, maestrias: M.bruiser, hechizos: [SS.flash, SS.exhaust], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'Tu Q te cura un porcentaje: en el desgaste del carril, eres el que mejor aguanta.',
    mid: 'La W da velocidad de ataque a ti y a los aliados cercanos: es un buff de equipo.',
    late: 'La ultimate sobre el carry lo saca 5 segundos del choque: es una ejecución garantizada.'
  },
  tips: [
    'La Represión Infinita es supresión pura: solo la Cimitarra Mercurial la limpia.',
    'Tu pasiva te acelera hacia los rivales bajos: eres el mejor perseguidor del modo.',
    'La Q se cura más cuanta más vida te falte: pelear al límite es rentable.'
  ]
}));

BUILDS.monkeyking.push(aramBuild({
  name: 'ARAM — Ciclón en el grupo', role: 'Top', style: 'Peleador / Área',
  resumen: 'El Ciclón de Wukong lanza por los aires a todo el equipo rival, y en ARAM siempre están agrupados. Su clon además engaña sobre por dónde va a entrar.',
  items: {
    inicio: ARAM_INICIO_TANK,
    core: [[3078, 'Fuerza de Trinidad'], [3111, 'Botas de Mercurio'], [3071, 'La Cuchilla Negra']],
    situacionales: [[3026, 'Ángel de la Guarda'], [3143, 'Presagio de Randuin'], [3068, 'Capa de Fuego Solar'], [3072, 'La Sanguinaria']]
  },
  runas: R.adTop, maestrias: M.adPen, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Tu pasiva te da armadura por cada enemigo cercano: en ARAM siempre está al máximo.',
    mid: 'La E golpea a todos los que atraviesa: salta sobre un súbdito para alcanzar al grupo.',
    late: 'E para entrar y R en medio de los cinco: el Ciclón los lanza a todos y tu equipo remata.'
  },
  tips: [
    'El clon (W) te vuelve invisible un instante: úsalo para engañar sobre tu entrada real.',
    'Tu pasiva escala con el número de enemigos cerca: en ARAM eres mucho más duro de lo normal.',
    'El Ciclón te acelera mientras giras: puedes perseguir mientras haces el daño.'
  ]
}));

BUILDS.vayne.push(aramBuild({
  name: 'ARAM — Daño verdadero', role: 'ADC', style: 'Tiradora / Anti-tanque', difficulty: 'Alta',
  resumen: 'Vayne sufre en ARAM por su alcance corto, pero sus Filos de Plata hacen daño verdadero porcentual: es la única forma fiable de matar a los tanques enemigos.',
  items: {
    inicio: ARAM_INICIO_AD,
    core: [[3153, 'Hoja del Rey Arruinado'], [3006, 'Grebas de Berserker'], [3046, 'Bailarín Espectral'], [3031, 'Filo Infinito']],
    situacionales: [[3026, 'Ángel de la Guarda'], [3072, 'La Sanguinaria'], [3139, 'Cimitarra Mercurial'], [3035, 'Últimas Palabras']]
  },
  runas: R.adc, maestrias: M.ad, hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Tu alcance es el peor del modo: quédate detrás y pega solo cuando el rival ya esté comprometido.',
    mid: 'Con Rey Arruinado, los 3 procs de la W hacen daño verdadero porcentual: los tanques caen igual.',
    late: 'Rueda entre autos para reposicionarte y usa la Condena (E) contra el muro para aturdir al que salte.'
  },
  tips: [
    'La E contra muro aturde 1.5 segundos: es tu anti-asesino, no una herramienta de daño.',
    'Rodar resetea el temporizador de tu autoataque: auto → Q → auto es tu combo básico.',
    'Sin frontline no existes: quédate detrás de tus tanques en cada choque.'
  ]
}));

// ---------- LoL Actual: presets de runas modernas ----------
// Los cuatro arquetipos de página que cubren a casi todo el roster clásico
// en el parche vivo. Iconos en cdn/img/perk-images (sin versión en la URL).
const P = {
  // rutas de icono reutilizadas
  precision: 'perk-images/Styles/7201_Precision.png',
  dominacion: 'perk-images/Styles/7200_Domination.png',
  brujeria: 'perk-images/Styles/7202_Sorcery.png',
  inspiracion: 'perk-images/Styles/7203_Whimsy.png',
  valor: 'perk-images/Styles/7204_Resolve.png'
};

const RM = {
  // Mago de control / poke: Cometa arcano
  magoCometa: {
    principal: { arbol: 'Brujería', icon: P.brujeria, runas: [
      [8229, 'Cometa arcano', 'perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png'],
      [8226, 'Banda de maná', 'perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png'],
      [8210, 'Trascendencia', 'perk-images/Styles/Sorcery/Transcendence/Transcendence.png'],
      [8237, 'Piroláser', 'perk-images/Styles/Sorcery/Scorch/Scorch.png']]},
    secundario: { arbol: 'Inspiración', icon: P.inspiracion, runas: [
      [8304, 'Calzado mágico', 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png'],
      [8347, 'Perspicacia cósmica', 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png']]},
    fragmentos: ['Velocidad de habilidad', 'Fuerza adaptativa', 'Vida escalada']
  },
  // Mago de burst / asesino mágico: Electrocutar
  magoBurst: {
    principal: { arbol: 'Dominación', icon: P.dominacion, runas: [
      [8112, 'Electrocutar', 'perk-images/Styles/Domination/Electrocute/Electrocute.png'],
      [8143, 'Impacto repentino', 'perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png'],
      [8138, 'Sabor a sangre', 'perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png'],
      [8135, 'Cazador de tesoros', 'perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png']]},
    secundario: { arbol: 'Brujería', icon: P.brujeria, runas: [
      [8210, 'Trascendencia', 'perk-images/Styles/Sorcery/Transcendence/Transcendence.png'],
      [8237, 'Piroláser', 'perk-images/Styles/Sorcery/Scorch/Scorch.png']]},
    fragmentos: ['Velocidad de habilidad', 'Fuerza adaptativa', 'Vida escalada']
  },
  // Peleador / juggernaut: Conquistador
  peleador: {
    principal: { arbol: 'Precisión', icon: P.precision, runas: [
      [8010, 'Conquistador', 'perk-images/Styles/Precision/Conqueror/Conqueror.png'],
      [9111, 'Triunfo', 'perk-images/Styles/Precision/Triumph.png'],
      [9104, 'Leyenda: Presteza', 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png'],
      [8014, 'Golpe de gracia', 'perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png']]},
    secundario: { arbol: 'Valor', icon: P.valor, runas: [
      [8473, 'Revestimiento de huesos', 'perk-images/Styles/Resolve/BonePlating/BonePlating.png'],
      [8451, 'Sobrecrecimiento', 'perk-images/Styles/Resolve/Overgrowth/Overgrowth.png']]},
    fragmentos: ['Fuerza adaptativa', 'Fuerza adaptativa', 'Vida escalada']
  },
  // Tirador de autoataques: Ataque intensificado
  tirador: {
    principal: { arbol: 'Precisión', icon: P.precision, runas: [
      [8005, 'Ataque intensificado', 'perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png'],
      [9111, 'Triunfo', 'perk-images/Styles/Precision/Triumph.png'],
      [9104, 'Leyenda: Presteza', 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png'],
      [8014, 'Golpe de gracia', 'perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png']]},
    secundario: { arbol: 'Dominación', icon: P.dominacion, runas: [
      [8143, 'Impacto repentino', 'perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png'],
      [8135, 'Cazador de tesoros', 'perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png']]},
    fragmentos: ['Velocidad de ataque', 'Fuerza adaptativa', 'Vida escalada']
  },
  // Tanque / iniciador: Garras del inmortal
  tanque: {
    principal: { arbol: 'Valor', icon: P.valor, runas: [
      [8437, 'Garras del inmortal', 'perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png'],
      [8446, 'Demoler', 'perk-images/Styles/Resolve/Demolish/Demolish.png'],
      [8473, 'Revestimiento de huesos', 'perk-images/Styles/Resolve/BonePlating/BonePlating.png'],
      [8451, 'Sobrecrecimiento', 'perk-images/Styles/Resolve/Overgrowth/Overgrowth.png']]},
    secundario: { arbol: 'Precisión', icon: P.precision, runas: [
      [9111, 'Triunfo', 'perk-images/Styles/Precision/Triumph.png'],
      [9104, 'Leyenda: Presteza', 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png']]},
    fragmentos: ['Fuerza adaptativa', 'Vida escalada', 'Vida escalada']
  },
  // Soporte protector: Protector
  soporte: {
    principal: { arbol: 'Valor', icon: P.valor, runas: [
      [8465, 'Protector', 'perk-images/Styles/Resolve/Guardian/Guardian.png'],
      [8463, 'Fuente de vida', 'perk-images/Styles/Resolve/FontOfLife/FontOfLife.png'],
      [8473, 'Revestimiento de huesos', 'perk-images/Styles/Resolve/BonePlating/BonePlating.png'],
      [8451, 'Sobrecrecimiento', 'perk-images/Styles/Resolve/Overgrowth/Overgrowth.png']]},
    secundario: { arbol: 'Inspiración', icon: P.inspiracion, runas: [
      [8304, 'Calzado mágico', 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png'],
      [8347, 'Perspicacia cósmica', 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png']]},
    fragmentos: ['Velocidad de habilidad', 'Fuerza adaptativa', 'Vida escalada']
  },
  // Soporte encantador: Invocar a Aery
  encantador: {
    principal: { arbol: 'Brujería', icon: P.brujeria, runas: [
      [8214, 'Invocar a Aery', 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png'],
      [8226, 'Banda de maná', 'perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png'],
      [8210, 'Trascendencia', 'perk-images/Styles/Sorcery/Transcendence/Transcendence.png'],
      [8237, 'Piroláser', 'perk-images/Styles/Sorcery/Scorch/Scorch.png']]},
    secundario: { arbol: 'Inspiración', icon: P.inspiracion, runas: [
      [8304, 'Calzado mágico', 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png'],
      [8347, 'Perspicacia cósmica', 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png']]},
    fragmentos: ['Velocidad de habilidad', 'Fuerza adaptativa', 'Vida escalada']
  }
};

// Inicios y botas del parche actual
const ACT_AP = [[1056, 'Anillo de Doran'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']];
const ACT_AD = [[1055, 'Espada de Doran'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']];
const ACT_TANK = [[1054, 'Escudo de Doran'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']];
const ACT_JG = [[1039, 'Espada de granizo'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']];
const ACT_SUP = [[3865, 'Atlas mundial'], [2003, 'Poción de vida'], [3340, 'Guardián invisible']];

function actBuild(o) {
  return Object.assign({ season: 'ACT', modo: 'grieta', difficulty: 'Media' }, o);
}

// ---------- LoL Actual: builds del parche vivo ----------
BUILDS.lux.push(actBuild({
  name: 'Mid — Actual (Cometa arcano)', role: 'Mid', style: 'Maga / Poke', difficulty: 'Baja',
  resumen: 'La Lux moderna sigue siendo artillería pura, pero ahora el Eco de Luden y el Tormento de Liandry convierten cada Chispa Final en una ejecución a media pantalla.',
  items: { inicio: ACT_AP,
    core: [[6655, 'Eco de Luden'], [3020, 'Botas de hechicero'], [3089, 'Sombrero mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de arena de Zhonya'], [3135, 'Bastón del Vacío'], [6653, 'Tormento de Liandry'], [3165, 'Morellonomicón']] },
  runasModernas: RM.magoCometa, hechizos: [SS.flash, SS.barrier], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'El Cometa arcano se activa fácil con la E a máximo alcance: poke garantizado sin exponerte.',
    mid: 'Con Luden, tu E + auto + Q borra media barra de vida. La Q sigue atrapando a dos en línea.',
    late: 'Chispa Final con enfriamiento reducido: ejecuta a través del mapa. Nunca camines delante de tu frontline.'
  },
  tips: [
    'Detona la pasiva con un auto tras cada habilidad: sigue siendo un tercio de tu daño.',
    'Piroláser premia el poke: cada E que roce suma daño acumulado durante toda la fase de líneas.',
    'La R revela el área: úsala como visión de emergencia sobre objetivos.'
  ]
}));

BUILDS.vayne.push(actBuild({
  name: 'ADC — Actual (Ataque intensificado)', role: 'ADC', style: 'Tiradora / Hipercarry', difficulty: 'Alta',
  resumen: 'Vayne moderna sigue viviendo del daño verdadero porcentual de sus Filos de Plata. El Verdugo de krakens amplifica ese daño en cada tercer golpe.',
  items: { inicio: ACT_AD,
    core: [[6672, 'Verdugo de krakens'], [3006, 'Grebas de berserker'], [3153, 'Hoja del rey arruinado'], [3046, 'Bailarín espectral']],
    situacionales: [[3026, 'Ángel de la guarda'], [3139, 'Cimitarra mercurial'], [3036, 'Recuerdos de lord Dominik'], [3072, 'Sanguinaria']] },
  runasModernas: RM.tirador, hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Tu fase de líneas sigue siendo dura: roba autos con la Q y guarda la E para clavar al que salte.',
    mid: 'Verdugo de krakens y Rey Arruinado juntos: cada tercer golpe hace un daño porcentual brutal.',
    late: 'Rueda entre autos y deja que la W haga el trabajo. El posicionamiento sigue siendo todo tu kit.'
  },
  tips: [
    'La E contra muro aturde: es tu botón anti-asesino, no daño.',
    'Rodar resetea el temporizador del autoataque: auto → Q → auto.',
    'Ataque intensificado se apila en 3 golpes y amplifica todo el daño posterior del equipo al objetivo.'
  ]
}));

BUILDS.jax.push(actBuild({
  name: 'Top — Actual (Conquistador)', role: 'Top', style: 'Peleador / Duelista',
  resumen: 'Jax moderno mantiene su Contraataque y su escalado infinito: Fuerza de Trinidad más objetos de aguante lo convierten en un split pusher que gana cualquier 1v1 del late.',
  items: { inicio: ACT_TANK,
    core: [[3078, 'Fuerza de trinidad'], [3111, 'Botas de mercurio'], [3053, 'Calibrador de Sterak'], [3742, 'Coraza del muerto']],
    situacionales: [[3065, 'Rostro espiritual'], [3143, 'Presagio de Randuin'], [6333, 'Baile de la muerte'], [3161, 'Lanza de Shojin']] },
  runasModernas: RM.peleador, hechizos: [SS.flash, SS.tp], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'Conquistador quiere intercambios largos: salta con la Q, aguanta con la E y deja que las cargas se apilen.',
    mid: 'Con Trinidad completada eres un duelista imparable. Empuja el lateral y obliga a que manden dos.',
    late: 'Tu E esquiva todos los autos del equipo: entra sobre el carry cuando su control esté gastado.'
  },
  tips: [
    'Contraataque esquiva TODOS los ataques básicos 2 segundos: actívalo justo cuando te disparen.',
    'La Q salta a súbditos y wards: es tu entrada y tu escape.',
    'Sterak evita que te borren en el burst: es tu objeto anti-asesino obligatorio.'
  ]
}));

BUILDS.katarina.push(actBuild({
  name: 'Mid — Actual (Electrocutar)', role: 'Mid', style: 'Asesina / Área', difficulty: 'Alta',
  resumen: 'Katarina moderna sigue reseteando todo su kit con cada asesinato. Electrocutar castiga su combo rápido y el Robaalmas de Mejai premia las rachas.',
  items: { inicio: ACT_AP,
    core: [[3020, 'Botas de hechicero'], [3157, 'Reloj de arena de Zhonya'], [3089, 'Sombrero mortal de Rabadon']],
    situacionales: [[3135, 'Bastón del Vacío'], [3041, 'Robaalmas de Mejai'], [6653, 'Tormento de Liandry'], [3165, 'Morellonomicón']] },
  runasModernas: RM.magoBurst, hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Sin coste de maná, pokea con la Q sin parar. Recoge las dagas para el daño extra de Electrocutar.',
    mid: 'Entra SEGUNDA en las peleas: espera a que gasten el control y luego encadena reseteos.',
    late: 'Q → Shunpo sobre la daga → W → R en medio, y Zhonya cuando te miren.'
  },
  tips: [
    'Tu ultimate se interrumpe con cualquier control: cuenta los aturdimientos rivales antes de girar.',
    'Shunpo sobre la daga en el aire es el combo básico: practica el timing.',
    'Zhonya justo después de girar te salva y el daño sigue aplicándose.'
  ]
}));

BUILDS.malphite.push(actBuild({
  name: 'Top — Actual (Garras del inmortal)', role: 'Top', style: 'Tanque / Iniciador', difficulty: 'Baja',
  resumen: 'Malphite moderno sigue siendo la mejor iniciación del juego contra composiciones de ataques básicos, con la Égida de fuego solar y el Corazón de hielo como núcleo.',
  items: { inicio: ACT_TANK,
    core: [[3068, 'Égida de fuego solar'], [3047, 'Botas blindadas'], [3110, 'Corazón de hielo']],
    situacionales: [[3075, 'Malla de espinas'], [3143, 'Presagio de Randuin'], [8020, 'Máscara abisal'], [3065, 'Rostro espiritual']] },
  runasModernas: RM.tanque, hechizos: [SS.flash, SS.tp], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'Contra AD, la E les corta la velocidad de ataque. Garras del inmortal te cura y suma vida permanente en cada intercambio.',
    mid: 'Corazón de hielo más armadura y eres inmune al top físico. Demoler te da presión de torre gratis.',
    late: 'R sobre dos o más. Ni aturdimientos ni desplazamientos la detienen una vez lanzada.'
  },
  tips: [
    'Destello + R en el mismo instante no da tiempo de reacción.',
    'Garras del inmortal se activa cada 4 segundos en combate: busca el intercambio corto y repetido.',
    'Tu Q roba velocidad de movimiento: es anti-kiteo y persecución.'
  ]
}));

BUILDS.leesin.push(actBuild({
  name: 'Jungla — Actual (Conquistador)', role: 'Jungla', style: 'Peleador / Gank', difficulty: 'Alta',
  resumen: 'Lee Sin moderno sigue siendo el jungla de early game por excelencia: mecánicas infinitas, ward-jump y una patada que decide partidas.',
  items: { inicio: ACT_JG,
    core: [[6692, 'Eclipse'], [3111, 'Botas de mercurio'], [3071, 'Cuchilla negra']],
    situacionales: [[3026, 'Ángel de la guarda'], [3053, 'Calibrador de Sterak'], [6333, 'Baile de la muerte'], [3143, 'Presagio de Randuin']] },
  runasModernas: RM.peleador, hechizos: [SS.flash, SS.smite], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Tu ventana es el early: visita los tres carriles antes del minuto 10. Cada gank convertido es una línea ganada.',
    mid: 'Con Eclipse tu burst sigue siendo enorme. Controla la visión de los objetivos y castiga los errores de posición.',
    late: 'Tu daño decae: conviértete en el iniciador. Un insec limpio sobre el carry vale más que cualquier cifra de daño.'
  },
  tips: [
    'Ward-jump sigue siendo tu herramienta clave: compra siempre un ward de más.',
    'La segunda Q hace más daño a objetivos bajos: retrásala para rematar.',
    'El insec: salta detrás del carry y patéalo hacia tu equipo.'
  ]
}));

BUILDS.morgana.push(actBuild({
  name: 'Support — Actual (Aery)', role: 'Support', style: 'Maga / Control', difficulty: 'Baja',
  resumen: 'El Escudo Negro sigue siendo el mejor botón anti-control del juego, y en el parche actual el Perforaplanos de Zaz\'Zak convierte a Morgana en una fuente de daño además de utilidad.',
  items: { inicio: ACT_SUP,
    core: [[3871, "Perforaplanos de Zaz'Zak"], [3020, 'Botas de hechicero'], [6653, 'Tormento de Liandry']],
    situacionales: [[3157, 'Reloj de arena de Zhonya'], [3116, 'Cetro de cristal de Rylai'], [3135, 'Bastón del Vacío'], [3089, 'Sombrero mortal de Rabadon']] },
  runasModernas: RM.encantador, hechizos: [SS.flash, SS.ignite], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'El Suelo Atormentado empuja y castiga. Guarda el lazo para el gank de tu jungla o para el que se acerque de más.',
    mid: 'Escudo Negro sobre el objetivo del enganche rival: si no pueden iniciar, no hay pelea.',
    late: 'Zhonya + ultimate en medio de su equipo: aturdes a varios y sobrevives a la canalización.'
  },
  tips: [
    'El Escudo Negro bloquea todo el CC mágico mientras aguante: ponlo ANTES, no después.',
    'El lazo dura 3 segundos al máximo rango: es una eternidad en una pelea.',
    'La ultimate te cura por rival cercano: entrar es menos suicida de lo que parece.'
  ]
}));

BUILDS.ashe.push(actBuild({
  name: 'ADC — Actual (Ataque intensificado)', role: 'ADC', style: 'Tiradora / Utility', difficulty: 'Baja',
  resumen: 'Ashe moderna mantiene su identidad: ralentización permanente, visión con el halcón y una flecha global que abre el mapa. El Verdugo de krakens sostiene su daño en el late.',
  items: { inicio: ACT_AD,
    core: [[6672, 'Verdugo de krakens'], [3006, 'Grebas de berserker'], [3094, 'Cañón de fuego rápido'], [3085, 'Huracán de Runaan']],
    situacionales: [[3072, 'Sanguinaria'], [3026, 'Ángel de la guarda'], [3036, 'Recuerdos de lord Dominik'], [3139, 'Cimitarra mercurial']] },
  runasModernas: RM.tirador, hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Farmea con Escarcha activa: nadie puede intercambiar contigo si no te alcanza. Halcón al río antes de cada objetivo.',
    mid: 'Tu flecha sigue abriendo peleas desde media pantalla. Kitea hacia tu equipo, nunca en línea recta.',
    late: 'Con Runaan tus autos ralentizan a todo su equipo a la vez: eres peel y daño al mismo tiempo.'
  },
  tips: [
    'La flecha aturde más cuanto más viaje: desde lejos son 3.5 segundos.',
    'El halcón es visión gratis: úsalo antes de cada dragón o barón.',
    'Sin escapes, tu Destello es sagrado: guárdalo para el asesino.'
  ]
}));

BUILDS.masteryi.push(actBuild({
  name: 'Jungla — Actual (Conquistador)', role: 'Jungla', style: 'Hipercarry', difficulty: 'Baja',
  resumen: 'Yi moderno sigue siendo el hipercarry de jungla: farmea hasta tener objetos y luego limpia peleas enteras con los reinicios de Highlander.',
  items: { inicio: ACT_JG,
    core: [[6672, 'Verdugo de krakens'], [3006, 'Grebas de berserker'], [3153, 'Hoja del rey arruinado'], [3046, 'Bailarín espectral']],
    situacionales: [[3139, 'Cimitarra mercurial'], [3026, 'Ángel de la guarda'], [3072, 'Sanguinaria'], [3036, 'Recuerdos de lord Dominik']] },
  runasModernas: RM.peleador, hechizos: [SS.flash, SS.smite], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Farmea. Tu early no existe: gankea solo carriles ya ganados o con control garantizado.',
    mid: 'Con Verdugo de krakens y Rey Arruinado empiezas a derretir. Sigue farmeando la jungla rival.',
    late: 'Entra el último, cuando gasten el control, y deja que Highlander encadene los reinicios.'
  },
  tips: [
    'Alpha Strike te hace inobjetivable un instante: esquiva la ultimate clave con ella.',
    'Cimitarra Mercurial es casi obligatoria contra composiciones con control.',
    'Cada asesinato reduce los enfriamientos: piensa en cadena, no en objetivo único.'
  ]
}));

BUILDS.garen.push(actBuild({
  name: 'Top — Actual (Garras del inmortal)', role: 'Top', style: 'Juggernaut / Split', difficulty: 'Baja',
  resumen: 'Variante de aguante del Garen moderno: Garras del inmortal en vez de Conquistador, para ganar la línea a base de intercambios cortos y presión de torre con Demoler.',
  items: { inicio: ACT_TANK,
    core: [[3078, 'Fuerza de trinidad'], [3047, 'Botas blindadas'], [3742, 'Coraza del muerto'], [3053, 'Calibrador de Sterak']],
    situacionales: [[3065, 'Rostro espiritual'], [3143, 'Presagio de Randuin'], [3075, 'Malla de espinas'], [6333, 'Baile de la muerte']] },
  runasModernas: RM.tanque, hechizos: [SS.flash, SS.tp], habilidades: ['E', 'Q', 'W'],
  plan: {
    early: 'Intercambia corto y repetido: Garras te cura y suma vida permanente cada 4 segundos en combate.',
    mid: 'Demoler convierte cada línea ganada en una torre caída. Empuja el lateral sin descanso.',
    late: 'Gira sobre los carries y ejecuta con la R. Tu aguante te permite entrar el primero.'
  },
  tips: [
    'La Q rompe ralentizaciones y silencia: guárdala para escapar o para llegar al carry.',
    'Demoler se carga junto a la torre: pégate a ella cuando la línea esté empujada.',
    'Girar hace daño máximo a un solo objetivo: pégate al más blando.'
  ]
}));

BUILDS.soraka.push(actBuild({
  name: 'Support — Actual (Aery)', role: 'Support', style: 'Enchanter / Curación', difficulty: 'Baja',
  resumen: 'Soraka moderna cambia el maná por curación pura: los Ecos de Helia y la Redención la convierten en la mejor sanadora sostenida del juego actual.',
  items: { inicio: ACT_SUP,
    core: [[6620, 'Ecos de Helia'], [3117, 'Botas de movilidad'], [3107, 'Redención']],
    situacionales: [[3222, 'Bendición de Mikael'], [6616, 'Bastón de aguas fluidas'], [2065, 'Canción de batalla de Shurelya'], [3011, 'Putrificador tecnoquímico']] },
  runasModernas: RM.encantador, hechizos: [SS.flash, SS.exhaust], habilidades: ['W', 'Q', 'E'],
  plan: {
    early: 'La Q te devuelve vida al impactar: pokea antes de curar, siempre en ese orden.',
    mid: 'Con Ecos de Helia, cada curación además hace daño en área. Mantén al ADC siempre por encima de media vida.',
    late: 'El Deseo es global: vigila todas las barras del mapa. Redención llega incluso donde tú no estás.'
  },
  tips: [
    'Tu W cuesta vida propia: cúrate con la Q antes de gastarla.',
    'El silencio de la E corta canalizaciones e iniciaciones.',
    'La Q ralentiza además de dañar: es peel real, no solo poke.'
  ]
}));

BUILDS.blitzcrank.push(actBuild({
  name: 'Support — Actual (Protector)', role: 'Support', style: 'Tanque / Pick',
  resumen: 'Blitzcrank moderno sigue definiendo partidas con un solo gancho. Protector le da la contrajugada defensiva que le faltaba cuando falla.',
  items: { inicio: ACT_SUP,
    core: [[3869, 'Detracción celestial'], [3111, 'Botas de mercurio'], [3190, 'Medallón de los Solari de Hierro']],
    situacionales: [[3109, 'Promesa de caballero'], [3050, 'Convergencia de Zeke'], [3075, 'Malla de espinas'], [8020, 'Máscara abisal']] },
  runasModernas: RM.soporte, hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'Amenaza el gancho desde detrás de tus súbditos: aunque falles, el rival no puede farmear tranquilo.',
    mid: 'Un gancho acertado es un kill: Q → E → tu ADC remata. Protector escuda al aliado que enfoquen.',
    late: 'Elige siempre al carry, nunca al tanque. Tu ultimate silencia en área y rompe escudos pasivos.'
  },
  tips: [
    'Gancho + Destello en pleno vuelo reposiciona el agarre: sigue siendo la mecánica más letal del rol.',
    'La E resetea tu autoataque: gancho → auto → E.',
    'Protector se activa cuando tu aliado recibe daño grave: quédate cerca del carry.'
  ]
}));

BUILDS.nasus.push(actBuild({
  name: 'Top — Actual (Garras del inmortal)', role: 'Top', style: 'Juggernaut / Split', difficulty: 'Baja',
  resumen: 'Nasus moderno sigue jugando a otro juego: apila la Q hasta que golpee más fuerte que cualquier ultimate, y con Garras del inmortal gana la línea sin arriesgar.',
  items: { inicio: ACT_TANK,
    core: [[3111, 'Botas de mercurio'], [3742, 'Coraza del muerto'], [3068, 'Égida de fuego solar']],
    situacionales: [[3065, 'Rostro espiritual'], [3143, 'Presagio de Randuin'], [3075, 'Malla de espinas'], [3053, 'Calibrador de Sterak']] },
  runasModernas: RM.tanque, hechizos: [SS.flash, SS.tp], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'No pelees, apila. Garras del inmortal te da el aguante para farmear bajo presión sin morir.',
    mid: 'Con 200 cargas y aguante, ganas cualquier 1v1. Empieza el split push: nadie derriba torres como tú.',
    late: 'Furia Impía te da vida, alcance y enfriamientos: entras como un tanque cuya Q pega como una ultimate.'
  },
  tips: [
    'La Q no gasta enfriamiento si mata: nunca falles un last hit con ella disponible.',
    'La W ralentiza un 95%: es una sentencia sobre cualquier objetivo sin escape.',
    'Tu debilidad es el minuto 10-20: juega bajo torre sin vergüenza.'
  ]
}));

BUILDS.amumu.push(actBuild({
  name: 'Jungla — Actual (Garras del inmortal)', role: 'Jungla', style: 'Tanque / Iniciador AP', difficulty: 'Baja',
  resumen: 'La Ofrenda al Dolor sigue siendo una de las mejores iniciaciones del juego, y el Tormento de Liandry hace que su quemadura derrita a los tanques rivales.',
  items: { inicio: ACT_JG,
    core: [[3068, 'Égida de fuego solar'], [3111, 'Botas de mercurio'], [6653, 'Tormento de Liandry']],
    situacionales: [[8020, 'Máscara abisal'], [3157, 'Reloj de arena de Zhonya'], [3143, 'Presagio de Randuin'], [3065, 'Rostro espiritual']] },
  runasModernas: RM.tanque, hechizos: [SS.flash, SS.smite], habilidades: ['E', 'W', 'Q'],
  plan: {
    early: 'La E reduce el daño físico que recibes y limpia campamentos: es clear y defensa a la vez.',
    mid: 'Con Fuego Solar y Liandry, tu W quema un porcentaje de vida a todos los cercanos.',
    late: 'Destello + R sobre el máximo de rivales: enraíza, desarma y tu equipo limpia.'
  },
  tips: [
    'La R desarma además de enraizar: los tiradores no pueden ni autoatacar.',
    'El Vendaje sobre un súbdito te reposiciona si la R está lista.',
    'Liandry se combina con tu W: daño porcentual continuo a todo el equipo.'
  ]
}));

BUILDS.tristana.push(actBuild({
  name: 'ADC — Actual (Ataque intensificado)', role: 'ADC', style: 'Tiradora / Hipercarry', difficulty: 'Baja',
  resumen: 'Tristana moderna sigue creciendo en alcance con cada nivel y su salto se reinicia con cada asesinato. El Verdugo de krakens le da el daño sostenido que necesita.',
  items: { inicio: ACT_AD,
    core: [[6672, 'Verdugo de krakens'], [3006, 'Grebas de berserker'], [3094, 'Cañón de fuego rápido'], [3032, 'Flechas de los Yun Tal']],
    situacionales: [[3072, 'Sanguinaria'], [3026, 'Ángel de la guarda'], [3036, 'Recuerdos de lord Dominik'], [3139, 'Cimitarra mercurial']] },
  runasModernas: RM.tirador, hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'E', 'W'],
  plan: {
    early: 'La E sobre el rival explota con los autoataques: aplícala y pega. Es tu poke y tu remate.',
    mid: 'Tu alcance ya supera al de casi todos: asedia torres desde fuera de su rango de respuesta.',
    late: 'El salto se reinicia con cada asesinato: en peleas caóticas puedes encadenar varios.'
  },
  tips: [
    'La W + R es un peel doble: empuja al asesino y salta en dirección contraria.',
    'La E explota antes si le pegas: coordina con tu equipo para detonarla.',
    'Eres la mejor derribadora de torres del juego: aprovecha cada línea ganada.'
  ]
}));

BUILDS.veigar.push(actBuild({
  name: 'Mid — Actual (Cometa arcano)', role: 'Mid', style: 'Mago / Escalado infinito',
  resumen: 'Veigar moderno conserva su escalado sin techo. Con Vara de las edades y Rabadon, su ultimate ejecuta a cualquier mago rival de un solo botón.',
  items: { inicio: ACT_AP,
    core: [[6657, 'Vara de las edades'], [3020, 'Botas de hechicero'], [3089, 'Sombrero mortal de Rabadon']],
    situacionales: [[3157, 'Reloj de arena de Zhonya'], [3135, 'Bastón del Vacío'], [6653, 'Tormento de Liandry'], [3116, 'Cetro de cristal de Rylai']] },
  runasModernas: RM.magoCometa, hechizos: [SS.flash, SS.ignite], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'Apila con la Q sobre cada súbdito que remates: 80 cargas al minuto 15 es un buen ritmo.',
    mid: 'La Jaula atrapa y el combo E → W → Q → R borra a los objetivos blandos.',
    late: 'Con 800+ de AP eres una torreta de un disparo: colócate detrás y ejecuta a quien se acerque.'
  },
  tips: [
    'La Jaula aturde solo a quien la cruce de dentro hacia fuera: colócala DETRÁS del objetivo.',
    'La W tarda en caer: úsala sobre rivales ya atrapados.',
    'Tu ultimate escala con el AP del rival: contra magos es una ejecución garantizada.'
  ]
}));

BUILDS.ezreal.push(actBuild({
  name: 'ADC — Actual (Cometa arcano)', role: 'ADC', style: 'Tirador de habilidades',
  resumen: 'Variante de poke del Ezreal moderno con Cometa arcano en vez de Primer Golpe: menos oro extra, pero más daño garantizado en cada Q a distancia.',
  items: { inicio: ACT_AD,
    core: [[3152, 'Cintomisil hextech'], [3006, 'Grebas de berserker'], [3078, 'Fuerza de trinidad'], [3042, 'Muramana']],
    situacionales: [[6694, 'Rencor de Serylda'], [3036, 'Recuerdos de lord Dominik'], [3139, 'Cimitarra mercurial'], [3026, 'Ángel de la guarda']] },
  runasModernas: RM.magoCometa, hechizos: [SS.flash, SS.heal], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'El Cometa se activa con cada Q acertada: poke constante que el rival no puede devolver.',
    mid: 'Con Cintomisil y Trinidad, cada Q pega como un objeto entero. Asedia desde fuera de rango.',
    late: 'Muramana convierte tu maná en daño. Nunca entres: castiga desde 1100 y guarda la E como escape.'
  },
  tips: [
    'La Q aplica efectos de objeto: es un autoataque disfrazado de habilidad.',
    'El Desplazamiento es tu único escape real: no lo gastes por daño.',
    'La W acelera a un aliado: tírasela al hipercarry antes del choque.'
  ]
}));

BUILDS.taric.push(actBuild({
  name: 'Support — Actual (Aery)', role: 'Support', style: 'Tanque / Protector', difficulty: 'Baja',
  resumen: 'El Taric moderno (ya reformado como Escudo de Valoran) mantiene la esencia: cura en área, aturde y su ultimate hace invulnerable a todo el equipo durante 2.5 segundos.',
  items: { inicio: ACT_SUP,
    core: [[3869, 'Detracción celestial'], [3111, 'Botas de mercurio'], [3190, 'Medallón de los Solari de Hierro']],
    situacionales: [[3109, 'Promesa de caballero'], [3050, 'Convergencia de Zeke'], [8020, 'Máscara abisal'], [3222, 'Bendición de Mikael']] },
  runasModernas: RM.soporte, hechizos: [SS.flash, SS.exhaust], habilidades: ['Q', 'W', 'E'],
  plan: {
    early: 'La Q cura en área a los aliados cercanos: es sostenimiento de línea sin coste de posición.',
    mid: 'Vincula la W a tu ADC para que tus hechizos salgan también desde él: duplica tu alcance efectivo.',
    late: 'La ultimate hace invulnerable a todo el equipo 2.5 segundos: úsala justo antes del burst rival, no después.'
  },
  tips: [
    'La R es invulnerabilidad de equipo: anticípate al daño, no reacciones a él.',
    'El aturdimiento de la E sale también desde el aliado vinculado con la W.',
    'Tu Q se carga con autoataques: pega a los súbditos para acelerar la curación.'
  ]
}));

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
// Los 61 campeones del roster clasificados en cada modo. Curada a partir del meta
// clásico S3 y las primeras estadísticas del modo (MetaSRC Classic 26.15).
const TIERLIST = {
  grieta: {
    nombre: 'Grieta Clásica',
    icono: '⚔️',
    desc: 'Los 61 campeones de LoL Classic clasificados para el 5v5 (parche 26.15): kits pre-rework sobre itemización Season 3. Contrasta siempre con las fuentes en vivo — el meta del modo evoluciona cada semana con El Consejo.',
    tiers: {
      'S+': ['leesin', 'jax', 'vayne', 'blitzcrank', 'kassadin'],
      'S': ['ahri', 'katarina', 'malphite', 'amumu', 'sona', 'tristana', 'ezreal', 'garen'],
      'A': ['ashe', 'lux', 'masteryi', 'soraka', 'annie', 'morgana', 'gragas', 'olaf', 'sivir', 'nasus', 'jarvaniv', 'twistedfate', 'chogath', 'pantheon', 'lulu'],
      'B': ['taric', 'karthus', 'anivia', 'ryze', 'veigar', 'missfortune', 'corki', 'janna', 'leona', 'alistar', 'monkeyking', 'tryndamere', 'drmundo', 'warwick', 'shaco', 'nunu', 'rammus', 'gangplank', 'brand', 'malzahar', 'twitch'],
      'C': ['heimerdinger', 'urgot', 'sion', 'teemo', 'kayle', 'zilean', 'skarner', 'evelynn', 'fiddlesticks', 'singed', 'kogmaw', 'nidalee']
    },
    notas: {
      taric: 'B verificado: 50.49% WR como support en Classic 26.15 (MetaSRC).',
      kogmaw: 'C en solitario: sube a A con una composición dedicada a protegerlo.',
      rammus: 'B de media: contra 4+ AD es directamente S.',
      nunu: 'B en pelea, S+ robando objetivos: su valor depende de tu jungla rival.'
    }
  },
  aram: {
    nombre: 'ARAM Clásico',
    icono: '❄️',
    desc: 'Los 61 campeones clasificados para el carril único con reglas clásicas: poke, daño en área y sostenimiento mandan; los asesinos cuerpo a cuerpo sufren. Lista curada por arquetipos — sin datos en vivo todavía.',
    tiers: {
      'S+': ['lux', 'sona', 'karthus', 'ashe', 'brand'],
      'S': ['morgana', 'veigar', 'missfortune', 'ahri', 'soraka', 'anivia', 'heimerdinger', 'fiddlesticks', 'zilean', 'ezreal', 'malzahar'],
      'A': ['annie', 'ryze', 'gragas', 'kogmaw', 'janna', 'taric', 'amumu', 'nidalee', 'twistedfate', 'gangplank', 'chogath'],
      'B': ['garen', 'malphite', 'leona', 'sivir', 'tristana', 'corki', 'jarvaniv', 'pantheon', 'alistar', 'blitzcrank', 'lulu', 'urgot', 'twitch', 'nunu', 'kayle', 'teemo'],
      'C': ['masteryi', 'leesin', 'evelynn', 'shaco', 'singed', 'jax', 'kassadin', 'katarina', 'drmundo', 'nasus', 'olaf', 'rammus', 'sion', 'skarner', 'tryndamere', 'warwick', 'monkeyking', 'vayne']
    },
    notas: {
      brand: 'S+: su ultimate rebotando en un carril estrecho es el sueño de todo mago de área.',
      nidalee: 'A: las lanzas a máximo alcance en un carril recto son medio kit sin respuesta.',
      nasus: 'C: sin súbditos que farmear tranquilo, la Q nunca despega.'
    }
  }
};

// Fuentes generales de meta en vivo (se mantienen actualizadas solas al ser enlaces)
const FUENTES_META = [
  ['https://u.gg/lol/champions', 'U.GG — builds y runas del parche actual (aprobada por Riot)'],
  ['https://www.metasrc.com/lol/classic', 'MetaSRC — LoL Classic: stats y tier list en vivo'],
  ['https://coachless.gg/builds', 'Coachless — builds analíticas antes de que sean meta'],
  ['https://probuildstats.com/', 'ProBuildStats — lo que construyen los profesionales, en directo'],
  ['https://mobalytics.gg/lol/classic', 'Mobalytics — guías y tier lists de LoL Classic'],
  ['https://op.gg/lol/classic', 'OP.GG — campeones y objetos de LoL Classic']
];


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
