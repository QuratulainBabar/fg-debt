import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, FileText, FileCheck, Download, Copy } from "lucide-react";
import { DOCUMENT_TEMPLATES } from "@/lib/admin-data";

export const Route = createFileRoute("/_admin/admin/document-templates")({
  head: () => ({ meta: [{ title: "Document Templates — FG Debt Advisor AI" }] }),
  component: AdminDocumentTemplatesPage,
});

function AdminDocumentTemplatesPage() {
  const statusBadge: Record<string, any> = {
    published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    draft: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  };
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        eyebrow="Admin / Operations"
        title="Document Templates"
        description="Manage legal letter templates, DRO suitability packs, IVA nominee reports, compliance sign-off forms, and client-facing correspondence."
        actions={
          <Button className="rounded-xl gradient-deep text-primary-foreground shadow-soft">
            <Plus className="size-4 mr-1.5" /> New Template
          </Button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: "Templates", value: DOCUMENT_TEMPLATES.length, icon: FileText, color: "primary" },
          { label: "Published", value: DOCUMENT_TEMPLATES.filter(t => t.status === "published").length, icon: FileCheck, color: "emerald" },
          { label: "Total Usage", value: "8,986", icon: Download, color: "blue" },
          { label: "Drafts Pending", value: DOCUMENT_TEMPLATES.filter(t => t.status === "draft").length, icon: Copy, color: "amber" },
        ].map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`grid size-10 place-items-center rounded-xl border ${
                s.color === "primary" ? "bg-primary/10 text-primary border-primary/20" :
                s.color === "emerald" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                s.color === "blue" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-display">Template Library</CardTitle>
              <CardDescription className="text-xs">Smart-merge templates pre-populated with matter, client and rule data.</CardDescription>
            </div>
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search templates…" className="pl-9 h-9 w-56 rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold">Template</TableHead>
                <TableHead className="text-xs font-semibold">Category</TableHead>
                <TableHead className="text-xs font-semibold">Usage</TableHead>
                <TableHead className="text-xs font-semibold">Modified</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOCUMENT_TEMPLATES.map((t) => (
                <TableRow key={t.id} className="group hover:bg-muted/50">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-9 place-items-center rounded-lg bg-primary/5 border border-primary/15">
                        <FileText className="size-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{t.name}</div>
                        <div className="text-[0.65rem] text-muted-foreground font-mono">{t.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="secondary" className="text-[0.65rem]">{t.category}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-semibold">{t.usageCount.toLocaleString()} uses</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">{t.lastModified}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className={`text-[0.65rem] capitalize border ${statusBadge[t.status]}`}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs mr-1">Edit</Button>
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs">Preview</Button>
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
