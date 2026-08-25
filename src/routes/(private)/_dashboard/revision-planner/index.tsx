import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(private)/_dashboard/revision-planner/")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	return <div>Hello "/(private)/_dashboard/revision-planner/"!</div>;
}
