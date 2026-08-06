"use client";

import { useQuery } from "convex/react";
import { useConvexAuth } from "@convex-dev/auth/react";
import { api } from "convex/_generated/api";
import type { ReactNode } from "react";
import { ActivateAdmin } from "@/components/admin/ActivateAdmin";
import { LoginForm } from "@/components/admin/LoginForm";

export function AdminGate({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const amIAdmin = useQuery(api.adminMutations.amIAdmin);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <LoginForm />
      </div>
    );
  }

  if (amIAdmin === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="h-24 w-full max-w-sm animate-pulse bg-line/60" />
      </div>
    );
  }

  if (amIAdmin === false) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <ActivateAdmin />
      </div>
    );
  }

  return <>{children}</>;
}