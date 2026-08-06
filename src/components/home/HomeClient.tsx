"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { api } from "convex/_generated/api";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { useI18n } from "@/lib/i18n";
import { site } from "@/lib/site";

export function HomeClient() {
  const { t, lang } = useI18n();
  const featured = useQuery(api.projects.featured);
  const all = useQuery(api.projects.allPublished);

  const loading = featured === undefined;
  const rows = featured ?? [];
  const count = all?.length ?? rows.length;

  return (
    <>
      <header className="pb-14 pt-16 sm:pt-24">
        <p className="eyebrow">{t("hero.eyebrow")}</p>
        <h1 className="mt-6 max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl">
          {t("hero.title")}
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
          {t("hero.sub")}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="/projects"
            className="group inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt"
          >
            {t("hero.ctaProjects")}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-line px-6 py-3 text-sm transition-colors hover:border-cobalt hover:text-cobalt"
          >
            {t("hero.ctaContact")}
          </a>
        </div>
      </header>

      <section aria-labelledby="index-heading">
        <div className="flex items-end justify-between pb-3">
          <p id="index-heading" className="eyebrow">
            {t("home.indexLabel")}
          </p>
          <span className="font-mono text-[11px] tracking-widest text-muted">
            {loading ? "··" : String(count).padStart(2, "0")} {t("list.count")}
          </span>
        </div>
        <div className="rule" />

        {loading ? (
          <div className="divide-y divide-line">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-5 px-4 py-6">
                <div className="h-3 w-6 animate-pulse bg-line" />
                <div className="h-5 w-1/2 animate-pulse bg-line" />
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-between py-10">
            <span className="font-mono text-xs tracking-widest text-muted">
              {t("list.empty")}
            </span>
          </div>
        ) : (
          <div>
            <div className="rule" />
            {rows.map((project, i) => (
              <ProjectRow key={project._id} project={project} index={i} />
            ))}
            <div className="pt-6">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted transition-colors hover:text-cobalt"
              >
                {t("hero.ctaProjects")}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="mt-16 border border-line bg-paper p-7 sm:p-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">{t("home.sectionAbout")}</p>
          </div>
          <div className="md:col-span-8">
            <p className="max-w-xl text-[15px] leading-relaxed">{site.tagline[lang]}</p>
            <Link
              href="/about"
              className="group mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-cobalt"
            >
              {t("nav.about")}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}