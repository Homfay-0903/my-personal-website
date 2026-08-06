"use client";

import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { site } from "@/lib/site";

const skills = {
  frontend: [
    "React / Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Vite",
    "State & data-fetching",
    "Accessibility",
  ],
  agent: [
    "LLM orchestration",
    "Playwright / browser tools",
    "Python tooling",
    "Prompt & eval workflows",
    "Convex / serverless data",
    "API design",
  ],
};

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <section className="pb-6 pt-16 sm:pt-20">
      <p className="eyebrow">{t("about.eyebrow")}</p>
      <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
        {t("about.title")}
      </h1>

      <div className="mt-10 max-w-2xl space-y-5 text-[15px] leading-[1.85] text-ink/90">
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow">{t("about.skillsTitle")}</p>
          <div className="mt-6 grid gap-10 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {t("about.skillsFrontend")}
              </p>
              <ul className="mt-4 space-y-2.5">
                {skills.frontend.map((s) => (
                  <li key={s} className="flex items-baseline gap-2.5 text-sm">
                    <span className="size-1.5 translate-y-[-1px] bg-cobalt" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {t("about.skillsAgent")}
              </p>
              <ul className="mt-4 space-y-2.5">
                {skills.agent.map((s) => (
                  <li key={s} className="flex items-baseline gap-2.5 text-sm">
                    <span className="font-mono text-[10px] text-cobalt" aria-hidden>
                      &gt;
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="md:col-span-5">
          <div className="border border-line">
            <div className="space-y-6 p-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {t("about.metaWhere")}
                </p>
                <p className="mt-1.5 text-sm font-medium">{t("about.metaWhereValue")}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {t("about.metaOpenTo")}
                </p>
                <p className="mt-1.5 text-sm font-medium">{t("about.metaOpenToValue")}</p>
              </div>
              <div className="rule" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {t("nav.contact")}
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-2 block text-[15px] font-medium break-all hover:text-cobalt"
                >
                  {site.email}
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-3 flex items-center gap-2 text-sm text-muted transition-colors hover:text-cobalt"
                >
                  {site.github.replace("https://", "")}
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}