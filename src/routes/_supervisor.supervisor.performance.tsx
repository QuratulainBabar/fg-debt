import { createFileRoute } from "@tanstack/react-router";
import { Gauge } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PLATFORM_PERFORMANCE } from "@/lib/supervisor-data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_supervisor/supervisor/performance")({
  head: () => ({ meta: [{ title: "Platform Performance — Supervisor Dashboard" }] }),
  component: PlatformPerformancePage,
});

function PlatformPerformancePage() {
  const { kpis, activity, solicitorLoad } = PLATFORM_PERFORMANCE;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Supervisor / Insights"
        title="Platform Performance"
        description="Operational indicators for supervising solicitors — review turnaround, override sign-off, quality pass rate and team load."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: "Avg review (hrs)", value: kpis.avgReviewTurnaroundHrs },
          { label: "Override sign-off", value: `${kpis.overrideSignOffRate}%` },
          { label: "Quality pass rate", value: `${kpis.qualityPassRate}%` },
          { label: "Open compliance", value: kpis.complianceOpen },
          { label: "Decisions (24h)", value: kpis.solicitorDecisionVolume24h },
          { label: "High-risk open", value: kpis.highRiskOpen },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4">
              <div className="text-xl font-display font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="surface-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Gauge className="size-5 text-primary" /> System Activity — Last 24 Hours
            </CardTitle>
            <CardDescription className="text-xs">Users, matters and documents processed across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="supUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="var(--color-primary)" fill="url(#supUsers)" strokeWidth={2.2} />
                  <Area type="monotone" dataKey="matters" stroke="#10B981" fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="docs" stroke="#F59E0B" fill="transparent" strokeWidth={2} strokeDasharray="4 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Health Indicators</CardTitle>
            <CardDescription className="text-xs">Supervisor-facing operational targets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Override sign-off rate</span>
                <span className="font-semibold">{kpis.overrideSignOffRate}%</span>
              </div>
              <Progress value={kpis.overrideSignOffRate} className="h-1.5" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Quality pass rate</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{kpis.qualityPassRate}%</span>
              </div>
              <Progress value={kpis.qualityPassRate} className="h-1.5" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Review SLA adherence</span>
                <span className="font-semibold">91%</span>
              </div>
              <Progress value={91} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Solicitor Team Load</CardTitle>
          <CardDescription className="text-xs">Active matters, overrides submitted and quality scores by solicitor.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solicitorLoad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="matters" radius={[6, 6, 0, 0]}>
                  {solicitorLoad.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#1C2B48" : i === 1 ? "#8EB1D1" : "#A7C7E7"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Solicitor</TableHead>
                <TableHead className="text-xs font-semibold">Matters</TableHead>
                <TableHead className="text-xs font-semibold">Overrides</TableHead>
                <TableHead className="text-xs font-semibold">Quality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitorLoad.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="py-3 text-xs font-semibold">{s.name}</TableCell>
                  <TableCell className="py-3 text-xs">{s.matters}</TableCell>
                  <TableCell className="py-3 text-xs">
                    <Badge variant="outline" className="text-[0.65rem]">{s.overrides}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-semibold">{s.quality}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
