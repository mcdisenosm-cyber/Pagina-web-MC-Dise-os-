import Image from "next/image";
import { images } from "@/data/images";
import { materialSamples, materialTones } from "@/data/materials";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Materials() {
  const hasReferences = materialSamples.some((sample) => sample.isReference);

  return (
    <section
      id="materiales"
      aria-labelledby="materiales-titulo"
      className="on-dark bg-carbon py-24 text-warm md:py-36"
    >
      <div className="container-editorial">
        <SectionHeading
          index="03"
          eyebrow="Materiales y acabados"
          id="materiales-titulo"
          tone="light"
          title={
            <>
              Láminas de RH, <em className="text-sand">tonos que se sienten</em>
            </>
          }
          intro="Fabricamos en láminas de RH. Te ayudamos a elegir entre tonos de madera y colores neutros, del más claro al más profundo, para que cada mueble dialogue con tu espacio."
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <figure className="reveal lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-carbon-soft">
              <Image
                src={images.materialsFeature.src}
                alt={images.materialsFeature.alt}
                fill
                sizes="(min-width: 64rem) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-sm leading-relaxed text-warm/65">
              Láminas en nuestro taller. El acabado define el carácter del mueble: veta, tono y
              textura se eligen junto con el diseño.
            </figcaption>
          </figure>

          <div className="space-y-12 lg:col-span-6 lg:col-start-7">
            {materialTones.map((tone) => {
              const samples = materialSamples.filter((sample) => sample.tone === tone.id);
              if (samples.length === 0) return null;
              return (
                <div key={tone.id} className="reveal">
                  <h3 className="eyebrow flex items-center gap-4 text-sand">
                    {tone.label}
                    <span aria-hidden="true" className="h-px flex-1 bg-warm/15" />
                  </h3>
                  <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                    {samples.map((sample) => (
                      <li key={sample.id}>
                        <div className="group relative aspect-square overflow-hidden ring-1 ring-warm/10">
                          {sample.swatch.kind === "image" ? (
                            <Image
                              src={sample.swatch.image.src}
                              alt={sample.swatch.image.alt}
                              fill
                              sizes="(min-width: 40rem) 12rem, 45vw"
                              className="object-cover transition-transform duration-[1.2s] ease-editorial group-hover:scale-110"
                            />
                          ) : (
                            <div
                              role="img"
                              aria-label={`Muestra de color ${sample.name.toLowerCase()}`}
                              className="size-full"
                              style={{ backgroundColor: sample.swatch.color }}
                            />
                          )}
                        </div>
                        <p className="mt-3 text-sm font-medium">{sample.name}</p>
                        {sample.isReference ? (
                          <p className="text-xs text-warm/60">Referencia visual</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {hasReferences ? (
              <p className="border-t border-warm/15 pt-6 text-sm leading-relaxed text-warm/70">
                Las muestras son referencias visuales para orientar la elección de tonos y no
                corresponden necesariamente al inventario disponible. Los colores pueden variar
                según la pantalla. Consúltanos por los acabados disponibles para tu proyecto.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
