import { format } from "date-fns";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button, Card, PageHeader, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

export default async function SchedulePage() {
  // Only owners and operations managers are allowed to view the schedule
  const user = await requireRole(["OWNER", "OPERATIONS_MANAGER"]);

  // Fetch all jobs for this organization, including the related pool, customer, and technician info
  // Jobs are sorted by scheduled start time first, then by their route order
  const jobs = await db.job.findMany({
    where: { organizationId: user.organizationId },
    include: { pool: { include: { customer: true } }, technician: true },
    orderBy: [{ scheduledStart: "asc" }, { routeOrder: "asc" }],
  });

  // Group jobs by date so we can display them in separate day sections
  // The key is the date string (e.g. "2025-04-30") and the value is an array of jobs on that day
  const groups = jobs.reduce<Record<string, typeof jobs>>((acc, job) => {
    const key = format(job.scheduledStart, "yyyy-MM-dd");
    acc[key] = acc[key] ?? [];
    acc[key].push(job);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Page header with a button to create a new job */}
      <PageHeader
        title="Schedule"
        description="Daily route view for upcoming service visits."
        action={<Button href="/jobs/new">Create job</Button>}
      />

      <div className="space-y-5">
        {/* Loop through each day group and render a card for it */}
        {Object.entries(groups).map(([date, items]) => (
          <Card key={date}>
            {/* Display the date in a readable format e.g. "Monday, Apr 30" */}
            <h2 className="text-lg font-semibold text-slate-900">
              {format(new Date(date), "EEEE, MMM d")}
            </h2>

            <div className="mt-4 space-y-3">
              {/* Loop through each job scheduled on this day */}
              {items.map((job) => (
                <div key={job.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      {/* Job title and details — pool name, customer name, assigned technician */}
                      <p className="font-medium text-slate-900">{job.title}</p>
                      <p className="text-sm text-slate-600">
                        {job.pool.name} · {job.pool.customer.name} · {job.technician?.name ?? "Unassigned"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Shows which route stop this job is (e.g. Route 1, Route 2) */}
                      <StatusBadge label={`Route ${job.routeOrder ?? "-"}`} tone="info" />
                      {/* Shows job status — green if completed, yellow if still pending */}
                      <StatusBadge
                        label={job.status}
                        tone={job.status === "COMPLETED" ? "success" : "warning"}
                      />
                    </div>
                  </div>

                  {/* Displays the start and end time of the job */}
                  <p className="mt-2 text-sm text-slate-500">
                    {formatDateTime(job.scheduledStart)} - {formatDateTime(job.scheduledEnd)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
