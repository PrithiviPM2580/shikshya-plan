import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/_auth/sign-up/")({
	component: SignUp,
});

function SignUp() {
	return <div>Hello "/(public)/_auth/sign-up/"!</div>;
}
