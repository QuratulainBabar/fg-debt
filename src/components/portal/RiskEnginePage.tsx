import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  FileSearch,
  Gauge,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { StatCard } from "@/components/portal/StatCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const RISK_ENGINE_SECTIONS = ["risk-identification", "risk-score"] as const;

export type RiskEngineSection = (typeof RISK_ENGINE_SECTIONS)[number];

const riskCategories = [
  { label: "Missing Documents", flagged: true, severity: "Medium" },
  { label: "Unverified Debts", flagged: true, severity: "Medium" },
  { label: "Unreasonable Expenditure", flagged: false, severity: "Low" },
  { label: "Hidden Assets", flagged: false, severity: "Low" },
  { label: "Potential Fraud Indicators", flagged: false, severity: "Low" },
  { label: "Preference Payments", flagged: false, severity: "Low" },
  { label: "Transactions at Undervalue", flagged: false, severity: "Low" },
  { label: "Director Liabilities", flagged: false, severity: "Low" },
  { label: "Guarantor Liabilities", flagged: false, severity: "Low" },
  { label: "Pending Litigation", flagged: false, severity: "Low" },
  { label: "Statutory Demands", flagged: false, severity: "Low" },
  { label: "Enforcement Action", flagged: true, severity: "High" },
] as const;

const flaggedCount = riskCategories.filter((r) => r.flagged).length;
const riskScore = Math.min(
  100,
  flaggedCount * 18 +
    riskCategories.filter((r) => r.flagged && r.severity === "High").length * 12
);
const riskBand = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low";

const scoreDrivers = [
  { label: "Document completeness", weight: 22, note: "Payslip and creditor letter outstanding" },
  { label: "Debt verification", weight: 18, note: "Two accounts pending OCR confirmation" },
  { label: "Enforcement exposure", weight: 28, note: "Priority arrears with active monitoring" },
  { label: "Asset / transaction integrity", weight: 12, note: "No undervalue or preference flags" },
  { label: "Litigation / statutory action", weight: 8, note: "No statutory demands recorded" },
];

const sectionMeta: Record<
  RiskEngineSection,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    value: string;
    hint: string;
    tone?: "default" | "positive" | "warning" | "deep";
  }
> = {
  "risk-identification": {
    title: "Risk Identification",
    description:
      "Compliance and case-integrity risks screened by the Risk Engine before solicitor review.",
    icon: FileSearch,
    value: `${flaggedCount} flagged`,
    hint: `Of ${riskCategories.length} checks`,
    tone: "warning",
  },
  "risk-score": {
    title: "Risk Score",
    description:
      "Composite score derived from flagged risk indicators — used to prioritise solicitor triage.",
    icon: Gauge,
    value: `${riskScore}/100`,
    hint: `${riskBand} risk band`,
    tone: riskBand === "High" ? "warning" : riskBand === "Medium" ? "warning" : "default",
  },
};

export function isRiskEngineSection(value: string): value is RiskEngineSection {
  return (RISK_ENGINE_SECTIONS as readonly string[]).includes(value);
}

export function RiskEnginePage({ section }: { section: RiskEngineSection }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <>
      <PageHeader
        eyebrow="Risk Engine"
        title={meta.title}
        description={meta.description}
        actions={
          <Button asChild variant="outline">
            <Link to="/risk-assessment">Open risk overview</Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Icon} label={meta.title} value={meta.value} hint={meta.hint} tone={meta.tone} />
        <StatCard
          icon={ShieldAlert}
          label="Overall band"
          value={riskBand}
          hint="Solicitor monitoring"
          tone={riskBand === "Low" ? "positive" : "warning"}
        />
        <StatCard
          icon={AlertTriangle}
          label="Active flags"
          value={String(flaggedCount)}
          hint="Require attention"
          tone="warning"
        />
      </div>

      {section === "risk-identification" ? (
        <section className="surface-card mt-6 p-6">
          <h2 className="text-lg font-semibold">Identified risk categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Full Risk Engine checklist. Flagged items contribute to the composite risk score.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {riskCategories.map((item) => (
              <span
                key={item.label}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                  item.flagged
                    ? "border-warning/35 bg-warning/18 text-warning"
                    : "border-border bg-secondary/50 text-primary"
                }`}
              >
                {item.label}
                {item.flagged ? " · Flagged" : ""}
              </span>
            ))}
          </div>
          <ul className="mt-6 divide-y divide-border">
            {riskCategories.map((item) => (
              <li
                key={item.label}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <span className="font-medium text-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.flagged ? "Action required" : "Clear"} />
                  <span className="text-xs text-muted-foreground">{item.severity}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="surface-card mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Composite risk score</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Weighted from document, verification, enforcement and integrity checks.
              </p>
            </div>
            <StatusBadge status={riskBand === "High" ? "Action required" : "In review"} />
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Risk score
                </p>
                <p className="mt-1 font-display text-3xl font-bold tabular-nums text-foreground">
                  {riskScore}
                  <span className="text-base font-medium text-muted-foreground"> / 100</span>
                </p>
              </div>
              <p className="text-sm font-semibold text-primary">{riskBand} risk</p>
            </div>
            <Progress value={riskScore} className="mt-4 h-2.5" />
          </div>

          <ul className="mt-6 space-y-4">
            {scoreDrivers.map((driver) => (
              <li key={driver.label} className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{driver.label}</p>
                  <span className="text-xs font-medium text-muted-foreground">
                    Weight {driver.weight}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{driver.note}</p>
                <Progress value={driver.weight * 3} className="mt-3 h-2" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
