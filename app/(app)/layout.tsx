import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Verifies the user is logged in before rendering any protected page
  const user = await requireUser();

  // Wraps all protected pages in the app shell which provides the sidebar and navigation
  return <AppShell user={user}>{children}</AppShell>;
}
