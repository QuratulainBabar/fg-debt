import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardCheck,
  Scale,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { disposableIncome, gbp, totalDebt } from "@/lib/mock-data";

export const DEBT_SOLUTION_SECTIONS = ["assess-suitability", "recommendation"] as const;

export type DebtSolutionSection = (typeof DEBT_SOLUTION_SECTIONS)[number];

const recommendedSolution = "Debt Relief Order Referral";

const suitabilityOptions = [
  "Budgeting Only",
  "Creditor Negotiation",
  "Debt Management Plan",
  "Breathing Space",
  "Debt Relief Order Referral",
  "IVA Referral",
  "Bankruptcy Advice",
  "Settlement Offers",
  "No Action",
];

const suitabilityFit: Record<string, number> = {
  "Budgeting Only": 22,
  "Creditor Negotiation": 41,
  "Debt Management Plan": 48,
  "Breathing Space": 58,
  "Debt Relief Order Referral": 91,
  "IVA Referral": 62,
  "Bankruptcy Advice": 31,
  "Settlement Offers": 35,
  "No Action": 8,
};

const recommendationAspects = [
  {
    label: "Advantages",
    detail: "Writes off qualifying unsecured debt after 12 months if criteria continue to be met.",
  },
  {
    label: "Disadvantages",
    detail: "Credit file impact for six years; restrictions on obtaining further credit.",
  },
  {
    label: "Eligibility",
    detail: `Debt ${gbp(totalDebt)} under £50k and surplus ${gbp(disposableIncome)}/mo within DRO limits.`,
  },
  {
    label: "Risks",
    detail: "Application may be refused if assets or income change before approval.",
  },
  {
    label: "Alternative Options",
    detail: "IVA referral or Debt Management Plan if surplus increases.",
  },
  {
    label: "Why Recommended",
    detail: "Best fit for low surplus, no property ownership and unsecured debt under the DRO threshold.",
  },
  {
    label: "Why Rejected",
    detail: "Budgeting only and no action rejected — do not resolve the existing debt burden.",
  },
];

const sectionMeta: Record<
  DebtSolutionSection,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    categories: string[];
    value: string;
    hint: string;
    tone?: "default" | "positive" | "warning" | "deep";
  }
> = {
  "assess-suitability": {
    title: "Assess Suitability",
    description:
      "Solutions screened by the Debt Solution Engine against your financial statement, debt profile and vulnerability flags.",
    icon: ClipboardCheck,
    categories: suitabilityOptions,
    value: "9 options",
    hint: "Suitability screened",
  },
  recommendation: {
    title: "Recommendation",
    description:
      "Primary AI recommendation with advantages, risks and alternatives — pending solicitor approval before advice is issued.",
    icon: Sparkles,
    categories: recommendationAspects.map((a) => a.label),
    value: "DRO",
    hint: "Awaiting solicitor",
    tone: "deep",
  },
};

export function isDebtSolutionSection(value: string): value is DebtSolutionSection {
  return (DEBT_SOLUTION_SECTIONS as readonly string[]).includes(value);
}

export function DebtSolutionEnginePage({ section }: { section: DebtSolutionSection }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <>
      <PageHeader
        eyebrow="Debt Solution Engine"
        title={meta.title}
        description={meta.description}
        actions={
          <Button asChild variant="outline">
            <Link to="/recommendation">View full recommendation</Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Icon} label={meta.title} value={meta.value} hint={meta.hint} tone={meta.tone} />
        <StatCard
          icon={Scale}
          label="Primary recommendation"
          value="DRO Referral"
          hint={`${suitabilityFit[recommendedSolution]}% fit`}
          tone="positive"
        />
        <StatCard icon={CheckCircle2} label="Solicitor status" value="Pending" hint="Human review required" />
      </div>

      {section === "assess-suitability" ? (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold">Suitability options</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each pathway scored against your circumstances. The highest fit becomes the engine recommendation.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {suitabilityOptions.map((label) => {
              const recommended = label === recommendedSolution;
              return (
                <span
                  key={label}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                    recommended
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-secondary/50 text-primary"
                  }`}
                >
                  {label}
                  {recommended ? " · Recommended" : ""}
                </span>
              );
            })}
          </div>
          <ul className="mt-6 space-y-4">
            {suitabilityOptions.map((label) => {
              const fit = suitabilityFit[label] ?? 0;
              const recommended = label === recommendedSolution;
              return (
                <li key={label} className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <div className="flex items-center gap-2">
                      {recommended && <StatusBadge status="Recommended" />}
                      <span className="text-xs font-medium text-muted-foreground">{fit}% fit</span>
                    </div>
                  </div>
                  <Progress value={fit} className="mt-3 h-2" />
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="surface-card mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Recommendation breakdown</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Why {recommendedSolution} was selected, and which alternatives were set aside.
              </p>
            </div>
            <StatusBadge status="Solicitor review" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {recommendationAspects.map((item) => (
              <span
                key={item.label}
                className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm font-medium text-primary"
              >
                {item.label}
              </span>
            ))}
          </div>
          <ul className="mt-6 divide-y divide-border">
            {recommendationAspects.map((item) => (
              <li key={item.label} className="py-4">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
