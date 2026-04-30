import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { PoolForm } from "@/components/forms/pool-form";
import { Card, PageHeader } from "@/components/ui";

export default async function NewPoolPage() {
  // Only owners can create new pools
  const user = await requireRole(["OWNER"]);

  // Fetches all customers for this organization to populate the pool assignment dropdown
  const customers = await db.customer.findMany({
    where: { organizationId: user.organizationId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Redirects to 404 if there are no customers yet — a pool must be assigned to a customer
  if (customers.length === 0) notFound();

  return (
    <div>
      <PageHeader title="New pool" description="Add a managed pool and define chemistry targets." />
      {/* Renders the pool form in create mode with the customer list passed in */}
      <Card><PoolForm customers={customers} mode="create" /></Card>
    </div>
  );
}
