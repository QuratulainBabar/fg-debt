import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Gauge, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { DEBT_SOLUTION_RULES } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/debt-solution-rules")({
  head: () => ({ meta: [{ title: "Debt Solution Rules — FG Debt Advisor AI" }] }),
  component: AdminDebtSolutionRulesPage,
});

function AdminDebtSolutionRulesPage() {
  const statusBadge: Record<string, any> = {
    active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    draft: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  };
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Rule Engine"
        title="Debt Solution Rules"
        description="Configure AI triage and suitability scorecards for DRO, IVA, DMP, Bankruptcy, Trust Deed and Scottish DAS recommendations."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> New Solution Rule
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Solution Models", value: DEBT_SOLUTION_RULES.length, icon: Gauge, color: "primary" },
          { label: "Eligibility Checks", value: 127, icon: CheckCircle2, color: "emerald" },
          { label: "Exclusion Criteria", value: 58, icon: AlertTriangle, color: "amber" },
          { label: "Cross-Score Conflicts", value: 3, icon: ArrowRight, color: "rose" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                s.color === "amber" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                "bg-rose-500/10 text-rose-600 border-rose-500/20"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-display">Solution Suitability Rules</CardTitle>
              <CardDescription className="text-xs">Triage logic applied by the AI engine when ranking debt solutions.</CardDescription>
            </div>
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search solution rules…" className="pl-9 h-9 w-56 rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Rule</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Jurisdiction</TableHead>
                <TableHead className="text-xs font-semibold">Version</TableHead>
                <TableHead className="text-xs font-semibold">Updated</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEBT_SOLUTION_RULES.map((r) => (
                <TableRow key={r.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="text-xs font-semibold text-foreground">{r.name}</div>
                    <div className="text-[0.65rem] text-muted-foreground font-mono">{r.id}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs">{r.category}</TableCell>
                  <TableCell className="py-3 text-xs">{r.jurisdiction}</TableCell>
                  <TableCell className="py-3"><Badge variant="outline" className="text-[0.65rem] font-mono">{r.version}</Badge></TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">{r.lastUpdated}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge[r.status]}`}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs mr-1">Edit</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs">Test</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
