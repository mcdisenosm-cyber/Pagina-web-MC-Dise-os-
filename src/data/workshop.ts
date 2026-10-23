import { images, type SiteImage } from "./images";

/** Capacidades del taller, tal como la empresa las presenta en sus publicaciones. */
export type Capability = {
  title: string;
  description: string;
  image: SiteImage;
};

export const capabilities: Capability[] = [
  {
    title: "Corte recto y curvo",
    description: "Cortamos cada lámina a la medida del diseño, en líneas rectas o curvas.",
    image: images.workshop.corte,
  },
  {
    title: "Enchapado recto y curvo",
    description: "Sellamos los cantos de cada pieza para lograr un acabado limpio.",
    image: images.workshop.enchapado,
  },
  {
    title: "Prensado de puertas",
    description: "Fabricamos nuestras puertas con prensa propia en el taller.",
    image: images.workshop.prensado,
  },
  {
    title: "Corte y grabado CNC",
    description: "Cortamos y grabamos diseños personalizados a petición de cada cliente.",
    image: images.workshop.cnc,
  },
  {
    title: "Asesoría profesional",
    description: "Te acompañamos a elegir el diseño, los materiales y los acabados.",
    image: images.workshop.asesoria,
  },
];
