import { AdminGate } from "@/components/admin/AdminGate";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = {
  title: "New project",
  robots: { index: false, follow: false },
};

export default function AdminNewProjectPage() {
  return (
    <AdminGate>
      <ProjectForm mode="new" />
    </AdminGate>
  );
}