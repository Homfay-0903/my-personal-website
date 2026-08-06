"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { categoryDefs } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

export function ProjectsClient() {
  const { t, lang } = useI18n();
  const [category, setCategory] = useState<string | undefined>(undefined);
  const projects = useQuery(api.projects.list, { category });

  const filters = [
    { id: undefined, label: t("list.filterAll") },
    ...categoryDefs.map((c) => ({ id: c.id, label: c.label[lang] })),
  ];

  return (
    <section className="pb-6 pt-16 sm:pt-20">
      <p className="eyebrow">{t("list.eyebrow")}</p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("list.title")}
        </h1>
        <span className="font-mono text-[11px] tracking-widest text-muted">
          {projects ? String(projects.length).padStart(2, "0") : "··"} {t("list.count")}
        </span>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t("list.title")}>
        {filters.map((f) => {
          const active = (category ?? undefined) === f.id;
          return (
            <button
              key={f.id ?? "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(f.id)}
              className={`rounded-sm border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                active
                  ? "border-cobalt bg-cobalt text-paper"
                  : "border-line text-muted hover:border-cobalt hover:text-cobalt"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        {projects === undefined ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border border-line">
                <div className="aspect-[16/9] animate-pulse bg-line/60" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse bg-line" />
                  <div className="h-3 w-full animate-pulse bg-line" />
                  <div className="h-3 w-4/5 animate-pulse bg-line" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-line py-16 text-center">
            <p className="font-mono text-xs tracking-widest text-muted">{t("list.empty")}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}