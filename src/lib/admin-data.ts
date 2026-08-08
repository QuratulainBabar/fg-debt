export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "client" | "solicitor" | "supervisor" | "admin";
  status: "active" | "invited" | "suspended";
  createdAt: string;
  lastLogin: string;
  assignedMatters?: number;
  title?: string;
}

export interface ComplianceAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  message: string;
  matterId?: string;
  timestamp: string;
  resolved: boolean;
  assignee?: string;
}

export interface RecentAction {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  category: "user" | "matter" | "document" | "rule" | "system";
}

export interface IntegrationStatus {
  id: string;
  name: string;
  category: string;
  status: "operational" | "degraded" | "offline";
  uptime: string;
  lastSync: string;
  latency?: string;
}

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

export interface LegalRule {
  id: string;
  name: string;
  jurisdiction: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: "active" | "draft" | "archived";
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  usageCount: number;
  lastModified: string;
  status: "published" | "draft";
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  enabled: boolean;
  lastRun: string;
}

export interface ReferralPartner {
  id: string;
  name: string;
  type: string;
  contactName: string;
  status: "active" | "inactive";
  mattersReferred: number;
  conversionRate: string;
}

export const ADMIN_USERS: AdminUser[] = [
  { id: "ADM-001", name: "James Whitfield", email: "j.whitfield@fgdebtadvisor.co.uk", role: "admin", status: "active", createdAt: "2024-11-02", lastLogin: "2026-08-07 09:12", title: "Platform Administrator" },
  { id: "SUP-001", name: "Patricia Holloway", email: "p.holloway@fgdebtadvisor.co.uk", role: "supervisor", status: "active", createdAt: "2025-01-15", lastLogin: "2026-08-07 08:40", assignedMatters: 42, title: "Senior Supervising Solicitor" },
  { id: "SUP-002", name: "Daniel Acheampong", email: "d.acheampong@fgdebtadvisor.co.uk", role: "supervisor", status: "active", createdAt: "2025-03-22", lastLogin: "2026-08-06 17:20", assignedMatters: 38, title: "Compliance Supervisor" },
  { id: "SOL-001", name: "Rachel Okonkwo", email: "r.okonkwo@fgdebtadvisor.co.uk", role: "solicitor", status: "active", createdAt: "2025-04-10", lastLogin: "2026-08-07 08:55", assignedMatters: 8, title: "Lead Insolvency Solicitor" },
  { id: "SOL-002", name: "Meera Shah", email: "m.shah@fgdebtadvisor.co.uk", role: "solicitor", status: "active", createdAt: "2025-05-18", lastLogin: "2026-08-07 07:30", assignedMatters: 6, title: "Solicitor" },
  { id: "SOL-003", name: "Thomas Reeves", email: "t.reeves@fgdebtadvisor.co.uk", role: "solicitor", status: "invited", createdAt: "2026-08-05", lastLogin: "Never", title: "Solicitor" },
  { id: "CLI-2401", name: "Amelia Hartley", email: "amelia.hartley@example.co.uk", role: "client", status: "active", createdAt: "2026-06-12", lastLogin: "2026-08-06 20:14" },
  { id: "CLI-2402", name: "Marcus Vance", email: "m.vance@vancetech.co.uk", role: "client", status: "active", createdAt: "2026-07-01", lastLogin: "2026-08-07 08:22" },
  { id: "CLI-2403", name: "Sarah Jenkins", email: "s.jenkins@outlook.com", role: "client", status: "active", createdAt: "2026-08-06", lastLogin: "2026-08-06 18:48" },
];

export const TOTAL_USERS = 2847;
export const ACTIVE_CLIENTS = 142;
export const ACTIVE_SOLICITORS = 8;
export const ACTIVE_SUPERVISORS = 3;
export const TOTAL_MATTERS = 238;

export const COMPLIANCE_ALERTS: ComplianceAlert[] = [
  { id: "CMP-1001", severity: "critical", type: "SRA Audit Threshold", message: "Solicitor overrides exceed 15% this week — SRA mandate requires supervising solicitor review.", timestamp: "18 minutes ago", resolved: false, assignee: "Patricia Holloway" },
  { id: "CMP-1002", severity: "high", type: "Vulnerability Sign-off", message: "Matter MAT-2026-3104 (critical hardship) lacks vulnerability framework sign-off before Breathing Space submission.", matterId: "MAT-2026-3104", timestamp: "1 hour ago", resolved: false },
  { id: "CMP-1003", severity: "high", type: "Statutory Demand Deadline", message: "HMRC statutory demand in MAT-2026-8801 has 6 days remaining before escalation threshold.", matterId: "MAT-2026-8801", timestamp: "2 hours ago", resolved: false },
  { id: "CMP-1004", severity: "medium", type: "Document Retention", message: "37 matters approaching 7-year GDPR document retention review date.", timestamp: "5 hours ago", resolved: false },
  { id: "CMP-1005", severity: "medium", type: "CPD Training Due", message: "2 solicitors have anti-money laundering CPD modules expiring within 14 days.", timestamp: "Yesterday", resolved: false },
  { id: "CMP-1006", severity: "low", type: "Data Quality Review", message: "12 client records missing NI number verification flag.", timestamp: "Yesterday", resolved: true },
];

export const RECENT_ACTIONS: RecentAction[] = [
  { id: "ACT-5001", actor: "Rachel Okonkwo", role: "Solicitor", action: "Approved IVA advice package", target: "MAT-2026-7492", timestamp: "12 mins ago", category: "matter" },
  { id: "ACT-5002", actor: "James Whitfield", role: "Admin", action: "Updated DRO qualifying debt ceiling rule", target: "Legal Rule §UK-DRO-004", timestamp: "34 mins ago", category: "rule" },
  { id: "ACT-5003", actor: "System", role: "Automated", action: "OCR failed confidence threshold", target: "DOC-1101 Statement", timestamp: "1 hour ago", category: "document" },
  { id: "ACT-5004", actor: "Patricia Holloway", role: "Supervisor", action: "Signed off override decision", target: "MAT-2026-9210", timestamp: "2 hours ago", category: "matter" },
  { id: "ACT-5005", actor: "James Whitfield", role: "Admin", action: "Created user invitation", target: "Thomas Reeves (Solicitor)", timestamp: "3 hours ago", category: "user" },
  { id: "ACT-5006", actor: "System", role: "Automated", action: "AI model nightly sync completed", target: "FG Debt AI v4.2", timestamp: "04:12 today", category: "system" },
  { id: "ACT-5007", actor: "Meera Shah", role: "Solicitor", action: "Submitted Breathing Space moratorium", target: "MAT-2026-3104", timestamp: "Yesterday", category: "matter" },
  { id: "ACT-5008", actor: "James Whitfield", role: "Admin", action: "Published document template v3", target: "DRO Suitability Letter", timestamp: "Yesterday", category: "document" },
];

export const INTEGRATIONS: IntegrationStatus[] = [
  { id: "INT-01", name: "Insolvency Service API", category: "Regulatory", status: "operational", uptime: "99.98%", lastSync: "2 mins ago", latency: "140ms" },
  { id: "INT-02", name: "HMRC Data Connect", category: "Revenue", status: "operational", uptime: "99.82%", lastSync: "5 mins ago", latency: "310ms" },
  { id: "INT-03", name: "Experian Credit Reference", category: "Credit Data", status: "operational", uptime: "99.91%", lastSync: "1 min ago", latency: "220ms" },
  { id: "INT-04", name: "OCR Document Engine", category: "AI / ML", status: "degraded", uptime: "98.40%", lastSync: "8 mins ago", latency: "1,240ms" },
  { id: "INT-05", name: "Land Registry Gateway", category: "Property", status: "operational", uptime: "99.65%", lastSync: "12 mins ago", latency: "440ms" },
  { id: "INT-06", name: "Notify Gov.uk SMS/Email", category: "Communications", status: "operational", uptime: "100%", lastSync: "Just now", latency: "80ms" },
  { id: "INT-07", name: "Companies House API", category: "Business Data", status: "offline", uptime: "92.10%", lastSync: "2 hours ago" },
  { id: "INT-08", name: "SRA Compliance Register", category: "Regulatory", status: "operational", uptime: "99.70%", lastSync: "20 mins ago", latency: "190ms" },
];

export const SYSTEM_ACTIVITY = [
  { hour: "00", users: 4, matters: 1, docs: 2 },
  { hour: "02", users: 2, matters: 0, docs: 1 },
  { hour: "04", users: 6, matters: 0, docs: 3 },
  { hour: "06", users: 18, matters: 2, docs: 8 },
  { hour: "08", users: 62, matters: 9, docs: 34 },
  { hour: "10", users: 118, matters: 18, docs: 68 },
  { hour: "12", users: 104, matters: 22, docs: 62 },
  { hour: "14", users: 132, matters: 26, docs: 78 },
  { hour: "16", users: 114, matters: 19, docs: 71 },
  { hour: "18", users: 86, matters: 12, docs: 48 },
  { hour: "20", users: 58, matters: 6, docs: 29 },
  { hour: "22", users: 22, matters: 3, docs: 14 },
];

export const ROLE_PERMISSIONS: RolePermission[] = [
  { id: "RL-1", name: "Platform Administrator", description: "Full system access including legal rule configuration.", userCount: 2, permissions: ["all"] },
  { id: "RL-2", name: "Supervising Solicitor", description: "Case oversight, override sign-off, compliance audit.", userCount: 3, permissions: ["matter.approve_override", "audit.view", "compliance.manage", "documents.sign_off"] },
  { id: "RL-3", name: "Case Solicitor", description: "Matter review, document OCR verification, client communication.", userCount: 8, permissions: ["matter.review", "documents.review", "client.communicate", "tasks.assign"] },
  { id: "RL-4", name: "Client Portal User", description: "Self-service debt assessment, document upload, AI assistant.", userCount: 2834, permissions: ["assessment.submit", "documents.upload", "messages.send", "profile.edit"] },
  { id: "RL-5", name: "Compliance Auditor", description: "Read-only audit access and regulatory reporting export.", userCount: 1, permissions: ["audit.view", "reports.export", "logs.view"] },
];

export const LEGAL_RULES: LegalRule[] = [
  { id: "R-LE-001", name: "DRO Qualifying Debt Threshold", jurisdiction: "England & Wales", category: "Insolvency", version: "v4.1", lastUpdated: "2026-07-02", status: "active" },
  { id: "R-LE-002", name: "DRO Surplus Income Cap (£75)", jurisdiction: "England & Wales", category: "Insolvency", version: "v2.0", lastUpdated: "2026-04-11", status: "active" },
  { id: "R-LE-003", name: "IVA Creditor Voting Threshold (75%)", jurisdiction: "England & Wales", category: "Insolvency", version: "v1.4", lastUpdated: "2025-12-18", status: "active" },
  { id: "R-LE-004", name: "Scottish DAS Eligibility", jurisdiction: "Scotland", category: "Debt Scheme", version: "v3.2", lastUpdated: "2026-06-14", status: "active" },
  { id: "R-LE-005", name: "Breathing Space Moratorium (60 days)", jurisdiction: "UK-wide", category: "Emergency Protection", version: "v1.1", lastUpdated: "2026-05-08", status: "active" },
  { id: "R-LE-006", name: "Priority Debt Hierarchy Matrix", jurisdiction: "England & Wales", category: "Enforcement", version: "v2.3", lastUpdated: "2026-03-22", status: "draft" },
];

export const FINANCIAL_RULES: LegalRule[] = [
  { id: "R-FI-001", name: "Common Financial Statement CFS v6", jurisdiction: "UK-wide", category: "Income/Expenditure", version: "v6.0", lastUpdated: "2026-06-01", status: "active" },
  { id: "R-FI-002", name: "Standard Financial Statement (SFS)", jurisdiction: "England & Wales", category: "Income/Expenditure", version: "v3.2", lastUpdated: "2026-05-20", status: "active" },
  { id: "R-FI-003", name: "Disposable Income Calculation", jurisdiction: "UK-wide", category: "Surplus", version: "v4.1", lastUpdated: "2026-07-12", status: "active" },
];

export const DEBT_SOLUTION_RULES: LegalRule[] = [
  { id: "R-DS-001", name: "DRO Solution Eligibility Matrix", jurisdiction: "England & Wales", category: "Debt Solution", version: "v5.0", lastUpdated: "2026-07-15", status: "active" },
  { id: "R-DS-002", name: "IVA Suitability Scorecard", jurisdiction: "England & Wales", category: "Debt Solution", version: "v3.4", lastUpdated: "2026-06-30", status: "active" },
  { id: "R-DS-003", name: "DMP Affordability Calculator", jurisdiction: "UK-wide", category: "Debt Solution", version: "v2.8", lastUpdated: "2026-05-18", status: "active" },
  { id: "R-DS-004", name: "Bankruptcy vs IVA Triage", jurisdiction: "England & Wales", category: "Debt Solution", version: "v2.1", lastUpdated: "2026-04-02", status: "active" },
  { id: "R-DS-005", name: "Protected Trust Deed (Scotland)", jurisdiction: "Scotland", category: "Debt Solution", version: "v1.6", lastUpdated: "2026-06-12", status: "active" },
];

export const RISK_RULES: LegalRule[] = [
  { id: "R-RS-001", name: "Client Risk Scoring Model", jurisdiction: "UK-wide", category: "Risk", version: "v7.2", lastUpdated: "2026-07-28", status: "active" },
  { id: "R-RS-002", name: "Critical Enforcement Escalation", jurisdiction: "UK-wide", category: "Risk", version: "v2.5", lastUpdated: "2026-06-04", status: "active" },
  { id: "R-RS-003", name: "Statutory Demand Deadline Trigger", jurisdiction: "England & Wales", category: "Risk", version: "v1.8", lastUpdated: "2026-07-01", status: "active" },
  { id: "R-RS-004", name: "Money Laundering (AML) Red Flags", jurisdiction: "UK-wide", category: "Risk", version: "v3.0", lastUpdated: "2026-05-16", status: "active" },
];

export const VULNERABILITY_RULES: LegalRule[] = [
  { id: "R-VN-001", name: "FCA Vulnerability Framework v2", jurisdiction: "UK-wide", category: "Vulnerability", version: "v2.3", lastUpdated: "2026-07-11", status: "active" },
  { id: "R-VN-002", name: "Mental Health Capacity Sign-off", jurisdiction: "UK-wide", category: "Vulnerability", version: "v1.5", lastUpdated: "2026-06-18", status: "active" },
  { id: "R-VN-003", name: "Domestic Abuse Safe Harbour Protocol", jurisdiction: "UK-wide", category: "Vulnerability", version: "v1.2", lastUpdated: "2026-05-28", status: "active" },
  { id: "R-VN-004", name: "Accessibility / Reasonable Adjustments", jurisdiction: "UK-wide", category: "Vulnerability", version: "v1.7", lastUpdated: "2026-06-30", status: "active" },
  { id: "R-VN-005", name: "Language & Translation Mandates", jurisdiction: "UK-wide", category: "Vulnerability", version: "v1.0", lastUpdated: "2026-04-20", status: "active" },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  { id: "DT-001", name: "DRO Suitability Advice Letter", category: "DRO", usageCount: 1242, lastModified: "2026-08-05", status: "published" },
  { id: "DT-002", name: "IVA Nominee Report Package", category: "IVA", usageCount: 832, lastModified: "2026-07-30", status: "published" },
  { id: "DT-003", name: "DMP Proposal & Schedule", category: "DMP", usageCount: 2108, lastModified: "2026-08-02", status: "published" },
  { id: "DT-004", name: "Breathing Space (Form SB1)", category: "Emergency", usageCount: 194, lastModified: "2026-07-12", status: "published" },
  { id: "DT-005", name: "Client Engagement Letter", category: "Onboarding", usageCount: 4210, lastModified: "2026-06-14", status: "published" },
  { id: "DT-006", name: "Vulnerability Sign-off Notice", category: "Compliance", usageCount: 358, lastModified: "2026-08-01", status: "draft" },
  { id: "DT-007", name: "Solicitor Override Record", category: "Compliance", usageCount: 74, lastModified: "2026-07-21", status: "published" },
  { id: "DT-008", name: "SRA Audit Confirmation Letter", category: "Compliance", usageCount: 18, lastModified: "2026-05-09", status: "published" },
];

export const WORKFLOWS: Workflow[] = [
  { id: "WF-001", name: "New Matter Auto-Assignment", trigger: "Matter created", steps: 4, enabled: true, lastRun: "2026-08-07 09:10" },
  { id: "WF-002", name: "Vulnerability Flag Escalation", trigger: "Vulnerability detected", steps: 5, enabled: true, lastRun: "2026-08-07 08:50" },
  { id: "WF-003", name: "Statutory Demand 7-Day Warning", trigger: "OCR detects demand", steps: 3, enabled: true, lastRun: "2026-08-07 06:15" },
  { id: "WF-004", name: "Reminder — Client Document Upload", trigger: "Docs overdue 48h", steps: 2, enabled: true, lastRun: "2026-08-07 07:00" },
  { id: "WF-005", name: "Supervisor Override Sign-off", trigger: "Solicitor override", steps: 3, enabled: true, lastRun: "2026-08-06 15:22" },
  { id: "WF-006", name: "Matter Archival after Completion", trigger: "Matter completed 180d", steps: 4, enabled: false, lastRun: "2026-07-20" },
];

export const REMINDER_SETTINGS = [
  { id: "RM-01", name: "Document upload requested", channel: "Email + SMS", interval: "48h after request", enabled: true, sentLast7d: 342 },
  { id: "RM-02", name: "Solicitor review approaching SLA", channel: "In-app + Email", interval: "2h before breach", enabled: true, sentLast7d: 48 },
  { id: "RM-03", name: "Matter check-in (inactive)", channel: "Email only", interval: "Every 14 days", enabled: true, sentLast7d: 126 },
  { id: "RM-04", name: "Supervisor escalation", channel: "Email + SMS", interval: "Critical risk for 1h", enabled: true, sentLast7d: 12 },
  { id: "RM-05", name: "CPD training expiry", channel: "Email", interval: "30d, 14d, 7d", enabled: true, sentLast7d: 4 },
  { id: "RM-06", name: "GDPR retention review", channel: "Email", interval: "30d before expiry", enabled: false, sentLast7d: 0 },
];

export const REFERRAL_PARTNERS: ReferralPartner[] = [
  { id: "RP-001", name: "Lowell & Grange Insolvency Practitioners", type: "Insolvency Practitioner", contactName: "Mark Evans", status: "active", mattersReferred: 128, conversionRate: "89%" },
  { id: "RP-002", name: "Glasgow Money Advice Service", type: "Scottish DAS Partner", contactName: "Ian McTavish", status: "active", mattersReferred: 54, conversionRate: "76%" },
  { id: "RP-003", name: "Shelter UK Housing Legal Aid", type: "Housing / Legal Aid", contactName: "Bristol Office", status: "active", mattersReferred: 36, conversionRate: "68%" },
  { id: "RP-004", name: "PayPlan DMP Administration", type: "Debt Management Plan", contactName: "Sarah Blake", status: "active", mattersReferred: 212, conversionRate: "93%" },
  { id: "RP-005", name: "StepChange DRO Intermediary", type: "DRO Intermediary", contactName: "Team Lead", status: "inactive", mattersReferred: 44, conversionRate: "82%" },
  { id: "RP-006", name: "Mind UK Mental Health Support", type: "Vulnerability Support", contactName: "Partner Liaison", status: "active", mattersReferred: 28, conversionRate: "N/A" },
];

export const AUDIT_LOGS = RECENT_ACTIONS.concat([
  { id: "ACT-5100", actor: "James Whitfield", role: "Admin", action: "Added new legal rule", target: "R-RS-004 AML Red Flags v3.0", timestamp: "2026-08-06 18:12", category: "rule" as const },
  { id: "ACT-5101", actor: "Patricia Holloway", role: "Supervisor", action: "Exported SRA quarterly audit report", target: "sra-audit-q3-2026.csv", timestamp: "2026-08-06 16:48", category: "system" as const },
  { id: "ACT-5102", actor: "System", role: "Automated", action: "Archived 18 matters", target: "retention-policy-180d", timestamp: "2026-08-06 04:00", category: "system" as const },
  { id: "ACT-5103", actor: "Daniel Acheampong", role: "Supervisor", action: "Suspended user account", target: "SOL-007 (access revoked)", timestamp: "2026-08-05 14:20", category: "user" as const },
  { id: "ACT-5104", actor: "Rachel Okonkwo", role: "Solicitor", action: "Rejected AI recommendation", target: "MAT-2026-9210 (override)", timestamp: "2026-08-05 11:30", category: "matter" as const },
]);

export function getAdminKPIMetrics() {
  return {
    totalUsers: TOTAL_USERS,
    activeClients: ACTIVE_CLIENTS,
    activeSolicitors: ACTIVE_SOLICITORS,
    activeSupervisors: ACTIVE_SUPERVISORS,
    totalMatters: TOTAL_MATTERS,
    complianceOpen: COMPLIANCE_ALERTS.filter((a) => !a.resolved).length,
    complianceCritical: COMPLIANCE_ALERTS.filter((a) => a.severity === "critical" && !a.resolved).length,
    operationalIntegrations: INTEGRATIONS.filter((i) => i.status === "operational").length,
    degradedIntegrations: INTEGRATIONS.filter((i) => i.status === "degraded" || i.status === "offline").length,
  };
}
