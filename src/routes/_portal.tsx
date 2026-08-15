import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { guardClientPortalAccess } from "@/lib/assessment-guard";
import { requireAuth } from "@/lib/auth-guard";

export const Route = createFileRoute("/_portal")({
  beforeLoad: ({ location }) => {
    requireAuth("client");
    // Mandatory onboarding: no portal pages (incl. dashboard) until assessment is submitted.
    guardClientPortalAccess(location.pathname);
  },
  component: PortalLayout,
});

function PortalLayout() {
  return (
    <PortalShell>
      <Outlet />
    </PortalShell>
  );
}
