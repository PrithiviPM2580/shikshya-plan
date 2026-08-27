import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import StudyShell from "#/components/shared/study-shell";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/(private)/_dashboard")({
	beforeLoad: async ({ location }) => {
		const { data: session } = await authClient.getSession();

		if (!session) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: location.href },
			});
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
