import { v } from "convex/values";
import { query } from "./_generated/server";
import { type Doc } from "./_generated/dataModel";

async function resolveImages(
  ctx: { storage: { getUrl: (id: string) => Promise<string | null> } },
  project: Doc<"projects">,
): Promise<Doc<"projects">> {
  if (project.images.length === 0 || project.images.every((i) => i.startsWith("http"))) {
    return project;
  }
  const resolved = await Promise.all(
    project.images.map(async (image) => {
      if (image.startsWith("http")) return image;
      return (await ctx.storage.getUrl(image)) ?? image;
    }),
  );
  return { ...project, images: resolved };
}

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_published_order", (q) => q.eq("published", true))
      .filter((q) =>
        category === undefined
          ? q.eq(q.field("published"), true)
          : q.and(q.eq(q.field("published"), true), q.eq(q.field("category"), category)),
      )
      .collect();
    const sorted = rows.sort((a, b) => a.order - b.order);
    return Promise.all(sorted.map((p) => resolveImages(ctx, p)));
  },
});

export const featured = query({
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_published_order", (q) => q.eq("published", true))
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
    const sorted = rows.sort((a, b) => a.order - b.order);
    return Promise.all(sorted.map((p) => resolveImages(ctx, p)));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!project || !project.published) return null;
    return resolveImages(ctx, project);
  },
});

export const allPublished = query({
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_published_order", (q) => q.eq("published", true))
      .collect();
    const sorted = rows.sort((a, b) => a.order - b.order);
    return Promise.all(sorted.map((p) => resolveImages(ctx, p)));
  },
});

export const categories = query({
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_published_order", (q) => q.eq("published", true))
      .collect();
    const ids = [...new Set(rows.map((p) => p.category))].sort();
    return ids;
  },
});
