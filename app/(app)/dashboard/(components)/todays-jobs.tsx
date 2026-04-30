import { Card, EmptyState, SectionTitle, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

// Defines the shape of the data prop passed into this component
interface TodaysJobsProps {
  data: any;
}

export function TodaysJobs({ data }: TodaysJobsProps) {
  return (
    <Card>
      <SectionTitle>Today&apos;s assigned jobs</SectionTitle>

      {/* Shows an empty state message if the technician has no jobs today */}
      {data.todayJobs.length === 0 ? (
        <EmptyState title="No jobs today" description="Your route is clear right now." />
      ) : (
        <div className="space-y-3">
          {/* Loops through today's jobs and displays pool, customer, schedule, and status */}
          {data.todayJobs.map((job: any) => (
            <div key={job.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{job.pool.name}</p>
                  <p className="text-sm text-slate-600">{job.pool.customer.name} · {job.pool.customer.address}</p>
                </div>
                <div className="text-sm text-slate-500">{formatDateTime(job.scheduledStart)}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                {/* Badge is green if the job is completed, blue if it is still in progress */}
                <StatusBadge label={job.status} tone={job.status === "COMPLETED" ? "success" : "info"} />
                {/* Links to the full job detail page */}
                <a href={`/jobs/${job.id}`} className="text-sm font-medium">Open job</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
