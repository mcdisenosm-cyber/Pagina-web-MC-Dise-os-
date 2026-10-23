import { images, type SiteImage } from "./images";

/**
 * Categorías autorizadas por MC Diseños.
 * No añadir categorías nuevas sin aprobación de la empresa.
 */
export const serviceIds = ["cocinas", "empotrados", "closets", "puertas", "mesas", "cnc"] as const;

export type ServiceId = (typeof serviceIds)[number];

export type Service = {
  id: ServiceId;
  title: string;
  /** Nombre corto para filtros y etiquetas. */
  shortTitle: string;
  /** Cómo se nombra el servicio dentro de una frase (mensajes de WhatsApp, etiquetas accesibles). */
  inSentence: string;
  description: string;
  image: SiteImage;
};

export const services: Service[] = [
  {
    id: "cocinas",
    title: "Cocinas integrales",
    shortTitle: "Cocinas",
    inSentence: "cocinas integrales",
    description:
      "Cocinas diseñadas a la medida de tu espacio y tu rutina: distribución, almacenamiento y acabados pensados para el uso diario.",
    image: images.services.cocinas,
  },
  {
    id: "empotrados",
    title: "Muebles empotrados",
    shortTitle: "Empotrados",
    inSentence: "muebles empotrados",
    description:
      "Muebles que se integran a la arquitectura: centros de entretenimiento, bibliotecas, barras, muebles de baño y mobiliario para oficinas y locales.",
    image: images.services.empotrados,
  },
  {
    id: "closets",
    title: "Clósets y armarios",
    shortTitle: "Clósets",
    inSentence: "clósets y armarios",
    description:
      "Clósets, armarios y vestieres organizados según lo que guardas, con módulos, cajones y frentes que acompañan el estilo del espacio.",
    image: images.services.closets,
  },
  {
    id: "puertas",
    title: "Puertas",
    shortTitle: "Puertas",
    inSentence: "puertas",
    description:
      "Puertas con diseño sobrio y acabados coordinados con el resto del mobiliario para dar unidad a cada ambiente.",
    image: images.services.puertas,
  },
  {
    id: "mesas",
    title: "Mesas y comedores",
    shortTitle: "Mesas",
    inSentence: "mesas y comedores",
    description:
      "Mesas y comedores para hogares y negocios, proporcionados a tu espacio y con el tono y la textura que elijas.",
    image: images.services.mesas,
  },
  {
    id: "cnc",
    title: "Diseños en CNC",
    shortTitle: "CNC",
    inSentence: "diseños en CNC",
    description:
      "Diseños personalizados creados a petición de cada cliente con nuestra máquina CNC: grabados, letras, mapas, letreros y muros decorativos.",
    image: images.services.cnc,
  },
];

export const servicesById = Object.fromEntries(services.map((s) => [s.id, s])) as Record<
  ServiceId,
  Service
>;

export function isServiceId(value: string): value is ServiceId {
  return (serviceIds as readonly string[]).includes(value);
}
