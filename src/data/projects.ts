import type { SiteImage } from "./images";
import type { ServiceId } from "./services";

/**
 * Tipos de los proyectos de la galería.
 *
 * El contenido NO se escribe aquí: se administra desde el panel /admin y se
 * guarda en src/content/proyectos/*.json (fotos en public/images/proyectos/).
 * La lectura está en src/server/projects.ts.
 *
 * `layout` controla la proporción de cada ficha en la galería tipo masonry:
 * - "tall": vertical alargada.
 * - "wide": horizontal.
 * - "standard": vertical moderada.
 */
export type ProjectLayout = "standard" | "tall" | "wide";

export type Project = {
  id: string;
  title: string;
  category: ServiceId;
  description: string;
  image: SiteImage;
  layout: ProjectLayout;
  /** Con true, la ficha muestra la etiqueta "Ejemplo" (contenido de demostración). */
  isDemo: boolean;
};
