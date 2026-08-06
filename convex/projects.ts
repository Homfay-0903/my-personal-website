import { v } from "convex/values";
import { query } from "./_generated/server";

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
    return rows.sort((a, b) => a.order - b.order);
  },
});

export const featured = query({
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_published_order", (q) => q.eq("published", true))
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
    return rows.sort((a, b) => a.order - b.order);
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
    return project;
  },
});

export const allPublished = query({
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_published_order", (q) => q.eq("published", true))
      .collect();
    return rows.sort((a, b) => a.order - b.order);
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