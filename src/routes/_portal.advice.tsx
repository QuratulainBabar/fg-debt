import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText, Scale } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
import { generatedDocuments } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_portal/advice")({
  head: () => ({
    meta: [
      { title: "Advice — FG Debt Advisor AI" },
      {
        name: "description",
        content: "View solicitor-reviewed advice letters and related advice documents for your case.",
      },
      { property: "og:title", content: "Advice — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Advice records and letters issued for your debt matter.",
      },
    ],
  }),
  component: AdvicePage,
});

const adviceRecords = [
  {
    title: "Advice letter — DRO suitability",
    status: "Solicitor review",
    date: "24 Jun 2026",
    summary:
      "Draft advice recommending a Debt Relief Order based on your assessment. Awaiting solicitor sign-off before formal issue.",
  },
  {
    title: "Standard Financial Statement",
    status: "Ready",
    date: "24 Jun 2026",
    summary: "Income and expenditure statement supporting the affordability conclusion.",
  },
  {
    title: "Creditor summary schedule",
    status: "Ready",
    date: "18 Jun 2026",
    summary: "Schedule of creditors prepared for inclusion with formal advice.",
  },
];

function AdvicePage() {
  return (
    <>
      <PageHeader
        eyebrow="Records"
        title="Advice"
        description="Advice letters and supporting packs for your case. Formal advice is only issued after solicitor approval."
        actions={
          <Button asChild variant="outline">
            <Link to="/recommendation">View recommendation</Link>
          </Button>
        }
      />

      <ul className="space-y-4">
        {adviceRecords.map((r) => (
          <li key={r.title} className="surface-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary/50 text-primary">
                  {r.title.includes("Advice letter") ? (
                    <Scale className="size-5" />
                  ) : (
                    <FileText className="size-5" />
                  )}
                </span>
                <div>
                  <h2 className="text-base font-semibold">{r.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{r.date}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={r.status} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Download started", { description: r.title })}
                >
                  <Download className="size-4" /> Download
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-6 surface-card p-5">
        <h3 className="text-sm font-semibold">Generated documents</h3>
        <ul className="mt-3 space-y-2">
          {generatedDocuments.map((d) => (
            <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
              <span>
                {d.name}{" "}
                <span className="text-muted-foreground">· {d.type}</span>
              </span>
              <span className="text-xs text-muted-foreground">{d.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
