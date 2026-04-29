import { Role } from "@prisma/client";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface AtGlanceProps {
  user: any;
  data: any;
  isOwner?: boolean;
}

export function AtGlance({user, data, isOwner}: AtGlanceProps) {
    if (user.role === Role.TECHNICIAN ) {
      return <>
        <Card className="overflow-hidden border-sky-100 bg-[linear-gradient(180deg,#ffffff,#f5f9fc)]">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-sky-700/70">Today on deck</p>
                <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950">Stay ahead of the route and keep every stop inspection-ready.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                  Your dashboard is tuned for field work: assigned jobs, recent logs, and the next visits that need attention.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">Jobs today</p>
                  <p className="font-display mt-2 text-4xl font-bold text-slate-950">{data.todayJobs.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">Upcoming</p>
                  <p className="font-display mt-2 text-4xl font-bold text-slate-950">{data.upcomingJobs.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">Recent logs</p>
                  <p className="font-display mt-2 text-4xl font-bold text-slate-950">{data.recentLogs.length}</p>
                </div>
              </div>
            </div>
          </Card>
      </>;
    }
    else{
        return <>
            <Card className="overflow-hidden border-sky-100 bg-[linear-gradient(180deg,#ffffff,#f5f9fc)]">
              <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-sky-700/70">
                    {isOwner ? "State of service" : "Control tower"}
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {isOwner
                      ? "A clearer picture of routes, revenue, staffing, and water quality."
                      : "Dispatch, chemistry, and customer follow-up in one operational view."}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                    {isOwner
                      ? "This board combines route activity, open issues, and financial progress so the business feels disciplined instead of reactive."
                      : "Stay on top of today’s appointments, active alerts, and the work that needs a quick follow-up before it becomes a customer problem."}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">{isOwner ? "Upcoming jobs" : "Jobs today"}</p>
                    <p className="font-display mt-2 text-4xl font-bold text-slate-950">{isOwner ? data.upcomingJobs.length : data.todayJobs.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Open alerts</p>
                    <p className="font-display mt-2 text-4xl font-bold text-slate-950">{data.activeAlerts.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">{isOwner ? "Tracked pools" : "30-day equipment spend"}</p>
                    <p className="font-display mt-2 text-4xl font-bold text-slate-950">{isOwner ? data.pools.length : formatCurrency(data.expenseSnapshot)}</p>
                  </div>
                </div>
              </div>
          </Card>
    </>}
}