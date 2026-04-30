import { Card, SectionTitle } from "@/components/ui"
import { formatDateTime } from "@/lib/utils";


interface RecentIncidentsProps{
    data: any;
}
export function RecentIncidents({data}: RecentIncidentsProps) {
    return <Card>
              <SectionTitle>Recent incidents</SectionTitle>
              <div className="space-y-3">
                {data.recentIncidents.map((item: any) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.pool.name} · {item.severity}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.technician.name} · {formatDateTime(item.createdAt)}</p>
                    </div>
                ))}
              </div>
            </Card>
}