import { Card, SectionTitle } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

interface RecentSubLogsProps {
    data: any;
}

export function RecentSubLogs({data}:RecentSubLogsProps) {
    return <Card>
                <SectionTitle>Recent submitted logs</SectionTitle>
                <div className="space-y-3">
                  {data.recentLogs.map((log: any) => (
                    <div key={log.id} className="rounded-xl border border-slate-200 p-4">
                      <p className="font-medium text-slate-900">{log.pool.name}</p>
                      <p className="text-sm text-slate-600">{log.summary}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDateTime(log.submittedAt)}</p>
                    </div>
                  ))}
                </div>
              </Card>
}