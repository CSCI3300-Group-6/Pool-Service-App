import { Role } from "@prisma/client";
import {PageHeader, SectionTitle} from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { AtGlance, TodaysJobs, UpcomingJobs, PoolsOverview, RecentSubLogs, TechnicianWorkloads, ActiveAlerts, RecentServiceLogs, RecentChemLogs, CustomerUpdateActivity, RecentIncidents } from "./(components)";

export default async function DashboardPage() {
  const user = await requireUser();
  const data: any = await getDashboardData(user.organizationId, user.role, user.id);
  const isTechnician = user.role === Role.TECHNICIAN
  const isOwner = user.role === Role.OWNER;



  if ( isTechnician ) {
    return (
      <div className="space-y-6">
        <PageHeader title="Technician Dashboard" description="Today’s route, upcoming jobs, and your recent submitted work." />
        <AtGlance user={user} data={data} ></AtGlance>
        <TodaysJobs data={data}></TodaysJobs>
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingJobs data={data} isTechnician={isTechnician}/>
          <RecentSubLogs data={data}/>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isOwner ? "Owner Dashboard" : "Operations Dashboard"}
        description={isOwner ? "Scheduling, customer growth, technician load, and customer communication in one view." : "Chemistry oversight, alerts, incidents, and reporting readiness across all pools."}
      />
      <AtGlance user={user} data={data} isOwner={isOwner}></AtGlance>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <UpcomingJobs data={data} isTechnician={isTechnician}/>
        <TechnicianWorkloads data={data}/>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <PoolsOverview data={data}/>
        <ActiveAlerts data={data}/>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentChemLogs data={data}/>
        <RecentIncidents data={data}/>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentServiceLogs data={data}/>
        <CustomerUpdateActivity data={data}/>
      </div>
    </div>
  );
}
