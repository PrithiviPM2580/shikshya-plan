import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import Github from "#/features/auth/components/icons/github";
import Google from "#/features/auth/components/icons/google";
import SignInForm from "#/features/auth/components/sign-in-form";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/(public)/_auth/sign-in/")({
	component: SignIn,
});

function SignIn() {
	const naviate = useNavigate();
	const [isPending, startTransition] = useTransition();
	async function onSocial(provider: "google" | "github") {
		startTransition(async () => {
			await authClient.signIn.social(
				{
					provider: provider,
					callbackURL: "/dashboard",
				},
				{
					onSuccess: () => {
						toast.success(
							`${provider.toUpperCase()} Account created successfully.`,
						);
						naviate({ to: "/dashboard" });
					},
					onError: ({ error }) => {
						toast.error(error.message);
					},
				},
			);
		});
	}
	return (
		<div className="flex justify-center items-start flex-col gap-4 ">
			<h2 className="w-full text-center">Welcome Back</h2>
			<p className="text-sm text-muted-foreground w-full text-center">
				Welcome back to your smart study workspace
			</p>
			<div className="flex gap-2 w-full">
				<Button
					variant="outline"
					className="flex-1"
					disabled={isPending}
					onClick={() => onSocial("google")}
				>
					<Google />
					Sign in with Google
				</Button>
				<Button
					variant="outline"
					className="flex-1"
					disabled={isPending}
					onClick={() => onSocial("github")}
				>
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
