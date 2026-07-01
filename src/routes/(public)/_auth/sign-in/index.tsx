import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import Github from "#/features/auth/components/icons/github";
import Google from "#/features/auth/components/icons/google";
import SignInForm from "#/features/auth/components/sign-in-form";

export const Route = createFileRoute("/(public)/_auth/sign-in/")({
	component: SignIn,
});

function SignIn() {
	return (
		<div className="flex justify-center items-start flex-col gap-4 ">
			<h2 className="w-full text-center">Welcome Back</h2>
			<p className="text-sm text-muted-foreground w-full text-center">
				Welcome back to your smart study workspace
			</p>
			<div className="flex gap-2 w-full">
				<Button variant="custom" className="flex-1">
					<Google />
					Sign in with Google
				</Button>
				<Button variant="custom" className="flex-1">
					<Github />
					Sign in with GitHub
				</Button>
			</div>
			<div className="flex-center gap-1 w-full">
				<Separator className="flex-1" />
				<span>or</span>
				<Separator className="flex-1" />
			</div>
			<SignInForm />
		</div>
	);
}
