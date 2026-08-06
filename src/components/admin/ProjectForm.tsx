"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import type { Doc, Id } from "convex/_generated/dataModel";
import { categoryDefs } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

type Project = Doc<"projects">;

const empty = {
  titleEn: "",
  titleZh: "",
  summaryEn: "",
  summaryZh: "",
  descriptionEn: "",
  descriptionZh: "",
  slug: "",
  category: "frontend",
  techStack: "",
  tags: "",
  images: "",
  demoUrl: "",
  repoUrl: "",
  featured: false,
  published: false,
};

function fromProject(p: Project): typeof empty {
  return {
    titleEn: p.title.en,
    titleZh: p.title.zh,
    summaryEn: p.summary.en,
    summaryZh: p.summary.zh,
    descriptionEn: p.description.en,
    descriptionZh: p.description.zh,
    slug: p.slug,
    category: p.category,
    techStack: p.techStack.join(", "),
    tags: p.tags.join(", "),
    images: p.images.join("\n"),
    demoUrl: p.demoUrl ?? "",
    repoUrl: p.repoUrl ?? "",
    featured: p.featured,
    published: p.published,
  };
}

export function ProjectForm({ mode, id }: { mode: "new" | "edit"; id?: string }) {
  const project = useQuery(
    api.adminMutations.getById,
    id ? { id: id as Id<"projects"> } : "skip",
  );

  if (mode === "edit" && project === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="h-24 w-full max-w-md animate-pulse bg-line/60" />
      </div>
    );
  }

  if (mode === "edit" && project === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <p className="font-mono text-xs tracking-widest text-muted">Project not found</p>
      </div>
    );
  }

  return (
    <ProjectFormBody
      key={mode === "edit" ? (project as Project)._id : "new"}
      mode={mode}
      id={id}
      initial={mode === "edit" ? fromProject(project as Project) : { ...empty, featured: false }}
    />
  );
}

function ProjectFormBody({
  mode,
  id,
  initial,
}: {
  mode: "new" | "edit";
  id?: string;
  initial: typeof empty;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const createProject = useMutation(api.adminMutations.createProject);
  const updateProject = useMutation(api.adminMutations.updateProject);
  const generateUploadUrl = useMutation(api.adminMutations.generateUploadUrl);
  const resolveStorageUrl = useMutation(api.adminMutations.resolveStorageUrl);

  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key: keyof typeof empty, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("upload failed");
      const { storageId } = (await response.json()) as { storageId: string };
      const url = await resolveStorageUrl({ storageId });
      setForm((f) => ({ ...f, images: f.images ? `${f.images}\n${url}` : url }));
    } catch {
      setError(t("admin.error"));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!form.titleEn && !form.titleZh) {
      setError(t("admin.errorEmpty"));
      return;
    }
    const slug = form.slug || slugify(form.titleEn || form.titleZh);
    if (!slug) {
      setError(t("admin.errorEmpty"));
      return;
    }
    setSaving(true);
    try {
      const data = {
        title: { en: form.titleEn, zh: form.titleZh },
        summary: { en: form.summaryEn, zh: form.summaryZh },
        description: { en: form.descriptionEn, zh: form.descriptionZh },
        slug,
        category: form.category,
        techStack: form.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        images: form.images
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        demoUrl: form.demoUrl.trim() || undefined,
        repoUrl: form.repoUrl.trim() || undefined,
        featured: form.featured,
        published: form.published,
      };
      if (mode === "new") {
        await createProject({ data });
      } else if (id) {
        await updateProject({ id: id as Id<"projects">, data });
      }
      router.push("/admin/projects");
      router.refresh();
    } catch {
      setError(t("admin.error"));
    } finally {
      setSaving(false);
    }
  };

  const langBadge = (l: "en" | "zh") => (
    <span
      className={`font-mono text-[10px] uppercase tracking-widest ${l === "zh" ? "text-cobalt" : "text-muted"}`}
    >
      {t(`admin.${l}`)}
    </span>
  );

  return (
    <form onSubmit={submit} className="pb-10 pt-10">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted transition-colors hover:text-cobalt"
      >
        <ArrowLeft size={13} /> {t("admin.backToProjects")}
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {mode === "new" ? t("admin.formHeadingNew") : t("admin.formHeadingEdit")}
        </h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="size-4 accent-[var(--cobalt)]"
            />
            {t("admin.publishedCheck")}
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="size-4 accent-[var(--cobalt)]"
            />
            {t("admin.featuredCheck")}
          </label>
        </div>
      </div>

      {error && (
        <p className="mt-6 border border-amber/40 bg-amber/5 px-3 py-2 text-xs text-amber">
          {error}
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <Field label={t("admin.title")} required>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-end">{langBadge("en")}</div>
                <input
                  value={form.titleEn}
                  onChange={(e) => set("titleEn", e.target.value)}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
                  placeholder="Project title"
                />
              </div>
              <div>
                <div className="mb-1 flex justify-end">{langBadge("zh")}</div>
                <input
                  value={form.titleZh}
                  onChange={(e) => set("titleZh", e.target.value)}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
                  placeholder="项目标题"
                />
              </div>
            </div>
          </Field>

          <Field label={t("admin.summary")} hint={t("admin.summaryHint")}>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-end">{langBadge("en")}</div>
                <input
                  value={form.summaryEn}
                  onChange={(e) => set("summaryEn", e.target.value)}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
                  placeholder="One line, shown on the card."
                />
              </div>
              <div>
                <div className="mb-1 flex justify-end">{langBadge("zh")}</div>
                <input
                  value={form.summaryZh}
                  onChange={(e) => set("summaryZh", e.target.value)}
                  className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
                  placeholder="卡片上的一句话"
                />
              </div>
            </div>
          </Field>

          <Field label={t("admin.description")} hint={t("admin.descriptionHint")}>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-end">{langBadge("en")}</div>
                <textarea
                  value={form.descriptionEn}
                  onChange={(e) => set("descriptionEn", e.target.value)}
                  rows={6}
                  className="w-full resize-y border border-line bg-paper px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-cobalt"
                />
              </div>
              <div>
                <div className="mb-1 flex justify-end">{langBadge("zh")}</div>
                <textarea
                  value={form.descriptionZh}
                  onChange={(e) => set("descriptionZh", e.target.value)}
                  rows={6}
                  className="w-full resize-y border border-line bg-paper px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-cobalt"
                />
              </div>
            </div>
          </Field>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <Field label={t("admin.slug")} hint={t("admin.slugHint")} required>
            <div className="flex gap-2">
              <input
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                className="w-full border border-line bg-paper px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-cobalt"
                placeholder="my-project"
              />
              <button
                type="button"
                onClick={() => set("slug", slugify(form.titleEn || form.titleZh))}
                className="shrink-0 border border-line px-3 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-cobalt hover:text-cobalt"
              >
                auto
              </button>
            </div>
          </Field>

          <Field label={t("admin.category")}>
            <div className="flex flex-wrap gap-2">
              {categoryDefs.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => set("category", c.id)}
                  className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    form.category === c.id
                      ? "border-cobalt bg-cobalt text-paper"
                      : "border-line text-muted hover:border-cobalt hover:text-cobalt"
                  }`}
                >
                  {c.label.en}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t("admin.techStack")}>
            <textarea
              value={form.techStack}
              onChange={(e) => set("techStack", e.target.value)}
              rows={3}
              className="w-full resize-y border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
              placeholder="React, Next.js, Tailwind CSS"
            />
          </Field>

          <Field label={t("admin.tags")}>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
              placeholder="Agent, Automation"
            />
          </Field>

          <Field label={t("admin.images")} hint={t("admin.imagesHint")}>
            <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-line px-3 py-4 text-sm text-muted transition-colors hover:border-cobalt hover:text-cobalt">
              <Upload size={15} />
              {uploading ? t("admin.uploading") : t("admin.chooseFile")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadImage(file);
                  e.target.value = "";
                }}
              />
            </label>
            <textarea
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              rows={5}
              className="mt-2 w-full resize-y border border-line bg-paper px-3 py-2.5 font-mono text-xs leading-relaxed outline-none transition-colors focus:border-cobalt"
              placeholder="https://…"
            />
          </Field>

          <Field label={t("admin.demoUrl")}>
            <input
              value={form.demoUrl}
              onChange={(e) => set("demoUrl", e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-cobalt"
              placeholder="https://…"
            />
          </Field>

          <Field label={t("admin.repoUrl")}>
            <input
              value={form.repoUrl}
              onChange={(e) => set("repoUrl", e.target.value)}
              className="w-full border border-line bg-paper px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-cobalt"
              placeholder="https://github.com/…"
            />
          </Field>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-ink px-8 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? t("admin.saving") : t("admin.save")}
        </button>
        <Link
          href="/admin/projects"
          className="font-mono text-[11px] tracking-widest text-muted transition-colors hover:text-cobalt"
        >
          {t("admin.cancel")}
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
        {required && <span className="text-amber"> *</span>}
      </p>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}