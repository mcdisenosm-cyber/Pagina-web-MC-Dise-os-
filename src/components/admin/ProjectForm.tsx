"use client";

import { startTransition, useActionState, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CircleAlert, ImagePlus, LoaderCircle } from "lucide-react";
import { saveProject, type SaveProjectState } from "@/app/admin/actions";
import {
  projectLayouts,
  projectLimits,
  validateProjectForm,
  type ProjectContent,
  type ProjectFormErrors,
  type ProjectFormFields,
} from "@/lib/project-content";
import { buttonClasses } from "@/components/ui/button";
import { resizeImageForUpload } from "./resize-image";

type ProjectFormProps = {
  categories: { id: string; title: string }[];
  /** Al editar: identificador y datos actuales. */
  slug?: string;
  initial?: ProjectContent;
};

const fieldClass =
  "mt-2 block w-full border border-carbon/20 bg-white px-3 py-2.5 text-base text-carbon focus:border-carbon focus:outline-none focus:ring-1 focus:ring-carbon";

export function ProjectForm({ categories, slug, initial }: ProjectFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch, pending] = useActionState<SaveProjectState, FormData>(saveProject, {});
  const [clientErrors, setClientErrors] = useState<ProjectFormErrors>({});
  const [preview, setPreview] = useState<string | null>(initial?.imagen ?? null);
  const [preparing, setPreparing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isNew = !slug;

  const errors = { ...state.errors, ...clientErrors };
  const busy = pending || preparing;

  const onImageChange = async (file: File | undefined) => {
    setClientErrors((current) => ({ ...current, imagen: undefined }));
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setClientErrors((current) => ({ ...current, imagen: "Selecciona un archivo de imagen." }));
      return;
    }
    setPreparing(true);
    try {
      const resized = await resizeImageForUpload(file);
      setImageFile(resized);
      setPreview(URL.createObjectURL(resized));
    } catch {
      setClientErrors((current) => ({
        ...current,
        imagen: "No se pudo leer la foto. Prueba con un archivo JPG o PNG.",
      }));
    } finally {
      setPreparing(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(
      ["titulo", "categoria", "descripcion", "textoAlternativo", "formato", "orden"].map((key) => [
        key,
        String(formData.get(key) ?? ""),
      ]),
    ) as ProjectFormFields;
    const nextErrors = validateProjectForm(fields);
    if (isNew && !imageFile) nextErrors.imagen = "Agrega una foto del proyecto.";
    setClientErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    formData.delete("imagen");
    if (imageFile) formData.set("imagen", imageFile);
    startTransition(() => dispatch(formData));
  };

  const error = (key: keyof ProjectFormErrors) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-red-800">
        <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
        {errors[key]}
      </p>
    ) : null;

  const a11y = (key: keyof ProjectFormErrors) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-deep hover:text-carbon">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a la lista
      </Link>

      {state.message ? (
        <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
          {state.message}
        </p>
      ) : null}

      {slug ? <input type="hidden" name="slugOriginal" value={slug} /> : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <div>
            <label htmlFor={`${uid}-titulo`} className="text-sm font-semibold text-carbon">
              Título
            </label>
            <input
              id={`${uid}-titulo`}
              name="titulo"
              defaultValue={initial?.titulo}
              maxLength={projectLimits.titleMax}
              placeholder="Ej.: Cocina blanca con isla"
              className={fieldClass}
              {...a11y("titulo")}
            />
            {error("titulo")}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-categoria`} className="text-sm font-semibold text-carbon">
                Categoría
              </label>
              <select
                id={`${uid}-categoria`}
                name="categoria"
                defaultValue={initial?.categoria ?? categories[0]?.id}
                className={fieldClass}
                {...a11y("categoria")}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              {error("categoria")}
            </div>
            <div>
              <label htmlFor={`${uid}-formato`} className="text-sm font-semibold text-carbon">
                Formato en la galería
              </label>
              <select
                id={`${uid}-formato`}
                name="formato"
                defaultValue={initial?.formato ?? "standard"}
                className={fieldClass}
                {...a11y("formato")}
              >
                {projectLayouts.map((layout) => (
                  <option key={layout.value} value={layout.value}>
                    {layout.label}
                  </option>
                ))}
              </select>
              {error("formato")}
            </div>
          </div>

          <div>
            <label htmlFor={`${uid}-descripcion`} className="text-sm font-semibold text-carbon">
              Descripción
            </label>
            <textarea
              id={`${uid}-descripcion`}
              name="descripcion"
              rows={4}
              defaultValue={initial?.descripcion}
              maxLength={projectLimits.descriptionMax}
              placeholder="Una o dos frases: materiales, tonos y qué incluye el trabajo."
              className={`${fieldClass} resize-y`}
              {...a11y("descripcion")}
            />
            {error("descripcion")}
          </div>

          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <div>
              <label htmlFor={`${uid}-alt`} className="text-sm font-semibold text-carbon">
                Descripción de la foto
              </label>
              <input
                id={`${uid}-alt`}
                name="textoAlternativo"
                defaultValue={initial?.textoAlternativo}
                maxLength={projectLimits.altMax}
                placeholder="Qué se ve en la imagen"
                className={fieldClass}
                {...a11y("textoAlternativo")}
              />
              <p className="mt-1 text-xs text-stone-deep">
                La usan las personas con discapacidad visual y Google.
              </p>
              {error("textoAlternativo")}
            </div>
            <div>
              <label htmlFor={`${uid}-orden`} className="text-sm font-semibold text-carbon">
                Posición
              </label>
              <input
                id={`${uid}-orden`}
                name="orden"
                type="number"
                min={projectLimits.orderMin}
                max={projectLimits.orderMax}
                step={1}
                defaultValue={initial?.orden ?? 5}
                className={fieldClass}
                {...a11y("orden")}
              />
              <p className="mt-1 text-xs text-stone-deep">Menor = aparece antes.</p>
              {error("orden")}
            </div>
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold text-carbon">Foto</span>
          <label
            htmlFor={`${uid}-imagen`}
            className={`mt-2 flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed bg-white text-center transition-colors hover:border-carbon ${
              errors.imagen ? "border-red-700" : "border-carbon/25"
            }`}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob) de la foto elegida
              <img src={preview} alt="Vista previa de la foto" className="size-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-2 p-6 text-sm text-stone-deep">
                <ImagePlus className="size-8" aria-hidden="true" />
                Toca para elegir una foto
                <span className="text-xs">JPG, PNG o WebP</span>
              </span>
            )}
          </label>
          <input
            id={`${uid}-imagen`}
            name="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => void onImageChange(e.target.files?.[0])}
            {...a11y("imagen")}
          />
          <p className="mt-2 text-xs text-stone-deep">
            {preparing
              ? "Preparando la foto…"
              : isNew
                ? "Se reduce automáticamente antes de subirla."
                : "Elige otra foto solo si quieres reemplazarla."}
          </p>
          {error("imagen")}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-carbon/10 pt-6 sm:flex-row sm:items-center">
        <button type="submit" disabled={busy} className={buttonClasses("solid", "disabled:opacity-60")}>
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? "Publicando…" : isNew ? "Publicar proyecto" : "Guardar cambios"}
        </button>
        <p className="text-sm text-stone-deep">
          Al publicar, la web se actualiza sola en 1–2 minutos.
        </p>
      </div>
    </form>
  );
}
