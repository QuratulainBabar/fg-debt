import { COMPLIANCE_ALERTS, SYSTEM_ACTIVITY } from "@/lib/admin-data";
import { INITIAL_MATTERS, type Matter } from "@/lib/solicitor-data";

export type OverrideStatus = "awaiting_signoff" | "signed_off" | "escalated" | "rejected";
export type SensitiveApprovalStatus = "pending" | "approved" | "returned";
export type QualityReviewStatus = "scheduled" | "in_progress" | "completed" | "action_required";
export type DecisionOutcome = "approve" | "amend" | "reject" | "override";

export interface AiOverrideCase {
  id: string;
  matterId: string;
  clientName: string;
  solicitor: string;
  aiRecommendation: string;
  overrideSolution: string;
  reason: string;
  status: OverrideStatus;
  riskLevel: "high" | "critical";
  submittedAt: string;
  slaHoursRemaining: number;
}

export interface SolicitorDecisionRecord {
  id: string;
  matterId: string;
  clientName: string;
  solicitor: string;
  outcome: DecisionOutcome;
  aiRecommendation: string;
  finalSolution: string;
  decidedAt: string;
  requiresSupervisorReview: boolean;
  notes: string;
}

export interface SensitiveCaseApproval {
  id: string;
  matterId: string;
  clientName: string;
  category: "vulnerability" | "aml" | "high_value" | "public_interest" | "domestic_abuse";
  solicitor: string;
  summary: string;
  status: SensitiveApprovalStatus;
  submittedAt: string;
  dueBy: string;
}

export interface QualityReviewItem {
  id: string;
  matterId: string;
  clientName: string;
  solicitor: string;
  reviewer: string;
  score?: number;
  findings: string;
  status: QualityReviewStatus;
  reviewedAt: string;
}

export interface SupervisorAuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  category: "override" | "compliance" | "quality" | "sensitive" | "decision" | "system";
}

export interface SupervisorNotification {
  id: string;
  title: string;
  body: string;
  matterId?: string;
  timestamp: string;
  unread: boolean;
  severity: "critical" | "high" | "medium" | "info";
}

export const SUPERVISOR_OVERRIDES: AiOverrideCase[] = [
  {
    id: "OVR-2201",
    matterId: "MAT-2026-9210",
    clientName: "Elena Petrova",
    solicitor: "Meera Shah",
    aiRecommendation: "Debt Management Plan (DMP)",
    overrideSolution: "Individual Voluntary Arrangement (IVA)",
    reason: "Client has surplus income and creditor pressure making DMP unsuitable; IVA better protects assets.",
    status: "awaiting_signoff",
    riskLevel: "high",
    submittedAt: "2 hours ago",
    slaHoursRemaining: 6,
  },
  {
    id: "OVR-2202",
    matterId: "MAT-2026-8801",
    clientName: "Marcus Vance",
    solicitor: "Rachel Okonkwo",
    aiRecommendation: "Individual Voluntary Arrangement (IVA)",
    overrideSolution: "Breathing Space + IVA",
    reason: "HMRC statutory demand requires emergency Breathing Space before IVA proposal.",
    status: "awaiting_signoff",
    riskLevel: "critical",
    submittedAt: "45 mins ago",
    slaHoursRemaining: 2,
  },
  {
    id: "OVR-2203",
    matterId: "MAT-2026-5512",
    clientName: "Omar Farooq",
    solicitor: "Thomas Reeves",
    aiRecommendation: "Debt Relief Order (DRO)",
    overrideSolution: "Token Payment Plan",
    reason: "Asset valuation disputed; DRO may be challenged — temporary token plan pending valuation.",
    status: "escalated",
    riskLevel: "high",
    submittedAt: "Yesterday",
    slaHoursRemaining: 0,
  },
  {
    id: "OVR-2204",
    matterId: "MAT-2026-4417",
    clientName: "Amelia Hartley",
    solicitor: "Rachel Okonkwo",
    aiRecommendation: "Debt Relief Order (DRO)",
    overrideSolution: "Debt Relief Order (DRO)",
    reason: "Minor amendment to surplus calculation only — supervisor confirmed DRO remains correct.",
    status: "signed_off",
    riskLevel: "high",
    submittedAt: "2 days ago",
    slaHoursRemaining: 24,
  },
];

export const SOLICITOR_DECISIONS: SolicitorDecisionRecord[] = [
  {
    id: "DEC-901",
    matterId: "MAT-2026-7492",
    clientName: "James Cotter",
    solicitor: "Rachel Okonkwo",
    outcome: "approve",
    aiRecommendation: "Individual Voluntary Arrangement (IVA)",
    finalSolution: "Individual Voluntary Arrangement (IVA)",
    decidedAt: "12 mins ago",
    requiresSupervisorReview: false,
    notes: "IVA package approved without amendment.",
  },
  {
    id: "DEC-902",
    matterId: "MAT-2026-8801",
    clientName: "Marcus Vance",
    solicitor: "Rachel Okonkwo",
    outcome: "override",
    aiRecommendation: "Individual Voluntary Arrangement (IVA)",
    finalSolution: "Breathing Space + IVA",
    decidedAt: "45 mins ago",
    requiresSupervisorReview: true,
    notes: "Override pending supervisor sign-off due to HMRC enforcement risk.",
  },
  {
    id: "DEC-903",
    matterId: "MAT-2026-3104",
    clientName: "Sarah Jenkins",
    solicitor: "Meera Shah",
    outcome: "amend",
    aiRecommendation: "Breathing Space",
    finalSolution: "Breathing Space + Vulnerability Framework",
    decidedAt: "1 hour ago",
    requiresSupervisorReview: true,
    notes: "Amended to require vulnerability sign-off before moratorium filing.",
  },
  {
    id: "DEC-904",
    matterId: "MAT-2026-6620",
    clientName: "Priya Nair",
    solicitor: "Meera Shah",
    outcome: "reject",
    aiRecommendation: "Debt Relief Order (DRO)",
    finalSolution: "Further evidence required",
    decidedAt: "3 hours ago",
    requiresSupervisorReview: false,
    notes: "Rejected pending missing payslips and council tax statement.",
  },
  {
    id: "DEC-905",
    matterId: "MAT-2026-9210",
    clientName: "Elena Petrova",
    solicitor: "Meera Shah",
    outcome: "override",
    aiRecommendation: "Debt Management Plan (DMP)",
    finalSolution: "Individual Voluntary Arrangement (IVA)",
    decidedAt: "2 hours ago",
    requiresSupervisorReview: true,
    notes: "Full AI override — SRA threshold review required.",
  },
];

export const SENSITIVE_APPROVALS: SensitiveCaseApproval[] = [
  {
    id: "SEN-401",
    matterId: "MAT-2026-3104",
    clientName: "Sarah Jenkins",
    category: "vulnerability",
    solicitor: "Meera Shah",
    summary: "Critical hardship / carer vulnerability — Breathing Space requires supervising solicitor sign-off.",
    status: "pending",
    submittedAt: "1 hour ago",
    dueBy: "Today 17:00",
  },
  {
    id: "SEN-402",
    matterId: "MAT-2026-8801",
    clientName: "Marcus Vance",
    category: "high_value",
    solicitor: "Rachel Okonkwo",
    summary: "Business assets > £3k and HMRC priority debt — sensitive high-value approval required.",
    status: "pending",
    submittedAt: "2 hours ago",
    dueBy: "Tomorrow 12:00",
  },
  {
    id: "SEN-403",
    matterId: "MAT-2026-1188",
    clientName: "Anon. Referral",
    category: "domestic_abuse",
    solicitor: "Rachel Okonkwo",
    summary: "Safe-harbour protocol engaged — correspondence restrictions and third-party contact rules.",
    status: "pending",
    submittedAt: "Yesterday",
    dueBy: "Today 14:00",
  },
  {
    id: "SEN-404",
    matterId: "MAT-2026-4417",
    clientName: "Amelia Hartley",
    category: "aml",
    solicitor: "Rachel Okonkwo",
    summary: "Standard AML refresh completed — no red flags; ready for supervisor acknowledgement.",
    status: "approved",
    submittedAt: "3 days ago",
    dueBy: "Completed",
  },
];

export const QUALITY_REVIEWS: QualityReviewItem[] = [
  {
    id: "QR-701",
    matterId: "MAT-2026-7492",
    clientName: "James Cotter",
    solicitor: "Rachel Okonkwo",
    reviewer: "Patricia Holloway",
    score: 92,
    findings: "Advice letter clear; creditor schedule complete; minor CFS note missing.",
    status: "completed",
    reviewedAt: "Today 09:20",
  },
  {
    id: "QR-702",
    matterId: "MAT-2026-6620",
    clientName: "Priya Nair",
    solicitor: "Meera Shah",
    reviewer: "Patricia Holloway",
    findings: "Evidence pack incomplete — quality hold until payslips verified.",
    status: "action_required",
    reviewedAt: "Today 08:45",
  },
  {
    id: "QR-703",
    matterId: "MAT-2026-5512",
    clientName: "Omar Farooq",
    solicitor: "Thomas Reeves",
    reviewer: "Daniel Acheampong",
    findings: "Sampling in progress — reviewing override rationale and client communications.",
    status: "in_progress",
    reviewedAt: "Yesterday",
  },
  {
    id: "QR-704",
    matterId: "MAT-2026-4417",
    clientName: "Amelia Hartley",
    solicitor: "Rachel Okonkwo",
    reviewer: "Patricia Holloway",
    findings: "Scheduled peer review of DRO suitability notice.",
    status: "scheduled",
    reviewedAt: "Due Fri",
  },
];

export const SUPERVISOR_AUDIT: SupervisorAuditEvent[] = [
  { id: "SA-1", timestamp: "2026-08-07 10:18", actor: "Patricia Holloway", role: "Supervisor", action: "Opened override sign-off queue", target: "OVR-2202", category: "override" },
  { id: "SA-2", timestamp: "2026-08-07 09:55", actor: "Rachel Okonkwo", role: "Solicitor", action: "Submitted AI override for review", target: "MAT-2026-8801", category: "override" },
  { id: "SA-3", timestamp: "2026-08-07 09:12", actor: "Patricia Holloway", role: "Supervisor", action: "Signed off override decision", target: "MAT-2026-9210", category: "override" },
  { id: "SA-4", timestamp: "2026-08-07 08:40", actor: "System", role: "Compliance Engine", action: "SRA override threshold alert raised", target: "CMP-1001", category: "compliance" },
  { id: "SA-5", timestamp: "2026-08-06 17:20", actor: "Daniel Acheampong", role: "Supervisor", action: "Completed matter quality review", target: "QR-701", category: "quality" },
  { id: "SA-6", timestamp: "2026-08-06 16:05", actor: "Meera Shah", role: "Solicitor", action: "Requested sensitive vulnerability approval", target: "SEN-401", category: "sensitive" },
  { id: "SA-7", timestamp: "2026-08-06 14:30", actor: "Patricia Holloway", role: "Supervisor", action: "Returned quality review for action", target: "QR-702", category: "quality" },
  { id: "SA-8", timestamp: "2026-08-06 11:00", actor: "Rachel Okonkwo", role: "Solicitor", action: "Approved IVA advice package", target: "MAT-2026-7492", category: "decision" },
];

export const SUPERVISOR_NOTIFICATIONS: SupervisorNotification[] = [
  {
    id: "SN-1",
    title: "Critical override awaiting sign-off",
    body: "MAT-2026-8801 — Breathing Space + IVA override has 2 hours SLA remaining.",
    matterId: "MAT-2026-8801",
    timestamp: "45 mins ago",
    unread: true,
    severity: "critical",
  },
  {
    id: "SN-2",
    title: "SRA override threshold breached",
    body: "Solicitor overrides exceed 15% this week — supervising solicitor review required.",
    timestamp: "18 mins ago",
    unread: true,
    severity: "critical",
  },
  {
    id: "SN-3",
    title: "Sensitive vulnerability approval due",
    body: "MAT-2026-3104 requires vulnerability framework sign-off before Breathing Space.",
    matterId: "MAT-2026-3104",
    timestamp: "1 hour ago",
    unread: true,
    severity: "high",
  },
  {
    id: "SN-4",
    title: "Quality review action required",
    body: "QR-702 (Priya Nair) returned — evidence pack incomplete.",
    matterId: "MAT-2026-6620",
    timestamp: "Today 08:45",
    unread: false,
    severity: "medium",
  },
];

export const PLATFORM_PERFORMANCE = {
  activity: SYSTEM_ACTIVITY,
  kpis: {
    avgReviewTurnaroundHrs: 18.4,
    overrideSignOffRate: 94,
    qualityPassRate: 88,
    complianceOpen: COMPLIANCE_ALERTS.filter((a) => !a.resolved).length,
    solicitorDecisionVolume24h: SOLICITOR_DECISIONS.length,
    highRiskOpen: INITIAL_MATTERS.filter((m) => m.riskLevel === "high" || m.riskLevel === "critical").length,
  },
  solicitorLoad: [
    { name: "Rachel Okonkwo", matters: 8, overrides: 2, quality: 92 },
    { name: "Meera Shah", matters: 6, overrides: 3, quality: 86 },
    { name: "Thomas Reeves", matters: 4, overrides: 1, quality: 78 },
  ],
};

export function getHighRiskMatters(matters: Matter[] = INITIAL_MATTERS) {
  return matters.filter((m) => m.riskLevel === "high" || m.riskLevel === "critical");
}

export function getSupervisorKPIMetrics(matters: Matter[] = INITIAL_MATTERS) {
  const highRisk = getHighRiskMatters(matters);
  const pendingOverrides = SUPERVISOR_OVERRIDES.filter((o) => o.status === "awaiting_signoff" || o.status === "escalated");
  const decisionsNeedingReview = SOLICITOR_DECISIONS.filter((d) => d.requiresSupervisorReview);
  const openCompliance = COMPLIANCE_ALERTS.filter((a) => !a.resolved);
  const pendingSensitive = SENSITIVE_APPROVALS.filter((s) => s.status === "pending");
  const qualityActions = QUALITY_REVIEWS.filter((q) => q.status === "action_required" || q.status === "in_progress");

  return {
    highRiskCases: highRisk.length,
    solicitorDecisionsPending: decisionsNeedingReview.length,
    aiOverridesPending: pendingOverrides.length,
    complianceIssues: openCompliance.length,
    sensitiveApprovals: pendingSensitive.length,
    auditEventsToday: SUPERVISOR_AUDIT.filter((e) => e.timestamp.startsWith("2026-08-07")).length,
    qualityReviewsOpen: qualityActions.length,
    platformHealth: PLATFORM_PERFORMANCE.kpis.overrideSignOffRate,
  };
}

export { COMPLIANCE_ALERTS, INITIAL_MATTERS };
