import { Card, SectionTitle } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

// Defines the shape of the props passed into this component
interface UpcomingJobsProps {
  data: any;
  isTechnician: boolean;
}

export function UpcomingJobs({ data, isTechnician }: UpcomingJobsProps) {
  return (
    <Card>
      <SectionTitle>Upcoming jobs</SectionTitle>

      {/* Loops through upcoming jobs and renders a different layout depending on the user's role */}
      <div className="space-y-3">
        {data.upcomingJobs.map((job: any) => (
          <div key={job.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col gap-2 md:flex-row md:jobs-center md:justify-between">
              <div>
                <p className="font-medium text-slate-900">{job.pool.name}</p>
                {/* Technicians only see the customer name, managers also see the assigned technician */}
                {isTechnician ? (
                  <p className="text-sm text-slate-600">{job.pool.customer.name}</p>
                ) : (
                  <p className="text-sm text-slate-600">{job.pool.customer.name} · {job.technician?.name ?? "Unassigned"}</p>
                )}
              </div>
              {/* Scheduled time is only shown to managers and owners, not technicians */}
              {!isTechnician && (
                <div className="text-sm text-slate-500">{formatDateTime(job.scheduledStart)}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
