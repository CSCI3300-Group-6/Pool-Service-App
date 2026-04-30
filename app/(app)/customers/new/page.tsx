import { CustomerForm } from "@/components/forms/customer-form";
import { Card, PageHeader } from "@/components/ui";
import { requireRole } from "@/lib/auth";

export default async function NewCustomerPage() {
  // Only owners can create new customers
  await requireRole(["OWNER"]);

  return (
    <div>
      <PageHeader title="New customer" description="Add a customer account and contact record." />
      {/* Renders the customer form in create mode — no existing data is passed in */}
      <Card><CustomerForm mode="create" /></Card>
    </div>
  );
}
