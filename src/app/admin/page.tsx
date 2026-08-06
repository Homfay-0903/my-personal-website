"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminGate } from "@/components/admin/AdminGate";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/projects");
  }, [router]);

  return (
    <AdminGate>
      <div className="flex flex-1 items-center justify-center" />
    </AdminGate>
  );
}