import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
  Home,
  Percent,
  PiggyBank,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { Button } from "@/components/ui/button";
import {
  disposableIncome,
  expenseItems,
  gbp,
  incomeItems,
  totalDebt,
  totalExpenses,
  totalIncome,
} from "@/lib/mock-data";

export const AI_FINANCIAL_SECTIONS = [
  "income",
  "expenditure",
  "monthly-surplus",
  "disposable-income",
  "debt-ratio",
  "housing-ratio",
  "financial-stress-score",
] as const;

export type AiFinancialSection = (typeof AI_FINANCIAL_SECTIONS)[number];

const housingCost = expenseItems.find((i) => i.label === "Rent")?.value ?? 0;
const housingRatio = Math.round((housingCost / totalIncome) * 100);
const debtRatio = Math.round((totalDebt / (totalIncome * 12)) * 100);
const surplusRate = Math.round((disposableIncome / totalIncome) * 100);
const stressScore = Math.min(
  100,
  Math.max(0, Math.round(debtRatio * 0.55 + housingRatio * 0.25 + (100 - surplusRate) * 0.2))
);

const sectionMeta: Record<
  AiFinancialSection,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    value: string;
    hint: string;
    tone?: "default" | "positive" | "warning" | "deep";
    detailTitle: string;
    detail: string;
    rows: { label: string; value: string }[];
  }
> = {
  income: {
    title: "Income",
    description: "Net household income declared in your assessment and checked against uploaded evidence.",
    icon: Wallet,
    value: gbp(totalIncome),
    hint: "Per month",
    detailTitle: "Income sources",
    detail: "Breakdown of employment, benefits and other income used by the AI financial statement.",
    rows: incomeItems.map((i) => ({ label: i.label, value: gbp(i.value) })),
  },
  expenditure: {
    title: "Expenditure",
    description: "Essential monthly spending organised to Common Financial Statement categories.",
    icon: ArrowDownRight,
    value: gbp(totalExpenses),
    hint: "Essential costs",
    detailTitle: "Monthly expenditure",
    detail: "Housing, utilities, living costs and other essentials used in affordability checks.",
    rows: expenseItems.map((i) => ({ label: i.label, value: gbp(i.value) })),
  },
  "monthly-surplus": {
    title: "Monthly Surplus",
    description: "What remains each month after essential expenditure — available for creditor offers.",
    icon: TrendingUp,
    value: gbp(disposableIncome),
    hint: `${surplusRate}% of income`,
    tone: "deep",
    detailTitle: "Surplus calculation",
    detail: "Income minus essential expenditure. Your solicitor reviews this before advice is issued.",
    rows: [
      { label: "Total monthly income", value: gbp(totalIncome) },
      { label: "Total essential expenditure", value: gbp(totalExpenses) },
      { label: "Monthly surplus", value: gbp(disposableIncome) },
      { label: "Suggested creditor offer (80%)", value: gbp(Math.round(disposableIncome * 0.8)) },
    ],
  },
  "disposable-income": {
    title: "Disposable Income",
    description: "Funds left after essentials that inform DRO eligibility and informal repayment capacity.",
    icon: PiggyBank,
    value: gbp(disposableIncome),
    hint: "After essentials",
    tone: "positive",
    detailTitle: "Disposable income summary",
    detail: "Aligned with Standard Financial Statement principles for regulated debt advice.",
    rows: [
      { label: "Net household income", value: gbp(totalIncome) },
      { label: "Essential spending", value: gbp(totalExpenses) },
      { label: "Disposable income", value: gbp(disposableIncome) },
      { label: "Contingency retained (20%)", value: gbp(Math.round(disposableIncome * 0.2)) },
    ],
  },
  "debt-ratio": {
    title: "Debt Ratio",
    description: "Total unsecured debt as a share of your annual household income.",
    icon: Percent,
    value: `${debtRatio}%`,
    hint: "Debt ÷ annual income",
    tone: debtRatio > 40 ? "warning" : "default",
    detailTitle: "Debt-to-income detail",
    detail: "Higher ratios increase pressure on repayment capacity and may favour formal solutions.",
    rows: [
      { label: "Total debt", value: gbp(totalDebt) },
      { label: "Annual income", value: gbp(totalIncome * 12) },
      { label: "Debt ratio", value: `${debtRatio}%` },
      { label: "Guidance band", value: debtRatio > 40 ? "Elevated" : "Manageable" },
    ],
  },
  "housing-ratio": {
    title: "Housing Ratio",
    description: "Housing costs as a percentage of monthly income — a key affordability indicator.",
    icon: Home,
    value: `${housingRatio}%`,
    hint: "Rent ÷ monthly income",
    tone: housingRatio > 35 ? "warning" : "default",
    detailTitle: "Housing cost detail",
    detail: "Rent or mortgage costs compared with net household income.",
    rows: [
      { label: "Housing cost (rent)", value: gbp(housingCost) },
      { label: "Monthly income", value: gbp(totalIncome) },
      { label: "Housing ratio", value: `${housingRatio}%` },
      { label: "Guidance band", value: housingRatio > 35 ? "High" : "Within range" },
    ],
  },
  "financial-stress-score": {
    title: "Financial Stress Score",
    description: "Composite AI score combining debt burden, housing pressure and surplus headroom.",
    icon: Gauge,
    value: `${stressScore}/100`,
    hint: stressScore >= 60 ? "Elevated stress" : "Moderate stress",
    tone: stressScore >= 60 ? "warning" : "default",
    detailTitle: "Score drivers",
    detail: "Weighted from debt ratio, housing ratio and surplus capacity. For solicitor triage — not a credit score.",
    rows: [
      { label: "Debt ratio contribution", value: `${debtRatio}%` },
      { label: "Housing ratio contribution", value: `${housingRatio}%` },
      { label: "Surplus headroom", value: `${surplusRate}% of income` },
      { label: "Overall stress score", value: `${stressScore} / 100` },
    ],
  },
};

export function isAiFinancialSection(value: string): value is AiFinancialSection {
  return (AI_FINANCIAL_SECTIONS as readonly string[]).includes(value);
}

export function AiFinancialStatementPage({ section }: { section: AiFinancialSection }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <>
      <PageHeader
        eyebrow="AI Financial Statement"
        title={meta.title}
        description={meta.description}
        actions={
          <Button asChild variant="outline">
            <Link to="/financial-information">Edit financial information</Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Icon} label={meta.title} value={meta.value} hint={meta.hint} tone={meta.tone} />
        <StatCard icon={ArrowUpRight} label="Monthly income" value={gbp(totalIncome)} hint="Net household" />
        <StatCard
          icon={PiggyBank}
          label="Disposable income"
          value={gbp(disposableIncome)}
          hint="After essentials"
          tone="positive"
        />
      </div>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-lg font-semibold">{meta.detailTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{meta.detail}</p>
        <ul className="mt-5 divide-y divide-border">
          {meta.rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-semibold tabular-nums">{row.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
