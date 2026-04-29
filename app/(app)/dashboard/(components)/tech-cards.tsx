import { StatCard } from "@/components/ui"

interface TechnicianCardsProps{
    data: any;
}

export function TechnicianCards({data} : TechnicianCardsProps) {
    return <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Today's jobs" value={data.todayJobs.length} />
              <StatCard label="Upcoming jobs" value={data.upcomingJobs.length} />
              <StatCard label="Recent logs" value={data.recentLogs.length} />
            </div>
}