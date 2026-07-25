// ============ ShadowLOLClassic — Datos ============
// Roster oficial de League of Legends Classic (lanzamiento 29/07/2026, parche 26.15):
// los 40 campeones originales + los añadidos hasta 2013, con kits pre-rework y base Season 3.
// Iconos oficiales de la época servidos desde Data Dragon (CDN de Riot):
//   Campeón:  dd 'Taric'          -> cdn/<ver>/img/champion/Taric.png
//   Objeto:   [id, 'Nombre']      -> cdn/<ver>/img/item/<id>.png
//   Hechizo:  ['SummonerX','N']   -> cdn/<ver>/img/spell/SummonerX.png
//   Runa:     img 'r_1_1.png'     -> cdn/<ver>/img/rune/<img>.png
// Cada build lleva `season` ('S1','S2','S3'...) y opcionalmente `parche` para usar
// los iconos de otra época (ej. '3.6.14', el parche más antiguo archivado, era S2/early S3).

const DD_VER = '3.15.5';
const DD_HOST = 'https://ddragon.leagueoflegends.com/cdn';
const DD = DD_HOST + '/' + DD_VER + '/img';

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
    }
  ]
};

// ---------- Montaje final ----------
function autoColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h}, 45%, 48%)`;
}

const CHAMPIONS = ROSTER.map(([dd, name, title, roles]) => {
  const id = dd.toLowerCase();
  return {
    id, dd, name, title, roles,
    color: COLORS[id] || autoColor(dd),
    lema: LEMAS[id] || '',
    builds: BUILDS[id] || []
  };
});

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
