/**
 * Registro central de imágenes.
 *
 * Las fotografías de /public/images son trabajos reales de MC Diseños
 * (tomadas de su página oficial de Facebook). Para cambiar una foto basta con
 * reemplazar el archivo o actualizar aquí `src` y `alt`; ningún componente
 * necesita modificarse.
 *
 * Las texturas de la sección de materiales siguen siendo referencias visuales
 * de Unsplash (licencia Unsplash) hasta contar con el catálogo real de láminas.
 */

export type SiteImage = {
  src: string;
  alt: string;
  /** true si la imagen es de referencia y no un trabajo real de la empresa. */
  isReference: boolean;
};

const real = (src: string, alt: string): SiteImage => ({
  src: `/images/${src}`,
  alt,
  isReference: false,
});

const unsplash = (id: string, alt: string): SiteImage => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`,
  alt,
  isReference: true,
});

export const images = {
  hero: real(
    "hero/cocina-isla-blanca.jpg",
    "Cocina integral blanca con isla de mesón negro y techo con panel en madera, fabricada por MC Diseños",
  ),
  cta: real(
    "empotrados/barra-cafeteria.jpg",
    "Barra de cafetería con frentes en madera clara, mesón en piedra y vigas decorativas en el techo",
  ),
  materialsFeature: real(
    "taller/laminas-en-taller.jpg",
    "Láminas apiladas en el taller de MC Diseños mientras el equipo trabaja al fondo",
  ),

  services: {
    cocinas: real(
      "hero/cocina-isla-blanca.jpg",
      "Cocina integral blanca con isla, campana central y detalle en madera",
    ),
    empotrados: real(
      "empotrados/mueble-tv-marmol-madera.jpg",
      "Mueble empotrado en madera con nicho de mármol, repisas y cajones suspendidos",
    ),
    closets: real(
      "closets/vestier-pasillo-madera.jpg",
      "Vestier en madera a ambos lados de un pasillo, con puertas, repisas y cajones",
    ),
    puertas: real(
      "puertas/puerta-madera-closet-gris.jpg",
      "Puerta en lámina tono madera junto a un clóset de frentes grises",
    ),
    mesas: real(
      "mesas/mesas-terraza-restaurante.jpg",
      "Mesas con cubierta en madera clara en la terraza de un restaurante",
    ),
    cnc: real(
      "cnc/muro-ondulado-madera.jpg",
      "Muro decorativo de listones de madera con forma ondulada sobre un mueble bajo",
    ),
  },

  projects: {
    cocinaIslaTecho: real(
      "cocinas/cocina-isla-blanca-techo-madera.jpg",
      "Cocina blanca con isla de mesón negro, campana de isla y techo con panel en madera",
    ),
    cocinaIslaMadera: real(
      "cocinas/cocina-isla-frentes-madera.jpg",
      "Cocina blanca con isla de frentes en madera y horno empotrado",
    ),
    cocinaGrafito: real(
      "cocinas/cocina-grafito-isla-blanca.jpg",
      "Cocina con muebles bajos en grafito, superiores blancos e isla con mesón negro",
    ),
    cocinaLineal: real(
      "cocinas/cocina-lineal-blanca.jpg",
      "Cocina lineal con frentes blancos brillantes y mesón negro",
    ),
    empotradoTv: real(
      "empotrados/mueble-tv-marmol-madera.jpg",
      "Mueble empotrado en madera con nicho de mármol, repisas y cajones suspendidos",
    ),
    empotradoBar: real(
      "empotrados/repisas-y-mueble-bar.jpg",
      "Repisas flotantes en madera y mueble bajo gris con vinera en cruz",
    ),
    empotradoCafeteria: real(
      "empotrados/barra-cafeteria.jpg",
      "Barra de cafetería con frentes en madera clara y mesón en piedra oscura",
    ),
    empotradoOficina: real(
      "empotrados/oficina-mobiliario.jpg",
      "Oficina con escritorio, biblioteca, panel para TV y techo de listones en madera",
    ),
    empotradoLavamanos: real(
      "empotrados/mueble-lavamanos-suspendido.jpg",
      "Mueble de lavamanos suspendido en tono madera oscura con perfiles de aluminio",
    ),
    empotradoBano: real(
      "empotrados/mueble-bano-espejo-redondo.jpg",
      "Mueble de baño en tono madera con lavamanos blanco y espejo redondo",
    ),
    closetCajonera: real(
      "closets/closet-madera-cajonera.jpg",
      "Clóset de piso a techo en tono madera con cajonera central",
    ),
    closetPasillo: real(
      "closets/vestier-pasillo-madera.jpg",
      "Vestier en madera a ambos lados de un pasillo con repisas y cajones",
    ),
    closetAbierto: real(
      "closets/vestier-abierto-madera.jpg",
      "Vestier abierto en madera con módulos, barras para colgar y cajones",
    ),
    closetBlanco: real(
      "closets/closet-abierto-blanco.jpg",
      "Clóset abierto en tono claro con repisas, cajones y zapatero metálico",
    ),
    closetGrafito: real(
      "closets/closet-grafito-repisas.jpg",
      "Clóset en tono grafito con puertas, repisas abiertas y cajones",
    ),
    puertaClosetGris: real(
      "puertas/puerta-madera-closet-gris.jpg",
      "Puerta en lámina tono madera junto a un clóset de frentes grises",
    ),
    puertaClosetMadera: real(
      "puertas/puerta-y-closet-madera.jpg",
      "Puerta y clóset en el mismo tono de madera",
    ),
    mesasTerraza: real(
      "mesas/mesas-terraza-restaurante.jpg",
      "Mesas con cubierta en madera clara en la terraza de un restaurante",
    ),
    mesasRestaurante: real(
      "mesas/mesas-restaurante-listones.jpg",
      "Mesas de restaurante con cubierta gris junto a un muro de listones en madera",
    ),
    cncAguila: real("cnc/grabado-aguila.jpg", "Águila grabada con CNC sobre una tabla de madera"),
    cncMapa: real("cnc/mapa-mundi-madera.jpg", "Mapamundi en madera cortado con CNC e instalado en una pared"),
    cncMapaDetalle: real(
      "cnc/mapa-mundi-detalle.jpg",
      "Detalle del mapamundi en madera con piezas en relieve",
    ),
    cncLetras: real(
      "cnc/letras-router-cnc.jpg",
      "Letras decorativas recién cortadas sobre la mesa del router CNC",
    ),
    cncMuro: real(
      "cnc/muro-ondulado-madera.jpg",
      "Muro decorativo de listones de madera con forma ondulada",
    ),
    cncPanel: real("cnc/panel-parametrico.jpg", "Panel paramétrico de listones ondulados en el taller"),
    cncLetrero: real(
      "cnc/letrero-madera-quemada.jpg",
      "Letrero tallado con CNC sobre madera con acabado quemado",
    ),
  },

  workshop: {
    team: real(
      "taller/equipo-sede-pitalito.jpg",
      "Equipo de MC Diseños frente a su sede en Pitalito",
    ),
    corte: real("taller/corte-recto-y-curvo.jpg", "Operario cortando una lámina en la escuadradora vertical"),
    enchapado: real("taller/enchapado-recto-y-curvo.jpg", "Operario trabajando en la enchapadora de cantos"),
    prensado: real("taller/prensado-de-puertas.jpg", "Prensa para la fabricación de puertas en el taller"),
    cnc: real("cnc/letras-router-cnc.jpg", "Piezas cortadas sobre la mesa del router CNC"),
    asesoria: real(
      "taller/asesoria-profesional.jpg",
      "Asesor revisando catálogos de acabados con una clienta",
    ),
  },

  /** Texturas ilustrativas para la sección de materiales (referencias visuales). */
  textures: {
    robleClaro: unsplash("1611072337226-1140ab367200", "Textura de madera clara con vetas suaves"),
    natural: unsplash("1644931551533-02906718127f", "Textura de madera en tono natural con veta fina"),
    cenizo: unsplash("1611600700192-d87eaeed4f81", "Textura de madera en tono gris cenizo"),
    nogal: unsplash("1644925757334-d0397c01518c", "Textura de madera en tono nogal medio"),
    tabaco: unsplash("1576092762791-dd9e2220abd1", "Textura de madera en tono tabaco con veta marcada"),
    wengue: unsplash("1736506159776-22ca388780fa", "Textura de madera muy oscura"),
  },
} as const;
