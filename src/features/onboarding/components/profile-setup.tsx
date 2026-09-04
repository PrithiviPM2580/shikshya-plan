import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { THEME_OPTIONS } from "../constants";
import { ProfileSetupSchema } from "../schemas";

interface ProfileSetupProps {
	initialName: string;
	initialTheme: "SYSTEM" | "LIGHT" | "DARK";
	onUpdateProfile: (data: {
		name: string;
		theme: "SYSTEM" | "LIGHT" | "DARK";
	}) => void;
	onNext: () => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function ProfileSetup({
	initialName,
	initialTheme,
	onUpdateProfile,
	onNext,
	onBack,
	isLoading = false,
}: ProfileSetupProps) {
	const form = useForm({
		defaultValues: {
			name: initialName,
			theme: initialTheme,
		},
		validators: {
			onSubmit: ProfileSetupSchema,
		},
		onSubmit: async ({ value }) => {
			onUpdateProfile({
				name: value.name,
				theme: value.theme,
			});
			onNext();
		},
	});

	return (
		<div className="w-full space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Set Up Your Profile</h2>
				<p className="text-sm text-muted-foreground mt-2">
					Personalize your study space with your name and theme preference
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<FieldGroup>
					<form.Field
						name="name"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor="name">Full Name</FieldLabel>
									<Input
										id="name"
										name="name"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										placeholder="Enter your full name"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					/>

					<form.Field
						name="theme"
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor="theme">Theme Preference</FieldLabel>
									<Select
										value={field.state.value}
										onValueChange={field.handleChange}
									>
										<SelectTrigger id="theme">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{THEME_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					/>
				</FieldGroup>

				<div className="flex gap-3">
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={onBack}
					>
						Back
					</Button>
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading || !form.state.values.name}
					>
						{isLoading ? "Loading..." : "Continue"}
					</Button>
				</div>
			</form>
		</div>
	);
}
