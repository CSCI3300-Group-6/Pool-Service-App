import { Role } from "@prisma/client";
import {PageHeader} from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { AtGlance } from "./(components)/at-glance";
import { TodaysJobs } from "./(components)/todays-jobs";
import { UpcomingJobs } from "./(components)/upcoming-jobs";
import { PoolsOverview } from "./(components)/pools-overview";
import { TechnicianCards } from "./(components)/tech-cards";
import { RecentSubLogs } from "./(components)/recent-sub-logs";
import { ManagerCards } from "./(components)/manager-cards";
import { TechnicianWorkloads } from "./(components)/technician-workload";
import { ActiveAlerts } from "./(components)/active-alerts";
import { RecentServiceLogs } from "./(components)/recent-service";
import { RecentChemLogs } from "./(components)/recent-chemical";
import { CustomerUpdateActivity } from "./(components)/customer-updates";
import { RecentIncidents } from "./(components)/recent-incidents";

export default async function DashboardPage() {
  const user = await requireUser();
  const data: any = await getDashboardData(user.organizationId, user.role, user.id);
  const isTechnician = user.role === Role.TECHNICIAN
  if ( isTechnician ) {
    return (
      <div className="space-y-6">
        <PageHeader title="Technician Dashboard" description="Today’s route, upcoming jobs, and your recent submitted work." />
        <AtGlance user={user} data={data} ></AtGlance>
        <TechnicianCards data={data}/>
        <TodaysJobs data={data}></TodaysJobs>
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingJobs data={data} isTechnician={isTechnician}/>
          <RecentSubLogs data={data}/>
        </div>
      </div>
    );
  }

  const isOwner = user.role === Role.OWNER;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isOwner ? "Owner Dashboard" : "Operations Dashboard"}
        description={isOwner ? "Scheduling, customer growth, technician load, and customer communication in one view." : "Chemistry oversight, alerts, incidents, and reporting readiness across all pools."}
      />
      <AtGlance user={user} data={data} isOwner={isOwner}></AtGlance>
      <ManagerCards data={data} isOwner={isOwner}/>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        {isOwner ? <UpcomingJobs data={data} isTechnician={isTechnician}/> : <PoolsOverview data={data}/>}
        {isOwner ? <TechnicianWorkloads data={data}/> : <ActiveAlerts data={data}/>}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {isOwner ? <RecentServiceLogs data={data}/> : <RecentChemLogs data={data}/>}
        {isOwner ? <CustomerUpdateActivity data={data}/> : <RecentIncidents data={data}/>}
      </div>
    </div>
  );
}
