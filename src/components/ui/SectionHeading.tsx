import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: "dark" | "light";
  className?: string;
};

/** Encabezado editorial: numeración, antetítulo, título serif e introducción. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  id,
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:gap-10 ${className}`}>
      <p
        className={`eyebrow flex items-center gap-4 lg:col-span-12 ${
          light ? "text-sand" : "text-wood-deep"
        }`}
      >
        <span aria-hidden="true">{index}</span>
        <span aria-hidden="true" className={`h-px w-10 ${light ? "bg-sand/50" : "bg-wood/60"}`} />
        <span>{eyebrow}</span>
      </p>
      <h2
        id={id}
        className={`font-display text-[2.6rem] leading-[1.02] tracking-tight text-balance xs:text-5xl md:text-6xl lg:col-span-7 xl:text-7xl ${
          light ? "text-warm" : "text-carbon"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <div
          className={`max-w-xl text-base leading-relaxed text-pretty md:text-lg lg:col-span-4 lg:col-start-9 lg:self-end ${
            light ? "text-warm/75" : "text-stone-deep"
          }`}
        >
          {intro}
        </div>
      ) : null}
    </div>
  );
}
