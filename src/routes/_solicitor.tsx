import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SolicitorShell } from "@/components/solicitor/SolicitorShell";

export const Route = createFileRoute("/_solicitor")({
  component: SolicitorLayout,
});

function SolicitorLayout() {
  return (
    <SolicitorShell>
      <Outlet />
    </SolicitorShell>
  );
}
