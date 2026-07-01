import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import Github from "#/features/auth/components/icons/github";
import Google from "#/features/auth/components/icons/google";
import SignUpForm from "#/features/auth/components/sign-up-form";

export const Route = createFileRoute("/(public)/_auth/sign-up/")({
	component: SignUp,
});

function SignUp() {
	return (
		<div className="flex justify-center items-start flex-col gap-4 ">
			<h2 className="w-full text-center">Start your journey</h2>
			<p className="text-sm text-muted-foreground w-full text-center">
				Build better study habits with intelligent planning.
			</p>
			<div className="flex gap-2 w-full">
				<Button variant="custom" className="flex-1">
					<Google />
					Sign up with Google
				</Button>
				<Button variant="custom" className="flex-1">
					<Github />
					Sign up with GitHub
				</Button>
			</div>
			<div className="flex-center gap-1 w-full">
				<Separator className="flex-1" />
				<span>or</span>
				<Separator className="flex-1" />
			</div>
			<SignUpForm />
		</div>
	);
}
