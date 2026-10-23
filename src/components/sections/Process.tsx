import { processSteps } from "@/data/process";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-titulo" className="bg-warm py-24 md:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="05"
          eyebrow="Proceso de trabajo"
          id="proceso-titulo"
          title={
            <>
              De la idea al espacio, <em className="text-wood-deep">paso a paso</em>
            </>
          }
          intro="Un proceso claro para que sepas en qué punto está tu proyecto y participes en las decisiones importantes."
        />

        <ol className="mt-16 grid gap-px overflow-hidden bg-carbon/10 md:mt-24 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, index) => (
            <li key={step.title} className="reveal flex flex-col bg-warm p-6 pt-8 sm:p-8 xl:min-h-[22rem]">
              <span
                aria-hidden="true"
                className="font-display text-7xl leading-none text-sand md:text-8xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-10 font-display text-3xl leading-tight text-carbon xl:mt-auto">
                <span className="sr-only">Paso {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-4 leading-relaxed text-pretty text-stone-deep">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
