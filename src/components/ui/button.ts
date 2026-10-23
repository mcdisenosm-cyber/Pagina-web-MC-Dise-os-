type ButtonVariant = "solid" | "outline" | "light" | "ghostLight" | "wood";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-sm whitespace-nowrap font-semibold tracking-wide transition-[background-color,color,border-color] duration-300 ease-editorial disabled:cursor-not-allowed aria-disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-carbon text-warm hover:bg-wood-deep",
  outline: "border border-carbon/25 text-carbon hover:border-carbon hover:bg-carbon hover:text-warm",
  light: "on-dark bg-warm text-carbon hover:bg-sand",
  ghostLight: "on-dark border border-warm/40 text-warm hover:border-warm hover:bg-warm hover:text-carbon",
  wood: "bg-wood-deep text-warm hover:bg-carbon",
};

export function buttonClasses(variant: ButtonVariant = "solid", extra = "") {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
