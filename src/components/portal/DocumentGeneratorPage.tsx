import { Link } from "@tanstack/react-router";
import {
  Download,
  Eye,
  FileStack,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const DOCUMENT_GENERATOR_SECTIONS = [
  "generated-documents",
  "view-download-documents",
] as const;

export type DocumentGeneratorSection = (typeof DOCUMENT_GENERATOR_SECTIONS)[number];

const generatedDocs = [
  { label: "Attendance Note", status: "Ready", date: "24 Jun 2026" },
  { label: "Financial Statement", status: "Ready", date: "24 Jun 2026" },
  { label: "Income & Expenditure Report", status: "Ready", date: "24 Jun 2026" },
  { label: "Debt Schedule", status: "Ready", date: "24 Jun 2026" },
  { label: "Asset Schedule", status: "Ready", date: "24 Jun 2026" },
  { label: "Liability Schedule", status: "Ready", date: "24 Jun 2026" },
  { label: "Debt Options Report", status: "Ready", date: "24 Jun 2026" },
  { label: "Advice Letter", status: "Pending review", date: "—" },
  { label: "Creditor Letters", status: "Pending review", date: "—" },
  { label: "Referral Letter", status: "Draft", date: "—" },
  { label: "Matter Strategy", status: "Ready", date: "25 Jun 2026" },
  { label: "File Review Checklist", status: "Ready", date: "25 Jun 2026" },
  { label: "Closing Letter", status: "Draft", date: "—" },
] as const;

const readyCount = generatedDocs.filter((d) => d.status === "Ready").length;

const sectionMeta: Record<
  DocumentGeneratorSection,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    value: string;
    hint: string;
    tone?: "default" | "positive" | "warning" | "deep";
  }
> = {
  "generated-documents": {
    title: "Generated Documents",
    description:
      "Case documents produced by the Document Generator from your assessment, financial statement and AI recommendation.",
    icon: FileStack,
    value: `${generatedDocs.length} types`,
    hint: `${readyCount} ready to download`,
  },
  "view-download-documents": {
    title: "View / Download Documents",
    description:
      "Open or download generated advice pack documents. Solicitor-approved items unlock for full download.",
    icon: Download,
    value: String(readyCount),
    hint: "Available now",
    tone: "deep",
  },
};

export function isDocumentGeneratorSection(
  value: string
): value is DocumentGeneratorSection {
  return (DOCUMENT_GENERATOR_SECTIONS as readonly string[]).includes(value);
}

function statusTone(status: string) {
  if (status === "Ready") return "Verified";
  if (status === "Pending review") return "Solicitor review";
  return "Draft";
}

export function DocumentGeneratorPage({ section }: { section: DocumentGeneratorSection }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  const handleDownload = (label: string, status: string) => {
    if (status !== "Ready") {
      toast.message(`${label} is not ready yet`, {
        description: "Awaiting solicitor review or final drafting.",
      });
      return;
    }
    toast.success(`${label} download started`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Document Generator"
        title={meta.title}
        description={meta.description}
        actions={
          <Button asChild variant="outline">
            <Link to="/documents">Open document vault</Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Icon} label={meta.title} value={meta.value} hint={meta.hint} tone={meta.tone} />
        <StatCard
          icon={FileText}
          label="Ready documents"
          value={String(readyCount)}
          hint="Download available"
          tone="positive"
        />
        <StatCard
          icon={Eye}
          label="Pending / draft"
          value={String(generatedDocs.length - readyCount)}
          hint="Awaiting review"
          tone="warning"
        />
      </div>

      {section === "generated-documents" ? (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold">Document pack inventory</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Full set of documents the generator can produce for this matter.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {generatedDocs.map((doc) => (
              <span
                key={doc.label}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                  doc.status === "Ready"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-secondary/50 text-primary"
                }`}
              >
                {doc.label}
              </span>
            ))}
          </div>
          <ul className="mt-6 divide-y divide-border">
            {generatedDocs.map((doc) => (
              <li
                key={doc.label}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-foreground">{doc.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.date === "—" ? "Not generated yet" : `Generated ${doc.date}`}
                  </p>
                </div>
                <StatusBadge status={statusTone(doc.status)} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold">View or download</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ready documents can be downloaded immediately. Pending items unlock after solicitor approval.
          </p>
          <ul className="mt-6 space-y-3">
            {generatedDocs.map((doc) => (
              <li
                key={doc.label}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{doc.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {doc.status}
                    {doc.date !== "—" ? ` · ${doc.date}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={statusTone(doc.status)} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={doc.status !== "Ready"}
                    onClick={() => handleDownload(doc.label, doc.status)}
                  >
                    <Download className="mr-1 size-3.5" />
                    Download
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
