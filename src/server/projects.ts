import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import type { Project } from "@/data/projects";
import {
  isValidSlug,
  parseProjectContent,
  sortProjectEntries,
  toProject,
} from "@/lib/project-content";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "proyectos");

/**
 * Lee los proyectos publicados (src/content/proyectos/*.json).
 *
 * El contenido solo cambia cuando el panel /admin hace un commit, lo que dispara un
 * nuevo despliegue; por eso el resultado se cachea al máximo. Las entradas con datos
 * incompletos se omiten para que un error nunca rompa la página.
 */
export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("max");

  const files = (await readdir(CONTENT_DIR)).filter((file) => file.endsWith(".json"));
  const entries = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".json".length);
      if (!isValidSlug(slug)) return null;
      try {
        const content = parseProjectContent(JSON.parse(await readFile(path.join(CONTENT_DIR, file), "utf8")));
        return content ? { slug, content } : null;
      } catch {
        return null;
      }
    }),
  );

  return sortProjectEntries(entries.filter((entry) => entry !== null)).map(({ slug, content }) =>
    toProject(slug, content),
  );
}
