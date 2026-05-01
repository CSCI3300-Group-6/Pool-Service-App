import { Role } from "@prisma/client";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { TechnicianCards } from "./tech-cards";
import { ManagerCards } from "./manager-cards";
import { assert } from "console";

// Defines the shape of the props passed into this component
interface AtGlanceProps {
  user: any;
  data: any;
  isOwner?: boolean;
}

export function AtGlance({ user, data, isOwner }: AtGlanceProps) {
  // Renders a different dashboard header depending on the user's role
  if (user.role === Role.TECHNICIAN) {
    // Technicians see a field-focused view with their assigned jobs and recent logs
    return (
      <Card className="overflow-hidden border-sky-100 bg-[linear-gradient(180deg,#ffffff,#f5f9fc)]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-sky-700/70">Today on deck</p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Stay ahead of the route and keep every stop inspection-ready.
            </h2>
          </div>
        </div>
        {/* Passes data down to the technician specific stat cards */}
        <TechnicianCards data={data} />
      </Card>
    );
  } else {
    // Defaults isOwner to false if it was not passed in
    if (isOwner == undefined) isOwner = false;

    // Owners and managers see different header text based on the isOwner flag
    return (
      <Card className="overflow-hidden border-sky-100 bg-[linear-gradient(180deg,#ffffff,#f5f9fc)]">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Summary
            </h2>
          </div>
        </div>
        {/* Passes data and isOwner flag down to the manager specific stat cards */}
        <ManagerCards data={data} isOwner={isOwner} />
      </Card>
    );
  }
}
