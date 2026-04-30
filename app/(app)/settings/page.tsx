import { requireUser } from "@/lib/auth";
import { Card, PageHeader } from "@/components/ui";

export default async function SettingsPage() {
  // Pulls the logged in user — any authenticated user can access their own settings
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Settings and account info." />

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Displays the current user's name, email, and role as read only fields */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Your account</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-700">
            <div><dt className="font-medium text-slate-900">Name</dt><dd>{user.name}</dd></div>
            <div><dt className="font-medium text-slate-900">Email</dt><dd>{user.email}</dd></div>
            <div><dt className="font-medium text-slate-900">Role</dt><dd>{user.role}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
