"use client";

import { useState } from "react";
import { useSubmit } from "@/components/forms/use-submit";

type JobStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "MISSED" | "CANCELLED";
const JOB_STATUSES: JobStatus[] = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "MISSED", "CANCELLED"];

export function JobStatusForm({ jobId, currentStatus }: { jobId: string; currentStatus: JobStatus }) {
  const [status, setStatus] = useState<JobStatus>(currentStatus);
  const { submit, isPending, error, success } = useSubmit();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Manager status</label>
      <div className="flex flex-wrap gap-2">
        <select value={status} onChange={(event) => setStatus(event.target.value as JobStatus)} className="max-w-xs">
          {JOB_STATUSES.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={isPending}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          onClick={() => submit(`/api/jobs/${jobId}/status`, { status })}
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
    </div>
  );
}
