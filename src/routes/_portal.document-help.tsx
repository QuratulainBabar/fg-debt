import { createFileRoute, Link } from "@tanstack/react-router";
import { FileQuestion, Upload } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_portal/document-help")({
  head: () => ({
    meta: [
      { title: "Document Help — FG Debt Advisor AI" },
      {
        name: "description",
        content: "Guidance on which documents to upload and how they are used in your case.",
      },
      { property: "og:title", content: "Document Help — FG Debt Advisor AI" },
      {
        property: "og:description",
        content: "Help choosing and uploading the right evidence for debt advice.",
      },
    ],
  }),
  component: DocumentHelpPage,
});

const guides = [
  {
    title: "Bank statements",
    body: "Upload the last 1–3 months showing income and regular outgoings. PDF scans are preferred over photos.",
  },
  {
    title: "Payslips & benefits",
    body: "Recent payslips or Universal Credit / benefit award letters verify income for affordability.",
  },
  {
    title: "Creditor letters",
    body: "Statements, arrears notices and default letters help confirm balances and account references.",
  },
  {
    title: "ID & address",
    body: "Passport or driving licence plus a recent council tax or utility bill complete identity checks.",
  },
];

function DocumentHelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI support"
        title="Document help"
        description="What to upload, why we need it, and how to avoid common rejection reasons such as cropped pages or expired ID."
        actions={
          <Button asChild>
            <Link to="/upload-documents">
              <Upload className="size-4" /> Upload documents
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((g) => (
          <section key={g.title} className="surface-card p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary/50 text-primary">
                <FileQuestion className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold">{g.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.body}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/documents">Open document vault</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/assistant">Ask AI about a document</Link>
        </Button>
      </div>
    </>
  );
}
