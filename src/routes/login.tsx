import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  DEMO_USERS,
  resolveLoginRole,
  roleDisplayLabel,
  roleHomePath,
  setCurrentRole,
  SOLICITOR_DEMO_CREDENTIALS,
} from "@/lib/auth";
import { getClientLandingPath } from "@/lib/assessment-guard";
import { isAssessmentComplete } from "@/lib/assessment-progress";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FG Debt Advisor AI Legal & Client Portal" },
      {
        name: "description",
        content: "Sign in to FG Debt Advisor AI for Client or Solicitor portals.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const role = resolveLoginRole(email, password);
    setLoading(true);
    setCurrentRole(role);

    setTimeout(() => {
      setLoading(false);
      const user = DEMO_USERS[role];
      const destination = role === "client" ? getClientLandingPath() : roleHomePath(role);
      toast.success(`Welcome back, ${user.name}`, {
        description:
          role === "client" && !isAssessmentComplete()
            ? "Continue your debt assessment to unlock your dashboard."
            : `Signed in to ${roleDisplayLabel(role)}.`,
      });
      navigate({ to: destination as any });
    }, 800);
  };

  return (
    <AuthLayout
      title="Sign in to FG Debt Advisor AI"
      subtitle="Enter your email and password to continue."
      footer={
        <>
          New to FG Debt Advisor AI?{" "}
          <Link to="/register" className="font-semibold text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Demo Solicitor Login</p>
          <p className="mt-1">
            Email:{" "}
            <span className="font-mono text-foreground">{SOLICITOR_DEMO_CREDENTIALS.email}</span>
          </p>
          <p>
            Password:{" "}
            <span className="font-mono text-foreground">{SOLICITOR_DEMO_CREDENTIALS.password}</span>
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.co.uk"
            autoComplete="email"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <label className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <Checkbox id="remember" defaultChecked /> Keep me signed in on this device
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
