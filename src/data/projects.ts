import { images, type SiteImage } from "./images";
import type { ServiceId } from "./services";

/**
 * Proyectos reales de MC Diseños (fotos de su página oficial de Facebook).
 *
 * `layout` controla la proporción de cada ficha en la galería tipo masonry:
 * - "tall": vertical alargada.
 * - "wide": horizontal.
 * - "standard": vertical moderada.
 *
 * `isDemo` queda disponible por si se añade contenido de ejemplo en el futuro:
 * con true, la ficha muestra la etiqueta "Ejemplo".
 */
export type ProjectLayout = "standard" | "tall" | "wide";

export type Project = {
  id: string;
  title: string;
  category: ServiceId;
  description: string;
  image: SiteImage;
  layout: ProjectLayout;
  isDemo: boolean;
};

type ProjectInput = Omit<Project, "isDemo"> & { isDemo?: boolean };

const project = (input: ProjectInput): Project => ({ isDemo: false, ...input });

export const projects: Project[] = [
  project({
    id: "cocina-isla-techo-madera",
    title: "Cocina blanca con isla",
    category: "cocinas",
    description:
      "Cocina en blanco brillante con isla de mesón negro, campana de isla y un panel en madera en el techo.",
    image: images.projects.cocinaIslaTecho,
    layout: "wide",
  }),
  project({
    id: "vestier-pasillo-madera",
    title: "Vestier en pasillo",
    category: "closets",
    description:
      "Vestier en tono madera a ambos lados del pasillo, con zonas de puertas, repisas abiertas y cajones.",
    image: images.projects.closetPasillo,
    layout: "tall",
  }),
  project({
    id: "cnc-muro-ondulado",
    title: "Muro ondulado en madera",
    category: "cnc",
    description:
      "Muro decorativo de listones cortados con CNC que forman una onda, sobre un mueble bajo con repisas.",
    image: images.projects.cncMuro,
    layout: "wide",
  }),
  project({
    id: "mueble-tv-marmol",
    title: "Mueble con nicho de mármol",
    category: "empotrados",
    description:
      "Mueble empotrado en tono madera con columnas laterales, repisas y cajones suspendidos alrededor de un muro de mármol.",
    image: images.projects.empotradoTv,
    layout: "standard",
  }),
  project({
    id: "mesas-terraza-restaurante",
    title: "Mesas para terraza",
    category: "mesas",
    description: "Mesas con cubierta en madera clara para la terraza de un restaurante.",
    image: images.projects.mesasTerraza,
    layout: "standard",
  }),
  project({
    id: "puerta-closet-gris",
    title: "Puerta en tono madera",
    category: "puertas",
    description:
      "Puerta en lámina tono madera con sobreluz, instalada junto a un clóset de frentes grises.",
    image: images.projects.puertaClosetGris,
    layout: "tall",
  }),
  project({
    id: "cocina-isla-frentes-madera",
    title: "Cocina con isla en madera",
    category: "cocinas",
    description:
      "Cocina blanca con horno empotrado y una isla de mesón blanco con frentes en madera.",
    image: images.projects.cocinaIslaMadera,
    layout: "wide",
  }),
  project({
    id: "cnc-mapamundi",
    title: "Mapamundi en madera",
    category: "cnc",
    description: "Mapamundi cortado pieza por pieza con CNC e instalado en relieve sobre la pared.",
    image: images.projects.cncMapa,
    layout: "standard",
  }),
  project({
    id: "closet-madera-cajonera",
    title: "Clóset con cajonera",
    category: "closets",
    description: "Clóset de piso a techo en tono madera con maleteros y cajonera central.",
    image: images.projects.closetCajonera,
    layout: "standard",
  }),
  project({
    id: "barra-cafeteria",
    title: "Barra de cafetería",
    category: "empotrados",
    description:
      "Barra de atención con frentes en madera clara y listones, mesón en piedra oscura y repisas de exhibición.",
    image: images.projects.empotradoCafeteria,
    layout: "standard",
  }),
  project({
    id: "cnc-aguila",
    title: "Grabado de águila",
    category: "cnc",
    description: "Ilustración de un águila grabada con CNC sobre una tabla de madera.",
    image: images.projects.cncAguila,
    layout: "wide",
  }),
  project({
    id: "cocina-grafito-isla",
    title: "Cocina en grafito y blanco",
    category: "cocinas",
    description:
      "Cocina con muebles bajos en grafito, superiores blancos y una isla con mesón negro.",
    image: images.projects.cocinaGrafito,
    layout: "wide",
  }),
  project({
    id: "mueble-lavamanos-suspendido",
    title: "Mueble de lavamanos suspendido",
    category: "empotrados",
    description:
      "Mueble de baño suspendido en tono madera oscura con cajones y perfiles de aluminio.",
    image: images.projects.empotradoLavamanos,
    layout: "tall",
  }),
  project({
    id: "vestier-abierto-madera",
    title: "Vestier abierto",
    category: "closets",
    description: "Vestier abierto en madera con módulos para colgar, repisas y cajones.",
    image: images.projects.closetAbierto,
    layout: "standard",
  }),
  project({
    id: "mesas-restaurante-listones",
    title: "Mesas para restaurante",
    category: "mesas",
    description:
      "Mesas de cubierta gris para el salón de un restaurante con muro y techo de listones en madera.",
    image: images.projects.mesasRestaurante,
    layout: "standard",
  }),
  project({
    id: "cnc-letras",
    title: "Letras decorativas",
    category: "cnc",
    description: "Letras para un letrero comercial, recién cortadas en el router CNC.",
    image: images.projects.cncLetras,
    layout: "wide",
  }),
  project({
    id: "repisas-mueble-bar",
    title: "Repisas y mueble bar",
    category: "empotrados",
    description:
      "Repisas flotantes en tono madera con portacopas y mueble bajo gris con vinera en cruz.",
    image: images.projects.empotradoBar,
    layout: "standard",
  }),
  project({
    id: "puerta-closet-madera",
    title: "Puerta y clóset a juego",
    category: "puertas",
    description: "Puerta y clóset fabricados en el mismo tono de madera para dar unidad al espacio.",
    image: images.projects.puertaClosetMadera,
    layout: "wide",
  }),
  project({
    id: "closet-grafito",
    title: "Clóset en grafito",
    category: "closets",
    description: "Clóset en tono grafito con puertas, repisas abiertas y cajones.",
    image: images.projects.closetGrafito,
    layout: "standard",
  }),
  project({
    id: "cnc-letrero-quemado",
    title: "Letrero tallado",
    category: "cnc",
    description: "Letrero tallado con CNC sobre madera con acabado quemado.",
    image: images.projects.cncLetrero,
    layout: "wide",
  }),
  project({
    id: "oficina-mobiliario",
    title: "Mobiliario para oficina",
    category: "empotrados",
    description:
      "Oficina con escritorio, biblioteca, panel para TV y techo de listones en madera.",
    image: images.projects.empotradoOficina,
    layout: "standard",
  }),
  project({
    id: "cocina-lineal-blanca",
    title: "Cocina lineal blanca",
    category: "cocinas",
    description: "Cocina lineal con frentes blancos brillantes, mesón negro y superiores hasta el techo.",
    image: images.projects.cocinaLineal,
    layout: "standard",
  }),
  project({
    id: "cnc-panel-parametrico",
    title: "Panel paramétrico",
    category: "cnc",
    description: "Panel de listones ondulados cortados con CNC, armado en el taller.",
    image: images.projects.cncPanel,
    layout: "wide",
  }),
  project({
    id: "closet-abierto-blanco",
    title: "Clóset abierto en tono claro",
    category: "closets",
    description: "Clóset abierto con repisas, cajones y zapatero metálico extraíble.",
    image: images.projects.closetBlanco,
    layout: "standard",
  }),
  project({
    id: "mueble-bano-espejo",
    title: "Mueble de baño",
    category: "empotrados",
    description: "Mueble de baño en tono madera con lavamanos integrado y espejo redondo.",
    image: images.projects.empotradoBano,
    layout: "tall",
  }),
  project({
    id: "cnc-mapamundi-detalle",
    title: "Detalle del mapamundi",
    category: "cnc",
    description: "Detalle de las piezas en relieve del mapamundi cortado con CNC.",
    image: images.projects.cncMapaDetalle,
    layout: "standard",
  }),
];
