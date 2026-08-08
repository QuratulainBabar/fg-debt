import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Scale, FileCheck, History } from "lucide-react";
import { LEGAL_RULES } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/legal-rules")({
  head: () => ({ meta: [{ title: "Legal Rules Management — FG Debt Advisor AI" }] }),
  component: AdminLegalRulesPage,
});

function AdminLegalRulesPage() {
  const statusBadge: Record<string, any> = {
    active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    draft: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    archived: "bg-muted text-muted-foreground border-border",
  };
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Rule Engine"
        title="Legal Rules Management"
        description="Configure jurisdictional insolvency rules, SRA compliance parameters, and regulatory mandate thresholds."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> New Rule
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Active Rules", value: LEGAL_RULES.filter(r => r.status === "active").length, icon: Scale, color: "emerald" },
          { label: "Drafts Pending Review", value: LEGAL_RULES.filter(r => r.status === "draft").length, icon: FileCheck, color: "amber" },
          { label: "Jurisdictions", value: 3, icon: History, color: "blue" },
          { label: "FCA/SRA Audited", value: 4, icon: Scale, color: "purple" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                s.color === "amber" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                "bg-purple-500/10 text-purple-600 border-purple-500/20"
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
              <CardTitle className="text-base font-display">Legal & Insolvency Rules</CardTitle>
              <CardDescription className="text-xs">DRO, IVA, DMP, Bankruptcy and Breathing Space regulatory parameters.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search rules…" className="pl-9 h-9 w-56 rounded-xl" />
              </div>
              <Button variant="outline" size="sm" className="rounded-xl"><Filter className="size-4 mr-1.5" />Jurisdiction</Button>
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
              {LEGAL_RULES.map((r) => (
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
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs">History</Button>
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
