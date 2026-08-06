"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useI18n } from "@/lib/i18n";

export function ActivateAdmin() {
  const { t } = useI18n();
  const becomeAdmin = useMutation(api.adminMutations.becomeAdmin);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <p className="eyebrow">{t("admin.meta")}</p>
      <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
        {t("admin.becomeAdminTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{t("admin.becomeAdminBody")}</p>

      <form
        className="mt-8 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await becomeAdmin({ secret });
          } catch {
            setError(t("admin.error"));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted">
            {t("admin.secret")}
          </span>
          <input
            required
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full border border-line bg-paper px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-cobalt"
          />
        </label>

        {error && (
          <p className="border border-amber/40 bg-amber/5 px-3 py-2 text-xs text-amber">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("admin.becomeAdminBtn")}
        </button>
      </form>
    </div>
  );
}