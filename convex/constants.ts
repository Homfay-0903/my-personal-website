export const ADMIN_SETUP_SECRET = "pf-609e0075a9";

export const PROJECT_CATEGORIES = [
  { id: "frontend", label: { en: "Frontend", zh: "前端" } },
  { id: "agent", label: { en: "AI Agent", zh: "AI Agent" } },
  { id: "other", label: { en: "Other", zh: "其他" } },
] as const;

export type ProjectCategoryId = (typeof PROJECT_CATEGORIES)[number]["id"];