import { getClientLandingPath } from "@/lib/assessment-guard";

export type UserRole = "client" | "solicitor";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  reference?: string;
  sraNumber?: string;
}

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  client: {
    id: "USER-CLI-01",
    name: "Amelia Hartley",
    email: "amelia.hartley@example.co.uk",
    role: "client",
    avatar: "AH",
    title: "Client / Debt Applicant",
    reference: "AQ-2026-04417",
  },
  solicitor: {
    id: "USER-SOL-01",
    name: "Rachel Okonkwo",
    email: "solicitor@gmail.com",
    role: "solicitor",
    avatar: "RO",
    title: "Lead Insolvency Solicitor",
    sraNumber: "SRA-629104",
  },
};

/** Hardcoded solicitor demo credentials. Any other email/password signs in as client. */
export const SOLICITOR_DEMO_CREDENTIALS = {
  email: "solicitor@gmail.com",
  password: "123456",
} as const;

export function resolveLoginRole(email: string, password: string): UserRole {
  const normalizedEmail = email.trim().toLowerCase();
  if (
    normalizedEmail === SOLICITOR_DEMO_CREDENTIALS.email &&
    password === SOLICITOR_DEMO_CREDENTIALS.password
  ) {
    return "solicitor";
  }
  return "client";
}

const STORAGE_KEY = "fg_debt_user_role";

export function getCurrentRole(): UserRole {
  if (typeof window === "undefined") return "client";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "solicitor" || stored === "client") {
    return stored;
  }
  return "client";
}

export function setCurrentRole(role: UserRole): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, role);
    window.dispatchEvent(new Event("auth-role-change"));
  }
}

export function getCurrentUser(): UserProfile {
  const role = getCurrentRole();
  return DEMO_USERS[role];
}

export function roleHomePath(role: UserRole): string {
  if (role === "solicitor") return "/solicitor";
  // Clients never land on the dashboard until assessment submission.
  return getClientLandingPath();
}

export function roleDisplayLabel(role: UserRole): string {
  if (role === "solicitor") return "Solicitor Dashboard";
  return "Client Portal";
}
