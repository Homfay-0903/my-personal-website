import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ADMIN_SETUP_SECRET } from "./constants";
import { requireAdmin } from "./helpers";
import { projectFields } from "./shared";

export const amIAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return false;
    const email: string = identity.email;
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    return admin !== null;
  },
});

export const becomeAdmin = mutation({
  args: { secret: v.string() },
  handler: async (ctx, { secret }) => {
    if (secret !== ADMIN_SETUP_SECRET) {
      throw new Error("Invalid setup secret");
    }
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email;
    if (!email) throw new Error("You must sign in first");
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (!existing) {
      await ctx.db.insert("admins", { email });
    }
    return true;
  },
});

export const listAll = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("projects").collect();
    const sorted = rows.sort((a, b) => a.order - b.order);
    return resolveImagesForDocs(ctx, sorted);
  },
});

async function resolveImagesForDocs<T extends { images: string[] }>(
  ctx: { storage: { getUrl: (id: string) => Promise<string | null> } },
  projects: T[],
): Promise<T[]> {
  return Promise.all(
    projects.map(async (project): Promise<T> => {
      if (project.images.length === 0 || project.images.every((i) => i.startsWith("http"))) {
        return project;
      }
      const resolved = await Promise.all(
        project.images.map(async (image) =>
          image.startsWith("http") ? image : (await ctx.storage.getUrl(image)) ?? image,
        ),
      );
      return { ...project, images: resolved };
    }),
  );
}

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const project = await ctx.db.get(id);
    if (!project) return null;
    const [resolved] = await resolveImagesForDocs(ctx, [project]);
    return resolved;
  },
});

export const resolveStorageUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    await requireAdmin(ctx);
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Storage file not found");
    return url;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const createProject = mutation({
  args: {
    data: v.object(projectFields),
  },
  handler: async (ctx, { data }) => {
    await requireAdmin(ctx);
    const max = await ctx.db.query("projects").collect();
    const order = max.length === 0 ? 0 : Math.max(...max.map((p) => p.order)) + 1;
    return await ctx.db.insert("projects", { ...data, order });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    data: v.object(projectFields),
  },
  handler: async (ctx, { id, data }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Project not found");
    await ctx.db.patch(id, data);
    return id;
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});

export const setPublished = mutation({
  args: { id: v.id("projects"), published: v.boolean() },
  handler: async (ctx, { id, published }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { published });
  },
});

export const setFeatured = mutation({
  args: { id: v.id("projects"), featured: v.boolean() },
  handler: async (ctx, { id, featured }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { featured });
  },
});

export const reorderProjects = mutation({
  args: { ids: v.array(v.id("projects")) },
  handler: async (ctx, { ids }) => {
    await requireAdmin(ctx);
    await Promise.all(
      ids.map((id, index) =>
        ctx.db.patch(id, { order: index }).catch(() => {
          return;
        }),
      ),
    );
  },
});