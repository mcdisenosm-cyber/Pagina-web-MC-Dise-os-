import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { images } from "@/data/images";
import { services } from "@/data/services";
import { whatsappMessages } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[max(40rem,100svh)] flex-col overflow-hidden bg-carbon text-warm"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.hero.src}
          alt={images.hero.alt}
          fill
          preload
          sizes="100vw"
          className="hero-image object-cover object-[60%_center]"
        />
        {/* Velo para garantizar la legibilidad del texto sobre la fotografía. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(100deg,rgb(32_34_31/0.88)_0%,rgb(32_34_31/0.62)_42%,rgb(32_34_31/0.12)_78%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgb(32_34_31/0.85),transparent)]"
        />      </div>

      <div className="container-editorial flex flex-1 flex-col justify-end pt-32 pb-10 md:pb-14">
        <div className="hero-copy max-w-4xl">
          <p className="eyebrow mb-6 flex items-center gap-4 text-sand">
            <span aria-hidden="true" className="h-px w-10 bg-sand/60" />
            Más de {siteConfig.experienceYears} años de experiencia
          </p>
          <h1
            id="hero-title"
            className="font-display text-[3.1rem] leading-[0.98] tracking-tight xs:text-6xl sm:text-7xl lg:text-8xl xl:text-[7.25rem]"
          >
            Tu espacio.
            <br />
            Tu estilo.
            <br />
            <em className="text-sand">Nuestro diseño.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-warm/85 text-pretty sm:text-lg">
            Creamos cocinas y mobiliario personalizado que combina diseño, funcionalidad y acabados
            que marcan la diferencia.
          </p>
          <div className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <a href="#proyectos" className={buttonClasses("light")}>
              Explorar proyectos
              <ArrowDownRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <WhatsAppLink message={whatsappMessages.general()} className={buttonClasses("ghostLight")}>
              <WhatsAppIcon className="size-[1.1rem]" />
              Cotizar por WhatsApp
            </WhatsAppLink>
          </div>
        </div>

        <nav
          aria-label="Servicios"
          className="mt-14 border-t border-warm/20 pt-5 md:mt-20"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-warm/75">
            {services.map((service, index) => (
              <li key={service.id}>
                <a
                  href={`#servicio-${service.id}`}
                  className="link-underline inline-flex items-baseline gap-2 py-1 transition-colors hover:text-warm"
                >
                  <span className="text-[0.7rem] text-sand" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
