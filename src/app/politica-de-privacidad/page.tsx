import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatWhatsAppNumber } from "@/lib/whatsapp";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFloat } from "@/components/whatsapp/WhatsAppFloat";

/*
 * Política de tratamiento de datos personales (Ley 1581 de 2012 y Decreto 1074 de 2015).
 * Texto base: debe revisarlo la empresa (idealmente con su asesor legal) antes de publicar.
 * Si el sitio empieza a guardar datos (base de datos, chatbot, etc.), actualizar las
 * secciones "Datos que recolectamos" y "Finalidades".
 */

export const metadata: Metadata = {
  title: `Política de tratamiento de datos personales | ${siteConfig.name}`,
  description: `Cómo ${siteConfig.legal.companyName} recolecta, usa y protege los datos personales, y cómo ejercer tus derechos como titular.`,
  alternates: { canonical: siteConfig.legal.privacyPolicyPath },
};

export default function PrivacyPolicyPage() {
  const { legal, contact } = siteConfig;
  const phone = formatWhatsAppNumber();

  return (
    <>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="bg-warm pt-32 pb-24 focus:outline-none md:pt-40">
        <article className="container-editorial">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-stone-deep hover:text-carbon"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver al inicio
            </Link>
            <p className="eyebrow mt-8 text-wood-deep">Ley 1581 de 2012</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-balance text-carbon md:text-6xl">
              Política de tratamiento de datos personales
            </h1>
            <p className="mt-6 text-sm text-stone-deep">
              Última actualización: {legal.privacyPolicyUpdated}
            </p>

            <div className="mt-12 space-y-10 leading-relaxed text-pretty text-stone-deep [&_h2]:font-display [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-carbon [&_li]:mt-2 [&_strong]:text-carbon [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
              <section>
                <h2>1. Responsable del tratamiento</h2>
                <ul>
                  <li>
                    <strong>Razón social:</strong> {legal.companyName}
                  </li>
                  <li>
                    <strong>NIT:</strong> {legal.nit}
                  </li>
                  <li>
                    <strong>Dirección:</strong> {contact.address}, {contact.city}
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong>{" "}
                    <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                      {contact.email}
                    </a>
                  </li>
                  {phone ? (
                    <li>
                      <strong>Teléfono / WhatsApp:</strong> {phone}
                    </li>
                  ) : null}
                </ul>
              </section>

              <section>
                <h2>2. Datos que recolectamos</h2>
                <p className="mt-4">
                  A través del formulario de contacto de este sitio solicitamos tu nombre, un
                  teléfono de contacto, el servicio que te interesa y una descripción de tu
                  proyecto.
                </p>
                <p className="mt-4">
                  <strong>Este sitio web no almacena esos datos.</strong> El formulario solo
                  redacta un mensaje que se abre en WhatsApp; la información nos llega únicamente
                  si decides enviar ese mensaje. Desde ese momento, los datos se tratan según esta
                  política y, en lo que corresponde al servicio de mensajería, según las
                  condiciones de WhatsApp (Meta).
                </p>
                <p className="mt-4">
                  No solicitamos datos sensibles ni datos de niñas, niños o adolescentes.
                </p>
              </section>

              <section>
                <h2>3. Finalidades</h2>
                <p className="mt-4">Usamos tus datos personales únicamente para:</p>
                <ul>
                  <li>Responder tus consultas y solicitudes de cotización.</li>
                  <li>Contactarte para definir el diseño, los materiales y la entrega de tu proyecto.</li>
                  <li>Hacer seguimiento a los servicios contratados.</li>
                  <li>Cumplir obligaciones legales, contables y tributarias.</li>
                </ul>
                <p className="mt-4">
                  No vendemos, alquilamos ni compartimos tus datos con terceros para fines
                  comerciales.
                </p>
              </section>

              <section>
                <h2>4. Tus derechos como titular</h2>
                <p className="mt-4">De acuerdo con el artículo 8 de la Ley 1581 de 2012, puedes:</p>
                <ul>
                  <li>Conocer, actualizar y rectificar tus datos personales.</li>
                  <li>Solicitar prueba de la autorización que nos otorgaste.</li>
                  <li>Ser informado sobre el uso que les hemos dado a tus datos.</li>
                  <li>
                    Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por
                    infracciones a la ley.
                  </li>
                  <li>
                    Revocar la autorización o solicitar la supresión de tus datos cuando no se
                    respeten los principios, derechos y garantías legales.
                  </li>
                  <li>Acceder gratuitamente a tus datos personales.</li>
                </ul>
              </section>

              <section>
                <h2>5. Cómo ejercer tus derechos</h2>
                <p className="mt-4">
                  Envía tu consulta o reclamo al correo{" "}
                  <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                    {contact.email}
                  </a>{" "}
                  o preséntalo en {contact.address}, {contact.city}, indicando tu nombre, tu
                  identificación, la descripción de tu solicitud y un medio para responderte.
                </p>
                <ul>
                  <li>
                    <strong>Consultas:</strong> se responden en un máximo de diez (10) días
                    hábiles, prorrogables por cinco (5) días hábiles más, informándote el motivo.
                  </li>
                  <li>
                    <strong>Reclamos</strong> (corrección, actualización, supresión o revocatoria):
                    se responden en un máximo de quince (15) días hábiles, prorrogables por ocho (8)
                    días hábiles más, informándote el motivo.
                  </li>
                </ul>
              </section>

              <section>
                <h2>6. Seguridad de la información</h2>
                <p className="mt-4">
                  Aplicamos medidas técnicas, humanas y administrativas razonables para proteger tus
                  datos contra pérdida, consulta, uso o acceso no autorizado. Este sitio se sirve
                  mediante conexión cifrada (HTTPS) y no guarda la información del formulario.
                </p>
              </section>

              <section>
                <h2>7. Autorización y vigencia</h2>
                <p className="mt-4">
                  Al marcar la casilla de autorización del formulario de contacto, nos autorizas de
                  forma previa, expresa e informada para tratar tus datos según esta política. Los
                  datos se conservarán mientras sean necesarios para las finalidades descritas o
                  mientras lo exija la ley. Esta política rige desde su publicación y cualquier
                  cambio importante se informará en esta página.
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
