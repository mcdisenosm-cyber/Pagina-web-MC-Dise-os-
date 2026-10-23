"use server";

import { redirect } from "next/navigation";
import { login, logout, requireAdmin } from "@/server/auth";
import {
  deleteStoredProject,
  getStoredProject,
  GitHubContentError,
  listStoredProjects,
  saveStoredProject,
} from "@/server/github-content";
import { ImageValidationError, processProjectImage } from "@/server/images";
import {
  isValidSlug,
  projectImagePath,
  slugify,
  validateProjectForm,
  type ProjectContent,
  type ProjectFormErrors,
  type ProjectFormFields,
} from "@/lib/project-content";

export type LoginState = { error?: string };

/** Inicio de sesión con correo y contraseña (se verifica en el servidor). */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const result = await login(
    typeof email === "string" ? email : "",
    typeof password === "string" ? password : "",
  );
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/admin");
}

export type SaveProjectState = {
  errors?: ProjectFormErrors;
  message?: string;
};

const SESSION_EXPIRED = "Tu sesión terminó. Vuelve a iniciar sesión para continuar.";
const GITHUB_FAILED =
  "No se pudo guardar en GitHub. Intenta de nuevo en un momento; si persiste, revisa el token de GitHub.";

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

/**
 * Crea o actualiza un proyecto. Se ejecuta en el servidor: comprueba la sesión del
 * administrador y vuelve a validar todo, sin confiar en el navegador.
 */
export async function saveProject(_prev: SaveProjectState, formData: FormData): Promise<SaveProjectState> {
  try {
    await requireAdmin();
  } catch {
    return { message: SESSION_EXPIRED };
  }

  const fields: ProjectFormFields = {
    titulo: text(formData, "titulo"),
    categoria: text(formData, "categoria"),
    descripcion: text(formData, "descripcion"),
    textoAlternativo: text(formData, "textoAlternativo"),
    formato: text(formData, "formato"),
    orden: text(formData, "orden"),
  };
  const errors = validateProjectForm(fields);

  const originalSlug = text(formData, "slugOriginal");
  const isNew = !originalSlug;
  if (!isNew && !isValidSlug(originalSlug)) return { message: "Proyecto no válido." };

  const imageEntry = formData.get("imagen");
  const imageFile = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;
  if (isNew && !imageFile) errors.imagen = "Agrega una foto del proyecto.";

  if (Object.keys(errors).length > 0) return { errors };

  try {
    let slug = originalSlug;
    if (isNew) {
      const base = slugify(fields.titulo);
      const taken = new Set((await listStoredProjects()).map((entry) => entry.slug));
      slug = base;
      for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
    } else if (!(await getStoredProject(originalSlug))) {
      return { message: "El proyecto ya no existe. Recarga la lista." };
    }

    let image: Buffer | null = null;
    if (imageFile) image = await processProjectImage(imageFile);

    const content: ProjectContent = {
      titulo: fields.titulo.trim(),
      categoria: fields.categoria as ProjectContent["categoria"],
      descripcion: fields.descripcion.trim(),
      imagen: projectImagePath(slug),
      textoAlternativo: fields.textoAlternativo.trim(),
      formato: fields.formato as ProjectContent["formato"],
      orden: Number(fields.orden),
    };
    await saveStoredProject(slug, content, image, isNew);
  } catch (error) {
    if (error instanceof ImageValidationError) return { errors: { imagen: error.message } };
    if (error instanceof GitHubContentError) return { message: GITHUB_FAILED };
    console.error("Error al guardar el proyecto", error);
    return { message: "Ocurrió un error inesperado al guardar." };
  }

  redirect(`/admin?estado=${isNew ? "creado" : "actualizado"}`);
}

export async function deleteProject(formData: FormData): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin");
  }
  const slug = text(formData, "slug");
  const stored = isValidSlug(slug) ? await getStoredProject(slug) : null;
  if (!stored) redirect("/admin?estado=no-encontrado");
  try {
    await deleteStoredProject(stored.slug, stored.content.titulo);
  } catch (error) {
    console.error("Error al eliminar el proyecto", error);
    redirect("/admin?estado=error");
  }
  redirect("/admin?estado=eliminado");
}
