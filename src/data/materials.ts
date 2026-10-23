import { images, type SiteImage } from "./images";

/**
 * Muestras de acabados en lámina de RH.
 *
 * Son REFERENCIAS VISUALES: no representan inventario, marcas ni referencias
 * comerciales confirmadas. Cuando MC Diseños confirme su catálogo, reemplazar
 * nombres e imágenes y marcar `isReference: false`.
 */
export type MaterialTone = "claros" | "medios" | "oscuros" | "neutros";

export type MaterialSample = {
  id: string;
  name: string;
  tone: MaterialTone;
  /** Textura fotográfica (maderas) o color sólido (acabados lisos). */
  swatch: { kind: "image"; image: SiteImage } | { kind: "color"; color: string };
  isReference: boolean;
};

export const materialTones: { id: MaterialTone; label: string }[] = [
  { id: "claros", label: "Maderas claras" },
  { id: "medios", label: "Maderas medias" },
  { id: "oscuros", label: "Maderas oscuras" },
  { id: "neutros", label: "Colores neutros" },
];

export const materialSamples: MaterialSample[] = [
  {
    id: "roble-claro",
    name: "Roble claro",
    tone: "claros",
    swatch: { kind: "image", image: images.textures.robleClaro },
    isReference: true,
  },
  {
    id: "natural",
    name: "Madera natural",
    tone: "claros",
    swatch: { kind: "image", image: images.textures.natural },
    isReference: true,
  },
  {
    id: "cenizo",
    name: "Gris cenizo",
    tone: "medios",
    swatch: { kind: "image", image: images.textures.cenizo },
    isReference: true,
  },
  {
    id: "nogal",
    name: "Nogal",
    tone: "medios",
    swatch: { kind: "image", image: images.textures.nogal },
    isReference: true,
  },
  {
    id: "tabaco",
    name: "Tabaco",
    tone: "oscuros",
    swatch: { kind: "image", image: images.textures.tabaco },
    isReference: true,
  },
  {
    id: "wengue",
    name: "Wengué",
    tone: "oscuros",
    swatch: { kind: "image", image: images.textures.wengue },
    isReference: true,
  },
  {
    id: "blanco",
    name: "Blanco",
    tone: "neutros",
    swatch: { kind: "color", color: "#F4F2EC" },
    isReference: true,
  },
  {
    id: "arena",
    name: "Arena",
    tone: "neutros",
    swatch: { kind: "color", color: "#D8C6AE" },
    isReference: true,
  },
  {
    id: "gris-piedra",
    name: "Gris piedra",
    tone: "neutros",
    swatch: { kind: "color", color: "#777873" },
    isReference: true,
  },
  {
    id: "grafito",
    name: "Grafito",
    tone: "neutros",
    swatch: { kind: "color", color: "#2E302C" },
    isReference: true,
  },
];
