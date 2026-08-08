import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, PieChart, FileBarChart, FileCheck, FileText, Calendar, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const solutionReport = [
  { month: "Mar", DRO: 42, IVA: 18, DMP: 56, BS: 8 },
  { month: "Apr", DRO: 58, IVA: 24, DMP: 62, BS: 12 },
  { month: "May", DRO: 64, IVA: 31, DMP: 68, BS: 15 },
  { month: "Jun", DRO: 72, IVA: 29, DMP: 74, BS: 21 },
  { month: "Jul", DRO: 81, IVA: 36, DMP: 82, BS: 28 },
  { month: "Aug", DRO: 94, IVA: 40, DMP: 91, BS: 34 },
];

const reports = [
  { id: "RPT-01", name: "SRA Quarterly Compliance Pack", freq: "Quarterly", lastRun: "01 Jul 2026", category: "Regulatory", format: "PDF + XLSX" },
  { id: "RPT-02", name: "Matter Outcome Analysis", freq: "Monthly", lastRun: "01 Aug 2026", category: "Performance", format: "XLSX" },
  { id: "RPT-03", name: "AI Recommendation vs Solicitor Decision", freq: "Weekly", lastRun: "04 Aug 2026", category: "AI Governance", format: "PDF" },
  { id: "RPT-04", name: "Vulnerability Flag Report", freq: "Monthly", lastRun: "01 Aug 2026", category: "FCA Compliance", format: "PDF + CSV" },
  { id: "RPT-05", name: "Solicitor Caseload & SLA", freq: "Weekly", lastRun: "05 Aug 2026", category: "Operations", format: "XLSX" },
  { id: "RPT-06", name: "Referral Partner Conversion", freq: "Monthly", lastRun: "01 Aug 2026", category: "Partners", format: "XLSX" },
  { id: "RPT-07", name: "Document Template Usage", freq: "Monthly", lastRun: "01 Aug 2026", category: "Operations", format: "CSV" },
  { id: "RPT-08", name: "GDPR Data Retention Review", freq: "Quarterly", lastRun: "01 Jul 2026", category: "Data Privacy", format: "PDF + XLSX" },
];

export const Route = createFileRoute("/_admin/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — FG Debt Advisor AI" }] }),
  component: AdminReportsPage,
});

function AdminReportsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Integrations & Reporting"
        title="Reports & Analytics"
        description="Schedule, run, and export SRA compliance reports, matter outcome analysis, AI governance metrics, and operational performance dashboards."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Calendar className="size-4 mr-1.5" /> Schedule Report
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Reports Library", value: reports.length, icon: FileBarChart, color: "primary" },
          { label: "Scheduled", value: 12, icon: Calendar, color: "blue" },
          { label: "Run This Week", value: 48, icon: PieChart, color: "emerald" },
          { label: "Pending SRA", value: 2, icon: FileCheck, color: "amber" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }`}>
                <s.icon className="size-5" />
              </div>
              <div>
                <div className="text-xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground font-semibold">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Solution Outcomes — Last 6 Months</CardTitle>
          <CardDescription className="text-xs">Approved solutions across all active matters by solicitor sign-off.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solutionReport} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="DRO" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="IVA" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="DMP" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="BS" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Report Library</CardTitle>
          <CardDescription className="text-xs">Browse, run, schedule, and download standardised reporting packages.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {reports.map((r) => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="grid size-10 place-items-center rounded-lg bg-primary/5 border border-primary/15 shrink-0">
                    <FileText className="size-4.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{r.name}</span>
                      <Badge variant="outline" className="text-[0.6rem] font-mono">{r.id}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[0.6rem]">{r.category}</Badge>
                      <span>{r.freq}</span>
                      <span>Last run: {r.lastRun}</span>
                      <span>Format: {r.format}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="rounded-lg text-xs"><FileDown className="size-3.5 mr-1.5" /> Preview</Button>
                  <Button variant="ghost" size="sm" className="rounded-lg text-xs"><Download className="size-3.5 mr-1.5" /> Run</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
