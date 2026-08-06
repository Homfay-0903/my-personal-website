"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useI18n } from "@/lib/i18n";

export function LoginForm() {
  const { t } = useI18n();
  const { signIn } = useAuthActions();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <p className="eyebrow">{t("admin.meta")}</p>
      <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
        {t("admin.unauthenticatedTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {t("admin.unauthenticatedBody")}
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await signIn("password", new FormData(event.currentTarget));
          } catch (err) {
            setError(
              err instanceof ConvexError
                ? String(err.data)
                : err instanceof Error
                  ? err.message
                  : t("admin.error"),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted">
            {t("admin.email")}
          </span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted">
            {t("admin.password")}
          </span>
          <input
            required
            minLength={8}
            type="password"
            name="password"
            autoComplete={mode === "signIn" ? "current-password" : "new-password"}
            placeholder="••••••••"
            className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-cobalt"
          />
        </label>

        <input type="hidden" name="flow" value={mode} />

        {error && (
          <p className="border border-amber/40 bg-amber/5 px-3 py-2 text-xs text-amber">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? t("admin.signingIn") : mode === "signIn" ? t("admin.signIn") : t("admin.signUp")}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode((m) => (m === "signIn" ? "signUp" : "signIn"))}
        className="mt-4 font-mono text-[11px] tracking-widest text-muted transition-colors hover:text-cobalt"
      >
        {mode === "signIn" ? t("admin.toSignUp") : t("admin.toSignIn")}
      </button>
    </div>
  );
}