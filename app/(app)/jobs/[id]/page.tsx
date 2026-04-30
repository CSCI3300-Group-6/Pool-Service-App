import { notFound } from "next/navigation";
import { CustomerUpdateForm } from "@/components/forms/customer-update-form";
import { JobStatusForm } from "@/components/forms/job-status-form";
import { TechnicianJobExecution } from "@/components/forms/technician-job-execution";
import { Card, PageHeader, SectionTitle, StatusBadge } from "@/components/ui";
import { ensureJobAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Pulls the job ID from the URL and verifies the user has access to this job
  const { id } = await params;
  const { user, job } = await ensureJobAccess(id);
  if (!job) notFound();

  // Fetches the 3 most recent service and chemical logs for this pool, excluding the current job
  const [recentHistory, recentChemicals] = await Promise.all([
    db.serviceLog.findMany({
      where: { poolId: job.poolId, jobId: { not: job.id } },
      include: { technician: true },
      orderBy: { submittedAt: "desc" },
      take: 3,
    }),
    db.chemicalLog.findMany({
      where: { poolId: job.poolId, jobId: { not: job.id } },
      orderBy: { loggedAt: "desc" },
      take: 3,
    }),
  ]);

  // Pre-fills the customer update email body using job and service log data
  const defaultUpdateBody = `Hello ${job.pool.customer.name},\n\n${job.technician?.name ?? "Our technician"} completed service on ${new Date(job.scheduledStart).toLocaleDateString()}.\n\nWork performed:\n${job.serviceLog?.summary ?? "Routine pool service completed."}\n\nNotes:\n${job.serviceLog?.observations ?? job.notes ?? "No additional notes."}\n`;

  return (
    <div className="space-y-6">
      <PageHeader title={job.title} description={`${job.pool.customer.name} · ${job.pool.name}`} />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">

          {/* Visit details card — shows customer, schedule, technician, pool, and status */}
          <Card>
            <SectionTitle>Visit details</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-700">
              <p><span className="font-medium text-slate-900">Customer:</span> {job.pool.customer.name}</p>
              <p><span className="font-medium text-slate-900">Address:</span> {job.pool.customer.address}</p>
              <p><span className="font-medium text-slate-900">Scheduled:</span> {formatDateTime(job.scheduledStart)}</p>
              <p><span className="font-medium text-slate-900">Technician:</span> {job.technician?.name ?? "Unassigned"}</p>
              <p><span className="font-medium text-slate-900">Pool:</span> {job.pool.poolType}</p>
              {/* Badge is green if completed, yellow if still pending */}
              <p><span className="font-medium text-slate-900">Status:</span> <StatusBadge label={job.status} tone={job.status === "COMPLETED" ? "success" : "warning"} /></p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div>
                <p className="font-medium text-slate-900">Care instructions</p>
                <p>{job.pool.careInstructions}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Job notes</p>
                <p>{job.notes || "No special notes for this visit."}</p>
              </div>
            </div>
          </Card>

          {/* Loops through recent service and chemical logs for this pool to give context for the visit */}
          <Card>
            <SectionTitle>Recent pool history</SectionTitle>
            <div className="space-y-3">
              {recentHistory.map((log) => (
                <div key={log.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{log.summary}</p>
                  <p className="text-sm text-slate-600">{log.technician.name} · {formatDateTime(log.submittedAt)}</p>
                </div>
              ))}
              {recentChemicals.map((chemical) => (
                <div key={chemical.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">{chemical.chemicalType}</p>
                  <p className="text-sm text-slate-600">{chemical.dosageAmount} {chemical.dosageUnit} · pH {chemical.phReading ?? "N/A"} · chlorine {chemical.chlorineReading ?? "N/A"}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Technicians see the job execution form, managers see controls and the service log */}
          {user.role === "TECHNICIAN" ? (
            // Technician view — checklist completion and service log submission
            <TechnicianJobExecution
              jobId={job.id}
              checklistItems={job.checklistItems.map((item) => ({ id: item.id, label: item.label, completed: item.completed, required: item.required }))}
              defaultSummary={job.serviceLog?.summary}
            />
          ) : (
            <>
              {/* Manager controls for updating job status */}
              <Card>
                <SectionTitle>Manager controls</SectionTitle>
                <JobStatusForm jobId={job.id} currentStatus={job.status} />
              </Card>

              {/* Loops through checklist items and shows whether each one is done or pending */}
              <Card>
                <SectionTitle>Completed checklist</SectionTitle>
                <div className="space-y-2">
                  {job.checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
                      <span>{item.label}</span>
                      <StatusBadge label={item.completed ? "Done" : "Pending"} tone={item.completed ? "success" : "warning"} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Shows the submitted service log, or a placeholder if none has been submitted yet */}
              <Card>
                <SectionTitle>Service log</SectionTitle>
                {job.serviceLog ? (
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-medium text-slate-900">Summary:</span> {job.serviceLog.summary}</p>
                    <p><span className="font-medium text-slate-900">Observations:</span> {job.serviceLog.observations}</p>
                    <p><span className="font-medium text-slate-900">Water level:</span> {job.serviceLog.waterLevelStatus}</p>
                    <p><span className="font-medium text-slate-900">Submitted:</span> {formatDateTime(job.serviceLog.submittedAt)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No service log submitted yet.</p>
                )}
              </Card>

              {/* Customer update form — pre-filled with job and service log data */}
              <Card>
                <SectionTitle>Customer update</SectionTitle>
                <CustomerUpdateForm
                  jobId={job.id}
                  defaultSubject={`Pool service update for ${job.pool.name}`}
                  defaultBody={defaultUpdateBody}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
