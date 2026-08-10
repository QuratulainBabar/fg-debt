import { createFileRoute, Link } from "@tanstack/react-router";
import { FileWarning, Upload } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_portal/missing-evidence")({
  head: () => ({
    meta: [
      { title: "Missing Evidence — FG Debt Advisor AI" },
      {
        name: "description",
        content: "See which documents are still needed before solicitor advice can be finalised.",
      },
      { property: "og:title", content: "Missing Evidence — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Outstanding evidence checklist for your debt case.",
      },
    ],
  }),
  component: MissingEvidencePage,
});

const outstanding = [
  {
    name: "Payslip — June 2026",
    reason: "Needed to confirm current net pay for affordability.",
    status: "Required",
  },
  {
    name: "Orbit Catalogue creditor letter",
    reason: "Balance verification for catalogue debt account.",
    status: "Required",
  },
  {
    name: "Bank statement — May 2026",
    reason: "Requested to finalise income check.",
    status: "Requested",
  },
];

const resolved = [
  { name: "Payslip — May 2026", status: "Verified" },
  { name: "Halbury Bank arrears notice", status: "Verified" },
];

function MissingEvidencePage() {
  return (
    <>
      <PageHeader
        eyebrow="AI support"
        title="Missing evidence"
        description="Items still needed for CASE-1042. Uploading these keeps solicitor review moving without delay."
        actions={
          <Button asChild>
            <Link to="/upload-documents">
              <Upload className="size-4" /> Upload now
            </Link>
          </Button>
        }
      />

      <section className="surface-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-warning/15 text-warning">
            <FileWarning className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Outstanding</h2>
            <p className="text-sm text-muted-foreground">{outstanding.length} items to provide</p>
          </div>
        </div>
        <ul className="space-y-3">
          {outstanding.map((item) => (
            <li
              key={item.name}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border p-4"
            >
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>
              </div>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 surface-card p-6">
        <h2 className="text-lg font-semibold">Recently verified</h2>
        <ul className="mt-4 space-y-3">
          {resolved.map((item) => (
            <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
              <span>{item.name}</span>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/document-help">Document help</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/documents">View all documents</Link>
        </Button>
      </div>
    </>
  );
}
