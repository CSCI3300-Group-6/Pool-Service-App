"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { useSubmit } from "@/components/forms/use-submit";

type FormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { submit, isPending, error } = useSubmit();

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await submit("/api/auth/login", values, { successPath: "/dashboard" });
      })}
    >
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
        <input {...register("email")} placeholder="john@poolcleaners.test" />
        {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
        <input type="password" {...register("password")} placeholder="demo1234" />
        {errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p> : null}
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        disabled={isPending}
        type="submit"
        className="w-full rounded-2xl bg-[linear-gradient(135deg,#10b981,#059669)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(16,185,129,0.18)] hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
