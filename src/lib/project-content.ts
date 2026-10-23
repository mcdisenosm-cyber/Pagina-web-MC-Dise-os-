import { isServiceId, type ServiceId } from "@/data/services";
import type { Project, ProjectLayout } from "@/data/projects";

/**
 * Formato de cada proyecto guardado en src/content/proyectos/<slug>.json.
 * La foto vive en public/images/proyectos/<slug>/imagen.jpg.
 *
 * Funciones puras (sin acceso a disco ni red): las usan la web, el panel y el
 * servidor para validar exactamente igual.
 */
export type ProjectContent = {
  titulo: string;
  categoria: ServiceId;
  descripcion: string;
  imagen: string;
  textoAlternativo: string;
  formato: ProjectLayout;
  orden: number;
};

export const projectLayouts: { value: ProjectLayout; label: string }[] = [
  { value: "standard", label: "Normal (vertical moderado)" },
  { value: "tall", label: "Vertical alargado" },
  { value: "wide", label: "Horizontal" },
];

export const projectLimits = {
  titleMin: 3,
  titleMax: 60,
  descriptionMin: 10,
  descriptionMax: 300,
  altMin: 5,
  altMax: 200,
  orderMin: 0,
  orderMax: 9999,
} as const;

export type ProjectFormFields = {
  titulo: string;
  categoria: string;
  descripcion: string;
  textoAlternativo: string;
  formato: string;
  orden: string;
};

export type ProjectFormErrors = Partial<Record<keyof ProjectFormFields | "imagen", string>>;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return slug.length >= 2 && slug.length <= 80 && SLUG_PATTERN.test(slug);
}

/** Convierte un título en identificador seguro: "Clóset en Grafito" → "closet-en-grafito". */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

export function projectImagePath(slug: string): string {
  return `/images/proyectos/${slug}/imagen.jpg`;
}

const isLayout = (value: string): value is ProjectLayout =>
  projectLayouts.some((layout) => layout.value === value);

/** Valida los campos de texto del formulario del panel. */
export function validateProjectForm(fields: ProjectFormFields): ProjectFormErrors {
  const errors: ProjectFormErrors = {};
  const titulo = fields.titulo.trim();
  const descripcion = fields.descripcion.trim();
  const alt = fields.textoAlternativo.trim();
  const orden = Number(fields.orden);
  const l = projectLimits;

  if (titulo.length < l.titleMin || titulo.length > l.titleMax)
    errors.titulo = `El título debe tener entre ${l.titleMin} y ${l.titleMax} caracteres.`;
  else if (!slugify(titulo)) errors.titulo = "El título debe incluir letras o números.";

  if (!isServiceId(fields.categoria)) errors.categoria = "Selecciona una categoría.";

  if (descripcion.length < l.descriptionMin || descripcion.length > l.descriptionMax)
    errors.descripcion = `La descripción debe tener entre ${l.descriptionMin} y ${l.descriptionMax} caracteres.`;

  if (alt.length < l.altMin || alt.length > l.altMax)
    errors.textoAlternativo = `Describe la foto en ${l.altMin} a ${l.altMax} caracteres.`;

  if (!isLayout(fields.formato)) errors.formato = "Selecciona un formato.";

  if (!Number.isInteger(orden) || orden < l.orderMin || orden > l.orderMax)
    errors.orden = `Usa un número entero entre ${l.orderMin} y ${l.orderMax}.`;

  return errors;
}

/** Interpreta un JSON guardado; devuelve null si está incompleto o es inválido. */
export function parseProjectContent(value: unknown): ProjectContent | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const str = (key: string) => (typeof v[key] === "string" ? (v[key] as string) : "");
  const categoria = str("categoria");
  const formato = str("formato");
  const imagen = str("imagen");
  const titulo = str("titulo").trim();
  if (!titulo || !isServiceId(categoria) || !imagen.startsWith("/images/proyectos/")) return null;
  return {
    titulo,
    categoria,
    descripcion: str("descripcion").trim(),
    imagen,
    textoAlternativo: str("textoAlternativo").trim(),
    formato: isLayout(formato) ? formato : "standard",
    orden: typeof v.orden === "number" && Number.isFinite(v.orden) ? v.orden : 100,
  };
}

export function sortProjectEntries<T extends { content: ProjectContent }>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) =>
      a.content.orden - b.content.orden || a.content.titulo.localeCompare(b.content.titulo, "es"),
  );
}

export function toProject(slug: string, content: ProjectContent): Project {
  return {
    id: slug,
    title: content.titulo,
    category: content.categoria,
    description: content.descripcion,
    image: { src: content.imagen, alt: content.textoAlternativo || content.titulo, isReference: false },
    layout: content.formato,
    isDemo: false,
  };
}
