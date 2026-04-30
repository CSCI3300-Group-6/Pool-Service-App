import { SectionTitle, Card } from "@/components/ui";
interface ActiveAlertsProps {
    data: any;
}

export function ActiveAlerts({data} : ActiveAlertsProps) {
    return <Card>
              <SectionTitle>Active alerts</SectionTitle>
              <div className="space-y-3">
                {data.activeAlerts.map((item: any) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                      <p className="font-medium text-slate-900">{item.pool.name}</p>
                      <p className="text-sm text-rose-700">{item.message}</p>
                    </div>
                ))}
              </div>
            </Card>
}