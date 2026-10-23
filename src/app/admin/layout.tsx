import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Panel de administración | MC Diseños",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-carbon/10 bg-warm">
        <div className="container-editorial flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Panel de administración">
            <Logo className="h-10" />
            <span className="hidden text-sm font-semibold text-stone-deep sm:inline">Panel de administración</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-deep hover:text-carbon"
          >
            Ver sitio
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>
      <main className="container-editorial py-10 md:py-14">{children}</main>
    </div>
  );
}
