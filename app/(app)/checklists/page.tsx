import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button, Card, PageHeader, SectionTitle } from "@/components/ui";

export default async function ChecklistsPage() {
  // Restricts access to owners and operations managers only
  const user = await requireRole(["OWNER", "OPERATIONS_MANAGER"]);

  // Fetches all checklist templates for the organization
  // Each template includes its items sorted by their display order
  const templates = await db.checklistTemplate.findMany({
    where: { organizationId: user.organizationId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Page header with a button to create a new checklist template */}
      <PageHeader title="Checklist templates" description="Reusable service steps for standardizing technician visits." action={<Button href="/checklists/new">New checklist</Button>} />

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Loops through each template and renders it as a card */}
        {templates.map((template) => (
          <Card key={template.id}>
            <SectionTitle>{template.name}</SectionTitle>
            <p className="text-sm text-slate-600">{template.description || "No description"}</p>

            {/* Loops through the checklist items and renders them as a list in sort order */}
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {template.items.map((item) => <li key={item.id}>• {item.label}</li>)}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
