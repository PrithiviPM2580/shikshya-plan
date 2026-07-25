import { createFileRoute } from "@tanstack/react-router";
import StudyShell from "#/components/shared/study-shell";

export const Route = createFileRoute("/(private)/_dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<StudyShell>
			<div className="rounded-3xl border border-border bg-surface p-10 text-center shadow-sm">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<p className="mt-4 text-sm text-muted-foreground">
					This is the dashboard route wrapped in the StudyShell layout.
				</p>
			</div>
		</StudyShell>
	);
}
