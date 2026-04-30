import { SectionTitle, Card } from "@/components/ui";

// Defines the shape of the data prop passed into this component
interface ActiveAlertsProps {
  data: any;
}

export function ActiveAlerts({ data }: ActiveAlertsProps) {
  return (
    <Card>
      <SectionTitle>Active alerts</SectionTitle>

      {/* Loops through each active alert and displays the pool name and alert message */}
      <div className="space-y-3">
        {data.activeAlerts.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900">{item.pool.name}</p>
            <p className="text-sm text-rose-700">{item.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
