"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-5 py-32">
      <p className="eyebrow">{t("notFound.eyebrow")}</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        {t("notFound.title")}
      </h1>
      <p className="text-sm text-muted">{t("notFound.body")}</p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-cobalt transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> {t("notFound.back")}
      </Link>
    </div>
  );
}