"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Footer() {
  const { lang } = useI18n();

  return (
    <footer id="contact" className="mt-20 scroll-mt-24">
      <div className="rule" />

      <div className="site-container grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {lang === "en" ? "Let’s build something precise." : "一起做点精确的东西吧。"}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {lang === "en"
              ? "If a team needs someone who ships clean interfaces — or an agent that gets the job done — I’m interested."
              : "如果你需要一个能把界面做干净、也踩过 AI 工具坑的开发者，欢迎联系。"}
          </p>
        </div>

        <div className="flex flex-col justify-end gap-3 md:col-span-7 md:items-end">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-2 rounded-sm border border-line px-5 py-2.5 text-sm transition-colors hover:border-cobalt hover:text-cobalt"
          >
            <Mail size={15} />
            {site.email}
            <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-sm border border-line px-5 py-2.5 text-sm transition-colors hover:border-cobalt hover:text-cobalt"
          >
            <GithubIcon size={15} />
            {site.github.replace("https://", "")}
            <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>
      </div>

      <div className="rule" />
      <div className="site-container flex flex-col gap-2 py-6 font-mono text-[11px] tracking-wider text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {site.name} — {site.role[lang]}</span>
        <span>Set in Archivo · Public Sans · JetBrains Mono</span>
      </div>
    </footer>
  );
}
