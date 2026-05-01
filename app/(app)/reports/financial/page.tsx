import { endOfDay, startOfDay, subDays } from "date-fns";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { getFinancialReportData } from "@/lib/data";
import { FinancialChart } from "@/components/financial-chart";
import { PrintButton } from "@/components/print-button";
import { Button, Card, PageHeader, SectionTitle } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

// Formats a Date into a yyyy-MM-dd string for HTML date inputs
function formatDateforInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default async function FinancialReportPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string; poolIds?: string; chemicalTypes?: string }>;
}) {
  // Pulls the logged in user and restricts access by role
  const user = await requireRole(["OWNER", "OPERATIONS_MANAGER"]);

  // Reads filter values from the URL query string
  const params = await searchParams;
  const start = startOfDay(new Date(params.start || formatDateforInput(subDays(new Date(), 30))));
  const end = endOfDay(new Date(params.end || formatDateforInput(new Date())));
  const poolIds = params.poolIds?.split(",").filter(Boolean);
  const chemicalTypes = params.chemicalTypes?.split(",").filter(Boolean);

  // Fetches report data and pool list in parallel
  const [data, pools] = await Promise.all([
    getFinancialReportData({ organizationId: user.organizationId, start, end, poolIds, chemicalTypes }),
    db.pool.findMany({ where: { organizationId: user.organizationId }, orderBy: { name: "asc" } }),
  ]);

  // Builds the CSV export URL using the current active filters
  const exportHref = `/api/reports/financial?start=${formatDateforInput(start)}&end=${formatDateforInput(end)}&poolIds=${poolIds?.join(",") ?? ""}&chemicalTypes=${chemicalTypes?.join(",") ?? ""}`;

  return (
    <div className="space-y-6">
      <PageHeader title="Financial report" description="Chemical usage cost trends, pool-level totals, and baseline variance." />

      {/* Filter form — hidden from print view */}
      <Card className="print-hidden">
        <form className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Start date</label>
            <input type="date" name="start" defaultValue={formatDateforInput(start)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">End date</label>
            <input type="date" name="end" defaultValue={formatDateforInput(end)} />
          </div>

          {/* Placeholder shows real pool names as an example */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Filter by pool name</label>
            <input
              name="poolIds"
              defaultValue={poolIds?.join(",") ?? ""}
              placeholder={pools.slice(0, 2).map((pool) => pool.name).join(", ")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Chemical types</label>
            <input name="chemicalTypes" defaultValue={chemicalTypes?.join(",") ?? ""} placeholder="Liquid chlorine,Muriatic acid" />
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-3">
            <Button type="submit">Apply filters</Button>
            {/* Links to the API route which streams back a CSV file */}
            <a
              href={exportHref}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Export CSV
            </a>
            <PrintButton />
          </div>
        </form>
      </Card>

      {/* Summary cards showing high level cost figures */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total chemical cost</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{formatCurrency(data.totalChemicalCost)}</p>
        </Card>
        {/* Variance compares current period cost against the prior equivalent period */}
        <Card>
          <p className="text-sm text-slate-500">Baseline comparison</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{formatCurrency(data.variance)}</p>
          <p className="text-sm text-slate-500">vs. prior equivalent period</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Chemical entries</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{data.logs.length}</p>
        </Card>
      </div>

      {/* Passes trend data to the chart component for rendering */}
      <Card>
        <SectionTitle>Usage trend</SectionTitle>
        <FinancialChart data={data.trends} />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Loops through cost totals grouped by pool */}
        <Card>
          <SectionTitle>Cost by pool</SectionTitle>
          <div className="space-y-3">
            {data.byPool.map((item) => (
              <div key={item.poolId} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.poolName}</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.cost)}</p>
                </div>
                <p className="text-sm text-slate-500">{item.usage.toFixed(2)} total units applied</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Loops through cost totals grouped by chemical type */}
        <Card>
          <SectionTitle>Cost by chemical</SectionTitle>
          <div className="space-y-3">
            {data.byChemical.map((item) => (
              <div key={item.chemicalType} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.chemicalType}</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.cost)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
