import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div>
			Hello "/(public)/_auth"!
			<Outlet />
		</div>
	);
}
