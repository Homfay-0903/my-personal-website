"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const { t, toggleLang } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const links = [
    { href: "/", label: t("nav.work") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/about", label: t("nav.about") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur">
      <div className="rule" />
      <nav className="flex items-center justify-between gap-4 py-3.5">
        <Link
          href="/"
          className="flex items-baseline gap-1.5 font-display text-[17px] font-semibold uppercase tracking-tight"
        >
          <span className="inline-block size-2 translate-y-[-1px] bg-cobalt" aria-hidden />
          <span>{pathname.startsWith("/admin") ? t("admin.meta") : "Homfay"}</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/projects") && !link.href.startsWith("/#")
                  ? pathname.startsWith("/projects")
                  : pathname === link.href.split("#")[0];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-ink ${active ? "text-ink underline decoration-cobalt decoration-2 underline-offset-4" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden rounded-sm px-2 py-1 font-mono text-[11px] tracking-widest text-muted transition-colors hover:text-cobalt sm:block"
          >
            ◆
          </Link>
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-sm border border-line px-2.5 py-1 font-mono text-[11px] tracking-widest transition-colors hover:border-cobalt hover:text-cobalt"
            aria-label={t("nav.switchLang")}
          >
            {t("nav.switchLang")}
          </button>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-sm p-1.5 text-muted transition-colors hover:text-cobalt"
            aria-label={isDark ? t("nav.themeLight") : t("nav.themeDark")}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>

      <nav className="flex items-center gap-5 border-t border-line py-2.5 text-sm text-muted sm:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}