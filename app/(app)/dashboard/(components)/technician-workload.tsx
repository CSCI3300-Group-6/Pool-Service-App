import { SectionTitle, Card } from "@/components/ui";

// Defines the shape of the data prop passed into this component
interface TechnicianWorkloadsProps {
  data: any;
}

export function TechnicianWorkloads({ data }: TechnicianWorkloadsProps) {
  return (
    <Card>
      <SectionTitle>Technician workload</SectionTitle>

      {/* Loops through each technician and displays their name and how many jobs they have scheduled today */}
      <div className="space-y-3">
        {data.technicians.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-sm text-slate-600">{item.assignedJobs.length} jobs scheduled today</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
