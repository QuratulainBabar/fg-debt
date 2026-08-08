import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn, Shield, ShieldCheck, UserRound } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DEMO_USERS, roleDisplayLabel, roleHomePath, setCurrentRole, type UserRole } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FG Debt Advisor AI Legal & Client Portal" },
      {
        name: "description",
        content: "Sign in to FG Debt Advisor AI for Client, Solicitor or Supervisor portals.",
      },
    ],
  }),
  component: LoginPage,
});

const LOGIN_ROLES: UserRole[] = ["solicitor", "supervisor", "client"];

function LoginPage() {
  const [role, setRole] = useState<UserRole>("solicitor");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(DEMO_USERS.solicitor.email);
  const [password, setPassword] = useState("Demo123456");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleRoleChange = (newRole: string) => {
    const r = newRole as UserRole;
    setRole(r);
    setEmail(DEMO_USERS[r].email);
    setPassword("Demo123456");
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setCurrentRole(role);

    setTimeout(() => {
      setLoading(false);
      const user = DEMO_USERS[role];
      toast.success(`Welcome back, ${user.name}`, {
        description: `Signed in to ${roleDisplayLabel(role)}.`,
      });
      navigate({ to: roleHomePath(role) as any });
    }, 800);
  };

  return (
    <AuthLayout
      title="Sign in to FG Debt Advisor AI"
      subtitle="Select demo portal role to sign in."
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
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Select Portal Role
          </Label>
          <Tabs value={role} onValueChange={handleRoleChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto gap-1 p-1">
              <TabsTrigger value="solicitor" className="flex items-center gap-1 text-[0.7rem] px-1 py-2">
                <ShieldCheck className="size-3.5 text-primary shrink-0" /> Solicitor
              </TabsTrigger>
              <TabsTrigger value="supervisor" className="flex items-center gap-1 text-[0.7rem] px-1 py-2">
                <Shield className="size-3.5 text-violet-600 shrink-0" /> Supervisor
              </TabsTrigger>
              <TabsTrigger value="client" className="flex items-center gap-1 text-[0.7rem] px-1 py-2">
                <UserRound className="size-3.5 text-accent-foreground shrink-0" /> Client
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs space-y-1">
          <div className="flex items-center justify-between font-semibold text-primary">
            <span>Demo Credential Auto-Filled</span>
            <span className="text-[0.65rem] uppercase tracking-wider font-mono">{role.toUpperCase()} MODE</span>
          </div>
          <p className="text-muted-foreground">
            {DEMO_USERS[role].name} ({DEMO_USERS[role].title}
            {DEMO_USERS[role].sraNumber ? ` • ${DEMO_USERS[role].sraNumber}` : ""}
            {DEMO_USERS[role].reference ? ` • ${DEMO_USERS[role].reference}` : ""})
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
            {loading ? "Signing in…" : `Sign in as ${LOGIN_ROLES.includes(role) ? roleDisplayLabel(role).replace(" Dashboard", "").replace(" Portal", "") : role}`}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
