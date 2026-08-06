import { v } from "convex/values";

export const projectFields = {
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
};

export type ProjectInput = {
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  description: { en: string; zh: string };
  slug: string;
  category: string;
  techStack: string[];
  tags: string[];
  images: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  published: boolean;
};