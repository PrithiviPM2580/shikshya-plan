import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/_dashboard/scheduler/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(private)/_dashboard/scheduler/"!</div>;
}
