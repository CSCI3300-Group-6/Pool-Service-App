import { Role } from "@prisma/client";
import { PageHeader, SectionTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { AtGlance, TodaysJobs, UpcomingJobs, PoolsOverview, RecentSubLogs, TechnicianWorkloads, ActiveAlerts, RecentServiceLogs, RecentChemLogs, CustomerUpdateActivity, RecentIncidents } from "./(components)";

export default async function DashboardPage() {
  // Pulls the logged in user — any authenticated user can access the dashboard
  const user = await requireUser();

  // Fetches all dashboard data for this user's organization and role
  const data: any = await getDashboardData(user.organizationId, user.role, user.id);

  // Determines which dashboard layout to render based on the user's role
  const isTechnician = user.role === Role.TECHNICIAN;
  const isOwner = user.role === Role.OWNER;

  // Technicians get a simplified field-focused layout with only their own jobs and logs
  if (isTechnician) {
    return (
      <div className="space-y-6">
        <PageHeader title="Technician Dashboard" description="Today's route, upcoming jobs, and your recent submitted work." />
        <AtGlance user={user} data={data} />
        <TodaysJobs data={data} />
        {/* Upcoming jobs and recent submitted logs sit side by side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingJobs data={data} isTechnician={isTechnician} />
          <RecentSubLogs data={data} />
        </div>
      </div>
    );
  }

  // Owners and managers get a full operational dashboard with all components
  return (
    <div className="space-y-6">
      {/* Page title and description swap between owner and manager versions */}
      <PageHeader
        title={isOwner ? "Owner Dashboard" : "Operations Dashboard"}
        description={isOwner ? "Scheduling, customer growth, technician load, and customer communication." : "Chemistry oversight, alerts, incidents, and reporting readiness across all pools."}
      />
      <AtGlance user={user} data={data} isOwner={isOwner} />

      {/* Upcoming jobs alongside technician workload summary */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <UpcomingJobs data={data} isTechnician={isTechnician} />
        <TechnicianWorkloads data={data} />
      </div>

      {/* Pools overview alongside active chemistry alerts */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <PoolsOverview data={data} />
        <ActiveAlerts data={data} />
      </div>

      {/* Recent chemical logs alongside recent incidents */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentChemLogs data={data} />
        <RecentIncidents data={data} />
      </div>

      {/* Recent service activity alongside customer update messages */}
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentServiceLogs data={data} />
        <CustomerUpdateActivity data={data} />
      </div>
    </div>
  );
}
