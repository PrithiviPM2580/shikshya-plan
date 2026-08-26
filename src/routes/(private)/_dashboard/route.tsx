import { createFileRoute, Outlet } from "@tanstack/react-router";
import StudyShell from "#/components/shared/study-shell";

export const Route = createFileRoute("/(private)/_dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<StudyShell>
			<Outlet />
		</StudyShell>
	);
}
