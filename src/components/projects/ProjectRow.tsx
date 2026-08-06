"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Doc } from "convex/_generated/dataModel";
import { categoryLabel } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

export function ProjectRow({
  project,
  index,
}: {
  project: Doc<"projects">;
  index: number;
}) {
  const { lang, t } = useI18n();
  const title = project.title[lang];
  const meta = [categoryLabel(project.category, lang), ...project.techStack.slice(0, 2)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="print-line group relative border-b border-line">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-0 rounded-sm"
        aria-label={title}
      />
      <div className="relative z-10 flex flex-col gap-1.5 px-3 py-5 transition-colors group-hover:bg-paper/60 sm:flex-row sm:items-baseline sm:gap-5 sm:px-4">
        <span className="font-mono text-[11px] tracking-widest text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h3>
        <span className="font-mono text-[11px] tracking-wide text-muted sm:ml-auto">
          {meta}
        </span>
        <span className="hidden items-center gap-3 sm:flex">
          {project.demoUrl && (
            <span className="bg-cobalt px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-paper">
              {t("home.live")}
            </span>
          )}
          <ArrowUpRight
            size={16}
            className="text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cobalt"
          />
        </span>
      </div>
    </div>
  );
}