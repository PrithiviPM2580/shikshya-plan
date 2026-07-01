import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_auth/sign-in/")({
	component: SignIn,
});

function SignIn() {
	return <div>Hello "/(public)/_auth/sign-in/"!</div>;
}
