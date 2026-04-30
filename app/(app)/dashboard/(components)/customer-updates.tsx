import { Card, SectionTitle } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

// Defines the shape of the data prop passed into this component
interface CustomerUpdateActivityProps {
  data: any;
}

export function CustomerUpdateActivity({ data }: CustomerUpdateActivityProps) {
  return (
    <Card>
      <SectionTitle>Customer update activity</SectionTitle>

      {/* Loops through recent messages and displays the customer name, subject, status, and timestamp */}
      <div className="space-y-3">
        {data.recentMessages.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900">{item.customer.name}</p>
            <p className="text-sm text-slate-600">{item.subject}</p>
            <p className="mt-1 text-xs text-slate-500">{item.status} · {formatDateTime(item.createdAt)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
