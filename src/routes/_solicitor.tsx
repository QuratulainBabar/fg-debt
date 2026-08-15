import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SolicitorShell } from "@/components/solicitor/SolicitorShell";
import { requireAuth } from "@/lib/auth-guard";

export const Route = createFileRoute("/_solicitor")({
  beforeLoad: () => {
    requireAuth("solicitor");
  },
  component: SolicitorLayout,
});

function SolicitorLayout() {
  return (
    <SolicitorShell>
      <Outlet />
    </SolicitorShell>
  );
}
