import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import StudyShell from "#/components/shared/study-shell";
import { getShellData, requireCurrentUser } from "#/lib/server-auth";

export const Route = createFileRoute("/(private)/_dashboard")({
	loader: () => getShellData(),
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
	const shellData = Route.useLoaderData();
	return (
		<StudyShell shellData={shellData}>
			<Outlet />
		</StudyShell>
	);
}
