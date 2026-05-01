import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { LoginForm } from "@/components/forms/login-form";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <div className="app-wave-bg flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_460px]">
        <div className="ocean-panel hidden overflow-hidden rounded-[2rem] p-10 text-white shadow-[0_28px_70px_rgba(12,18,52,0.24)] lg:block">
          <h1 className="font-display mt-5 max-w-xl text-5xl font-bold leading-[0.95] tracking-tight">
            Pool service software
          </h1>
          

          <ul className="mt-8 grid gap-4 text-sm text-slate-200/90">
            <li>Role-based dashboards for owner, ops manager, and field technician.</li>
          </ul>
        </div>
        <Card className="mx-auto w-full max-w-xl rounded-[1.6rem] p-8 md:p-10">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-700">Pool Cleaners Inc.</p>
              
            </div>
          </div>
          <h2 className="font-display mt-6 text-4xl font-bold tracking-tight text-slate-950">Sign in</h2>
          <div className="mt-6 rounded-[1rem] bg-[linear-gradient(135deg,rgba(15,18,63,0.04),rgba(121,216,236,0.14))] p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Quick demo tip</p>
            <p className="mt-1">Start with the owner account for the full view, then switch to a technician to see the field workflow.</p>
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
