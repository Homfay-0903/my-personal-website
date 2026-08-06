import { AdminGate } from "@/components/admin/AdminGate";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = {
  title: "Edit project",
  robots: { index: false, follow: false },
};

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AdminGate>
      <ProjectForm mode="edit" id={id} />
    </AdminGate>
  );
}