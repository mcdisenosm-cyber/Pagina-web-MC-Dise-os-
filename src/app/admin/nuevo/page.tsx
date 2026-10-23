import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { services } from "@/data/services";
import { getAdminSession } from "@/server/auth";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <Suspense fallback={<p className="text-stone-deep">Cargando…</p>}>
      <NewProject />
    </Suspense>
  );
}

async function NewProject() {
  // Panel privado: siempre se resuelve en cada solicitud (nunca como página estática).
  await connection();
  if (!(await getAdminSession())) redirect("/admin");
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-carbon md:text-5xl">Nuevo proyecto</h1>
      <ProjectForm categories={services.map(({ id, title }) => ({ id, title }))} />
    </div>
  );
}
