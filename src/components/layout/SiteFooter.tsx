import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowUpRight, LogIn, Mail, MapPin } from "lucide-react";
import { navigation, siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { formatWhatsAppNumber, isWhatsAppConfigured, whatsappMessages } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { WhatsAppLink } from "@/components/whatsapp/WhatsAppLink";

/** Año actual cacheado: compatible con el prerender de Cache Components. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  const whatsapp = isWhatsAppConfigured();

  return (
    <footer className="border-t border-carbon/10 bg-warm text-carbon">
      <div className="container-editorial pt-20 pb-28 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/#inicio" aria-label={`${siteConfig.name}, volver al inicio`} className="inline-block">
              <Logo className="h-24 md:h-28" />
            </Link>
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-stone-deep italic">
              {siteConfig.slogan}
            </p>
          </div>

          <nav aria-label="Navegación del pie de página" className="lg:col-span-2 lg:col-start-6">
            <h2 className="eyebrow text-wood-deep">Navegación</h2>
            <ul className="mt-5 space-y-1 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline inline-block py-1.5 text-stone-deep hover:text-carbon">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-wood-deep">Servicios</h2>
            <ul className="mt-5 space-y-1 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/#servicio-${service.id}`}
                    className="link-underline inline-block py-1.5 text-stone-deep hover:text-carbon"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-wood-deep">Contacto</h2>
            <ul className="mt-5 space-y-1 text-sm">
              {whatsapp ? (
                <li>
                  <WhatsAppLink
                    message={whatsappMessages.general()}
                    ariaLabel={`WhatsApp ${formatWhatsAppNumber()}`}
                    className="inline-flex items-center gap-2 py-1.5 text-stone-deep hover:text-carbon"
                  >
                    <WhatsAppIcon className="size-4" />
                    {formatWhatsAppNumber()}
                  </WhatsAppLink>
                </li>
              ) : (
                <li>
                  <Link href="/#contacto" className="link-underline inline-block py-1.5 text-stone-deep hover:text-carbon">
                    Formulario de contacto
                  </Link>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-2 py-1.5 break-all text-stone-deep hover:text-carbon"
                >
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 py-1.5 text-stone-deep hover:text-carbon"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    {siteConfig.contact.address}
                    <br />
                    {siteConfig.contact.city}
                  </span>
                </a>
              </li>
              {siteConfig.social.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 py-1.5 text-stone-deep hover:text-carbon"
                  >
                    {social.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-carbon/10 pt-8 text-xs text-stone-deep sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.legal.companyName} · NIT {siteConfig.legal.nit}. Todos los
            derechos reservados.
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <Link
              href={siteConfig.legal.privacyPolicyPath}
              className="link-underline self-start py-1 hover:text-carbon sm:self-auto"
            >
              Política de tratamiento de datos personales
            </Link>
            {/* Acceso al panel de administración: solo entran cuentas autorizadas. */}
            <Link
              href="/admin"
              prefetch={false}
              rel="nofollow"
              className="link-underline inline-flex items-center gap-1.5 self-start py-1 hover:text-carbon sm:self-auto"
            >
              <LogIn className="size-3.5" aria-hidden="true" />
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
