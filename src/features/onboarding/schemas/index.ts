import { z } from "zod";

export const ProgramSelectionSchema = z.object({
	programName: z.string().min(1, "Please select a program"),
});

export type ProgramSelectionFormValues = z.infer<typeof ProgramSelectionSchema>;

export const SemesterSelectionSchema = z.object({
	semesterNumber: z.number().min(1).max(8, "Invalid semester"),
});

export type SemesterSelectionFormValues = z.infer<
	typeof SemesterSelectionSchema
>;

export const ProfileSetupSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be less than 100 characters"),
	theme: z.enum(["SYSTEM", "LIGHT", "DARK"]).default("SYSTEM"),
});

export type ProfileSetupFormValues = z.infer<typeof ProfileSetupSchema>;

export const OnboardingCompleteSchema = z.object({
	programName: z.string(),
	semesterNumber: z.number(),
	name: z.string(),
	theme: z.enum(["SYSTEM", "LIGHT", "DARK"]),
});

export type OnboardingCompleteValues = z.infer<typeof OnboardingCompleteSchema>;
