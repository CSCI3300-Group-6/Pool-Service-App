import { Card, SectionTitle } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
interface RecentChemLogsProps{
    data: any;
}
export function RecentChemLogs({data}: RecentChemLogsProps) {
    return <Card> 
              <SectionTitle>Recent chemical logs</SectionTitle>
              <div className="space-y-3">
                {data.recentChemicalLogs.map((item: any) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                      <p className="font-medium text-slate-900">{item.pool.name}</p>
                      <p className="text-sm text-slate-600">{item.chemicalType} · {item.dosageAmount} {item.dosageUnit}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.technician.name} · {formatDateTime(item.loggedAt)}</p>
                    </div>
                ))}
              </div>
            </Card>
}