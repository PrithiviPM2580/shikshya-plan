import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/_dashboard/goals/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(private)/_dashboard/goals/"!</div>;
}
