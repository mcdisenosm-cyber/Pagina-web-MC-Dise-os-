import { siteConfig } from "@/config/site";

/** Franja editorial con el eslogan, entre el hero y los servicios. */
export function Manifesto() {
  return (
    <section aria-label="Nuestra propuesta" className="bg-warm">
      <div className="container-editorial grid gap-10 py-24 md:py-32 lg:grid-cols-12">
        <p className="flex items-end gap-4 lg:col-span-3 lg:flex-col lg:items-start lg:gap-2">
          <span className="font-display text-7xl leading-none text-wood-deep md:text-8xl">
            +{siteConfig.experienceYears}
          </span>
          <span className="eyebrow pb-2 text-stone-deep lg:pb-0">Años de experiencia</span>
        </p>
        <div className="reveal lg:col-span-9">
          <p className="font-display text-4xl leading-[1.08] tracking-tight text-balance text-carbon sm:text-5xl lg:text-6xl">
            {siteConfig.slogan}.{" "}
            <span className="text-stone-deep">
              Cada mueble parte de tu espacio, de tu forma de vivirlo y de los acabados que lo hacen
              tuyo.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
