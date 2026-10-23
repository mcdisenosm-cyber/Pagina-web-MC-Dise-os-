import Image from "next/image";
import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
  /** Precarga la imagen (solo para el logo visible al cargar, en el header). */
  preload?: boolean;
};

/**
 * Logotipo de MC Diseños, en sus colores originales y siempre sobre fondo claro.
 * La altura se controla con `className` (por ejemplo "h-14"); el ancho se ajusta solo.
 * Si `siteConfig.logo` es null, se muestra el nombre de la marca en texto.
 */
export function Logo({ className = "h-14", preload = false }: LogoProps) {
  const { logo, name } = siteConfig;

  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={name}
        width={logo.width}
        height={logo.height}
        sizes="(min-width: 64rem) 220px, 160px"
        preload={preload}
        className={`w-auto ${className}`}
      />
    );
  }

  return (
    <span className={`font-display text-[1.65rem] leading-none tracking-tight whitespace-nowrap text-carbon ${className}`}>
      {name}
    </span>
  );
}
