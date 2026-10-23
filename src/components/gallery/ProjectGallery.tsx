"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import type { Project, ProjectLayout } from "@/data/projects";
import type { ServiceId } from "@/data/services";
import { buttonClasses } from "@/components/ui/button";
import { Lightbox } from "./Lightbox";

const INITIAL_COUNT = 12;

type Category = { id: ServiceId; title: string; shortTitle: string };
type Filter = "todos" | ServiceId;

type ProjectGalleryProps = {
  projects: Project[];
  categories: Category[];
};

/** Proporción de cada ficha en el masonry (alto / ancho, usado también para equilibrar columnas). */
const layoutRatio: Record<ProjectLayout, { className: string; ratio: number }> = {
  standard: { className: "aspect-[4/5]", ratio: 5 / 4 },
  tall: { className: "aspect-[2/3]", ratio: 3 / 2 },
  wide: { className: "aspect-[4/3]", ratio: 3 / 4 },
};

// Número de columnas según el ancho de pantalla (coincide con los breakpoints sm y lg).
const columnQueries = ["(min-width: 64rem)", "(min-width: 40rem)"] as const;

function subscribeColumns(onChange: () => void) {
  const lists = columnQueries.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

function getColumnCount() {
  if (window.matchMedia(columnQueries[0]).matches) return 3;
  if (window.matchMedia(columnQueries[1]).matches) return 2;
  return 1;
}

/** Reparte las fichas colocando cada una en la columna más corta, sin dejar huecos. */
function distribute(projects: Project[], columns: number) {
  const result = Array.from({ length: columns }, () => [] as { project: Project; index: number }[]);
  const heights = new Array<number>(columns).fill(0);
  projects.forEach((project, index) => {
    const target = heights.indexOf(Math.min(...heights));
    result[target].push({ project, index });
    heights[target] += layoutRatio[project.layout].ratio;
  });
  return result;
}

export function ProjectGallery({ projects, categories }: ProjectGalleryProps) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const categoryTitle = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.title])) as Record<ServiceId, string>,
    [categories],
  );

  const filtered = useMemo(
    () => (filter === "todos" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );
  // Se muestran los primeros proyectos y el resto con "Ver más" para no alargar la página.
  const visible = useMemo(
    () => (expanded ? filtered : filtered.slice(0, INITIAL_COUNT)),
    [expanded, filtered],
  );
  const hiddenCount = filtered.length - visible.length;

  const selectFilter = (next: Filter) => {
    setFilter(next);
    setExpanded(false);
  };

  const showMore = () => {
    const firstNewId = filtered[visible.length]?.id;
    setExpanded(true);
    // Lleva el foco a la primera ficha nueva para no perderlo al desaparecer el botón.
    requestAnimationFrame(() => {
      if (firstNewId) triggerRefs.current.get(firstNewId)?.focus({ preventScroll: true });
    });
  };

  // En el servidor se renderiza una columna; tras hidratar se ajusta al ancho real.
  const columnCount = useSyncExternalStore(subscribeColumns, getColumnCount, () => 1);
  const columns = useMemo(() => distribute(visible, columnCount), [visible, columnCount]);

  const counts = useMemo(() => {
    const result: Partial<Record<ServiceId, number>> = {};
    for (const project of projects) result[project.category] = (result[project.category] ?? 0) + 1;
    return result;
  }, [projects]);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "todos", label: "Todos", count: projects.length },
    ...categories.map((c) => ({ id: c.id, label: c.title, count: counts[c.id] ?? 0 })),
  ];

  const closeLightbox = () => {
    const project = activeIndex !== null ? visible[activeIndex] : null;
    setActiveIndex(null);
    if (project) triggerRefs.current.get(project.id)?.focus({ preventScroll: true });
  };

  return (
    <div className="mt-12 md:mt-16">
      <div
        role="group"
        aria-label="Filtrar proyectos por categoría"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {filters.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(item.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 border px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                active
                  ? "border-carbon bg-carbon text-warm"
                  : "border-carbon/20 text-carbon hover:border-carbon"
              }`}
            >
              {item.label}
              <span className={`text-xs ${active ? "text-sand" : "text-stone-deep"}`}>{item.count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Mostrando ${visible.length} de ${filtered.length} proyectos${
          filter === "todos" ? "" : ` de ${categoryTitle[filter]}`
        }`}
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 text-stone-deep">Pronto añadiremos proyectos de esta categoría.</p>
      ) : (
        <div
          key={filter}
          role="list"
          aria-label="Proyectos"
          className="mt-8 flex items-start gap-3 sm:gap-4"
        >
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
              {column.map(({ project, index }) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  categoryTitle={categoryTitle[project.category]}
                  delay={Math.min(index, 8) * 60}
                  onOpen={() => setActiveIndex(index)}
                  buttonRef={(node) => {
                    if (node) triggerRefs.current.set(project.id, node);
                    else triggerRefs.current.delete(project.id);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {hiddenCount > 0 ? (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={showMore} className={buttonClasses("outline")}>
            Ver más proyectos
            <span className="text-xs text-stone-deep group-hover:text-sand">+{hiddenCount}</span>
          </button>
        </div>
      ) : null}

      <Lightbox
        projects={visible}
        index={activeIndex}
        categoryTitle={categoryTitle}
        onClose={closeLightbox}
        onNavigate={setActiveIndex}
      />
    </div>
  );
}

type ProjectCardProps = {
  project: Project;
  categoryTitle: string;
  delay: number;
  onOpen: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
};

function ProjectCard({ project, categoryTitle, delay, onOpen, buttonRef }: ProjectCardProps) {
  return (
    <div
      role="listitem"
      className={`${layoutRatio[project.layout].className} animate-[fade-up_0.7s_var(--ease-editorial)_both]`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`Ampliar ${project.title}, ${categoryTitle}`}
        className="group relative block size-full overflow-hidden bg-carbon text-left"
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-editorial group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(32_34_31/0.85)_0%,rgb(32_34_31/0.25)_45%,transparent_70%)]"
        />
        {project.isDemo ? (
          <span className="absolute top-3 left-3 bg-warm/90 px-2 py-1 text-[0.65rem] font-semibold tracking-[0.15em] text-carbon uppercase">
            Ejemplo
          </span>
        ) : null}
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 flex size-9 items-center justify-center bg-warm/90 text-carbon opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Maximize2 className="size-4" />
        </span>
        <span className="absolute inset-x-0 bottom-0 block p-4 text-warm sm:p-5">
          <span className="eyebrow block text-[0.65rem] text-sand">{categoryTitle}</span>
          <span className="mt-1 block font-display text-2xl leading-tight">{project.title}</span>
          <span className="mt-1 line-clamp-2 block max-w-md text-sm leading-snug text-warm/80">
            {project.description}
          </span>
        </span>
      </button>
    </div>
  );
}
