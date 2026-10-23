"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigation, siteConfig } from "@/config/site";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: bloquea el scroll, cierra con Escape y mantiene el foco dentro.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        toggleRef.current,
        ...panelRef.current.querySelectorAll<HTMLElement>("a, button"),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  // El header es siempre claro para mostrar el logo en sus colores originales.
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-warm/95 text-carbon backdrop-blur-md transition-shadow duration-500 ease-editorial ${
        scrolled || menuOpen
          ? "shadow-[0_1px_0_rgb(32_34_31/0.08),0_12px_30px_-24px_rgb(32_34_31/0.5)]"
          : "shadow-[0_1px_0_rgb(32_34_31/0.06)]"
      }`}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-carbon focus:px-4 focus:py-2 focus:text-warm"
      >
        Saltar al contenido
      </a>
      <div className="container-editorial flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/#inicio" className="shrink-0 py-2" aria-label={`${siteConfig.name}, ir al inicio`}>
          <Logo preload className="h-12 sm:h-[3.25rem]" />
        </Link>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-sm font-medium">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline py-1">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className={menuOpen ? "hidden" : "hidden sm:block"}>
            <Link href="/#contacto" className={buttonClasses("solid", "min-h-11 px-5")}>
              Cotizar mi proyecto
            </Link>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="menu-movil"
        hidden={!menuOpen}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-carbon/10 bg-warm lg:hidden"
      >
        <nav aria-label="Navegación móvil" className="container-editorial flex min-h-full flex-col py-10">
          <ul className="space-y-1">
            {navigation.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-5 border-b border-carbon/10 py-4 font-display text-4xl text-carbon transition-colors hover:text-wood-deep"
                >
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-stone-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <Link
              href="/#contacto"
              onClick={() => setMenuOpen(false)}
              className={buttonClasses("solid", "w-full")}
            >
              Cotizar mi proyecto
            </Link>
            <p className="mt-6 font-display text-xl text-stone-deep italic">{siteConfig.slogan}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
