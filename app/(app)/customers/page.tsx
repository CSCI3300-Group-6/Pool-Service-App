import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Button, Card, PageHeader, StatusBadge } from "@/components/ui";

export default async function CustomersPage() {
  // Only owners can access the customers list
  const user = await requireRole(["OWNER"]);

  // Fetches all customers for the organization, including their pools and messages
  // Sorted alphabetically by name
  const customers = await db.customer.findMany({
    where: { organizationId: user.organizationId },
    include: { pools: true, messages: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Page header with a button to create a new customer */}
      <PageHeader title="Customers" description="Manage residential, community, and resort accounts." action={<Button href="/customers/new">New customer</Button>} />

      {/* Table listing all customers and their key details */}
      <Card className="overflow-hidden p-0">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Pools</th>
              <th className="px-4 py-3">Updates</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {/* Loops through each customer and renders a table row */}
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-slate-200">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{customer.name}</p>
                  <p className="text-slate-500">{customer.address}</p>
                </td>

                {/* Shows email first, falls back to phone, then a placeholder if neither exists */}
                <td className="px-4 py-3">{customer.email || customer.phone || "No contact info"}</td>

                {/* Shows the total number of pools linked to this customer */}
                <td className="px-4 py-3">{customer.pools.length}</td>

                {/* Shows how many update messages have been sent to this customer */}
                <td className="px-4 py-3">
                  <StatusBadge label={`${customer.messages.length} sent`} tone="info" />
                </td>

                {/* Links to the individual customer detail page */}
                <td className="px-4 py-3 text-right">
                  <a href={`/customers/${customer.id}`} className="font-medium">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
