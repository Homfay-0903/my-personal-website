import type { Lang } from "./i18n";

export const categoryDefs = [
  { id: "frontend", label: { en: "Frontend", zh: "前端" } },
  { id: "agent", label: { en: "AI Agent", zh: "AI Agent" } },
  { id: "other", label: { en: "Other", zh: "其他" } },
] as const;

export function categoryLabel(id: string, lang: Lang): string {
  const def = categoryDefs.find((c) => c.id === id);
  return def ? def.label[lang] : id;
}