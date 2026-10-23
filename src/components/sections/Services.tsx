import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { whatsappMessages } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";

/**
 * Composición asimétrica: cada posición define columnas, desplazamiento y
 * proporción de la imagen. Se aplica por orden a los servicios.
 */
const compositions = [
  { item: "lg:col-span-7", image: "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[6/5]", sizes: "(min-width: 64rem) 55vw, 100vw" },
  { item: "lg:col-span-4 lg:col-start-9 lg:mt-56", image: "aspect-[4/5]", sizes: "(min-width: 64rem) 30vw, (min-width: 48rem) 50vw, 100vw" },
  { item: "lg:col-span-5 lg:col-start-2", image: "aspect-[4/5]", sizes: "(min-width: 64rem) 40vw, (min-width: 48rem) 50vw, 100vw" },
  { item: "lg:col-span-5 lg:col-start-8 lg:mt-32", image: "aspect-[4/5] lg:aspect-[3/4]", sizes: "(min-width: 64rem) 40vw, (min-width: 48rem) 50vw, 100vw" },
  { item: "lg:col-span-6", image: "aspect-[4/5] lg:aspect-[5/4]", sizes: "(min-width: 64rem) 48vw, (min-width: 48rem) 50vw, 100vw" },
  { item: "lg:col-span-5 lg:col-start-8 lg:mt-40", image: "aspect-[4/5]", sizes: "(min-width: 64rem) 40vw, (min-width: 48rem) 50vw, 100vw" },
];

export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="bg-warm pb-24 md:pb-36">
      <div className="container-editorial">
        <SectionHeading
          index="01"
          eyebrow="Servicios"
          id="servicios-titulo"
          title={
            <>
              Mobiliario a medida, <em className="text-wood-deep">pensado pieza a pieza</em>
            </>
          }
          intro="Diseñamos y fabricamos mobiliario a medida en láminas de RH y piezas personalizadas en CNC. Cuéntanos qué necesitas y te ayudamos a definirlo."
        />

        <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-24">
          {services.map((service, index) => {
            const layout = compositions[index % compositions.length];
            return (
              <article
                key={service.id}
                id={`servicio-${service.id}`}
                aria-labelledby={`servicio-${service.id}-titulo`}
                className={`reveal group scroll-mt-24 ${layout.item}`}
              >
                <div className={`relative overflow-hidden bg-paper ${layout.image}`}>
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes={layout.sizes}
                    className="object-cover transition-transform duration-[1.4s] ease-editorial group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 md:gap-x-8">
                  <span
                    aria-hidden="true"
                    className="pt-2 text-xs font-semibold tracking-[0.2em] text-wood-deep"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      id={`servicio-${service.id}-titulo`}
                      className="font-display text-3xl leading-tight text-carbon md:text-4xl"
                    >
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-md leading-relaxed text-pretty text-stone-deep">
                      {service.description}
                    </p>
                    <WhatsAppLink
                      message={whatsappMessages.service(service.id)}
                      ariaLabel={`Solicitar cotización de ${service.inSentence}`}
                      className="mt-2 inline-flex items-center gap-2 py-3 text-sm font-semibold text-carbon transition-colors hover:text-wood-deep"
                    >
                      <span className="border-b border-current/30 pb-0.5">Solicitar cotización</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </WhatsAppLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
