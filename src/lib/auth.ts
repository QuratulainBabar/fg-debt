export type UserRole = "client" | "solicitor" | "supervisor" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  reference?: string;
  sraNumber?: string;
  adminId?: string;
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
    email: "r.okonkwo@fgdebtadvisor.co.uk",
    role: "solicitor",
    avatar: "RO",
    title: "Lead Insolvency Solicitor",
    sraNumber: "SRA-629104",
  },
  supervisor: {
    id: "USER-SUP-01",
    name: "Patricia Holloway",
    email: "p.holloway@fgdebtadvisor.co.uk",
    role: "supervisor",
    avatar: "PH",
    title: "Senior Supervising Solicitor",
    sraNumber: "SRA-418902",
  },
  admin: {
    id: "USER-ADM-01",
    name: "James Whitfield",
    email: "j.whitfield@fgdebtadvisor.co.uk",
    role: "admin",
    avatar: "JW",
    title: "Platform Administrator",
    adminId: "FGA-0001",
  },
};

const STORAGE_KEY = "fg_debt_user_role";

export function getCurrentRole(): UserRole {
  if (typeof window === "undefined") return "client";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "solicitor" || stored === "client" || stored === "admin" || stored === "supervisor") {
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
  if (role === "client") return "/dashboard";
  if (role === "solicitor") return "/solicitor";
  if (role === "supervisor") return "/supervisor";
  return "/admin";
}

export function roleDisplayLabel(role: UserRole): string {
  if (role === "client") return "Client Portal";
  if (role === "solicitor") return "Solicitor Dashboard";
  if (role === "supervisor") return "Supervisor Dashboard";
  return "Admin Control Centre";
}
