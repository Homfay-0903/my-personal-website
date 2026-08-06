import { mutation } from "./_generated/server";

const sampleProjects = [
  {
    title: { en: "AI PDF Note Taker", zh: "AI PDF 笔记助手" },
    summary: {
      en: "Extract and organize highlights from PDFs with AI-powered summaries.",
      zh: "用 AI 从 PDF 中提取高亮并自动生成结构化笔记。",
    },
    description: {
      en: "A tool that ingests PDF documents, identifies highlighted passages, and produces clean, searchable notes with AI-generated summaries. Built to prove fast iteration from prototype to deployed web app.",
      zh: "一个能够读取 PDF、识别高亮段落并借助 AI 生成摘要的工具，最终输出干净可检索的笔记。用它验证了从原型到上线的高效迭代。",
    },
    slug: "ai-pdf-note-taker",
    category: "frontend",
    techStack: ["React", "Next.js", "Tailwind CSS", "OpenAI"],
    tags: ["PDF", "AI Summary", "Productivity"],
    images: ["https://picsum.photos/seed/note-taker/1200/800"],
    demoUrl: "",
    repoUrl: "https://github.com/Homfay-0903",
    featured: true,
    published: true,
  },
  {
    title: { en: "Browser Automation Agent", zh: "浏览器自动化 Agent" },
    summary: {
      en: "An AI agent that plans and executes multi-step tasks in the browser.",
      zh: "能自主规划并执行多步浏览器任务的 AI Agent。",
    },
    description: {
      en: "An autonomous agent that combines LLM planning with headless-browser tool use. It decomposes a natural-language goal into actions, executes them, and adjusts its plan when the environment changes.",
      zh: "一个将 LLM 规划与浏览器工具调用结合的自治智能体：把自然语言目标拆解为动作、执行并根据环境变化动态调整计划。",
    },
    slug: "browser-automation-agent",
    category: "agent",
    techStack: ["Python", "Playwright", "LangGraph", "LLM"],
    tags: ["Agent", "Automation", "LLM"],
    images: ["https://picsum.photos/seed/automation-agent/1200/800"],
    demoUrl: "",
    repoUrl: "",
    featured: true,
    published: true,
  },
  {
    title: { en: "Algorithm Practice Hub", zh: "算法练习站" },
    summary: {
      en: "A structured collection of solved LeetCode problems with explainers.",
      zh: "带讲解的 LeetCode 解题集，按专题整理。",
    },
    description: {
      en: "A growing collection of algorithm solutions organized by topic, each with a plain-language explanation and complexity analysis. Doubles as a personal reference while chasing efficient patterns.",
      zh: "一个按专题整理的算法题解集合，每题附带通俗讲解与复杂度分析，既是刷题记录也是可复用的个人参考。",
    },
    slug: "algorithm-shop-hub",
    category: "other",
    techStack: ["TypeScript", "Data Structures"],
    tags: ["Algorithms", "TypeScript"],
    images: ["https://picsum.photos/seed/algo-hub/1200/800"],
    demoUrl: "",
    repoUrl: "",
    featured: false,
    published: true,
  },
];

export const seed = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("projects").collect();
    if (existing.length > 0) {
      return { inserted: 0, skipped: true };
    }
    let order = 0;
    for (const project of sampleProjects) {
      await ctx.db.insert("projects", { ...project, order });
      order += 1;
    }
    return { inserted: sampleProjects.length, skipped: false };
  },
});