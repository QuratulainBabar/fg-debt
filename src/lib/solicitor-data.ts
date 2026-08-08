export type MatterStatus =
  | "new"
  | "awaiting_review"
  | "urgent_review"
  | "client_response_required"
  | "documents_awaiting_review"
  | "advice_awaiting_approval"
  | "referrals_in_progress"
  | "approved"
  | "rejected"
  | "amended"
  | "overridden"
  | "completed";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type VulnerabilityFlag =
  | "none"
  | "health_illness"
  | "financial_hardship"
  | "mental_health"
  | "domestic_vulnerability"
  | "language_barrier";

export interface DebtorItem {
  id: string;
  creditor: string;
  type: string;
  balance: number;
  arrears: number;
  interestRate: string;
  isPriority: boolean;
  accountNumber: string;
  status: "verified" | "disputed" | "pending_verification";
}

export interface AssetItem {
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  encumbrance: number; // e.g. mortgage/finance against it
  exempt: boolean; // exempt under DRO / insolvency guidelines
}

export interface DocumentItem {
  id: string;
  name: string;
  category: "bank_statement" | "payslip" | "creditor_letter" | "id_proof" | "tenancy" | "utility_bill";
  size: string;
  uploadedAt: string;
  ocrStatus: "completed" | "in_progress" | "failed" | "needs_review";
  verificationStatus: "verified" | "flagged" | "pending";
  confidenceScore: number; // e.g. 98%
  extractedInfo: Record<string, string>;
  previewUrl?: string;
  version: number;
}

export interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  type: "client_clarification" | "missing_info_request" | "solicitor_review" | "third_party_request";
  dueDate: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "pending" | "sent_to_client" | "resolved" | "overdue";
  description: string;
}

export interface AuditRecord {
  id: string;
  user: string;
  role: string;
  timestamp: string;
  section: string;
  previousValue: string;
  newValue: string;
  reason: string;
}

export interface ReferralItem {
  id: string;
  partner: string;
  reason: string;
  status: "initiated" | "accepted" | "in_progress" | "completed" | "declined";
  date: string;
  contactPerson: string;
  notes: string;
}

export interface Matter {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  niNumber: string;
  dob: string;
  employmentStatus: string;
  employerName: string;
  monthlyNetIncome: number;
  benefitsIncome: number;
  totalIncome: number;
  monthlyExpenses: number;
  disposableIncome: number;
  
  assignedSolicitor: string;
  status: MatterStatus;
  riskLevel: RiskLevel;
  vulnerability: VulnerabilityFlag;
  vulnerabilityNotes?: string;
  
  totalDebt: number;
  priorityDebtTotal: number;
  nonPriorityDebtTotal: number;
  
  aiRecommendedSolution: string;
  aiConfidenceScore: number;
  aiReasoning: string[];
  alternativeSolutions: { name: string; pros: string; cons: string }[];
  rejectedSolutions: { name: string; reason: string }[];
  
  solicitorDecision?: {
    action: "approve" | "amend" | "reject" | "override";
    solicitorName: string;
    decidedAt: string;
    notes: string;
    amendedSolution?: string;
  };
  
  nextRequiredAction: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  
  debts: DebtorItem[];
  assets: AssetItem[];
  documents: DocumentItem[];
  tasks: TaskItem[];
  auditHistory: AuditRecord[];
  referrals: ReferralItem[];
  notes: { id: string; author: string; role: string; date: string; content: string; isInternal: boolean }[];
}

export const INITIAL_MATTERS: Matter[] = [
  {
    id: "MAT-2026-4417",
    clientName: "Amelia Hartley",
    clientEmail: "amelia.hartley@example.co.uk",
    clientPhone: "+44 7700 900312",
    clientAddress: "48 Harrow Lane, Manchester, M4 2BQ",
    niNumber: "QQ 12 34 56 C",
    dob: "14/05/1988",
    employmentStatus: "Employed (Part-time)",
    employerName: "Manchester Logistics Ltd",
    monthlyNetIncome: 1980,
    benefitsIncome: 565,
    totalIncome: 2545,
    monthlyExpenses: 2400,
    disposableIncome: 145,
    assignedSolicitor: "Rachel Okonkwo",
    status: "awaiting_review",
    riskLevel: "medium",
    vulnerability: "health_illness",
    vulnerabilityNotes: "Long-term medical condition impacting full-time work capability.",
    totalDebt: 18420,
    priorityDebtTotal: 2220,
    nonPriorityDebtTotal: 16200,
    aiRecommendedSolution: "Debt Relief Order (DRO)",
    aiConfidenceScore: 94,
    aiReasoning: [
      "Total qualifying debt (£18,420) is well under the £50,000 UK DRO threshold.",
      "Monthly disposable income (£145) is below the £75/month surplus cap when considering upcoming health expenditure.",
      "Total assets value (£850) is significantly below the £2,000 threshold.",
      "Client has lived in England & Wales for over 3 years.",
    ],
    alternativeSolutions: [
      { name: "Debt Management Plan (DMP)", pros: "Informal, avoids insolvency public register", cons: "Will take 10+ years to clear £18.4k debt at £145/month" },
      { name: "Token Payment Plan", pros: "Buys time with creditors", cons: "Does not write off principal debt" }
    ],
    rejectedSolutions: [
      { name: "Individual Voluntary Arrangement (IVA)", reason: "Excessive fees relative to total debt and surplus income." },
      { name: "Bankruptcy", reason: "Disproportionate legal costs (£680 application fee) when DRO is eligible." }
    ],
    nextRequiredAction: "Verify May bank statement expenditure & sign off DRO application notice",
    dueDate: "2026-08-10",
    createdAt: "2026-06-12",
    updatedAt: "2026-08-06",
    debts: [
      { id: "D1", creditor: "Manchester City Council", type: "Council Tax Arrears", balance: 1480, arrears: 620, interestRate: "0%", isPriority: true, accountNumber: "CT-881920", status: "verified" },
      { id: "D2", creditor: "Northern Energy", type: "Gas & Electricity Arrears", balance: 740, arrears: 240, interestRate: "0%", isPriority: true, accountNumber: "NE-44912", status: "verified" },
      { id: "D3", creditor: "Halbury Bank", type: "Credit Card", balance: 6240, arrears: 310, interestRate: "24.9%", isPriority: false, accountNumber: "CC-90123", status: "verified" },
      { id: "D4", creditor: "Vale Finance", type: "Personal Loan", balance: 5320, arrears: 0, interestRate: "12.4%", isPriority: false, accountNumber: "PL-5519", status: "verified" },
      { id: "D5", creditor: "Swiftpay", type: "BNPL", balance: 1180, arrears: 90, interestRate: "0%", isPriority: false, accountNumber: "SP-0021", status: "verified" },
      { id: "D6", creditor: "Orbit Catalogue", type: "Catalogue Debt", balance: 3460, arrears: 145, interestRate: "29.8%", isPriority: false, accountNumber: "OC-1049", status: "verified" },
    ],
    assets: [
      { id: "A1", type: "Motor Vehicle", description: "2012 Ford Fiesta 1.2L (Mileage: 92,000)", estimatedValue: 1250, encumbrance: 0, exempt: true },
      { id: "A2", type: "Savings Account", description: "Halifax Savings", estimatedValue: 180, encumbrance: 0, exempt: true },
    ],
    documents: [
      {
        id: "DOC-101",
        name: "Bank statement — May 2026.pdf",
        category: "bank_statement",
        size: "1.2 MB",
        uploadedAt: "2026-06-12",
        ocrStatus: "completed",
        verificationStatus: "verified",
        confidenceScore: 99,
        extractedInfo: { "Opening Balance": "£340.20", "Closing Balance": "£180.10", "Total Credits": "£2,545.00", "Debits Count": "42" },
        version: 1,
      },
      {
        id: "DOC-102",
        name: "Payslip — May 2026.pdf",
        category: "payslip",
        size: "480 KB",
        uploadedAt: "2026-06-12",
        ocrStatus: "completed",
        verificationStatus: "verified",
        confidenceScore: 97,
        extractedInfo: { "Gross Pay": "£2,350.00", "Net Pay": "£1,980.00", "Tax Paid": "£280.00", "NI Paid": "£90.00" },
        version: 1,
      },
      {
        id: "DOC-103",
        name: "Halbury Bank Arrears Notice.pdf",
        category: "creditor_letter",
        size: "320 KB",
        uploadedAt: "2026-06-18",
        ocrStatus: "completed",
        verificationStatus: "verified",
        confidenceScore: 96,
        extractedInfo: { "Creditor": "Halbury Bank PLC", "Account": "CC-90123", "Outstanding": "£6,240.00", "Notice Type": "Default Warning" },
        version: 1,
      },
    ],
    tasks: [
      { id: "T1", title: "Clarify monthly childcare costs", assignee: "Amelia Hartley", type: "client_clarification", dueDate: "2026-08-12", priority: "high", status: "sent_to_client", description: "Request confirmation whether £180 monthly childcare is ongoing during school holidays." },
      { id: "T2", title: "Sign off DRO Suitability Notice", assignee: "Rachel Okonkwo", type: "solicitor_review", dueDate: "2026-08-10", priority: "urgent", status: "pending", description: "Final legal verification of total qualifying debt before submitting to Insolvency Service." }
    ],
    auditHistory: [
      { id: "AUD-1", user: "AI Engine v4.2", role: "Automated Triage", timestamp: "2026-06-24 14:22", section: "AI Recommendation", previousValue: "Pending Analysis", newValue: "Debt Relief Order (DRO)", reason: "Completed standard financial evaluation." },
      { id: "AUD-2", user: "System OCR", role: "OCR Pipeline", timestamp: "2026-06-18 09:15", section: "Documents", previousValue: "Unprocessed", newValue: "Verified (99% confidence)", reason: "Extracted salary & creditor records from May PDF statements." },
      { id: "AUD-3", user: "Rachel Okonkwo", role: "Solicitor", timestamp: "2026-06-12 11:00", section: "Matter Status", previousValue: "New Matter", newValue: "Awaiting Review", reason: "Assigned matter MAT-2026-4417 to solicitor caseload." }
    ],
    referrals: [
      { id: "REF-3391", partner: "Lowell & Grange Insolvency Practitioners", reason: "DRO Intermediary Application Processing", status: "accepted", date: "2026-06-24", contactPerson: "Mark Evans, IP", notes: "Intermediary approved to submit DRO to Official Receiver." }
    ],
    notes: [
      { id: "N1", author: "Rachel Okonkwo", role: "Solicitor", date: "2026-06-24 15:10", content: "Reviewed AI DRO recommendation. Qualifying debts are verified. Client qualifies for DRO under revised 2024 limit rules.", isInternal: true },
      { id: "N2", author: "Rachel Okonkwo", role: "Solicitor", date: "2026-06-24 15:12", content: "Sent client update: Assessment complete and under final legal sign-off.", isInternal: false }
    ]
  },
  {
    id: "MAT-2026-8801",
    clientName: "Marcus Vance",
    clientEmail: "m.vance@vancetech.co.uk",
    clientPhone: "+44 7700 900881",
    clientAddress: "12 King Street, Leeds, LS1 2BH",
    niNumber: "AB 98 76 54 D",
    dob: "02/11/1982",
    employmentStatus: "Self-Employed (IT Contractor)",
    employerName: "Vance Tech Solutions Ltd",
    monthlyNetIncome: 3400,
    benefitsIncome: 0,
    totalIncome: 3400,
    monthlyExpenses: 3110,
    disposableIncome: 290,
    assignedSolicitor: "Rachel Okonkwo",
    status: "urgent_review",
    riskLevel: "high",
    vulnerability: "none",
    totalDebt: 34500,
    priorityDebtTotal: 4800,
    nonPriorityDebtTotal: 29700,
    aiRecommendedSolution: "Individual Voluntary Arrangement (IVA)",
    aiConfidenceScore: 91,
    aiReasoning: [
      "Total unsecured debt (£34,500) exceeds £20,000 threshold for IVA efficiency.",
      "Monthly disposable income (£290) supports a realistic 60-month repayment schedule (£17,400 total return).",
      "Client owns business assets requiring protection from bankruptcy liquidation.",
    ],
    alternativeSolutions: [
      { name: "Debt Management Plan", pros: "Flexible informal arrangement", cons: "Creditors may continue charging high interest rates" }
    ],
    rejectedSolutions: [
      { name: "Debt Relief Order", reason: "Debt (£34.5k) & surplus (£290) exceed DRO limits." },
      { name: "Bankruptcy", reason: "Would compromise self-employed business trading status." }
    ],
    nextRequiredAction: "Review urgent statutory demand received from HMRC creditor",
    dueDate: "2026-08-08",
    createdAt: "2026-07-01",
    updatedAt: "2026-08-07",
    debts: [
      { id: "D81", creditor: "HMRC VAT & Tax", type: "Tax Arrears", balance: 4800, arrears: 4800, interestRate: "7.75%", isPriority: true, accountNumber: "HMRC- Leeds", status: "verified" },
      { id: "D82", creditor: "Barclays Business Credit", type: "Credit Card", balance: 14200, arrears: 1200, interestRate: "19.9%", isPriority: false, accountNumber: "BC-9918", status: "verified" },
      { id: "D83", creditor: "Funding Circle", type: "Unsecured Business Loan", balance: 15500, arrears: 0, interestRate: "14.2%", isPriority: false, accountNumber: "FC-3301", status: "verified" },
    ],
    assets: [
      { id: "A81", type: "IT Equipment", description: "Workstations & Servers", estimatedValue: 3200, encumbrance: 0, exempt: false }
    ],
    documents: [
      { id: "DOC-801", name: "HMRC Statutory Demand Notice.pdf", category: "creditor_letter", size: "2.1 MB", uploadedAt: "2026-08-05", ocrStatus: "completed", verificationStatus: "flagged", confidenceScore: 98, extractedInfo: { "Creditor": "HMRC", "Demand Amount": "£4,800.00", "Deadline": "7 Days" }, version: 1 }
    ],
    tasks: [
      { id: "T81", title: "File Breathing Space application to pause HMRC enforcement", assignee: "Rachel Okonkwo", type: "solicitor_review", dueDate: "2026-08-08", priority: "urgent", status: "pending", description: "Statutory demand notice requires immediate Breathing Space registration." }
    ],
    auditHistory: [
      { id: "AUD-81", user: "AI Engine v4.2", role: "Automated Triage", timestamp: "2026-08-05 16:30", section: "Risk Scoring", previousValue: "Medium Risk", newValue: "High Risk (Critical Enforcement)", reason: "Statutory Demand document detected by OCR parser." }
    ],
    referrals: [],
    notes: [
      { id: "N81", author: "Rachel Okonkwo", role: "Solicitor", date: "2026-08-06 09:15", content: "Urgent HMRC threat. Preparing 60-day Breathing Space moratorium entry.", isInternal: true }
    ]
  },
  {
    id: "MAT-2026-3104",
    clientName: "Sarah Jenkins",
    clientEmail: "s.jenkins@outlook.com",
    clientPhone: "+44 7700 900552",
    clientAddress: "19 Elm Street, Bristol, BS2 8RP",
    niNumber: "JL 44 21 09 A",
    dob: "22/08/1993",
    employmentStatus: "Unemployed / Carer",
    employerName: "N/A",
    monthlyNetIncome: 0,
    benefitsIncome: 1420,
    totalIncome: 1420,
    monthlyExpenses: 1465,
    disposableIncome: -45,
    assignedSolicitor: "Rachel Okonkwo",
    status: "new",
    riskLevel: "critical",
    vulnerability: "financial_hardship",
    vulnerabilityNotes: "Single mother of 2 children in severe budget deficit with active eviction threat.",
    totalDebt: 8120,
    priorityDebtTotal: 3400,
    nonPriorityDebtTotal: 4720,
    aiRecommendedSolution: "Breathing Space & Debt Relief Order (DRO)",
    aiConfidenceScore: 96,
    aiReasoning: [
      "Negative disposable income (-£45 deficit) requires immediate hardship relief.",
      "Priority rent & council tax arrears (£3,400) place family under immediate eviction risk.",
      "Qualifies for 100% debt write-off via DRO once emergency Breathing Space is registered.",
    ],
    alternativeSolutions: [],
    rejectedSolutions: [
      { name: "DMP / IVA", reason: "Client has negative surplus income (-£45); cannot sustain monthly payments." }
    ],
    nextRequiredAction: "Immediate emergency Breathing Space moratorium submission to court",
    dueDate: "2026-08-07",
    createdAt: "2026-08-06",
    updatedAt: "2026-08-07",
    debts: [
      { id: "D31", creditor: "Bristol Housing Trust", type: "Rent Arrears", balance: 2400, arrears: 2400, interestRate: "0%", isPriority: true, accountNumber: "RENT-9921", status: "verified" },
      { id: "D32", creditor: "Bristol City Council", type: "Council Tax", balance: 1000, arrears: 1000, interestRate: "0%", isPriority: true, accountNumber: "CT-33019", status: "verified" },
      { id: "D33", creditor: "Provident Personal Credit", type: "Doorstep Loan", balance: 4720, arrears: 850, interestRate: "45.0%", isPriority: false, accountNumber: "PPC-102", status: "verified" },
    ],
    assets: [],
    documents: [
      { id: "DOC-301", name: "Eviction Warning Notice - Landlord.pdf", category: "tenancy", size: "1.8 MB", uploadedAt: "2026-08-06", ocrStatus: "completed", verificationStatus: "flagged", confidenceScore: 99, extractedInfo: { "Landlord": "Bristol Housing", "Possession Hearing Date": "14 Aug 2026" }, version: 1 }
    ],
    tasks: [
      { id: "T31", title: "Submit Emergency Breathing Space to Insolvency Service", assignee: "Rachel Okonkwo", type: "solicitor_review", dueDate: "2026-08-07", priority: "urgent", status: "pending", description: "Halt eviction proceedings before Aug 14 hearing." }
    ],
    auditHistory: [
      { id: "AUD-31", user: "AI Engine v4.2", role: "Automated Triage", timestamp: "2026-08-06 18:00", section: "Vulnerability Flag", previousValue: "None", newValue: "Critical Hardship", reason: "Eviction notice detected in OCR parse." }
    ],
    referrals: [
      { id: "REF-3101", partner: "Shelter UK Housing Legal Aid", reason: "Representation at eviction possession hearing", status: "initiated", date: "2026-08-07", contactPerson: "Shelter Bristol Office", notes: "Referral submitted to prevent homelessness." }
    ],
    notes: [
      { id: "N31", author: "Rachel Okonkwo", role: "Solicitor", date: "2026-08-07 08:30", content: "Prioritising this matter for instant emergency Breathing Space submission today.", isInternal: true }
    ]
  },
  {
    id: "MAT-2026-9210",
    clientName: "David Croft",
    clientEmail: "david.croft@croftbuild.co.uk",
    clientPhone: "+44 7700 900192",
    clientAddress: "7 Oakwood Drive, Birmingham, B15 2TT",
    niNumber: "WM 88 12 34 B",
    dob: "30/03/1975",
    employmentStatus: "Employed (Senior Manager)",
    employerName: "Midland Infrastructure Group",
    monthlyNetIncome: 4200,
    benefitsIncome: 0,
    totalIncome: 4200,
    monthlyExpenses: 3750,
    disposableIncome: 450,
    assignedSolicitor: "Rachel Okonkwo",
    status: "advice_awaiting_approval",
    riskLevel: "high",
    vulnerability: "none",
    totalDebt: 42000,
    priorityDebtTotal: 0,
    nonPriorityDebtTotal: 42000,
    aiRecommendedSolution: "Debt Management Plan (DMP)",
    aiConfidenceScore: 89,
    aiReasoning: [
      "Client holds £65,000 equity in primary property, ruling out DRO and making IVA less favorable due to equity release clauses.",
      "Monthly surplus of £450 is sufficient to repay £42,000 total debt in ~7.7 years via structured DMP.",
      "Avoids placing charge or forced sale on residential property.",
    ],
    alternativeSolutions: [
      { name: "Individual Voluntary Arrangement", pros: "Fixed 5 year duration", cons: "Would require £40,000 equity remortgage or extension" }
    ],
    rejectedSolutions: [
      { name: "Debt Relief Order", reason: "Debt exceeding £50k cap and property equity exceeding £2k limit." },
      { name: "Bankruptcy", reason: "High risk of forced property sale by Trustee in Bankruptcy." }
    ],
    nextRequiredAction: "Approve draft advice letter & DMP proposal schedule",
    dueDate: "2026-08-09",
    createdAt: "2026-07-15",
    updatedAt: "2026-08-06",
    debts: [
      { id: "D91", creditor: "Halifax Credit", type: "Credit Card", balance: 18500, arrears: 0, interestRate: "19.9%", isPriority: false, accountNumber: "HX-9901", status: "verified" },
      { id: "D92", creditor: "MBNA", type: "Credit Card", balance: 14000, arrears: 0, interestRate: "22.4%", isPriority: false, accountNumber: "MB-2210", status: "verified" },
      { id: "D93", creditor: "Sainsbury's Bank", type: "Personal Loan", balance: 9500, arrears: 0, interestRate: "9.8%", isPriority: false, accountNumber: "SB-4401", status: "verified" },
    ],
    assets: [
      { id: "A91", type: "Residential Property", description: "4 Bed Detached, Birmingham (Valued £420,000, Mortgage £355,000)", estimatedValue: 420000, encumbrance: 355000, exempt: false }
    ],
    documents: [
      { id: "DOC-901", name: "Mortgage Statement 2026.pdf", category: "bank_statement", size: "950 KB", uploadedAt: "2026-07-16", ocrStatus: "completed", verificationStatus: "verified", confidenceScore: 99, extractedInfo: { "Lender": "Nationwide", "Balance": "£355,000.00" }, version: 1 }
    ],
    tasks: [
      { id: "T91", title: "Approve formal DMP Advice Document package", assignee: "Rachel Okonkwo", type: "solicitor_review", dueDate: "2026-08-09", priority: "high", status: "pending", description: "Review and approve DMP formal proposal for PayPlan dispatch." }
    ],
    auditHistory: [
      { id: "AUD-91", user: "Rachel Okonkwo", role: "Solicitor", timestamp: "2026-08-05 14:00", section: "Advice Generation", previousValue: "Drafting", newValue: "Awaiting Approval", reason: "Drafted formal DMP advice letter preserving property equity." }
    ],
    referrals: [],
    notes: []
  },
  {
    id: "MAT-2026-1158",
    clientName: "Elena Rostova",
    clientEmail: "elena.r@gmail.com",
    clientPhone: "+44 7700 900662",
    clientAddress: "88 Queens Road, London, SE15 2AA",
    niNumber: "ER 11 22 33 X",
    dob: "11/04/1990",
    employmentStatus: "Employed (Retail)",
    employerName: "Marks & Spencer PLC",
    monthlyNetIncome: 1650,
    benefitsIncome: 0,
    totalIncome: 1650,
    monthlyExpenses: 1570,
    disposableIncome: 80,
    assignedSolicitor: "Rachel Okonkwo",
    status: "client_response_required",
    riskLevel: "medium",
    vulnerability: "mental_health",
    vulnerabilityNotes: "Client reported acute anxiety; requested written-only communication.",
    totalDebt: 12600,
    priorityDebtTotal: 950,
    nonPriorityDebtTotal: 11650,
    aiRecommendedSolution: "Debt Relief Order (DRO)",
    aiConfidenceScore: 92,
    aiReasoning: [
      "Total debt (£12,600) is well within DRO limit.",
      "Disposable income (£80) requires clarification on £40 monthly unverified subscription debits.",
    ],
    alternativeSolutions: [],
    rejectedSolutions: [],
    nextRequiredAction: "Awaiting client upload of June bank statement page 2",
    dueDate: "2026-08-14",
    createdAt: "2026-07-20",
    updatedAt: "2026-08-04",
    debts: [
      { id: "D111", creditor: "Thames Water", type: "Water Arrears", balance: 950, arrears: 350, interestRate: "0%", isPriority: true, accountNumber: "TW-9012", status: "verified" },
      { id: "D112", creditor: "Vanquis Bank", type: "Credit Card", balance: 4200, arrears: 180, interestRate: "39.9%", isPriority: false, accountNumber: "VQ-1102", status: "verified" },
      { id: "D113", creditor: "Capital One", type: "Credit Card", balance: 7450, arrears: 0, interestRate: "29.9%", isPriority: false, accountNumber: "CO-8812", status: "verified" },
    ],
    assets: [],
    documents: [
      { id: "DOC-1101", name: "Bank Statement - June (Incomplete).pdf", category: "bank_statement", size: "640 KB", uploadedAt: "2026-07-21", ocrStatus: "needs_review", verificationStatus: "flagged", confidenceScore: 78, extractedInfo: { "Pages": "1 of 2", "Missing": "Page 2 debits" }, version: 1 }
    ],
    tasks: [
      { id: "T1101", title: "Provide Page 2 of June Bank Statement", assignee: "Elena Rostova", type: "missing_info_request", dueDate: "2026-08-14", priority: "medium", status: "sent_to_client", description: "Page 2 missing from upload batch." }
    ],
    auditHistory: [],
    referrals: [],
    notes: []
  },
  {
    id: "MAT-2026-7492",
    clientName: "Tariq Mahmood",
    clientEmail: "tariq.m@mahmoodlogistics.co.uk",
    clientPhone: "+44 7700 900441",
    clientAddress: "104 Park Lane, Sheffield, S10 2RD",
    niNumber: "TM 55 66 77 C",
    dob: "05/09/1980",
    employmentStatus: "Employed",
    employerName: "Yorkshire Transport",
    monthlyNetIncome: 2850,
    benefitsIncome: 0,
    totalIncome: 2850,
    monthlyExpenses: 2640,
    disposableIncome: 210,
    assignedSolicitor: "Rachel Okonkwo",
    status: "approved",
    riskLevel: "low",
    vulnerability: "none",
    totalDebt: 26800,
    priorityDebtTotal: 0,
    nonPriorityDebtTotal: 26800,
    aiRecommendedSolution: "Individual Voluntary Arrangement (IVA)",
    aiConfidenceScore: 98,
    aiReasoning: [
      "54-month IVA approved with 42% projected creditor dividend.",
      "Solicitor approved advice package issued to client on 02 Aug 2026.",
    ],
    alternativeSolutions: [],
    rejectedSolutions: [],
    solicitorDecision: {
      action: "approve",
      solicitorName: "Rachel Okonkwo",
      decidedAt: "2026-08-02 11:30",
      notes: "Fully verified income & expenses. IVA proposal signed and dispatched to insolvency practitioner."
    },
    nextRequiredAction: "Awaiting creditor voting result at IVA meeting",
    dueDate: "2026-08-20",
    createdAt: "2026-06-01",
    updatedAt: "2026-08-02",
    debts: [
      { id: "D701", creditor: "Santander", type: "Personal Loan", balance: 16800, arrears: 0, interestRate: "11.2%", isPriority: false, accountNumber: "SAN-9901", status: "verified" },
      { id: "D702", creditor: "HSBC Credit", type: "Credit Card", balance: 10000, arrears: 0, interestRate: "18.9%", isPriority: false, accountNumber: "HS-3390", status: "verified" },
    ],
    assets: [],
    documents: [],
    tasks: [],
    auditHistory: [
      { id: "AUD-701", user: "Rachel Okonkwo", role: "Solicitor", timestamp: "2026-08-02 11:30", section: "Solicitor Decision", previousValue: "Awaiting Review", newValue: "Approved", reason: "Issued formal IVA legal advice letter." }
    ],
    referrals: [],
    notes: []
  },
  {
    id: "MAT-2026-5033",
    clientName: "Fiona Gallagher",
    clientEmail: "f.gallagher@gmail.com",
    clientPhone: "+44 7700 900223",
    clientAddress: "15 Victoria Road, Glasgow, G42 8YU",
    niNumber: "FG 33 44 55 E",
    dob: "19/12/1991",
    employmentStatus: "Employed",
    employerName: "Glasgow Care Services",
    monthlyNetIncome: 1820,
    benefitsIncome: 0,
    totalIncome: 1820,
    monthlyExpenses: 1710,
    disposableIncome: 110,
    assignedSolicitor: "Rachel Okonkwo",
    status: "referrals_in_progress",
    riskLevel: "medium",
    vulnerability: "language_barrier",
    vulnerabilityNotes: "Requires translated advice summary documents (Polish).",
    totalDebt: 15900,
    priorityDebtTotal: 1200,
    nonPriorityDebtTotal: 14700,
    aiRecommendedSolution: "Debt Relief Order (DRO) / DAS (Scotland)",
    aiConfidenceScore: 93,
    aiReasoning: [
      "Scottish Debt Arrangement Scheme (DAS) recommended for Scottish jurisdiction compliance.",
    ],
    alternativeSolutions: [],
    rejectedSolutions: [],
    nextRequiredAction: "Awaiting Scottish Money Adviser confirmation",
    dueDate: "2026-08-15",
    createdAt: "2026-07-10",
    updatedAt: "2026-08-03",
    debts: [],
    assets: [],
    documents: [],
    tasks: [],
    auditHistory: [],
    referrals: [
      { id: "REF-501", partner: "Glasgow Money Advice Service (Scottish DAS)", reason: "Debt Arrangement Scheme setup in Scotland", status: "in_progress", date: "2026-07-25", contactPerson: "Ian McTavish", notes: "Case transferred to Scottish accredited money adviser." }
    ],
    notes: []
  },
  {
    id: "MAT-2026-6620",
    clientName: "Arthur Pendelton",
    clientEmail: "a.pendelton@btinternet.com",
    clientPhone: "+44 7700 900774",
    clientAddress: "42 High Street, Nottingham, NG1 5FD",
    niNumber: "AP 77 88 99 Z",
    dob: "04/01/1954",
    employmentStatus: "Retired (State Pension + Private)",
    employerName: "N/A",
    monthlyNetIncome: 1450,
    benefitsIncome: 220,
    totalIncome: 1670,
    monthlyExpenses: 1640,
    disposableIncome: 30,
    assignedSolicitor: "Rachel Okonkwo",
    status: "documents_awaiting_review",
    riskLevel: "low",
    vulnerability: "health_illness",
    vulnerabilityNotes: "Pensioner with mobility limitations.",
    totalDebt: 6400,
    priorityDebtTotal: 0,
    nonPriorityDebtTotal: 6400,
    aiRecommendedSolution: "Debt Relief Order (DRO)",
    aiConfidenceScore: 97,
    aiReasoning: [
      "Low total debt (£6,400) and minimal surplus (£30) qualifies for fast-track DRO.",
    ],
    alternativeSolutions: [],
    rejectedSolutions: [],
    nextRequiredAction: "Verify pension statement upload",
    dueDate: "2026-08-11",
    createdAt: "2026-07-28",
    updatedAt: "2026-08-05",
    debts: [],
    assets: [],
    documents: [
      { id: "DOC-601", name: "State Pension Statement 2026.pdf", category: "payslip", size: "310 KB", uploadedAt: "2026-08-05", ocrStatus: "completed", verificationStatus: "pending", confidenceScore: 96, extractedInfo: { "Pension Amount": "£1,450.00/mo" }, version: 1 }
    ],
    tasks: [],
    auditHistory: [],
    referrals: [],
    notes: []
  }
];

export function getKPIMetrics(matters: Matter[]) {
  return {
    activeMatters: matters.filter(m => m.status !== "completed" && m.status !== "rejected").length,
    newMatters: matters.filter(m => m.status === "new").length,
    mattersAwaitingReview: matters.filter(m => m.status === "awaiting_review" || m.status === "urgent_review").length,
    urgentMatters: matters.filter(m => m.status === "urgent_review" || m.riskLevel === "critical" || m.tasks.some(t => t.priority === "urgent" && t.status === "pending")).length,
    highRiskCases: matters.filter(m => m.riskLevel === "high" || m.riskLevel === "critical").length,
    clientResponsesRequired: matters.filter(m => m.status === "client_response_required" || m.tasks.some(t => t.status === "sent_to_client")).length,
    documentsAwaitingReview: matters.filter(m => m.status === "documents_awaiting_review" || m.documents.some(d => d.verificationStatus === "pending" || d.verificationStatus === "flagged")).length,
    adviceAwaitingApproval: matters.filter(m => m.status === "advice_awaiting_approval").length,
    referralsInProgress: matters.reduce((acc, m) => acc + m.referrals.filter(r => r.status === "in_progress" || r.status === "initiated" || r.status === "accepted").length, 0),
    overdueTasks: matters.reduce((acc, m) => acc + m.tasks.filter(t => t.status === "overdue" || (new Date(t.dueDate) < new Date() && t.status === "pending")).length, 0),
  };
}

export const SOLICITOR_NOTIFICATIONS = [
  {
    id: "NOTIF-1",
    title: "Urgent Risk Detected: Statutory Demand",
    body: "Marcus Vance (MAT-2026-8801) uploaded an HMRC Statutory Demand with 7-day deadline.",
    type: "urgent_risk",
    matterId: "MAT-2026-8801",
    timestamp: "10 mins ago",
    unread: true,
  },
  {
    id: "NOTIF-2",
    title: "Critical Vulnerability & Eviction Alert",
    body: "Sarah Jenkins (MAT-2026-3104) uploaded a possession hearing notice. Emergency Breathing Space required.",
    type: "high_vulnerability",
    matterId: "MAT-2026-3104",
    timestamp: "1 hour ago",
    unread: true,
  },
  {
    id: "NOTIF-3",
    title: "New Matter Assigned to Your Caseload",
    body: "Matter MAT-2026-3104 (Sarah Jenkins) assigned for legal review.",
    type: "new_matter",
    matterId: "MAT-2026-3104",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: "NOTIF-4",
    title: "AI Analysis Completed: DRO Recommendation",
    body: "AI recommendation generated for Amelia Hartley (MAT-2026-4417) with 94% confidence score.",
    type: "ai_completed",
    matterId: "MAT-2026-4417",
    timestamp: "3 hours ago",
    unread: false,
  },
  {
    id: "NOTIF-5",
    title: "Client Submitted Assessment",
    body: "Amelia Hartley submitted updated financial statement & 3 creditor letters.",
    type: "client_submitted",
    matterId: "MAT-2026-4417",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "NOTIF-6",
    title: "Document Uploaded & OCR Scanned",
    body: "Bank statement uploaded for Arthur Pendelton (MAT-2026-6620). Confidence: 96%.",
    type: "doc_uploaded",
    matterId: "MAT-2026-6620",
    timestamp: "Yesterday",
    unread: false,
  },
];
