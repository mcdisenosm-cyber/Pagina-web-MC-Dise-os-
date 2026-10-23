import "server-only";
import { getServerSecret } from "./env";
import { isValidSlug, parseProjectContent, sortProjectEntries, type ProjectContent } from "@/lib/project-content";

/**
 * Lectura y escritura del contenido del sitio en GitHub.
 *
 * Usa un token de GitHub de grano fino (GITHUB_CONTENT_TOKEN) limitado a ESTE
 * repositorio con permiso "Contents: Read and write". Cada cambio del panel es un
 * commit normal en la rama principal; Vercel lo detecta y vuelve a publicar la web.
 * Los mensajes de commit NO incluyen el correo del administrador (el repositorio es público).
 */

const CONTENT_DIR = "src/content/proyectos";
const IMAGES_DIR = "public/images/proyectos";

function repo() {
  const value = process.env.GITHUB_REPO ?? "mcdisenosm-cyber/Pagina-web-MC-Dise-os-";
  if (!/^[\w.-]+\/[\w.-]+$/.test(value)) throw new Error("GITHUB_REPO no es válido.");
  return value;
}

function branch() {
  return process.env.GITHUB_BRANCH ?? "main";
}

export function isGitHubContentConfigured(): boolean {
  return Boolean(process.env.GITHUB_CONTENT_TOKEN);
}

async function gh<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.github.com/repos/${repo()}${endpoint}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${getServerSecret("GITHUB_CONTENT_TOKEN")}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "mc-disenos-panel",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!response.ok) {
    // No se reenvía el detalle de GitHub al navegador; solo se registra en el servidor.
    console.error(`GitHub ${init?.method ?? "GET"} ${endpoint} → ${response.status}`);
    throw new GitHubContentError(response.status);
  }
  return (await response.json()) as T;
}

export class GitHubContentError extends Error {
  constructor(public status: number) {
    super(`Error de GitHub (${status})`);
  }
}

export type StoredProject = { slug: string; content: ProjectContent };

/** Lista los proyectos tal como están ahora en GitHub (incluye cambios aún no publicados). */
export async function listStoredProjects(): Promise<StoredProject[]> {
  const files = await gh<{ name: string; sha: string; type: string }[]>(
    `/contents/${CONTENT_DIR}?ref=${encodeURIComponent(branch())}`,
  );
  const entries = await Promise.all(
    files
      .filter((file) => file.type === "file" && file.name.endsWith(".json"))
      .map(async (file) => {
        const slug = file.name.slice(0, -".json".length);
        if (!isValidSlug(slug)) return null;
        const blob = await gh<{ content: string }>(`/git/blobs/${file.sha}`);
        try {
          const content = parseProjectContent(JSON.parse(Buffer.from(blob.content, "base64").toString("utf8")));
          return content ? { slug, content } : null;
        } catch {
          return null;
        }
      }),
  );
  return sortProjectEntries(entries.filter((entry) => entry !== null));
}

export async function getStoredProject(slug: string): Promise<StoredProject | null> {
  if (!isValidSlug(slug)) return null;
  const all = await listStoredProjects();
  return all.find((entry) => entry.slug === slug) ?? null;
}

type FileChange = { path: string; content: Buffer } | { path: string; delete: true };

/** Crea un único commit con todos los cambios (sin forzar: nunca reescribe el historial). */
async function commit(message: string, changes: FileChange[]) {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${branch()}`);
  const parentSha = ref.object.sha;
  const parent = await gh<{ tree: { sha: string } }>(`/git/commits/${parentSha}`);

  const tree = await Promise.all(
    changes.map(async (change) => {
      if ("delete" in change) {
        return { path: change.path, mode: "100644", type: "blob", sha: null };
      }
      const blob = await gh<{ sha: string }>(`/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: change.content.toString("base64"), encoding: "base64" }),
      });
      return { path: change.path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );

  const newTree = await gh<{ sha: string }>(`/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const newCommit = await gh<{ sha: string }>(`/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [parentSha] }),
  });
  await gh(`/git/refs/heads/${branch()}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });
}

/** Guarda (crea o actualiza) un proyecto y, si se envía, su foto ya procesada. */
export async function saveStoredProject(
  slug: string,
  content: ProjectContent,
  image: Buffer | null,
  isNew: boolean,
) {
  if (!isValidSlug(slug)) throw new Error("Identificador inválido.");
  const changes: FileChange[] = [
    { path: `${CONTENT_DIR}/${slug}.json`, content: Buffer.from(JSON.stringify(content, null, 2) + "\n") },
  ];
  if (image) changes.push({ path: `${IMAGES_DIR}/${slug}/imagen.jpg`, content: image });
  await commit(`${isNew ? "Nuevo proyecto" : "Actualizar proyecto"}: ${content.titulo} (desde el panel)`, changes);
}

export async function deleteStoredProject(slug: string, title: string) {
  if (!isValidSlug(slug)) throw new Error("Identificador inválido.");
  await commit(`Eliminar proyecto: ${title} (desde el panel)`, [
    { path: `${CONTENT_DIR}/${slug}.json`, delete: true },
    { path: `${IMAGES_DIR}/${slug}/imagen.jpg`, delete: true },
  ]);
}
