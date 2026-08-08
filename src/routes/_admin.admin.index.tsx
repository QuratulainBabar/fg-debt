import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Cpu,
  FileText,
  Filter,
  History,
  LayoutList,
  Network,
  Plus,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  TableProperties,
  TriangleAlert,
  Users,
  UserCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import { SolicitorStatCard } from "@/components/solicitor/SolicitorStatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ADMIN_USERS,
  COMPLIANCE_ALERTS,
  RECENT_ACTIONS,
  INTEGRATIONS,
  SYSTEM_ACTIVITY,
  getAdminKPIMetrics,
  TOTAL_MATTERS,
} from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — FG Debt Advisor AI" },
      { name: "description", content: "Platform management, configuration and monitoring for the FG Debt Advisor AI platform." },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const metrics = getAdminKPIMetrics();
  const navigate = useNavigate();

  const roleDistribution = [
    { name: "Clients", value: metrics.totalUsers - 13, fill: "var(--color-chart-1)" },
    { name: "Solicitors", value: 8, fill: "var(--color-chart-2)" },
    { name: "Supervisors", value: 3, fill: "var(--color-chart-3)" },
    { name: "Admins", value: 2, fill: "var(--color-chart-5)" },
  ];

  const severityBreakdown = [
    { level: "Critical", count: COMPLIANCE_ALERTS.filter(a => a.severity === "critical" && !a.resolved).length, fill: "#EF4444" },
    { level: "High", count: COMPLIANCE_ALERTS.filter(a => a.severity === "high" && !a.resolved).length, fill: "#F59E0B" },
    { level: "Medium", count: COMPLIANCE_ALERTS.filter(a => a.severity === "medium" && !a.resolved).length, fill: "#3B82F6" },
    { level: "Low", count: COMPLIANCE_ALERTS.filter(a => a.severity === "low" && !a.resolved).length, fill: "#10B981" },
  ].filter(b => b.count > 0);

  const unresolvedAlerts = COMPLIANCE_ALERTS.filter(a => !a.resolved);
  const resolvedAlerts = COMPLIANCE_ALERTS.filter(a => a.resolved);

  const categoryIcons: Record<string, any> = {
    user: Users, matter: Scale, document: FileText, rule: Shield, system: Cpu,
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
              Admin Control Centre
            </h1>
            <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/5 font-mono text-xs">
              Platform Governance · v4.2
            </Badge>
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 font-mono text-xs">
              SRA Audited
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform-wide overview, user management, rule engine configuration, and compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link to="/admin/audit-logs">
              <History className="size-4 mr-1.5" /> Audit Trail
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Link to="/admin/users">
              <UserPlus className="size-4 mr-1.5" /> Invite User
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Platform Performance Metrics
          </h2>
          <span className="text-xs text-muted-foreground">Live • Updated every 30s</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          <SolicitorStatCard
            label="Total Users"
            value={metrics.totalUsers.toLocaleString()}
            icon={Users}
            trend="+124 this week"
            statusColor="blue"
            onClick={() => navigate({ to: "/admin/users" as any })}
          />
          <SolicitorStatCard
            label="Active Clients"
            value={metrics.activeClients}
            icon={UserCheck}
            trend="On portal today"
            statusColor="emerald"
            onClick={() => navigate({ to: "/admin/users" as any })}
          />
          <SolicitorStatCard
            label="Active Solicitors"
            value={metrics.activeSolicitors}
            icon={ShieldCheck}
            trend="SRA regulated"
            statusColor="blue"
            onClick={() => navigate({ to: "/admin/users" as any })}
          />
          <SolicitorStatCard
            label="Active Supervisors"
            value={metrics.activeSupervisors}
            icon={Shield}
            trend="Override authority"
            statusColor="purple"
            onClick={() => navigate({ to: "/admin/users" as any })}
          />
          <SolicitorStatCard
            label="Total Matters"
            value={TOTAL_MATTERS}
            icon={TableProperties}
            trend="+18 since Monday"
            statusColor="emerald"
            onClick={() => navigate({ to: "/admin/reports" as any })}
          />
          <SolicitorStatCard
            label="Compliance Alerts"
            value={metrics.complianceOpen}
            icon={TriangleAlert}
            trend={`${metrics.complianceCritical} critical`}
            statusColor="rose"
            onClick={() => navigate({ to: "/admin/audit-logs" as any })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2 space-y-6">
          <Card className="surface-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Activity className="size-5 text-primary" />
                  System Activity — Last 24 Hours
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  User sessions, matter creation, and document processing throughput across the platform.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" /> Users
                </span>
                <span className="inline-flex items-center gap-1.5 ml-2">
                  <span className="size-2 rounded-full bg-emerald-500" /> Matters
                </span>
                <span className="inline-flex items-center gap-1.5 ml-2">
                  <span className="size-2 rounded-full bg-amber-500" /> Documents
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SYSTEM_ACTIVITY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMatters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="var(--color-primary)" fill="url(#colorUsers)" strokeWidth={2.2} />
                  <Area type="monotone" dataKey="matters" stroke="#10B981" fill="url(#colorMatters)" strokeWidth={2} />
                  <Area type="monotone" dataKey="docs" stroke="#F59E0B" fill="transparent" strokeWidth={2} strokeDasharray="4 3" />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <ShieldAlert className="size-5 text-rose-500" />
                  Compliance Alerts & Risk Warnings
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Regulatory, SRA mandate, and vulnerability escalation items requiring administrative attention.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[0.7rem]">{unresolvedAlerts.length} Open</Badge>
                <Badge variant="outline" className="text-[0.7rem] text-muted-foreground">{resolvedAlerts.length} Resolved</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold w-24">Severity</TableHead>
                    <TableHead className="text-xs font-semibold">Alert</TableHead>
                    <TableHead className="text-xs font-semibold">Assignee</TableHead>
                    <TableHead className="text-xs font-semibold">Time</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unresolvedAlerts.map((alert) => (
                    <TableRow key={alert.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="py-3 align-top">
                        <Badge
                          variant={
                            alert.severity === "critical"
                              ? "destructive"
                              : alert.severity === "high"
                              ? "default"
                              : alert.severity === "medium"
                              ? "secondary"
                              : "outline"
                          }
                          className={`text-[0.65rem] capitalize ${
                            alert.severity === "high"
                              ? "!bg-amber-500 !text-white border-amber-50-foreground"
                              : ""
                          }`}
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-xs font-semibold text-foreground">{alert.type}</div>
                        <div className="text-[0.7rem] text-muted-foreground mt-0.5 leading-relaxed">{alert.message}</div>
                        {alert.matterId && (
                          <span className="inline-flex items-center text-[0.65rem] text-primary font-mono mt-1">
                          {alert.matterId}
                        </span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-xs">
                        <div>{alert.assignee ?? "Unassigned"}</div>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {alert.timestamp}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() => navigate({ to: "/admin/audit-logs" as any })}
                        >
                          Review <ArrowUpRight className="size-3.5 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <History className="size-5 text-primary" />
                  Recent Platform Actions
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Latest user, rule, matter and document events captured in the audit trail.
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs rounded-lg">
                <Link to="/admin/audit-logs">Full Audit Logs</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Actor</TableHead>
                  <TableHead className="text-xs font-semibold">Category</TableHead>
                  <TableHead className="text-xs font-semibold">Action</TableHead>
                  <TableHead className="text-xs font-semibold">Target</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Timestamp</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_ACTIONS.slice(0, 7).map((a) => {
                  const CatIcon = categoryIcons[a.category] ?? Activity;
                  return (
                    <TableRow key={a.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="py-3">
                        <div className="text-xs font-semibold text-foreground">{a.actor}</div>
                        <div className="text-[0.65rem] text-muted-foreground">{a.role}</div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                          <CatIcon className="size-3.5 text-primary" /> {a.category}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-foreground">{a.action}</TableCell>
                      <TableCell className="py-3 text-xs font-mono text-primary">{a.target}</TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground text-right whitespace-nowrap">{a.timestamp}</TableCell>
                    </TableRow>
                  );
                })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center justify-between">
                <span>Users by Role</span>
                <Badge variant="secondary" className="text-[0.65rem]">Access Control</Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Role distribution across the platform user base.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`role-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`${val} Users`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2 pt-3 border-t border-border">
                {roleDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-semibold">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {severityBreakdown.length > 0 && (
            <Card className="surface-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Alert Severity Mix</CardTitle>
                <CardDescription className="text-xs">
                  Open compliance cases by severity level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityBreakdown} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="level" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {severityBreakdown.map((entry, i) => (
                          <Cell key={`sev-${i}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="surface-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Network className="size-4 text-primary" />
                  Integration Status
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {metrics.operationalIntegrations} operational, {metrics.degradedIntegrations} degraded.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs rounded-lg h-7 px-2">
                <Link to="/admin/integrations">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {INTEGRATIONS.map((i) => (
                <div key={i.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`size-2 shrink-0 rounded-full ${
                      i.status === "operational" ? "bg-emerald-500" :
                      i.status === "degraded" ? "bg-amber-500 animate-pulse" :
                      "bg-rose-500 animate-pulse"
                    }`} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">{i.name}</div>
                      <div className="text-[0.65rem] text-muted-foreground">{i.category}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-[0.65rem] font-semibold ${
                      i.status === "operational" ? "text-emerald-600 dark:text-emerald-400" :
                      i.status === "degraded" ? "text-amber-600 dark:text-amber-400" :
                      "text-rose-600 dark:text-rose-400"
                    } capitalize`}>
                      {i.status === "operational" ? "Online" : i.status === "degraded" ? "Slow" : "Offline"}
                    </div>
                    <div className="text-[0.6rem] text-muted-foreground">{i.uptime}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Platform Health</CardTitle>
              <CardDescription className="text-xs">Core operational indicators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">AI Engine Uptime</span>
                  <span className="font-semibold">99.97%</span>
                </div>
                <Progress value={99.97} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">SLA Compliance</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">98.4%</span>
                </div>
                <Progress value={98.4} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">OCR Document Success</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">94.1%</span>
                </div>
                <Progress value={94.1} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Backup Coverage</span>
                  <span className="font-semibold">100%</span>
                </div>
                <Progress value={100} className="h-1.5" />
              </div>
              <div className="pt-2 mt-1 border-t border-border flex items-center justify-between text-[0.7rem] text-muted-foreground">
                <span>Last platform backup</span>
                <span className="font-mono">04:00 today · Success</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
