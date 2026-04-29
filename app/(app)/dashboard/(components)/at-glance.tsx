import { Role } from "@prisma/client";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { TechnicianCards } from "./tech-cards";
import { ManagerCards } from "./manager-cards";
import { assert } from "console";

interface AtGlanceProps {
  user: any;
  data: any;
  isOwner?: boolean;
}

export function AtGlance({user, data, isOwner}: AtGlanceProps) {
    if (user.role === Role.TECHNICIAN ) {
      return <Card className="overflow-hidden border-sky-100 bg-[linear-gradient(180deg,#ffffff,#f5f9fc)]">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-sky-700/70">Today on deck</p>
                <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950">Stay ahead of the route and keep every stop inspection-ready.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                  Your dashboard is tuned for field work: assigned jobs, recent logs, and the next visits that need attention.
                </p>
              </div>
            </div>
            <TechnicianCards data={data}/>
        </Card>;
    }
    else{
      if (isOwner == undefined)
        isOwner = false;
      return <Card className="overflow-hidden border-sky-100 bg-[linear-gradient(180deg,#ffffff,#f5f9fc)]">
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
            </div>
            <ManagerCards data={data} isOwner={isOwner}/>
        </Card>
          }
}