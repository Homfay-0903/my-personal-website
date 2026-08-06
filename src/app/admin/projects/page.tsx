import { AdminGate } from "@/components/admin/AdminGate";
import { ManageProjects } from "@/components/admin/ManageProjects";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminProjectsPage() {
  return (
    <AdminGate>
      <ManageProjects />
    </AdminGate>
  );
}