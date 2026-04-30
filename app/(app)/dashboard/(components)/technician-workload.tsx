import { SectionTitle, Card } from "@/components/ui";
interface TechnicianWorkloadsProps {
    data: any;
}

export function TechnicianWorkloads({data} : TechnicianWorkloadsProps) {
    return <Card>
              <SectionTitle>Technician workload</SectionTitle>
              <div className="space-y-3">
                {data.technicians.map((item: any) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.assignedJobs.length} jobs scheduled today</p>
                    </div>
                ))}
              </div>
            </Card>
}