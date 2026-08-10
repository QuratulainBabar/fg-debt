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
  Cloud,
  FileCheck2,
  FileSignature,
  FileStack,
  FileText,
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
  Scale,
  ScanLine,
  ScrollText,
  Send,
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
      { to: "/solicitor/notifications", label: "Alerts", icon: Bell },
      { to: "/solicitor/tasks", label: "Tasks", icon: ListTodo },
    ],
  },
  {
    group: "Matter Review",
    items: [
      { to: "/solicitor/review/overview", label: "Overview", icon: ClipboardList, reviewTab: "overview" },
      { to: "/solicitor/review/financial-statement", label: "Financial Statement", icon: Banknote, reviewTab: "financial" },
      { to: "/solicitor/review/debt-review", label: "Debt Review", icon: TableProperties, reviewTab: "debts" },
      { to: "/solicitor/review/vulnerability-review", label: "Vulnerability Review", icon: ShieldQuestion, reviewTab: "vulnerabilities" },
      { to: "/solicitor/review/risk-review", label: "Risk Review", icon: ShieldAlert, reviewTab: "risks" },
      { to: "/solicitor/review/ai-recommendation", label: "AI Recommendation", icon: Sparkles, reviewTab: "ai_rec" },
      { to: "/solicitor/review/decision", label: "Decision", icon: Scale, reviewTab: "ai_rec" },
    ],
  },
  {
    group: "Documents & Letters",
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
    group: "Referrals",
    items: [
      { to: "/solicitor/referrals", label: "Referral List", icon: Handshake },
      { to: "/solicitor/referrals/create", label: "Create Referral", icon: Send },
      { to: "/solicitor/referrals/pack", label: "Referral Pack", icon: FolderOpen },
      { to: "/solicitor/referrals/status", label: "Referral Status", icon: Activity },
    ],
  },
  {
    group: "Compliance & Audit",
    items: [
      { to: "/solicitor/audit", label: "Audit Log", icon: History },
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
    group: "Rules & Configuration",
    items: [
      { to: "/solicitor/rules/legal", label: "Legal Rules", icon: Scale },
      { to: "/solicitor/rules/risk", label: "Risk Rules", icon: ShieldAlert },
      { to: "/solicitor/rules/debt-solution", label: "Debt Solution Rules", icon: Gauge },
      { to: "/solicitor/rules/vulnerability", label: "Vulnerability Rules", icon: ShieldQuestion },
      { to: "/solicitor/rules/document-templates", label: "Document Templates", icon: FileText },
      { to: "/solicitor/rules/workflow-reminders", label: "Workflow & Reminders", icon: Workflow },
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
      { to: "/solicitor/integrations/clio", label: "Clio", icon: Building2 },
      { to: "/solicitor/integrations/xero", label: "Xero", icon: Banknote },
      { to: "/solicitor/integrations/microsoft-365", label: "Microsoft 365", icon: Cloud },
      { to: "/solicitor/integrations/open-banking", label: "Open Banking", icon: Network },
      { to: "/solicitor/integrations/ocr", label: "OCR / Document Processing", icon: ScanLine },
      { to: "/solicitor/integrations/e-signature", label: "E-signature", icon: FileSignature },
    ],
  },
];
