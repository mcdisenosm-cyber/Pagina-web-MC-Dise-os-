import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { images } from "@/data/images";
import { whatsappMessages } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";

export function CallToAction() {
  return (
    <section
      aria-labelledby="cta-titulo"
      className="on-dark relative isolate overflow-hidden bg-carbon text-warm"
    >
      <Image
        src={images.cta.src}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-carbon/72" />

      <div className="container-editorial grid gap-10 py-28 md:py-40 lg:grid-cols-12">
        <div className="reveal lg:col-span-8">
          <p className="eyebrow mb-6 flex items-center gap-4 text-sand">
            <span aria-hidden="true" className="h-px w-10 bg-sand/60" />
            Asesoría para tu proyecto
          </p>
          <h2
            id="cta-titulo"
            className="font-display text-[2.75rem] leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Hagamos realidad tu <em className="text-sand">próximo proyecto</em>
          </h2>
        </div>
        <div className="reveal flex flex-col justify-end gap-8 lg:col-span-4">
          <p className="text-base leading-relaxed text-warm/85 text-pretty md:text-lg">
            Compártenos tu idea, aunque todavía no esté definida. Con unas fotos, algunas medidas o
            una referencia podemos orientarte y preparar tu cotización.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <WhatsAppLink message={whatsappMessages.general()} className={buttonClasses("light")}>
              <WhatsAppIcon className="size-[1.1rem]" />
              Escribir por WhatsApp
            </WhatsAppLink>
            <a href="#contacto" className={buttonClasses("ghostLight")}>
              Usar el formulario
              <ArrowDownRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
