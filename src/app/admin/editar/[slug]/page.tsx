import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { services } from "@/data/services";
import { getAdminSession } from "@/server/auth";
import { getStoredProject } from "@/server/github-content";
import { ProjectForm } from "@/components/admin/ProjectForm";

type Params = Promise<{ slug: string }>;

export default function EditProjectPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<p className="text-stone-deep">Cargando…</p>}>
      <EditProject params={params} />
    </Suspense>
  );
}

async function EditProject({ params }: { params: Params }) {
  // Panel privado: siempre se resuelve en cada solicitud (nunca como página estática).
  await connection();
  if (!(await getAdminSession())) redirect("/admin");
  const { slug } = await params;
  const stored = await getStoredProject(slug);
  if (!stored) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-carbon md:text-5xl">Editar proyecto</h1>
      <ProjectForm
        categories={services.map(({ id, title }) => ({ id, title }))}
        slug={stored.slug}
        initial={stored.content}
      />
    </div>
  );
}
