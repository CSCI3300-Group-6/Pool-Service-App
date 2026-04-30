import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button, Card, PageHeader, StatusBadge } from "@/components/ui";

export default async function PoolsPage() {
  // Owners and operations managers can view the pools list
  const user = await requireRole(["OWNER", "OPERATIONS_MANAGER"]);

  // Fetches all pools for the organization, including customer info and unresolved alerts
  const pools = await db.pool.findMany({
    where: { organizationId: user.organizationId },
    include: { customer: true, alerts: { where: { resolved: false } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* New pool button is only shown to owners, not operations managers */}
      <PageHeader
        title="Pools"
        description="Track pool configuration, chemistry ranges, and care instructions."
        action={user.role === "OWNER" ? <Button href="/pools/new">New pool</Button> : undefined}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Loops through each pool and renders a summary card */}
        {pools.map((pool) => (
          <Card key={pool.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{pool.name}</p>
                <p className="text-sm text-slate-600">{pool.customer.name}</p>
              </div>
              {/* Badge is green if the pool is active, yellow if it is inactive */}
              <StatusBadge label={pool.status} tone={pool.status === "ACTIVE" ? "success" : "warning"} />
            </div>

            {/* Pool type, dimensions, and volume details */}
            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p>{pool.poolType}</p>
              <p>{pool.dimensions}</p>
              <p>{pool.estimatedVolume.toLocaleString()} gal</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              {/* Alert count badge is red if there are unresolved alerts, blue if the pool is clear */}
              <StatusBadge label={`${pool.alerts.length} active alerts`} tone={pool.alerts.length ? "danger" : "info"} />
              {/* Links to the individual pool detail page */}
              <a href={`/pools/${pool.id}`} className="text-sm font-medium">View</a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
