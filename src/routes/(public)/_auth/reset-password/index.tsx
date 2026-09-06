import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { authClient } from "#/lib/auth-client";

const resetSearchSchema = z.object({
	token: z.string().optional(),
});

export const Route = createFileRoute("/(public)/_auth/reset-password/")({
	validateSearch: resetSearchSchema,
	component: ResetPassword,
});

function ResetPassword() {
	const { token } = Route.useSearch();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [pending, setPending] = useState(false);

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!token) {
			toast.error("This reset link is invalid or incomplete");
			return;
		}
		if (password !== confirmation) {
			toast.error("Passwords do not match");
			return;
		}
		setPending(true);
		try {
			await authClient.resetPassword({ newPassword: password, token });
			toast.success("Password updated. You can sign in now.");
			navigate({ to: "/sign-in" });
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to reset password",
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
				<h2 className="mt-6 text-2xl font-semibold">Choose a new password</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					Use at least six characters for your new password.
				</p>
			</div>
			<form onSubmit={submit} className="space-y-4">
				<label className="space-y-2 text-sm font-medium">
					New password
					<Input
						type="password"
						required
						minLength={6}
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						autoComplete="new-password"
					/>
				</label>
				<label className="space-y-2 text-sm font-medium">
					Confirm password
					<Input
						type="password"
						required
						minLength={6}
						value={confirmation}
						onChange={(event) => setConfirmation(event.target.value)}
						autoComplete="new-password"
					/>
				</label>
				<Button
					type="submit"
					className="w-full mt-2"
					disabled={pending || !token}
				>
					{pending && <Loader2Icon className="size-4 animate-spin" />}
					Update password
				</Button>
			</form>
		</div>
	);
}
