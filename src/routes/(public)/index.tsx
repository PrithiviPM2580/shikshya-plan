import { createFileRoute } from "@tanstack/react-router";
import Landing from "#/features/home/landing";

export const Route = createFileRoute("/(public)/")({ component: Home });

function Home() {
	return (
		// biome-ignore lint/complexity/noUselessFragments: <explanation>
		<>
			<Landing />
		</>
	);
}
