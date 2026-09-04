import { createFileRoute, redirect } from "@tanstack/react-router";
import Landing from "#/features/home/landing";
import { getOnboardingStatus } from "#/lib/server-auth";

export const Route = createFileRoute("/(public)/")({
	beforeLoad: async () => {
		const status = await getOnboardingStatus();
		if (status.user) {
			throw redirect({ to: status.isComplete ? "/dashboard" : "/onboarding" });
		}
	},
	component: Home,
});

function Home() {
	return (
		// biome-ignore lint/complexity/noUselessFragments: <explanation>
		<>
			<Landing />
		</>
	);
}
