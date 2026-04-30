import { Card, SectionTitle } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

// Defines the shape of the data prop passed into this component
interface RecentServiceLogsProps {
  data: any;
}

export function RecentServiceLogs({ data }: RecentServiceLogsProps) {
  return (
    <Card>
      <SectionTitle>Recent service activity</SectionTitle>

      {/* Loops through recent service logs and displays pool name, summary, technician, and timestamp */}
      <div className="space-y-3">
        {data.recentServiceActivity.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900">{item.pool.name}</p>
            <p className="text-sm text-slate-600">{item.summary}</p>
            <p className="mt-1 text-xs text-slate-500">{item.technician.name} · {formatDateTime(item.submittedAt)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
