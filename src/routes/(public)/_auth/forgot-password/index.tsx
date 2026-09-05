import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/(public)/_auth/forgot-password/")({
	component: ForgotPassword,
});

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [pending, setPending] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);
		try {
			await authClient.requestPasswordReset({
				email,
				redirectTo: `${window.location.origin}/reset-password`,
			});
			setSubmitted(true);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to request a password reset",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="w-full space-y-6">
			<div>
				<Link
					to="/sign-in"
					className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
				>
					<ArrowLeft className="size-3" /> Back to sign in
				</Link>
				<h2 className="mt-6 text-2xl font-semibold">Reset your password</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Enter your email and we’ll send you a secure reset link.
				</p>
			</div>
			{submitted ? (
				<div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
					If an account exists for that email, check your inbox for the reset link.
				</div>
			) : (
				<form onSubmit={submit} className="space-y-4">
					<label className="space-y-2 text-sm font-medium">
						Email
						<Input
							type="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="you@example.com"
						/>
					</label>
					<Button type="submit" className="w-full" disabled={pending}>
						{pending && <Loader2Icon className="size-4 animate-spin" />}
						Send reset link
					</Button>
				</form>
			)}
		</div>
	);
}
