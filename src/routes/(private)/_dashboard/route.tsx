import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import StudyShell from "#/components/shared/study-shell";
import { requireCurrentUser } from "#/lib/server-auth";

export const Route = createFileRoute("/(private)/_dashboard")({
	beforeLoad: async () => {
		try {
			await requireCurrentUser();
		} catch {
			throw redirect({ to: "/sign-in" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<StudyShell>
			<Outlet />
		</StudyShell>
	);
}
