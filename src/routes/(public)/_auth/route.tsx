import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<main className="screen">
			<div className="flex min-h-screen flex-col lg:flex-row p-screen">
				<section className="flex flex-1 items-center justify-center bg-primary rounded-corner">
					{/* Left */}
				</section>

				<section className="flex flex-1 items-center justify-center">
					{/* Right */}
					<Outlet />
				</section>
			</div>
		</main>
	);
}
