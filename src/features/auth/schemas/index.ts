import { z } from "zod";

export const signUpFormSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters."),
	email: z.email("Please enter a valid email address."),
	password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signInFormSchema = z.object({
	email: z.email("Please enter a valid email address."),
	password: z.string().min(6, "Password must be at least 6 characters."),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type SignInFormValues = z.infer<typeof signInFormSchema>;
