"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 items-center gap-1.5 px-3 text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 disabled:opacity-60"
    >
      <Trash2 className="size-4" aria-hidden="true" />
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}

export function DeleteProjectButton({ slug, title }: { slug: string; title: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(event) => {
        if (!window.confirm(`¿Eliminar "${title}" de la galería? Esta acción quita el proyecto y su foto.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton />
    </form>
  );
}
