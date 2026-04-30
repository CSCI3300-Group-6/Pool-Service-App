import { ChecklistTemplateForm } from "@/components/forms/checklist-template-form";
import { Card, PageHeader } from "@/components/ui";
import { requireRole } from "@/lib/auth";

export default async function NewChecklistPage() {
  // Restricts access to owners and operations managers only
  await requireRole(["OWNER", "OPERATIONS_MANAGER"]);

  return (
    <div>
      <PageHeader title="New checklist template" description="Create a reusable checklist for recurring pool service jobs." />
      {/* Renders the checklist template form inside a card */}
      <Card><ChecklistTemplateForm /></Card>
    </div>
  );
}
