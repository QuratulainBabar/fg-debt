import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Bell,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  History,
  LayoutGrid,
  LogOut,
  Menu,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserCheck,
  UserRound,
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
import { getCurrentUser, setCurrentRole, type UserRole } from "@/lib/auth";
import { SUPERVISOR_NOTIFICATIONS } from "@/lib/supervisor-data";
import { toast } from "sonner";

const supervisorNav = [
  {
    group: "Overview",
    items: [{ to: "/supervisor", label: "Dashboard", icon: LayoutGrid }],
  },
  {
    group: "Case Oversight",
    items: [
      { to: "/supervisor/high-risk", label: "High-Risk Cases", icon: ShieldAlert },
      { to: "/supervisor/solicitor-decisions", label: "Solicitor Decisions", icon: Scale },
      { to: "/supervisor/ai-overrides", label: "AI Overrides", icon: Sparkles },
      { to: "/supervisor/sensitive-approvals", label: "Sensitive Case Approvals", icon: FileCheck2 },
    ],
  },
  {
    group: "Compliance & Quality",
    items: [
      { to: "/supervisor/compliance", label: "Compliance Issues", icon: TriangleAlert },
      { to: "/supervisor/quality-reviews", label: "Matter Quality Reviews", icon: ClipboardCheck },
      { to: "/supervisor/audit", label: "Audit History", icon: History },
    ],
  },
  {
    group: "Insights",
    items: [{ to: "/supervisor/performance", label: "Platform Performance", icon: Gauge }],
  },
];

function roleDestination(role: UserRole) {
  if (role === "client") return "/dashboard";
  if (role === "solicitor") return "/solicitor";
  if (role === "supervisor") return "/supervisor";
  return "/admin";
}

function roleLabel(role: UserRole) {
  if (role === "client") return "Client Portal";
  if (role === "solicitor") return "Solicitor Dashboard";
  if (role === "supervisor") return "Supervisor Dashboard";
  return "Admin Control Centre";
}

function SupervisorSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      <div className="px-2 flex items-center justify-between">
        <Logo to="/supervisor" inverted />
      </div>

      <div className="px-2 py-1.5 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-accent-foreground">
          <ShieldCheck className="size-4 text-violet-400" />
          <span>Supervising Solicitor Portal</span>
        </div>
        <p className="mt-1 text-[0.68rem] text-sidebar-foreground/70">
          Oversight · Override Sign-off · Compliance
        </p>
      </div>

      <nav className="flex-1 space-y-6">
        {supervisorNav.map((section) => (
          <div key={section.group} className="space-y-1">
            <p className="px-3 pb-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
              {section.group}
            </p>
            {section.items.map((item) => {
              const active =
                item.to === "/supervisor"
                  ? pathname === "/supervisor" || pathname === "/supervisor/"
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
            Sign-off Queue
          </span>
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-violet-300">
            <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" /> 3 Pending
          </span>
        </div>
        <p className="text-[0.68rem] leading-relaxed text-sidebar-foreground/70">
          AI overrides and sensitive cases await supervising solicitor approval under SRA mandate.
        </p>
      </div>
    </div>
  );
}

export function SupervisorShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const unreadNotifs = SUPERVISOR_NOTIFICATIONS.filter((n) => n.unread).length;

  const handleRoleSwitch = (newRole: UserRole) => {
    setCurrentRole(newRole);
    toast.info(`Switched Role to ${roleLabel(newRole)}`);
    navigate({ to: roleDestination(newRole) as any });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] bg-sidebar text-sidebar-foreground lg:block">
        <SupervisorSidebarContent />
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
            <SupervisorSidebarContent onNavigate={() => setMobileOpen(false)} />
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

              <button className="relative flex h-10 w-64 md:w-96 items-center gap-2 rounded-full border border-border bg-muted/60 px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate">Search high-risk matters, overrides, compliance…</span>
                <kbd className="ml-auto pointer-events-none hidden rounded border border-border bg-background px-1.5 py-0.5 text-[0.65rem] font-mono font-medium sm:inline-block">
                  Cmd K
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex rounded-full text-xs font-medium border-violet-500/40 text-violet-700 dark:text-violet-300 bg-violet-500/5"
                  >
                    Supervisor Portal
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs">Select Active Demo Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleRoleSwitch("admin")}>
                    <Shield className="size-4 mr-2" /> Admin Control Centre
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("supervisor")} className="font-semibold text-primary">
                    <ShieldCheck className="size-4 mr-2" /> Supervisor Dashboard (Current)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("solicitor")}>
                    <UserCheck className="size-4 mr-2" /> Solicitor Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("client")}>
                    <UserRound className="size-4 mr-2" /> Client Portal (Amelia Hartley)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Supervisor Notifications">
                    <Bell className="size-5" />
                    {unreadNotifs > 0 && (
                      <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-rose-600 text-[0.6rem] font-bold text-white">
                        {unreadNotifs}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96 p-2">
                  <DropdownMenuLabel className="flex items-center justify-between pb-2">
                    <span className="font-semibold text-sm">Supervisor Alerts</span>
                    <Badge variant="secondary" className="text-[0.65rem]">{unreadNotifs} Unread</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                    {SUPERVISOR_NOTIFICATIONS.map((n) => (
                      <button
                        key={n.id}
                        onClick={() =>
                          navigate({
                            to: (n.severity === "critical" ? "/supervisor/ai-overrides" : "/supervisor/compliance") as any,
                          })
                        }
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                          n.unread ? "bg-primary/5 font-medium" : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground mb-1">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              n.severity === "critical"
                                ? "text-rose-600 dark:text-rose-400"
                                : n.severity === "high"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            <AlertTriangle className="size-3" />
                            {n.severity.toUpperCase()}
                          </span>
                          <span>{n.timestamp}</span>
                        </div>
                        <p className="font-semibold text-foreground">{n.title}</p>
                        <p className="text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                      </button>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="justify-center text-xs font-semibold text-primary">
                    <Link to="/supervisor/compliance">View Compliance Issues</Link>
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
                    <span className="block text-[0.68rem] text-primary mt-0.5">{user.sraNumber}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleRoleSwitch("solicitor")}>
                    <UserCheck className="size-4 mr-2" /> Switch to Solicitor View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("admin")}>
                    <Shield className="size-4 mr-2" /> Switch to Admin View
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
