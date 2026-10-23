import "server-only";
import { cacheLife } from "next/cache";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { isServiceId } from "@/data/services";
import type { Project, ProjectLayout } from "@/data/projects";

const layouts: ProjectLayout[] = ["standard", "tall", "wide"];

/**
 * Lee los proyectos publicados desde el panel (src/content/proyectos).
 *
 * El contenido solo cambia cuando el panel hace un commit, lo que dispara un
 * nuevo despliegue; por eso el resultado se cachea al máximo.
 * Las entradas con datos incompletos o una categoría desconocida se omiten
 * para que un error de edición nunca rompa la página.
 */
export async function getProjects(): Promise<Project[]> {
  "use cache";
  // En producción cada publicación del panel genera un despliegue nuevo, así que la
  // caché máxima es segura. En desarrollo (modo local) reinicia `npm run dev` para
  // ver en la galería lo editado en el panel.
  cacheLife("max");

  const reader = createReader(process.cwd(), keystaticConfig);
  const entries = await reader.collections.proyectos.all();

  return entries
    .filter(({ entry }) => entry.imagen && isServiceId(entry.categoria))
    .sort((a, b) => (a.entry.orden ?? 100) - (b.entry.orden ?? 100) || a.entry.titulo.localeCompare(b.entry.titulo, "es"))
    .map(({ slug, entry }) => ({
      id: slug,
      title: entry.titulo,
      category: entry.categoria as Project["category"],
      description: entry.descripcion,
      image: {
        src: entry.imagen as string,
        alt: entry.textoAlternativo || entry.titulo,
        isReference: false,
      },
      layout: layouts.includes(entry.formato as ProjectLayout) ? (entry.formato as ProjectLayout) : "standard",
      isDemo: false,
    }));
}
