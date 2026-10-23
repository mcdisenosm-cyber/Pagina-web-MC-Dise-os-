import { services } from "@/data/services";
import { getProjects } from "@/server/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGallery } from "@/components/gallery/ProjectGallery";

export async function Projects() {
  const projects = await getProjects();

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-titulo"
      className="bg-paper py-24 md:py-36"
    >
      <div className="container-editorial">
        <SectionHeading
          index="02"
          eyebrow="Proyectos destacados"
          id="proyectos-titulo"
          title={
            <>
              Espacios que inspiran <em className="text-wood-deep">tu próximo proyecto</em>
            </>
          }
          intro="Trabajos realizados por nuestro equipo. Explora por categoría y amplía cada imagen para ver el detalle; si algo te gusta, cotiza un proyecto similar."
        />

        <ProjectGallery
          projects={projects}
          categories={services.map(({ id, title, shortTitle }) => ({ id, title, shortTitle }))}
        />
      </div>
    </section>
  );
}
