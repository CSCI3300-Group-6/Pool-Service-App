import { StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

// Defines the shape of the props passed into this component
interface ManagerCardsProps {
  data: any;
  isOwner: boolean;
}

export function ManagerCards({ data, isOwner }: ManagerCardsProps) {
  // Renders four stat cards summarizing key operational metrics
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Upcoming jobs" value={data.upcomingJobs.length} />
      {/* Alert card detail text swaps depending on whether the user is an owner or manager */}
      <StatCard label="Active alerts" value={data.activeAlerts.length} detail={isOwner ? "Visibility into chemistry issues" : "Inspection focus"} />
      <StatCard label="Tracked pools" value={data.pools.length} />
      {/* Formats the raw expense number into a currency string for display */}
      <StatCard label="30-day equipment spend" value={formatCurrency(data.expenseSnapshot)} />
    </div>
  );
}
