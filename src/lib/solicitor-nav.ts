import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Cloud,
  CreditCard,
  FileCheck2,
  FileSearch,
  FileSignature,
  FileStack,
  FileText,
  FileWarning,
  Flag,
  FolderOpen,
  Gauge,
  GitBranch,
  Handshake,
  History,
  LayoutGrid,
  ListTodo,
  Mail,
  Network,
  PieChart,
  PiggyBank,
  Plug,
  Scale,
  ScanLine,
  ScrollText,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  TableProperties,
  UserCheck,
  Workflow,
} from "lucide-react";

export type SolicitorNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** When set, link opens a matter review tab instead of a standalone page */
  reviewTab?: string;
};

export type SolicitorNavGroup = {
  group: string;
  items: SolicitorNavItem[];
};

export const solicitorNav: SolicitorNavGroup[] = [
  {
    group: "Overview",
    items: [
      { to: "/solicitor", label: "Dashboard", icon: LayoutGrid },
      { to: "/solicitor/matters", label: "Matter List", icon: FileStack },
      { to: "/solicitor/settings/firm-profile", label: "Firm Profile", icon: Building2 },
      { to: "/solicitor/notifications", label: "Alerts", icon: Bell },
      { to: "/solicitor/tasks", label: "Tasks", icon: ListTodo },
    ],
  },
  {
    group: "AI Financial Statement",
    items: [
      { to: "/solicitor/review/financial-statement", label: "Financial Statement", icon: Banknote, reviewTab: "financial" },
      { to: "/solicitor/financial-summary", label: "Financial Summary", icon: PieChart },
    ],
  },
  {
    group: "Debt Analysis Engine",
    items: [
      { to: "/solicitor/review/debt-review", label: "Debt Review", icon: TableProperties, reviewTab: "debts" },
      { to: "/solicitor/debt-analysis-engine/debt-summary", label: "Debt Summary", icon: ClipboardList },
      { to: "/solicitor/debt-analysis-engine/priority-debts", label: "Priority Debts", icon: AlertTriangle },
      { to: "/solicitor/debt-analysis-engine/non-priority-debts", label: "Non-Priority Debts", icon: CreditCard },
      { to: "/solicitor/debt-analysis-engine/secured-debts", label: "Secured Debts", icon: Shield },
    ],
  },
  {
    group: "Vulnerability Assessment",
    items: [
      { to: "/solicitor/review/vulnerability-review", label: "Vulnerability Review", icon: ShieldQuestion, reviewTab: "vulnerabilities" },
      { to: "/solicitor/vulnerability-assessment/risk-assessment", label: "Risk Assessment", icon: ShieldAlert },
      { to: "/solicitor/vulnerability-assessment/solicitor-review-flag", label: "Solicitor Review Flag", icon: Flag },
    ],
  },
  {
    group: "Debt Solution Engine",
    items: [
      { to: "/solicitor/review/ai-recommendation", label: "AI Recommendation", icon: Sparkles, reviewTab: "ai_rec" },
      { to: "/solicitor/review/decision", label: "Decision", icon: Scale, reviewTab: "ai_rec" },
      { to: "/solicitor/debt-solution-engine/advantages", label: "Advantages", icon: CheckCircle2 },
      { to: "/solicitor/debt-solution-engine/disadvantages", label: "Disadvantages", icon: AlertTriangle },
      { to: "/solicitor/debt-solution-engine/eligibility", label: "Eligibility", icon: ClipboardCheck },
      { to: "/solicitor/debt-solution-engine/risks", label: "Risks", icon: ShieldAlert },
      { to: "/solicitor/debt-solution-engine/alternative-options", label: "Alternative Options", icon: GitBranch },
      { to: "/solicitor/debt-solution-engine/why-recommended", label: "Why Recommended", icon: FileCheck2 },
      { to: "/solicitor/debt-solution-engine/why-rejected", label: "Why Rejected", icon: Flag },
    ],
  },
  {
    group: "AI Legal Rules Engine",
    items: [
      { to: "/solicitor/rules/legal", label: "Legal Rules", icon: Scale },
      { to: "/solicitor/rules/financial", label: "Financial Rules", icon: PiggyBank },
      { to: "/solicitor/rules/risk", label: "Risk Rules", icon: ShieldAlert },
      { to: "/solicitor/rules/debt-solution", label: "Debt Solution Rules", icon: Gauge },
      { to: "/solicitor/rules/vulnerability", label: "Vulnerability Rules", icon: ShieldQuestion },
      { to: "/solicitor/rules/document-templates", label: "Document Templates", icon: FileText },
      { to: "/solicitor/rules/workflow-reminders", label: "Workflow & Reminders", icon: Workflow },
      { to: "/solicitor/rules/sla", label: "SLA Rules", icon: Clock3 },
    ],
  },
  {
    group: "Risk Engine",
    items: [
      { to: "/solicitor/review/risk-review", label: "Risk Review", icon: ShieldAlert, reviewTab: "risks" },
      { to: "/solicitor/risk-engine/risk-identification", label: "Risk Identification", icon: FileSearch },
      { to: "/solicitor/risk-engine/risk-score", label: "Risk Score", icon: Gauge },
      { to: "/solicitor/risk-engine/missing-documents", label: "Missing Documents", icon: FileWarning },
    ],
  },
  {
    group: "Document Generator",
    items: [
      { to: "/solicitor/documents", label: "Document List", icon: FolderOpen },
      { to: "/solicitor/letters/financial-statement", label: "Financial Statement", icon: FileText },
      { to: "/solicitor/letters/income-expenditure", label: "Income & Expenditure Report", icon: FileText },
      { to: "/solicitor/letters/debt-schedule", label: "Debt Schedule", icon: FileText },
      { to: "/solicitor/letters/asset-schedule", label: "Asset Schedule", icon: FileText },
      { to: "/solicitor/letters/liability-schedule", label: "Liability Schedule", icon: FileText },
      { to: "/solicitor/letters/debt-options-report", label: "Debt Options Report", icon: FileText },
      { to: "/solicitor/letters/advice-letter", label: "Advice Letter", icon: Mail },
      { to: "/solicitor/letters/creditor-letters", label: "Creditor Letters", icon: Mail },
      { to: "/solicitor/letters/referral-letter", label: "Referral Letter", icon: Send },
      { to: "/solicitor/letters/matter-strategy", label: "Matter Strategy", icon: ScrollText },
      { to: "/solicitor/letters/file-review-checklist", label: "File Review Checklist", icon: ClipboardCheck },
      { to: "/solicitor/letters/closing-letter", label: "Closing Letter", icon: FileCheck2 },
    ],
  },
  {
    group: "Referral Engine",
    items: [
      { to: "/solicitor/referrals", label: "Referral List", icon: Handshake },
      { to: "/solicitor/referrals/create", label: "Create Referral", icon: Send },
      { to: "/solicitor/referrals/pack", label: "Referral Pack", icon: FolderOpen },
      { to: "/solicitor/referrals/status", label: "Referral Status", icon: Activity },
    ],
  },
  {
    group: "Compliance Engine",
    items: [
      { to: "/solicitor/audit", label: "Audit Log", icon: History },
      { to: "/solicitor/compliance/alerts", label: "Compliance Alerts", icon: AlertTriangle },
      { to: "/solicitor/compliance/advice-history", label: "Advice History", icon: BookOpen },
      { to: "/solicitor/compliance/document-history", label: "Document History", icon: FileStack },
      { to: "/solicitor/compliance/version-control", label: "Version Control", icon: GitBranch },
      { to: "/solicitor/compliance/conflict-checks", label: "Conflict Checks", icon: ShieldCheck },
      { to: "/solicitor/compliance/identity-checks", label: "Identity Checks", icon: UserCheck },
      { to: "/solicitor/compliance/client-consent", label: "Client Consent", icon: FileSignature },
      { to: "/solicitor/compliance/gdpr-records", label: "GDPR Records", icon: ShieldCheck },
      { to: "/solicitor/compliance/matter-reviews", label: "Matter Reviews", icon: ClipboardCheck },
      { to: "/solicitor/compliance/approvals", label: "Approvals", icon: CheckCircle2 },
    ],
  },
  {
    group: "Reporting",
    items: [
      { to: "/solicitor/reports/management", label: "Management Reports", icon: PieChart },
      { to: "/solicitor/reports/matter-outcomes", label: "Matter Outcomes", icon: ClipboardList },
      { to: "/solicitor/reports/debt-solutions", label: "Debt Solutions", icon: Banknote },
      { to: "/solicitor/reports/referrals", label: "Referrals", icon: Handshake },
      { to: "/solicitor/reports/client-satisfaction", label: "Client Satisfaction", icon: UserCheck },
      { to: "/solicitor/reports/solicitor-approval-rates", label: "Solicitor Approval Rates", icon: CheckCircle2 },
      { to: "/solicitor/reports/compliance-exceptions", label: "Compliance Exceptions", icon: AlertTriangle },
      { to: "/solicitor/reports/vulnerability-statistics", label: "Vulnerability Statistics", icon: ShieldQuestion },
    ],
  },
  {
    group: "Integrations",
    items: [
      { to: "/solicitor/integrations", label: "All Integrations", icon: Plug },
      { to: "/solicitor/integrations/clio", label: "Clio", icon: Building2 },
      { to: "/solicitor/integrations/xero", label: "Xero", icon: Banknote },
      { to: "/solicitor/integrations/microsoft-365", label: "Microsoft 365", icon: Cloud },
      { to: "/solicitor/integrations/open-banking", label: "Open Banking", icon: Network },
      { to: "/solicitor/integrations/ocr", label: "OCR / Document Processing", icon: ScanLine },
      { to: "/solicitor/integrations/e-signature", label: "E-signature", icon: FileSignature },
    ],
  },
];
