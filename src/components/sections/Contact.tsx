import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { formatWhatsAppNumber, isWhatsAppConfigured, whatsappMessages } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";

export function Contact() {
  const configured = isWhatsAppConfigured();
  const phone = formatWhatsAppNumber();

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-paper py-24 md:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="06"
          eyebrow="Contacto"
          id="contacto-titulo"
          title={
            <>
              Cuéntanos <em className="text-wood-deep">tu idea</em>
            </>
          }
        />

        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-8 lg:col-span-4">
            <p className="text-lg leading-relaxed text-pretty text-stone-deep">
              Completa el formulario y continúa la conversación por WhatsApp con tu solicitud ya
              redactada. Solo tienes que revisarla y enviarla.
            </p>
            <dl className="space-y-5 border-t border-carbon/15 pt-8 text-sm">
              <div>
                <dt className="eyebrow text-wood-deep">Cómo funciona</dt>
                <dd className="mt-2 leading-relaxed text-stone-deep">
                  Al enviar el formulario se abre WhatsApp con tu mensaje. Esta página no guarda ni
                  envía tus datos a ningún servidor.
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-wood-deep">Contacto directo</dt>
                <dd className="mt-2 space-y-1 leading-relaxed text-stone-deep">
                  {phone ? (
                    <WhatsAppLink
                      message={whatsappMessages.general()}
                      ariaLabel={`WhatsApp ${phone}`}
                      className="flex items-center gap-2 py-1 font-semibold text-carbon hover:text-wood-deep"
                    >
                      <WhatsAppIcon className="size-4" />
                      {phone}
                    </WhatsAppLink>
                  ) : null}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-2 py-1 break-all hover:text-carbon"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden="true" />
                    {siteConfig.contact.email}
                  </a>
                  <a
                    href={siteConfig.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 py-1 hover:text-carbon"
                  >
                    <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
                    <span>
                      {siteConfig.contact.address}
                      <br />
                      {siteConfig.contact.city}
                    </span>
                  </a>
                  {siteConfig.social.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 hover:text-carbon"
                    >
                      <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                      {social.label}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-wood-deep">Servicios</dt>
                <dd className="mt-2 leading-relaxed text-stone-deep">
                  {services.map((s) => s.title).join(" · ")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm
              services={services.map(({ id, title }) => ({ id, title }))}
              whatsappConfigured={configured}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
