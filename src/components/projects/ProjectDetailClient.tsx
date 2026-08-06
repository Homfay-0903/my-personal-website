"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { categoryLabel } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

export function ProjectDetailClient({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const project = useQuery(api.projects.getBySlug, { slug });
  const all = useQuery(api.projects.allPublished);

  const neighbors = useMemo(() => {
    if (!project || !all) return null;
    const idx = all.findIndex((p) => p._id === project._id);
    if (idx === -1) return null;
    return {
      prev: idx > 0 ? all[idx - 1] : null,
      next: idx < all.length - 1 ? all[idx + 1] : null,
    };
  }, [project, all]);

  if (project === undefined) {
    return (
      <div className="pb-6 pt-16">
        <div className="h-4 w-40 animate-pulse bg-line" />
        <div className="mt-6 h-12 w-3/4 animate-pulse bg-line" />
        <div className="mt-6 aspect-video animate-pulse bg-line" />
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="flex flex-1 flex-col items-start justify-center gap-5 py-32">
        <p className="eyebrow">{t("detail.eyebrow")}</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t("detail.notFound")}
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-cobalt"
        >
          <ArrowLeft size={13} /> {t("detail.backHome")}
        </Link>
      </div>
    );
  }

  const title = project.title[lang];
  const summary = project.summary[lang];
  const description = project.description[lang];
  const paragraphs = description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const [heroImage, ...restImages] = project.images;

  return (
    <article className="pb-6 pt-10 sm:pt-14">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted transition-colors hover:text-cobalt"
      >
        <ArrowLeft size={13} /> {t("detail.back")}
      </Link>

      <header className="mt-8 border-b border-line pb-10">
        <p className="eyebrow">{t("detail.eyebrow")}</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {title}
          </h1>
          <div className="flex gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-cobalt"
              >
                {t("detail.live")}
                <ArrowUpRight size={15} />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-line px-5 py-2.5 text-sm transition-colors hover:border-cobalt hover:text-cobalt"
              >
                <GithubIcon size={15} />
                {t("detail.source")}
              </a>
            )}
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">{summary}</p>
      </header>

      {heroImage && (
        <div className="mt-10 overflow-hidden border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt={title} className="size-full object-cover" />
        </div>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="space-y-6 md:col-span-8">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-[15px] leading-[1.85] text-ink/90">
              {paragraph}
            </p>
          ))}
          {restImages.length > 0 && (
            <div className="grid gap-6 pt-2 sm:grid-cols-2">
              {restImages.map((image, i) => (
                <div key={i} className="overflow-hidden border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${title} ${i + 2}`} className="size-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="md:col-span-4">
          <div className="border border-line">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 p-6 md:grid-cols-1">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {t("detail.category")}
                </p>
                <p className="mt-1.5 text-sm font-medium">
                  {categoryLabel(project.category, lang)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {t("detail.stack")}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-line px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {t("detail.tags")}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-cobalt/10 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-cobalt"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <nav className="mt-16 grid border-t border-line sm:grid-cols-2" aria-label={t("list.title")}>
        {neighbors?.prev ? (
          <Link
            href={`/projects/${neighbors.prev.slug}`}
            className="group flex flex-col gap-2 border-b border-line py-6 pr-4 transition-colors hover:bg-paper/60 sm:border-r sm:border-b-0"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {t("detail.prev")}
            </span>
            <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
              {neighbors.prev.title[lang]}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
        {neighbors?.next && (
          <Link
            href={`/projects/${neighbors.next.slug}`}
            className="group flex flex-col items-end gap-2 border-b border-line py-6 pl-4 text-right transition-colors hover:bg-paper/60 sm:border-b-0"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {t("detail.next")}
            </span>
            <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              {neighbors.next.title[lang]}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
