import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  History,
  Scale,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { SolicitorStatCard } from "@/components/solicitor/SolicitorStatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  COMPLIANCE_ALERTS,
  getHighRiskMatters,
  getSupervisorKPIMetrics,
  SOLICITOR_DECISIONS,
  SUPERVISOR_OVERRIDES,
  SENSITIVE_APPROVALS,
} from "@/lib/supervisor-data";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_supervisor/supervisor/")({
  head: () => ({
    meta: [
      { title: "Supervisor Dashboard — FG Debt Advisor AI" },
      {
        name: "description",
        content: "Supervising solicitor oversight for high-risk cases, AI overrides, compliance and quality reviews.",
      },
    ],
  }),
  component: SupervisorDashboardPage,
});

function SupervisorDashboardPage() {
  const metrics = getSupervisorKPIMetrics();
  const navigate = useNavigate();
  const highRisk = getHighRiskMatters();
  const pendingOverrides = SUPERVISOR_OVERRIDES.filter((o) => o.status === "awaiting_signoff" || o.status === "escalated");
  const openCompliance = COMPLIANCE_ALERTS.filter((a) => !a.resolved);
  const decisionsNeedingReview = SOLICITOR_DECISIONS.filter((d) => d.requiresSupervisorReview);
  const pendingSensitive = SENSITIVE_APPROVALS.filter((s) => s.status === "pending");

  const oversightMix = [
    { name: "High Risk", value: metrics.highRiskCases, fill: "#EF4444" },
    { name: "Overrides", value: metrics.aiOverridesPending, fill: "#8B5CF6" },
    { name: "Sensitive", value: metrics.sensitiveApprovals, fill: "#F59E0B" },
    { name: "Compliance", value: metrics.complianceIssues, fill: "#3B82F6" },
  ];

  const decisionBars = [
    { label: "Approve", count: SOLICITOR_DECISIONS.filter((d) => d.outcome === "approve").length, fill: "#10B981" },
    { label: "Amend", count: SOLICITOR_DECISIONS.filter((d) => d.outcome === "amend").length, fill: "#3B82F6" },
    { label: "Reject", count: SOLICITOR_DECISIONS.filter((d) => d.outcome === "reject").length, fill: "#F59E0B" },
    { label: "Override", count: SOLICITOR_DECISIONS.filter((d) => d.outcome === "override").length, fill: "#8B5CF6" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
              Supervisor Dashboard
            </h1>
            <Badge variant="outline" className="border-violet-500/40 text-violet-700 dark:text-violet-300 bg-violet-500/5 font-mono text-xs">
              Supervising Solicitor · SRA Oversight
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            High-risk case oversight, solicitor decision review, AI override sign-off, and compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link to="/supervisor/audit">
              <History className="size-4 mr-1.5" /> Audit History
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Link to="/supervisor/ai-overrides">
              <Sparkles className="size-4 mr-1.5" /> Review Overrides
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Supervisor Oversight Metrics
          </h2>
          <span className="text-xs text-muted-foreground">Live • Updated every 30s</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
          <SolicitorStatCard
            label="High-Risk Cases"
            value={metrics.highRiskCases}
            icon={ShieldAlert}
            trend="Escalated"
            statusColor="rose"
            onClick={() => navigate({ to: "/supervisor/high-risk" as any })}
          />
          <SolicitorStatCard
            label="Solicitor Decisions"
            value={metrics.solicitorDecisionsPending}
            icon={Scale}
            trend="Need review"
            statusColor="amber"
            onClick={() => navigate({ to: "/supervisor/solicitor-decisions" as any })}
          />
          <SolicitorStatCard
            label="AI Overrides"
            value={metrics.aiOverridesPending}
            icon={Sparkles}
            trend="Sign-off due"
            statusColor="purple"
            onClick={() => navigate({ to: "/supervisor/ai-overrides" as any })}
          />
          <SolicitorStatCard
            label="Compliance Issues"
            value={metrics.complianceIssues}
            icon={TriangleAlert}
            trend="Open alerts"
            statusColor="rose"
            onClick={() => navigate({ to: "/supervisor/compliance" as any })}
          />
          <SolicitorStatCard
            label="Sensitive Approvals"
            value={metrics.sensitiveApprovals}
            icon={FileCheck2}
            trend="Awaiting you"
            statusColor="amber"
            onClick={() => navigate({ to: "/supervisor/sensitive-approvals" as any })}
          />
          <SolicitorStatCard
            label="Audit Events Today"
            value={metrics.auditEventsToday}
            icon={History}
            trend="Immutable log"
            statusColor="blue"
            onClick={() => navigate({ to: "/supervisor/audit" as any })}
          />
          <SolicitorStatCard
            label="Quality Reviews"
            value={metrics.qualityReviewsOpen}
            icon={ClipboardCheck}
            trend="In progress"
            statusColor="blue"
            onClick={() => navigate({ to: "/supervisor/quality-reviews" as any })}
          />
          <SolicitorStatCard
            label="Platform Health"
            value={`${metrics.platformHealth}%`}
            icon={Gauge}
            trend="Sign-off rate"
            statusColor="emerald"
            onClick={() => navigate({ to: "/supervisor/performance" as any })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center justify-between">
                <span>Oversight Mix</span>
                <Badge variant="secondary" className="text-[0.65rem]">Queues</Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Open supervisor workloads across high-risk, overrides, sensitive and compliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={oversightMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {oversightMix.map((entry, index) => (
                        <Cell key={`mix-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`${val} items`, "Open"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border text-xs">
                {oversightMix.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                    <span className="font-semibold ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Solicitor Decision Outcomes</CardTitle>
              <CardDescription className="text-xs">
                Recent solicitor decision pattern across the team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={decisionBars} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {decisionBars.map((entry, index) => (
                        <Cell key={`dec-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="surface-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Sparkles className="size-5 text-violet-500" />
                  AI Overrides Awaiting Sign-off
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Solicitor overrides of AI recommendations requiring supervising solicitor approval.
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs rounded-lg">
                <Link to="/supervisor/ai-overrides">View All ({pendingOverrides.length})</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold">Matter</TableHead>
                    <TableHead className="text-xs font-semibold">AI → Override</TableHead>
                    <TableHead className="text-xs font-semibold">Solicitor</TableHead>
                    <TableHead className="text-xs font-semibold">SLA</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOverrides.map((o) => (
                    <TableRow key={o.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="py-3">
                        <div className="font-semibold text-sm text-foreground">{o.clientName}</div>
                        <div className="text-[0.7rem] text-muted-foreground font-mono">{o.matterId}</div>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-[0.62rem] capitalize ${
                            o.riskLevel === "critical"
                              ? "border-rose-500 text-rose-600 bg-rose-500/10"
                              : "border-amber-500 text-amber-600 bg-amber-500/10"
                          }`}
                        >
                          {o.riskLevel} risk
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs">
                        <div className="text-muted-foreground line-through">{o.aiRecommendation}</div>
                        <div className="font-medium text-foreground">{o.overrideSolution}</div>
                      </TableCell>
                      <TableCell className="py-3 text-xs">{o.solicitor}</TableCell>
                      <TableCell className="py-3 text-xs">
                        <span className={o.slaHoursRemaining <= 2 ? "text-rose-600 font-semibold" : "text-muted-foreground"}>
                          {o.slaHoursRemaining > 0 ? `${o.slaHoursRemaining}h left` : "Overdue"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate({ to: "/supervisor/ai-overrides" as any })}
                          className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Sign off <ArrowUpRight className="size-3.5 ml-1" />
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
                  <ShieldAlert className="size-5 text-rose-500" />
                  High-Risk Cases & Compliance
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Critical/high risk matters and open compliance alerts requiring supervisor attention.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="text-xs rounded-lg">
                  <Link to="/supervisor/high-risk">High Risk ({highRisk.length})</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-xs rounded-lg">
                  <Link to="/supervisor/compliance">Compliance ({openCompliance.length})</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold">Item</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Detail</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highRisk.slice(0, 3).map((m) => (
                    <TableRow key={m.id} className="group hover:bg-muted/50">
                      <TableCell className="py-3">
                        <div className="font-semibold text-sm">{m.clientName}</div>
                        <div className="text-[0.7rem] font-mono text-muted-foreground">{m.id}</div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={`text-[0.62rem] capitalize ${
                            m.riskLevel === "critical"
                              ? "border-rose-500 text-rose-600 bg-rose-500/10"
                              : "border-amber-500 text-amber-600 bg-amber-500/10"
                          }`}
                        >
                          {m.riskLevel} risk
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">{m.nextRequiredAction}</TableCell>
                      <TableCell className="py-3 text-right">
                        <Button size="sm" variant="secondary" className="text-xs" onClick={() => navigate({ to: "/supervisor/high-risk" as any })}>
                          Review <ArrowUpRight className="size-3.5 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {openCompliance.slice(0, 2).map((a) => (
                    <TableRow key={a.id} className="group hover:bg-muted/50">
                      <TableCell className="py-3">
                        <div className="font-semibold text-sm">{a.type}</div>
                        <div className="text-[0.7rem] font-mono text-muted-foreground">{a.id}</div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant={a.severity === "critical" ? "destructive" : "default"} className="text-[0.62rem] capitalize">
                          {a.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground line-clamp-2">{a.message}</TableCell>
                      <TableCell className="py-3 text-right">
                        <Button size="sm" variant="secondary" className="text-xs" onClick={() => navigate({ to: "/supervisor/compliance" as any })}>
                          Open <ArrowUpRight className="size-3.5 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="surface-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Decisions needing review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {decisionsNeedingReview.slice(0, 3).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigate({ to: "/supervisor/solicitor-decisions" as any })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-left text-xs hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{d.clientName}</span>
                      <Badge variant="secondary" className="text-[0.62rem] capitalize">{d.outcome}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground line-clamp-1">{d.notes}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card className="surface-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Sensitive approvals pending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingSensitive.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate({ to: "/supervisor/sensitive-approvals" as any })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-left text-xs hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{s.clientName}</span>
                      <Badge variant="outline" className="text-[0.62rem] capitalize">{s.category.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground line-clamp-1">{s.summary}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
