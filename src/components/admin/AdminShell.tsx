import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardList,
  Cog,
  CreditCard,
  FileText,
  FileStack,
  Flame,
  Gauge,
  History,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Menu,
  Network,
  PieChart,
  Scale,
  Search,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  TableProperties,
  TriangleAlert,
  Users,
  UserCheck,
  UserPlus,
  UserRound,
  Workflow,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, roleDisplayLabel, roleHomePath, setCurrentRole, type UserRole } from "@/lib/auth";
import { COMPLIANCE_ALERTS } from "@/lib/admin-data";
import { toast } from "sonner";

const adminNav = [
  {
    group: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutGrid }],
  },
  {
    group: "Users & Access",
    items: [
      { to: "/admin/users", label: "Users Management", icon: Users },
      { to: "/admin/roles", label: "Roles & Permissions", icon: ShieldCheck },
    ],
  },
  {
    group: "Rule Engine",
    items: [
      { to: "/admin/legal-rules", label: "Legal Rules Management", icon: Scale },
      { to: "/admin/financial-rules", label: "Financial Rules", icon: CreditCard },
      { to: "/admin/debt-solution-rules", label: "Debt Solution Rules", icon: Gauge },
      { to: "/admin/risk-rules", label: "Risk Rules", icon: ShieldAlert },
      { to: "/admin/vulnerability-rules", label: "Vulnerability Rules", icon: ShieldQuestion },
    ],
  },
  {
    group: "Operations",
    items: [
      { to: "/admin/document-templates", label: "Document Templates", icon: FileText },
      { to: "/admin/workflow-builder", label: "Workflow Builder", icon: Workflow },
      { to: "/admin/reminder-settings", label: "Reminder Settings", icon: Bell },
      { to: "/admin/referral-partners", label: "Referral Partners", icon: Network },
    ],
  },
  {
    group: "Integrations & Reporting",
    items: [
      { to: "/admin/integrations", label: "Integrations", icon: Network },
      { to: "/admin/reports", label: "Reports", icon: PieChart },
      { to: "/admin/audit-logs", label: "Audit Logs", icon: History },
    ],
  },
  {
    group: "Platform",
    items: [{ to: "/admin/settings", label: "System Settings", icon: Cog }],
  },
];

function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = getCurrentUser();

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      <div className="px-2 flex items-center justify-between">
        <Logo to="/admin" inverted />
      </div>

      <div className="px-2 py-1.5 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-accent-foreground">
          <Shield className="size-4 text-amber-400" />
          <span>Admin Control Centre</span>
        </div>
        <p className="mt-1 text-[0.68rem] text-sidebar-foreground/70">
          Platform Management • Admin ID: FGA-0001
        </p>
      </div>

      <nav className="flex-1 space-y-6">
        {adminNav.map((section) => (
          <div key={section.group} className="space-y-1">
            <p className="px-3 pb-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
              {section.group}
            </p>
            {section.items.map((item) => {
              const active =
                item.to === "/admin"
                  ? pathname === "/admin" || pathname === "/admin/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to as any}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                    active
                      ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-soft"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon
                    className={`size-4 transition-colors ${
                      active ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/30 p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Compliance Status
          </span>
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" /> 3 Open
          </span>
        </div>
        <p className="text-[0.68rem] leading-relaxed text-sidebar-foreground/70">
          1 critical SRA threshold alert, 2 high-risk escalations awaiting supervisor sign-off.
        </p>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const openAlerts = COMPLIANCE_ALERTS.filter((a) => !a.resolved).length;

  const handleRoleSwitch = (newRole: UserRole) => {
    setCurrentRole(newRole);
    toast.info(`Switched Role to ${roleDisplayLabel(newRole)}`);
    navigate({ to: roleHomePath(newRole) as any });
  };

  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] bg-sidebar text-sidebar-foreground lg:block">
        <AdminSidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[290px] bg-sidebar text-sidebar-foreground">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-5 rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <AdminSidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-5" />
              </Button>

              <button
                className="relative flex h-10 w-64 md:w-96 items-center gap-2 rounded-full border border-border bg-muted/60 px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted"
              >
                <Search className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate">Search users, rules, matters, audit logs…</span>
                <kbd className="ml-auto pointer-events-none hidden rounded border border-border bg-background px-1.5 py-0.5 text-[0.65rem] font-mono font-medium sm:inline-block">
                  Cmd K
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full text-xs font-medium border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/5">
                    Admin Portal
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs">Select Active Demo Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleRoleSwitch("admin")} className="font-semibold text-primary">
                    <Shield className="size-4 mr-2" /> Admin Control Centre (Current)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("supervisor")}>
                    <UserCheck className="size-4 mr-2" /> Supervisor Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("solicitor")}>
                    <ShieldCheck className="size-4 mr-2" /> Solicitor Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("client")}>
                    <UserRound className="size-4 mr-2" /> Client Portal (Amelia Hartley)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Admin Compliance Alerts">
                    <TriangleAlert className="size-5" />
                    {openAlerts > 0 && (
                      <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-rose-600 text-[0.6rem] font-bold text-white">
                        {openAlerts}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96 p-2">
                  <DropdownMenuLabel className="flex items-center justify-between pb-2">
                    <span className="font-semibold text-sm">Compliance & Platform Alerts</span>
                    <Badge variant="secondary" className="text-[0.65rem]">{openAlerts} Open</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                    {COMPLIANCE_ALERTS.slice(0, 6).map((a) => (
                      <button
                        key={a.id}
                        onClick={() => navigate({ to: "/admin" as any })}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                          a.resolved ? "opacity-60" : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground mb-1">
                          <span className={`inline-flex items-center gap-1 font-semibold ${
                            a.severity === "critical" ? "text-rose-600 dark:text-rose-400" :
                            a.severity === "high" ? "text-amber-600 dark:text-amber-400" :
                            a.severity === "medium" ? "text-blue-600 dark:text-blue-400" :
                            "text-emerald-600 dark:text-emerald-400"
                          }`}>
                            <span className={`size-1.5 rounded-full ${
                              a.severity === "critical" ? "bg-rose-500" :
                              a.severity === "high" ? "bg-amber-500" :
                              a.severity === "medium" ? "bg-blue-500" :
                              "bg-emerald-500"
                            }`} />
                            {a.severity.toUpperCase()} · {a.type}
                          </span>
                          <span>{a.timestamp}</span>
                        </div>
                        <p className="font-semibold text-foreground line-clamp-2">{a.message}</p>
                      </button>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="justify-center text-xs font-semibold text-primary">
                    <Link to="/admin/audit-logs">View Audit Logs</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 transition-colors hover:bg-muted">
                    <span className="grid size-8 place-items-center rounded-full gradient-deep text-xs font-bold text-primary-foreground">
                      {user.avatar}
                    </span>
                    <div className="hidden text-left sm:block">
                      <span className="block text-xs font-semibold leading-tight">{user.name}</span>
                      <span className="block text-[0.65rem] text-muted-foreground leading-tight">{user.title}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <span className="block text-sm font-semibold">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">{user.email}</span>
                    <span className="block text-[0.68rem] text-primary mt-0.5">{user.adminId}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" as any })}>
                    <Settings2 className="size-4 mr-2" /> Platform Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("solicitor")}>
                    <UserRound className="size-4 mr-2" /> Switch to Solicitor View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("supervisor")}>
                    <UserCheck className="size-4 mr-2" /> Switch to Supervisor View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("client")}>
                    <UserRound className="size-4 mr-2" /> Switch to Client View
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/login" })}>
                    <LogOut className="size-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] animate-rise px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
