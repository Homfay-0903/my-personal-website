"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const langs = ["en", "zh"] as const;
export type Lang = (typeof langs)[number];

const en = {
  "nav.work": "Work",
  "nav.projects": "Projects",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.switchLang": "中文",
  "nav.themeLight": "Light",
  "nav.themeDark": "Dark",

  "hero.eyebrow": "Selected work — index",
  "hero.title": "Frontend developer building interfaces people glide through.",
  "hero.sub": "A directory of recent web and AI-agent projects. Open a line to view specs, demos, and source.",
  "hero.ctaProjects": "Browse all projects",
  "hero.ctaContact": "Say hi",

  "home.sectionAbout": "About",
  "home.indexLabel": "Project index",
  "home.live": "Live",
  "home.source": "Source",
  "home.countPrefix": "no.",

  "about.eyebrow": "About — short version",
  "about.title": "I turn fuzzy ideas into crisp, working interfaces.",
  "about.p1": "I build frontend applications that hold up under real use — clear state, sane layouts, no dead ends. Most recently I have been pairing classic React/Next.js craft with AI tools, and shipping small agents that automate browser and document workflows.",
  "about.p2": "This site is also a small proof of that: every project below is managed through an admin panel that runs on the same codebase, so projects can be added or swapped in minutes without a redeploy.",
  "about.skillsTitle": "Tools of the trade",
  "about.skillsFrontend": "Frontend",
  "about.skillsAgent": "Agent / automation",
  "about.metaWhere": "Based in",
  "about.metaWhereValue": "China",
  "about.metaOpenTo": "Open to",
  "about.metaOpenToValue": "frontend & agent roles",
  "about.contactTitle": "Let’s build something precise.",
  "about.contactBody": "If a team needs someone who ships clean interfaces, I’m interested.",
  "about.contactCta": "Email me",
  "about.contactGithub": "GitHub",

  "list.eyebrow": "Project directory",
  "list.title": "All projects",
  "list.filterAll": "All",
  "list.filterFrontend": "Frontend",
  "list.filterAgent": "AI Agent",
  "list.filterOther": "Other",
  "list.count": "projects",
  "list.empty": "Nothing here yet.",

  "detail.eyebrow": "Project spec",
  "detail.stack": "Tech stack",
  "detail.category": "Category",
  "detail.tags": "Tags",
  "detail.links": "Links",
  "detail.live": "Live demo",
  "detail.source": "Source code",
  "detail.prev": "Prev project",
  "detail.next": "Next project",
  "detail.back": "Back to projects",
  "detail.notFound": "This project is not on the index.",
  "detail.backHome": "Back to index",

  "notFound.eyebrow": "Error — 404",
  "notFound.title": "Off the plotted path.",
  "notFound.body": "The page you asked for isn’t in this drawing.",
  "notFound.back": "Back to index",

  "admin.meta": "Admin",
  "admin.signIn": "Sign in",
  "admin.signUp": "Create account",
  "admin.toSignUp": "No account? Create one",
  "admin.toSignIn": "Have an account? Sign in",
  "admin.email": "Email",
  "admin.password": "Password",
  "admin.signingIn": "Signing you in…",
  "admin.welcome": "Signed in",
  "admin.manageTitle": "Manage projects",
  "admin.manageSub": "Create, edit, reorder and publish your work. Changes go live on the site immediately.",
  "admin.logout": "Sign out",
  "admin.newProject": "New project",
  "admin.becomeAdminTitle": "Activate admin",
  "admin.becomeAdminBody": "This account is new. Enter your admin setup code to gain write access.",
  "admin.secret": "Setup code",
  "admin.becomeAdminBtn": "Activate",
  "admin.active": "Admin",
  "admin.pending": "Pending",
  "admin.published": "Published",
  "admin.draft": "Draft",
  "admin.featured": "Featured",
  "admin.edit": "Edit",
  "admin.delete": "Delete",
  "admin.wantsDelete": "Delete this project? This cannot be undone.",
  "admin.cancel": "Cancel",
  "admin.reorder": "Drag to reorder",
  "admin.uploading": "Uploading…",
  "admin.upload": "Upload",
  "admin.uploadDone": "Uploaded",
  "admin.chooseFile": "Choose image",
  "admin.slug": "Slug",
  "admin.slugHint": "Used in the URL — /projects/{slug}",
  "admin.category": "Category",
  "admin.techStack": "Tech stack (comma separated)",
  "admin.tags": "Tags (comma separated)",
  "admin.demoUrl": "Live demo URL",
  "admin.repoUrl": "Source / repo URL",
  "admin.images": "Screenshots",
  "admin.imagesHint": "Upload screenshots, or paste image URLs (one per line).",
  "admin.title": "Title",
  "admin.zh": "中文",
  "admin.en": "English",
  "admin.summary": "Summary (card)",
  "admin.summaryHint": "One line shown on the card. Keep it under 140 chars.",
  "admin.description": "Description",
  "admin.descriptionHint": "Support paragraphs with a blank line.",
  "admin.publishedCheck": "Published (visible on the site)",
  "admin.featuredCheck": "Featured (homepage index)",
  "admin.save": "Save project",
  "admin.saving": "Saving…",
  "admin.saved": "Saved",
  "admin.backToProjects": "Back to manager",
  "admin.formHeadingNew": "New project",
  "admin.formHeadingEdit": "Edit project",
  "admin.errorEmpty": "Fill in the fields marked *.",
  "admin.emptyList": "No projects yet.",
  "admin.unauthenticatedTitle": "Sign in to manage projects",
  "admin.unauthenticatedBody": "The manager is private. Only you — the site owner — can change projects here.",
  "admin.error": "Something went wrong. Try again.",
  "admin.unauthorized": "Your account is not activated as admin yet.",
} as const;

export type Key = keyof typeof en;

const zh: Record<Key, string> = {
  "nav.work": "作品",
  "nav.projects": "全部项目",
  "nav.about": "关于",
  "nav.contact": "联系",
  "nav.switchLang": "EN",
  "nav.themeLight": "日间",
  "nav.themeDark": "夜间",

  "hero.eyebrow": "精选作品 — 索引",
  "hero.title": "前端开发者，专注打造让人用得顺手的界面与体验。",
  "hero.sub": "一份项目目录。打开任意一项，即可查看规格、在线演示与源码。本站所有数据都由后台面板管理，无需重新部署即可增删替换。",
  "hero.ctaProjects": "浏览全部项目",
  "hero.ctaContact": "联系我",

  "home.sectionAbout": "关于我",
  "home.indexLabel": "项目索引",
  "home.live": "在线演示",
  "home.source": "源码",
  "home.countPrefix": "编号",

  "about.eyebrow": "关于我 — 概要",
  "about.title": "把模糊的想法做成能用的界面。",
  "about.p1": "我开发经得起真实使用的前端应用：状态清晰、反馈诚实、不多不少。最近在做 React / Next.js 工程的同时探索 AI 工具链，也写过几个能自动完成浏览器与文档流程的 Agent。",
  "about.p2": "本站本身就是一个小小证明：所有数据驱动的页面都来自同一个后台管理系统，几分钟内就能新增或替换项目，无需再次部署。",
  "about.skillsTitle": "常用技术",
  "about.skillsFrontend": "前端",
  "about.skillsAgent": "Agent / 工具链",
  "about.metaWhere": "所在地",
  "about.metaWhereValue": "中国",
  "about.metaOpenTo": "求职方向",
  "about.metaOpenToValue": "前端 / Agent 开发",
  "about.contactTitle": "一起做点精确的东西吧。",
  "about.contactBody": "如果你需要一个能把界面做干净、踩过 AI 工具坑的开发者，欢迎联系。",
  "about.contactCta": "发邮件",
  "about.contactGithub": "GitHub",

  "list.eyebrow": "项目目录",
  "list.title": "全部项目",
  "list.filterAll": "全部",
  "list.filterFrontend": "前端",
  "list.filterAgent": "AI Agent",
  "list.filterOther": "其他",
  "list.count": "个项目",
  "list.empty": "暂无项目。",

  "detail.eyebrow": "项目规格",
  "detail.stack": "技术栈",
  "detail.category": "分类",
  "detail.tags": "标签",
  "detail.links": "链接",
  "detail.live": "在线演示",
  "detail.source": "源码",
  "detail.prev": "上一个项目",
  "detail.next": "下一个项目",
  "detail.back": "返回项目列表",
  "detail.notFound": "索引里没有这个项目。",
  "detail.backHome": "回到首页",

  "notFound.eyebrow": "错误 — 404",
  "notFound.title": "这张图纸上找不到这个页面。",
  "notFound.body": "你要找的页面不在当前设计中。",
  "notFound.back": "回到首页",

  "admin.meta": "管理",
  "admin.signIn": "登录",
  "admin.signUp": "注册",
  "admin.toSignUp": "没有账号？创建",
  "admin.toSignIn": "已有账号？登录",
  "admin.email": "邮箱",
  "admin.password": "密码",
  "admin.signingIn": "登录中…",
  "admin.welcome": "已登录",
  "admin.manageTitle": "项目管理",
  "admin.manageSub": "新增、修改、排序、上架作品。保存后网站即时更新。",
  "admin.logout": "退出登录",
  "admin.newProject": "新建项目",
  "admin.becomeAdminTitle": "激活管理员",
  "admin.becomeAdminBody": "这个账号是新的。输入管理员设置码以激活写权限。",
  "admin.secret": "设置码",
  "admin.becomeAdminBtn": "激活",
  "admin.active": "管理员",
  "admin.pending": "待激活",
  "admin.published": "已上架",
  "admin.draft": "草稿",
  "admin.featured": "精选",
  "admin.edit": "编辑",
  "admin.delete": "删除",
  "admin.wantsDelete": "确定删除该项目？不可恢复。",
  "admin.cancel": "取消",
  "admin.reorder": "拖拽排序",
  "admin.uploading": "上传中…",
  "admin.upload": "上传",
  "admin.uploadDone": "已上传",
  "admin.chooseFile": "选择图片",
  "admin.slug": "Slug",
  "admin.slugHint": "用于 URL — /projects/{slug}",
  "admin.category": "分类",
  "admin.techStack": "技术栈（逗号分隔）",
  "admin.tags": "标签（逗号分隔）",
  "admin.demoUrl": "在线演示 URL",
  "admin.repoUrl": "源码仓库 URL",
  "admin.images": "截图",
  "admin.imagesHint": "上传截图，或直接粘贴图片 URL（每行一个）。",
  "admin.title": "标题",
  "admin.zh": "中文",
  "admin.en": "English",
  "admin.summary": "摘要（卡片）",
  "admin.summaryHint": "卡片上的一句话，最好不超过 60 字。",
  "admin.description": "详细介绍",
  "admin.descriptionHint": "用空行分段。",
  "admin.publishedCheck": "上架（公网可见）",
  "admin.featuredCheck": "精选（首页索引）",
  "admin.save": "保存项目",
  "admin.saving": "保存中…",
  "admin.saved": "已保存",
  "admin.backToProjects": "返回项目管理",
  "admin.formHeadingNew": "新建项目",
  "admin.formHeadingEdit": "编辑项目",
  "admin.errorEmpty": "请填写标红的必填项。",
  "admin.emptyList": "还没有项目，点击右上角创建第一个吧。",
  "admin.error": "出错了，请重试。",
  "admin.unauthorized": "你的账号尚未激活为管理员。",
  "admin.unauthenticatedTitle": "登录以管理项目",
  "admin.unauthenticatedBody": "管理后台为私有页面，只有站长可以在此增删改项目。",
};

const dict: Record<Lang, Record<Key, string>> = { en, zh };

const STORAGE_KEY = "pf-lang";

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "zh" || stored === "en") return stored;
  const nav = window.navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("zh") ? "zh" : "en";
}

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: Key) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydration-safe: SSR renders "en"; the real preference is applied once
  // the client is mounted (reading localStorage during render would cause
  // hydration mismatches).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration sync
    setLangState(detectInitialLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: setLangState,
      toggleLang: () => setLangState((l) => (l === "en" ? "zh" : "en")),
      t: (key: Key) => dict[lang][key],
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/** Localized string helper for server components and non-React modules. */
export function pick<T>(obj: { en: T; zh: T }, lang: Lang): T {
  return obj[lang];
}

export type { Lang as Locale };

