import { Role } from "@prisma/client";
import { Card, EmptyState, PageHeader, SectionTitle, StatCard, StatusBadge } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AtGlance } from "./(components)/at-glance";
import { TodaysJobs } from "./(components)/todays-jobs";
import { UpcomingJobs } from "./(components)/upcoming-jobs";
import { PoolsOverview } from "./(components)/pools-overview";

export default async function DashboardPage() {
  const user = await requireUser();
  const data: any = await getDashboardData(user.organizationId, user.role, user.id);
  const isTechnician = user.role === Role.TECHNICIAN
  if ( isTechnician ) {
    return (
      <div className="space-y-6">
        <PageHeader title="Technician Dashboard" description="Today’s route, upcoming jobs, and your recent submitted work." />
        <AtGlance user={user} data={data} ></AtGlance>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Today's jobs" value={data.todayJobs.length} />
          <StatCard label="Upcoming jobs" value={data.upcomingJobs.length} />
          <StatCard label="Recent logs" value={data.recentLogs.length} />
        </div>
        <TodaysJobs data={data}></TodaysJobs>
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingJobs data={data} isTechnician={isTechnician}/>
          <Card>
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Upcoming jobs" value={data.upcomingJobs.length} />
        <StatCard label="Active alerts" value={data.activeAlerts.length} detail={isOwner ? "Visibility into chemistry issues" : "Inspection focus"} />
        <StatCard label="Tracked pools" value={data.pools.length} />
        <StatCard label="30-day equipment spend" value={formatCurrency(data.expenseSnapshot)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        {isOwner ? <UpcomingJobs data={data} isTechnician={isTechnician}/> : <PoolsOverview data={data}/>}
        <Card>
          <SectionTitle>{isOwner ? "Technician workload" : "Active alerts"}</SectionTitle>
          <div className="space-y-3">
            {(isOwner ? data.technicians : data.activeAlerts).map((item: any) => (
              "assignedJobs" in item ? (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.assignedJobs.length} jobs scheduled today</p>
                </div>
              ) : (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{item.pool.name}</p>
                  <p className="text-sm text-rose-700">{item.message}</p>
                </div>
              )
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <SectionTitle>{isOwner ? "Recent service activity" : "Recent chemical logs"}</SectionTitle>
          <div className="space-y-3">
            {(isOwner ? data.recentServiceActivity : data.recentChemicalLogs).map((item: any) => (
              "summary" in item ? (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{item.pool.name}</p>
                  <p className="text-sm text-slate-600">{item.summary}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.technician.name} · {formatDateTime(item.submittedAt)}</p>
                </div>
              ) : (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{item.pool.name}</p>
                  <p className="text-sm text-slate-600">{item.chemicalType} · {item.dosageAmount} {item.dosageUnit}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.technician.name} · {formatDateTime(item.loggedAt)}</p>
                </div>
              )
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle>{isOwner ? "Customer update activity" : "Recent incidents"}</SectionTitle>
          <div className="space-y-3">
            {(isOwner ? data.recentMessages : data.recentIncidents).map((item: any) => (
              "subject" in item ? (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{item.customer.name}</p>
                  <p className="text-sm text-slate-600">{item.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.status} · {formatDateTime(item.createdAt)}</p>
                </div>
              ) : (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.pool.name} · {item.severity}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.technician.name} · {formatDateTime(item.createdAt)}</p>
                </div>
              )
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
