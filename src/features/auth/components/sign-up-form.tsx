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
import { type SignUpFormValues, signUpFormSchema } from "../schemas";

export default function SignUpForm() {
	const [isPending, startTransition] = useTransition();
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		} satisfies SignUpFormValues,
		validators: {
			onSubmit: signUpFormSchema,
		},
		onSubmit: async ({ value }) => {
			startTransition(async () => {
				await authClient.signUp.email(
					{
						name: value.name,
						email: value.email,
						password: value.password,
					},
					{
						onSuccess: () => {
							toast.success("Sign up successfully");
							navigate({ to: "/" });
						},
						onError: ({ error }) => {
							toast.error(error.message || "Failed to sign-up");
						},
					},
				);
			});
		},
	});

	return (
		<div className="w-full flex flex-col gap-7">
			<form
				id="sign-up-form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className=" w-full!"
			>
				<FieldGroup>
					<form.Field
						name="name"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid} className="gap-1!">
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Enter your name"
										autoComplete="off"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					/>
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
				</FieldGroup>
			</form>
			<div className="w-full flex flex-col gap-2">
				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending && <Loader2Icon className="size-8 animate-spin" />}
					Sign Up
				</Button>
				<p className="text-sm text-muted-foreground w-full text-center">
					Already have an account?{" "}
					<Link to="/sign-in" className="text-primary hover:underline">
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
