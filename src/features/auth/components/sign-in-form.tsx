/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "#/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type SignInFormValues, signInFormSchema } from "../schemas";

export default function SignInForm() {
	const navigate = useNavigate();
	const [isPending, startTransition] = useTransition();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		} satisfies SignInFormValues,
		validators: {
			onSubmit: signInFormSchema,
		},
		onSubmit: async ({ value }) => {
			startTransition(async () => {
				await authClient.signIn.email(
					{
						email: value.email,
						password: value.password,
					},
					{
						onSuccess: () => {
							toast.success("Sign in successfully");
							navigate({ to: "/dashboard" });
						},
						onError: ({ error }) => {
							toast.error(error.message || "Failed to sign-in");
						},
					},
				);
			});
		},
	});

	return (
		<div className="w-full flex flex-col gap-7">
			<form
				id="sign-in-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<form.Field
						name="email"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid} className="gap-1!">
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Enter your email"
										autoComplete="off"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					/>
					<form.Field
						name="password"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid} className="gap-1!">
									<FieldLabel htmlFor={field.name}>Password</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Enter your password"
										autoComplete="off"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					/>
					<div className="-mt-3 text-right">
						<Link
							to="/forgot-password"
							className="text-xs text-muted-foreground hover:text-primary hover:underline"
						>
							Forgot password?
						</Link>
					</div>
					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending && <Loader2Icon className="size-8 animate-spin" />}
						Sign In
					</Button>
				</FieldGroup>
			</form>
			<div className="w-full -mt-4">
				<p className="text-sm text-muted-foreground w-full text-center">
					Don't have an account?{" "}
					<Link to="/sign-up" className="text-primary hover:underline">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
