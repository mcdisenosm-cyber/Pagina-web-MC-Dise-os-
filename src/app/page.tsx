import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Materials } from "@/components/sections/Materials";
import { Process } from "@/components/sections/Process";
import { Workshop } from "@/components/sections/Workshop";
import { CallToAction } from "@/components/sections/CallToAction";
import { Contact } from "@/components/sections/Contact";
import { WhatsAppFloat } from "@/components/whatsapp/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Manifesto />
        <Services />
        <Projects />
        <Materials />
        <Workshop />
        <Process />
        <CallToAction />
        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
