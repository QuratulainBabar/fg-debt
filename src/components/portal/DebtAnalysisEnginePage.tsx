import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  Calculator,
  CreditCard,
  Landmark,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { Button } from "@/components/ui/button";
import {
  gbp,
  nonPriorityDebts,
  priorityDebts,
  totalArrears,
  totalDebt,
  totalNonPriority,
  totalPriority,
} from "@/lib/mock-data";

export const DEBT_ANALYSIS_SECTIONS = [
  "priority-debts",
  "non-priority-debts",
  "secured-other-debts",
  "debt-calculations",
] as const;

export type DebtAnalysisSection = (typeof DEBT_ANALYSIS_SECTIONS)[number];

const allDebts = [...priorityDebts, ...nonPriorityDebts];
const creditorCount = allDebts.length;
const defaultedCount = allDebts.filter((d) => d.arrears > 0).length;

const sectionMeta: Record<
  DebtAnalysisSection,
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
  "priority-debts": {
    title: "Priority Debts",
    description:
      "Debts that can lead to serious consequences if unpaid — housing, tax, utilities and court-related liabilities.",
    icon: AlertTriangle,
    categories: [
      "Rent",
      "Mortgage",
      "Council Tax",
      "Utilities",
      "Magistrates Fines",
      "Child Maintenance",
      "HMRC",
    ],
    value: gbp(totalPriority),
    hint: `${priorityDebts.length} accounts flagged`,
    tone: "warning",
  },
  "non-priority-debts": {
    title: "Non-Priority Debts",
    description:
      "Unsecured consumer credit that should be managed after priority liabilities are under control.",
    icon: CreditCard,
    categories: ["Credit Cards", "Loans", "Catalogues", "Overdrafts", "Payday Loans"],
    value: gbp(totalNonPriority),
    hint: `${nonPriorityDebts.length} accounts flagged`,
  },
  "secured-other-debts": {
    title: "Secured Debts",
    description:
      "Secured liabilities that need separate treatment in the advice journey.",
    icon: Shield,
    categories: ["Student Loans", "Business Debts", "Guarantees"],
    value: "3 types",
    hint: "Tracked for advice scope",
  },
  "debt-calculations": {
    title: "Debt Calculations",
    description:
      "Aggregated figures the AI engine uses for affordability, risk and solution matching.",
    icon: Calculator,
    categories: ["Total Debt", "Number of Creditors", "Arrears", "Interest", "Default Status"],
    value: gbp(totalDebt),
    hint: `${creditorCount} creditors`,
    tone: "deep",
  },
};

const calculationRows = [
  { label: "Total Debt", value: gbp(totalDebt) },
  { label: "Number of Creditors", value: String(creditorCount) },
  { label: "Arrears", value: gbp(totalArrears) },
  {
    label: "Interest",
    value: allDebts.some((d) => d.interest !== "0%") ? "Mixed rates" : "0%",
  },
  {
    label: "Default Status",
    value: defaultedCount > 0 ? `${defaultedCount} in arrears` : "No defaults",
  },
];

export function isDebtAnalysisSection(value: string): value is DebtAnalysisSection {
  return (DEBT_ANALYSIS_SECTIONS as readonly string[]).includes(value);
}

export function DebtAnalysisEnginePage({ section }: { section: DebtAnalysisSection }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  const creditorRows =
    section === "priority-debts"
      ? priorityDebts
      : section === "non-priority-debts"
        ? nonPriorityDebts
        : [];

  return (
    <>
      <PageHeader
        eyebrow="Debt Analysis Engine"
        title={meta.title}
        description={meta.description}
        actions={
          <Button asChild variant="outline">
            <Link to="/debt-creditor-information">Update creditor details</Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Icon} label={meta.title} value={meta.value} hint={meta.hint} tone={meta.tone} />
        <StatCard icon={Landmark} label="Total debt" value={gbp(totalDebt)} hint="All creditors" />
        <StatCard
          icon={Building2}
          label="Arrears"
          value={gbp(totalArrears)}
          hint="Across tracked accounts"
          tone={totalArrears > 0 ? "warning" : "default"}
        />
      </div>

      <section className="surface-card mt-6 p-6">
        <h2 className="text-lg font-semibold">Categories in this analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Classification used by the Debt Analysis Engine for triage and advice.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {meta.categories.map((label) => (
            <span
              key={label}
              className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm font-medium text-primary"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {section === "debt-calculations" ? (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold">Calculated metrics</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Live figures derived from your assessment and creditor schedule.
          </p>
          <ul className="mt-5 divide-y divide-border">
            {calculationRows.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold tabular-nums">{row.value}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : creditorRows.length > 0 ? (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold">Creditors in this group</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Accounts currently mapped to {meta.title.toLowerCase()}.
          </p>
          <ul className="mt-5 divide-y divide-border">
            {creditorRows.map((d) => (
              <li key={d.creditor} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{d.creditor}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.type} · Interest {d.interest}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">{gbp(d.balance)}</p>
                  {d.arrears > 0 && (
                    <p className="text-xs text-warning">Arrears {gbp(d.arrears)}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold">No accounts recorded yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add student loans, business debts or guarantees in your creditor information so they appear here.
          </p>
        </section>
      )}
    </>
  );
}
