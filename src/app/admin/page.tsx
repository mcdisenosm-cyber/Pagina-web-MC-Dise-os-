/* El panel navega con <a> (cargas completas de página) a propósito: Next.js conserva en
   memoria las rutas visitadas y así se evita ver formularios con datos anteriores o listas
   desactualizadas. */
import { Suspense } from "react";
import { connection } from "next/server";
import Image from "next/image";
import { CircleAlert, CircleCheck, Pencil, Plus } from "lucide-react";
import { servicesById } from "@/data/services";
import { getAdminSession, isAdminConfigured } from "@/server/auth";
import { isGitHubContentConfigured, listStoredProjects } from "@/server/github-content";
import { buttonClasses } from "@/components/ui/button";
import { LoginForm } from "@/components/admin/LoginForm";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";

type SearchParams = Promise<{ estado?: string }>;

const statusMessages: Record<string, { ok: boolean; text: string }> = {
  creado: { ok: true, text: "Proyecto publicado. La web se actualizará en 1–2 minutos." },
  actualizado: { ok: true, text: "Cambios guardados. La web se actualizará en 1–2 minutos." },
  eliminado: { ok: true, text: "Proyecto eliminado. La web se actualizará en 1–2 minutos." },
  "no-encontrado": { ok: false, text: "Ese proyecto ya no existe." },
  error: { ok: false, text: "No se pudo completar la acción. Intenta de nuevo." },
};

export default function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<p className="text-stone-deep">Cargando…</p>}>
      <AdminHome searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminHome({ searchParams }: { searchParams: SearchParams }) {
  // Panel privado: siempre se resuelve en cada solicitud (nunca como página estática).
  await connection();
  const { estado } = await searchParams;

  if (!isAdminConfigured()) {
    return (
      <Card title="Panel no disponible">
        <p>El inicio de sesión del panel todavía no está configurado en este servidor.</p>
      </Card>
    );
  }

  const admin = await getAdminSession();
  if (!admin) {
    return (
      <Card title="Iniciar sesión">
        <p>Acceso exclusivo para el administrador de MC Diseños.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
    );
  }

  const status = estado ? statusMessages[estado] : undefined;
  const projects = isGitHubContentConfigured() ? await listStoredProjects().catch(() => null) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-carbon md:text-5xl">Proyectos de la galería</h1>
          <p className="mt-2 text-sm text-stone-deep">Sesión iniciada como {admin.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/nuevo" className={buttonClasses("solid")}>
            <Plus className="size-4" aria-hidden="true" />
            Nuevo proyecto
          </a>
          <SignOutButton />
        </div>
      </div>

      {status ? (
        <p
          role="status"
          className={`flex items-center gap-2 border-l-2 px-4 py-3 text-sm ${
            status.ok ? "border-wood bg-warm text-carbon" : "border-red-700 bg-red-50 text-red-900"
          }`}
        >
          {status.ok ? <CircleCheck className="size-4 text-wood-deep" aria-hidden="true" /> : <CircleAlert className="size-4" aria-hidden="true" />}
          {status.text}
        </p>
      ) : null}

      {projects === null ? (
        <p className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
          No se pudo leer la lista de proyectos desde GitHub. Revisa que el token de GitHub esté
          configurado y vigente.
        </p>
      ) : (
        <>
          <p className="text-sm text-stone-deep">{projects.length} proyectos publicados.</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(({ slug, content }) => (
              <li key={slug} className="flex gap-4 border border-carbon/10 bg-warm p-3">
                <div className="relative size-24 shrink-0 overflow-hidden bg-paper">
                  <Image src={content.imagen} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-xs font-semibold tracking-[0.15em] text-wood-deep uppercase">
                    {servicesById[content.categoria].title}
                  </p>
                  <p className="mt-1 truncate font-semibold text-carbon">{content.titulo}</p>
                  <p className="text-xs text-stone-deep">Posición {content.orden}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
                    <a
                      href={`/admin/editar/${slug}`}
                      className="inline-flex min-h-10 items-center gap-1.5 px-3 text-sm font-semibold text-carbon transition-colors hover:bg-paper"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Editar
                    </a>
                    <DeleteProjectButton slug={slug} title={content.titulo} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md border border-carbon/10 bg-warm p-8 text-stone-deep">
      <h1 className="font-display text-4xl text-carbon">{title}</h1>
      <div className="mt-4 leading-relaxed">{children}</div>
    </div>
  );
}
