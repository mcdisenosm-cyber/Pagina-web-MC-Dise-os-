import Image from "next/image";
import { siteConfig } from "@/config/site";
import { images } from "@/data/images";
import { capabilities } from "@/data/workshop";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Workshop() {
  return (
    <section id="taller" aria-labelledby="taller-titulo" className="bg-paper py-24 md:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="04"
          eyebrow="Nuestro taller"
          id="taller-titulo"
          title={
            <>
              Un equipo propio, <em className="text-wood-deep">un taller en Pitalito</em>
            </>
          }
          intro={`Más de ${siteConfig.experienceYears} años de experiencia nos respaldan. Detrás de cada mueble hay personas y un taller con maquinaria para cortar, enchapar, prensar y tallar; ahí fabricamos cada pieza que diseñamos contigo.`}
        />

        <figure className="reveal mt-16 md:mt-24">
          <div className="relative aspect-[4/3] overflow-hidden bg-carbon sm:aspect-[1200/442]">
            <Image
              src={images.workshop.team.src}
              alt={images.workshop.team.alt}
              fill
              sizes="(min-width: 90rem) 83rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-4 text-sm text-stone-deep">
            Equipo de {siteConfig.name} en nuestra sede de {siteConfig.contact.city.replace(", Colombia", "")}.
          </figcaption>
        </figure>

        <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-5">
          {capabilities.map((capability, index) => (
            <li key={capability.title} className="reveal group">
              <div className="relative aspect-[4/5] overflow-hidden bg-carbon">
                <Image
                  src={capability.image.src}
                  alt={capability.image.alt}
                  fill
                  sizes="(min-width: 64rem) 18vw, (min-width: 48rem) 30vw, 45vw"
                  className="object-cover transition-transform duration-[1.4s] ease-editorial group-hover:scale-[1.04]"
                />
              </div>
              <p aria-hidden="true" className="mt-5 text-xs font-semibold tracking-[0.2em] text-wood-deep">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight text-carbon">{capability.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-stone-deep">
                {capability.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
