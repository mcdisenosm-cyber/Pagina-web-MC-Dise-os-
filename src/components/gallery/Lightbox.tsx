"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Project } from "@/data/projects";
import type { ServiceId } from "@/data/services";
import { whatsappMessages } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";

type LightboxProps = {
  projects: Project[];
  index: number | null;
  categoryTitle: Record<ServiceId, string>;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Vista ampliada basada en <dialog> nativo: atrapa el foco, se cierra con
 * Escape y permite navegar con las flechas del teclado.
 */
export function Lightbox({ projects, index, categoryTitle, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const project = index !== null ? projects[index] : null;
  const total = projects.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    if (index === null || total < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onNavigate((index + 1) % total);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, total, onNavigate]);

  const goPrev = () => index !== null && onNavigate((index - 1 + total) % total);
  const goNext = () => index !== null && onNavigate((index + 1) % total);

  const navButton =
    "on-dark flex size-12 items-center justify-center border border-warm/25 text-warm transition-colors hover:border-warm hover:bg-warm hover:text-carbon";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="lightbox-titulo"
      className="lightbox on-dark m-0 size-full max-h-none max-w-none bg-transparent p-0 text-warm"
      onClick={(event) => {
        // Cierra al hacer clic en el fondo (fuera del contenido).
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      {project ? (
        <div
          className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) dialogRef.current?.close();
          }}
        >
          <div className="flex items-center justify-between gap-4 lg:col-span-2">
            <p className="text-sm text-warm/70" aria-live="polite">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className={navButton}
              aria-label="Cerrar vista ampliada"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <figure className="relative min-h-0">
            <Image
              key={project.id}
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(min-width: 64rem) 70vw, 100vw"
              className="animate-[fade-in_0.4s_ease-out] object-contain"
            />
          </figure>

          <div className="flex flex-col gap-5 lg:justify-end lg:pb-2">
            <div>
              <p className="eyebrow text-sand">{categoryTitle[project.category]}</p>
              <h3 id="lightbox-titulo" className="mt-2 font-display text-3xl leading-tight md:text-4xl">
                {project.title}
              </h3>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-warm/80 md:text-base">
                {project.description}
              </p>
              {project.isDemo ? (
                <p className="mt-3 text-xs text-warm/60">
                  Imagen de referencia con fines demostrativos.
                </p>
              ) : null}
            </div>
            <div
              className="flex flex-wrap items-center gap-3"
              onClickCapture={(event) => {
                // Sin WhatsApp configurado el enlace lleva a #contacto: cerramos la vista ampliada.
                const link = (event.target as HTMLElement).closest("a");
                if (link?.getAttribute("href")?.startsWith("#")) dialogRef.current?.close();
              }}
            >
              {total > 1 ? (
                <>
                  <button type="button" onClick={goPrev} className={navButton} aria-label="Proyecto anterior">
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={goNext} className={navButton} aria-label="Proyecto siguiente">
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}
              <WhatsAppLink
                message={whatsappMessages.project(project.title, project.category)}
                ariaLabel={`Cotizar un proyecto similar a ${project.title}`}
                className="inline-flex min-h-12 items-center gap-2 bg-warm px-5 text-sm font-semibold text-carbon transition-colors hover:bg-sand"
              >
                Cotizar algo similar
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </WhatsAppLink>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
