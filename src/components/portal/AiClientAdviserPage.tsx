import { Link } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  Bot,
  CalendarCheck,
  CircleHelp,
  FileSearch,
  FileWarning,
  HelpCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { Button } from "@/components/ui/button";

export const AI_CLIENT_ADVISER_SECTIONS = [
  "explain-debt-options",
  "explain-terminology",
  "answer-common-questions",
  "check-uploaded-documents",
  "request-missing-evidence",
  "prepare-client-for-appointments",
  "provide-status-updates",
] as const;

export type AiClientAdviserSection = (typeof AI_CLIENT_ADVISER_SECTIONS)[number];

const sectionMeta: Record<
  AiClientAdviserSection,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    value: string;
    hint: string;
    tone?: "default" | "positive" | "warning" | "deep";
    bullets: string[];
    relatedTo?: string;
    relatedLabel?: string;
  }
> = {
  "explain-debt-options": {
    title: "Explain Debt Options",
    description:
      "Plain-English explanations of DRO, IVA, DMP, bankruptcy and informal options matched to your circumstances.",
    icon: BookOpen,
    value: "4 guides",
    hint: "Ready to review",
    bullets: [
      "Debt Relief Order (DRO) — write-off pathway for qualifying low-surplus cases",
      "IVA — formal repayment plan when DRO limits are exceeded",
      "Debt Management Plan — informal single payment to creditors",
      "Breathing Space / bankruptcy — temporary protection or formal insolvency",
    ],
    relatedTo: "/explain-debt-options",
    relatedLabel: "Open debt options guide",
  },
  "explain-terminology": {
    title: "Explain Terminology",
    description:
      "Definitions of legal and debt-advice terms used in your assessment, recommendation and documents.",
    icon: CircleHelp,
    value: "12 terms",
    hint: "Glossary ready",
    bullets: [
      "Priority debt — liabilities with stronger enforcement powers (rent, council tax, energy)",
      "Disposable income — surplus after essential expenditure",
      "Breathing Space — temporary protection from creditor action",
      "Solicitor review — human approval required before formal advice is issued",
    ],
  },
  "answer-common-questions": {
    title: "Answer Common Questions",
    description:
      "Fast answers to frequent client questions about process, timelines, credit impact and next steps.",
    icon: HelpCircle,
    value: "8 FAQs",
    hint: "Updated today",
    bullets: [
      "Will this affect my credit file?",
      "How long does solicitor review take?",
      "What happens if my income changes?",
      "Do I still need to pay priority debts?",
    ],
    relatedTo: "/answer-questions",
    relatedLabel: "Ask a question",
  },
  "check-uploaded-documents": {
    title: "Check Uploaded Documents",
    description:
      "AI checks readability, completeness and relevance of documents you have already uploaded.",
    icon: FileSearch,
    value: "5 checked",
    hint: "1 needs attention",
    tone: "warning",
    bullets: [
      "Bank statement — May 2026 · Verified",
      "Payslip — May 2026 · Verified",
      "Universal Credit letter · In review",
      "Tenancy agreement · Rejected — re-upload clearer scan",
    ],
    relatedTo: "/documents",
    relatedLabel: "Open documents",
  },
  "request-missing-evidence": {
    title: "Request Missing Evidence",
    description:
      "Outstanding evidence required to complete affordability checks and solicitor review.",
    icon: FileWarning,
    value: "2 outstanding",
    hint: "Action required",
    tone: "warning",
    bullets: [
      "Latest bank statement covering 1–31 May 2026",
      "Halbury Bank arrears notice (clearer copy)",
      "Optional: childcare cost confirmation",
    ],
    relatedTo: "/missing-evidence",
    relatedLabel: "View missing evidence",
  },
  "prepare-client-for-appointments": {
    title: "Prepare Client for Appointments",
    description:
      "What to expect in solicitor calls or meetings, and documents to have ready.",
    icon: CalendarCheck,
    value: "1 upcoming",
    hint: "Solicitor review",
    bullets: [
      "Have your NI number and matter reference ready",
      "Review the recommended solution summary beforehand",
      "Note any income or expenditure changes since assessment",
      "Prepare questions about DRO eligibility and next steps",
    ],
  },
  "provide-status-updates": {
    title: "Provide Status Updates",
    description:
      "Live progress on your case activity, notifications and solicitor review milestones.",
    icon: Activity,
    value: "On track",
    hint: "Last update 2h ago",
    tone: "positive",
    bullets: [
      "Assessment submitted and documents verified",
      "AI recommendation generated — awaiting solicitor",
      "Vulnerability and risk flags reviewed by the engines",
      "Advice letter pending solicitor approval",
    ],
    relatedTo: "/status-updates",
    relatedLabel: "Open status updates",
  },
};

export function isAiClientAdviserSection(value: string): value is AiClientAdviserSection {
  return (AI_CLIENT_ADVISER_SECTIONS as readonly string[]).includes(value);
}

export function AiClientAdviserPage({ section }: { section: AiClientAdviserSection }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <>
      <PageHeader
        eyebrow="AI Client Adviser"
        title={meta.title}
        description={meta.description}
        actions={
          <Button asChild variant="outline">
            <Link to="/assistant">
              <Bot className="size-4" /> Open AI Adviser chat
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Icon} label={meta.title} value={meta.value} hint={meta.hint} tone={meta.tone} />
        <StatCard
          icon={ShieldCheck}
          label="Advice status"
          value="Draft only"
          hint="Solicitor approval required"
        />
        <StatCard
          icon={Bot}
          label="AI Client Adviser"
          value="Active"
          hint="Human-in-the-loop"
          tone="positive"
        />
      </div>

      <section className="surface-card mt-6 p-6">
        <div>
          <h2 className="text-lg font-semibold">{meta.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Support provided by the AI Client Adviser. Formal advice remains solicitor-gated.
          </p>
        </div>

        <ul className="mt-5 space-y-3">
          {meta.bullets.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>

        {meta.relatedTo && (
          <div className="mt-5">
            <Button asChild>
              <Link to={meta.relatedTo as any}>{meta.relatedLabel}</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
