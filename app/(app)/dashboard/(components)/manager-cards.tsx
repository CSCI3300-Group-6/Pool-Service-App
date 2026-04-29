import { StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface ManagerCardsProps {
    data: any;
    isOwner: boolean;
}

export function ManagerCards({data, isOwner}:ManagerCardsProps) {
    return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Upcoming jobs" value={data.upcomingJobs.length} />
            <StatCard label="Active alerts" value={data.activeAlerts.length} detail={isOwner ? "Visibility into chemistry issues" : "Inspection focus"} />
            <StatCard label="Tracked pools" value={data.pools.length} />
            <StatCard label="30-day equipment spend" value={formatCurrency(data.expenseSnapshot)} />
          </div>
}