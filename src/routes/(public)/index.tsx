import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/")({ component: Home });

function Home() {
	return (
		<div>
			<h1>Welcome to the Public Home Page</h1>
			<p>This is the public section of the application.</p>
		</div>
	);
}
