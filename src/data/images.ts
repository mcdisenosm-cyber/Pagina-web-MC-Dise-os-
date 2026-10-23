/**
 * Registro central de las imágenes FIJAS del sitio (hero, servicios, llamada a la
 * acción y taller). Son trabajos reales de MC Diseños, guardados en
 * /public/images/sitio y /public/images/taller.
 *
 * Las fotos de la GALERÍA no están aquí: se administran desde el panel /admin
 * y viven en /public/images/proyectos (ver src/data/projects.ts).
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
    "sitio/hero-cocina-isla-blanca.jpg",
    "Cocina integral blanca con isla de mesón negro y techo con panel en madera, fabricada por MC Diseños",
  ),
  cta: real(
    "sitio/cta-barra-cafeteria.jpg",
    "Barra de cafetería con frentes en madera clara, mesón en piedra y vigas decorativas en el techo",
  ),
  materialsFeature: real(
    "taller/laminas-en-taller.jpg",
    "Láminas apiladas en el taller de MC Diseños mientras el equipo trabaja al fondo",
  ),

  services: {
    cocinas: real(
      "sitio/hero-cocina-isla-blanca.jpg",
      "Cocina integral blanca con isla, campana central y detalle en madera",
    ),
    empotrados: real(
      "sitio/servicio-empotrados.jpg",
      "Mueble empotrado en madera con nicho de mármol, repisas y cajones suspendidos",
    ),
    closets: real(
      "sitio/servicio-closets.jpg",
      "Vestier en madera a ambos lados de un pasillo, con puertas, repisas y cajones",
    ),
    puertas: real(
      "sitio/servicio-puertas.jpg",
      "Puerta en lámina tono madera junto a un clóset de frentes grises",
    ),
    mesas: real(
      "sitio/servicio-mesas.jpg",
      "Mesas con cubierta en madera clara en la terraza de un restaurante",
    ),
    cnc: real(
      "sitio/servicio-cnc.jpg",
      "Muro decorativo de listones de madera con forma ondulada sobre un mueble bajo",
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
    cnc: real("taller/router-cnc.jpg", "Piezas cortadas sobre la mesa del router CNC"),
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
