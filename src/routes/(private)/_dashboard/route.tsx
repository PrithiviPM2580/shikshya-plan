import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "#/components/default-catch-boundary";
import StudyShell from "#/components/shared/study-shell";
import { Spinner } from "#/components/ui/spinner";
import { getOnboardingStatus, getShellData } from "#/lib/server-auth";

export const Route = createFileRoute("/(private)/_dashboard")({
	loader: () => getShellData(),
	beforeLoad: async () => {
		const status = await getOnboardingStatus();
		if (!status.user) {
			throw redirect({ to: "/sign-in" });
		}
		if (!status.isComplete) {
			throw redirect({ to: "/onboarding" });
		}
	},
	errorComponent: DefaultCatchBoundary,
	pendingComponent: DashboardPending,
	component: RouteComponent,
});

function DashboardPending() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Spinner />
				Loading your study workspace...
			</div>
		</div>
	);
}

function RouteComponent() {
	const shellData = Route.useLoaderData();
	return (
		<StudyShell shellData={shellData}>
			<Outlet />
		</StudyShell>
	);
}
