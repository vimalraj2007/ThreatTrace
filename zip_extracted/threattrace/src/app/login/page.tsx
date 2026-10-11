"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldAlert } from "lucide-react";
import { Btn } from "@/components/ui";

const schema = z.object({ email: z.string().email("Enter a valid work email."), password: z.string().min(8, "Password must be at least 8 characters."), remember: z.boolean().optional() });
type F = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) });
  const go = (demo: boolean) => { if (demo) localStorage.setItem("tt_demo", "1"); else localStorage.removeItem("tt_demo"); router.push("/dashboard"); };
  const field = "mt-1 w-full rounded border border-line bg-bg px-3 py-2 text-sm focus:border-accent focus:outline-none";
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm rounded-md border border-line bg-panel p-7">
        <div className="mb-6 flex items-center gap-2"><ShieldAlert className="h-6 w-6 text-accent" /><span className="text-xl font-semibold">ThreatTrace</span></div>
        <p className="mb-6 text-sm text-mute">Sign in as a SOC analyst to reconstruct attack chains from fragmented telemetry.</p>
        <form onSubmit={handleSubmit(async () => go(false))} className="space-y-4" noValidate>
          <div><label htmlFor="email" className="text-xs text-mute">Email</label><input id="email" type="email" autoComplete="username" className={field} {...register("email")} />{errors.email && <p className="mt-1 text-xs text-crit">{errors.email.message}</p>}</div>
          <div><label htmlFor="pw" className="text-xs text-mute">Password</label><input id="pw" type="password" autoComplete="current-password" className={field} {...register("password")} />{errors.password && <p className="mt-1 text-xs text-crit">{errors.password.message}</p>}</div>
          <label className="flex items-center gap-2 text-xs text-mute"><input type="checkbox" {...register("remember")} />Remember me</label>
          <Btn variant="primary" type="submit" disabled={isSubmitting} className="w-full justify-center">Sign in</Btn>
        </form>
        <div className="my-5 h-px bg-line" />
        <Btn onClick={() => go(true)} className="w-full justify-center">Continue with Demo Investigation</Btn>
      </div>
    </div>
  );
}
