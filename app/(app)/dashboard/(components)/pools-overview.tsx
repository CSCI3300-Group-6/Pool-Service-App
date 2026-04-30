import { Card, SectionTitle, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

// Defines the shape of the data prop passed into this component
interface PoolsOverviewProps {
  data: any;
}

export function PoolsOverview({ data }: PoolsOverviewProps) {
  return (
    <Card>
      <SectionTitle>{"All pools overview"}</SectionTitle>

      <div className="space-y-3">
        {/* Loops through pools and renders a different layout depending on the data shape */}
        {data.pools.map((item: any) =>
          // If the item has a scheduledStart it is a job, otherwise it is a plain pool record
          "scheduledStart" in item ? (
            // Job view — shows pool name, customer, assigned technician, and scheduled time
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{item.pool.name}</p>
                  <p className="text-sm text-slate-600">{item.pool.customer.name} · {item.technician?.name ?? "Unassigned"}</p>
                </div>
                <div className="text-sm text-slate-500">{formatDateTime(item.scheduledStart)}</div>
              </div>
            </div>
          ) : (
            // Pool view — shows pool name, customer, pool type, and active alert count
            // Badge is red if there are alerts, green if the pool is clear
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.customer.name} · {item.poolType}</p>
                </div>
                <StatusBadge label={`${item.alerts.length} alerts`} tone={item.alerts.length ? "danger" : "success"} />
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
