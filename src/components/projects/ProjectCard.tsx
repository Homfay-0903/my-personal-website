"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Doc } from "convex/_generated/dataModel";
import { categoryLabel } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

export function ProjectCard({ project }: { project: Doc<"projects"> }) {
  const { lang, t } = useI18n();
  const title = project.title[lang];
  const image = project.images[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col border border-line bg-paper transition-colors hover:border-cobalt"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-code-bg">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="size-full object-cover grayscale-[30%] transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-mono text-[11px] tracking-widest text-muted/60">
            [ NO PLOT ]
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
          <ArrowUpRight
            size={15}
            className="text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cobalt"
          />
        </div>
        <p className="text-sm leading-relaxed text-muted">{project.summary[lang]}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          <span className="bg-cobalt/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-cobalt">
            {categoryLabel(project.category, lang)}
          </span>
          {project.techStack.slice(0, 2).map((tech) => (
            <span
              key={tech}
              className="border border-line px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}