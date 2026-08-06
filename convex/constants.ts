export const ADMIN_SETUP_SECRET = "yjcrekD8J46FM9Cvq1VGho5U";

export const PROJECT_CATEGORIES = [
  { id: "frontend", label: { en: "Frontend", zh: "前端" } },
  { id: "agent", label: { en: "AI Agent", zh: "AI Agent" } },
  { id: "other", label: { en: "Other", zh: "其他" } },
] as const;

export type ProjectCategoryId = (typeof PROJECT_CATEGORIES)[number]["id"];