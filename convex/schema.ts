import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  projects: defineTable({
    title: v.object({ en: v.string(), zh: v.string() }),
    summary: v.object({ en: v.string(), zh: v.string() }),
    description: v.object({ en: v.string(), zh: v.string() }),
    slug: v.string(),
    category: v.string(),
    techStack: v.array(v.string()),
    tags: v.array(v.string()),
    images: v.array(v.string()),
    demoUrl: v.optional(v.string()),
    repoUrl: v.optional(v.string()),
    featured: v.boolean(),
    published: v.boolean(),
    order: v.number(),
  })
    .index("by_published_order", ["published", "order"])
    .index("by_slug", ["slug"])
    .index("by_category", ["category", "order"]),
  admins: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
});
