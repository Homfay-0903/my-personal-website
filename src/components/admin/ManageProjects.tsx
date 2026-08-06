"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "convex/_generated/api";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { Id } from "convex/_generated/dataModel";
import { useI18n } from "@/lib/i18n";

export function ManageProjects() {
  const { t, lang } = useI18n();
  const { signOut } = useAuthActions();
  const projects = useQuery(api.adminMutations.listAll);
  const setPublished = useMutation(api.adminMutations.setPublished);
  const setFeatured = useMutation(api.adminMutations.setFeatured);
  const deleteProject = useMutation(api.adminMutations.deleteProject);
  const reorderProjects = useMutation(api.adminMutations.reorderProjects);

  const handleMove = async (id: Id<"projects">, dir: -1 | 1) => {
    if (!projects) return;
    const ids = projects.map((p) => p._id);
    const from = ids.indexOf(id);
    const to = from + dir;
    if (to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    await reorderProjects({ ids });
  };

  return (
    <section className="pb-6 pt-12 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t("admin.meta")}</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("admin.manageTitle")}
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            {t("admin.manageSub")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-cobalt"
          >
            <Plus size={15} />
            {t("admin.newProject")}
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:border-amber hover:text-amber"
          >
            {t("admin.logout")}
          </button>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto">
        {projects === undefined ? (
          <div className="divide-y divide-line border border-line">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-5 p-5">
                <div className="h-5 w-40 animate-pulse bg-line" />
                <div className="ml-auto h-5 w-20 animate-pulse bg-line" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-line py-16 text-center">
            <p className="font-mono text-xs tracking-widest text-muted">{t("admin.emptyList")}</p>
          </div>
        ) : (
          <div className="border border-line">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted md:grid-cols-[auto_1fr_auto_auto_auto_auto_auto]">
              <span>Order</span>
              <span>Title</span>
              <span className="hidden md:block">Category</span>
              <span className="hidden md:block">{t("admin.featured")}</span>
              <span className="hidden md:block">{t("admin.published")}</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            <div className="divide-y divide-line">
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 px-4 py-3.5 transition-colors hover:bg-paper/60 md:grid-cols-[auto_1fr_auto_auto_auto_auto_auto]"
                >
                  <span className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(project._id, -1)}
                      aria-label="move up"
                      className="p-1 text-muted transition-colors hover:text-cobalt disabled:opacity-20"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === projects.length - 1}
                      onClick={() => handleMove(project._id, 1)}
                      aria-label="move down"
                      className="p-1 text-muted transition-colors hover:text-cobalt disabled:opacity-20"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </span>

                  <div className="min-w-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="block truncate font-display text-[15px] font-semibold tracking-tight hover:text-cobalt"
                    >
                      {project.title[lang]}
                    </Link>
                    <span className="font-mono text-[10px] tracking-widest text-muted">
                      /{project.slug}
                    </span>
                  </div>

                  <span className="hidden font-mono text-[11px] tracking-widest text-muted md:block">
                    {project.category}
                  </span>

                  <span className="hidden md:block">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={project.featured}
                      onClick={() =>
                        setFeatured({ id: project._id, featured: !project.featured })
                      }
                      className="h-4 w-7 rounded-full border border-line transition-colors"
                      aria-label={t("admin.featured")}
                    >
                      <span
                        className={`block size-2.5 rounded-full transition-all ${
                          project.featured ? "ml-3.5 bg-cobalt" : "ml-0.5 bg-muted/40"
                        }`}
                      />
                    </button>
                  </span>

                  <span className="hidden md:block">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
                        project.published ? "text-cobalt" : "text-muted"
                      }`}
                    >
                      <span
                        className={`inline-block size-1.5 rounded-full ${
                          project.published ? "bg-cobalt" : "bg-muted"
                        }`}
                      />
                      {project.published ? t("admin.published") : t("admin.draft")}
                    </span>
                  </span>

                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPublished({ id: project._id, published: !project.published })
                      }
                      className="rounded-sm border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-cobalt hover:text-cobalt md:hidden"
                    >
                      {project.published ? t("admin.published") : t("admin.draft")}
                    </button>
                    <Link
                      href={`/admin/projects/edit/${project._id}`}
                      aria-label={t("admin.edit")}
                      className="rounded-sm p-1.5 text-muted transition-colors hover:text-cobalt"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(t("admin.wantsDelete"))) {
                          void deleteProject({ id: project._id });
                        }
                      }}
                      aria-label={t("admin.delete")}
                      className="rounded-sm p-1.5 text-muted transition-colors hover:text-amber"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
