import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/forms/customer-form";
import { Card, PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Only owners can view and edit customer details
  const user = await requireRole(["OWNER"]);

  // Pulls the customer ID from the URL
  const { id } = await params;

  // Fetches the customer along with their pools and last 8 messages
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      pools: true,
      messages: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });

  // Redirects to a 404 page if the customer doesn't exist or belongs to a different organization
  if (!customer || customer.organizationId !== user.organizationId) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={customer.name} description={customer.address} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Edit form — passes existing customer data in as default values */}
        <Card>
          <SectionTitle>Edit customer</SectionTitle>
          <CustomerForm
            mode="edit"
            customer={{
              id: customer.id,
              name: customer.name,
              email: customer.email ?? "",
              phone: customer.phone ?? "",
              address: customer.address,
              notes: customer.notes ?? "",
            }}
          />
        </Card>

        <div className="space-y-6">

          {/* Loops through pools linked to this customer */}
          <Card>
            <SectionTitle>Pools</SectionTitle>
            <div className="space-y-3">
              {customer.pools.map((pool) => (
                <div key={pool.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{pool.name}</p>
                  <p className="text-sm text-slate-600">{pool.poolType}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Loops through the most recent messages sent to this customer */}
          <Card>
            <SectionTitle>Customer updates</SectionTitle>
            <div className="space-y-3">
              {customer.messages.map((message) => (
                <div key={message.id} className="rounded-xl border border-slate-200 p-4">
