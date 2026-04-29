import { Card, SectionTitle, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

interface PoolsOverviewProps {
    data: any;
}

export function PoolsOverview({data} : PoolsOverviewProps){
    return <Card>
          <SectionTitle>{"All pools overview"}</SectionTitle>
          <div className="space-y-3">
            {data.pools.map((item: any) => (
              "scheduledStart" in item ? (
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
            ))}
          </div>
        </Card>
}