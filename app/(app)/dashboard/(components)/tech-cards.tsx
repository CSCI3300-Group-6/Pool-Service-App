import { StatCard } from "@/components/ui";

// Defines the shape of the data prop passed into this component
interface TechnicianCardsProps {
  data: any;
}

export function TechnicianCards({ data }: TechnicianCardsProps) {
  // Renders three stat cards summarizing the technician's current workload
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
      <StatCard label="Today's jobs" value={data.todayJobs.length} />
      <StatCard label="Upcoming jobs" value={data.upcomingJobs.length} />
      <StatCard label="Recent logs" value={data.recentLogs.length} />
    </div>
  );
}
