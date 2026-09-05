import { z } from "zod";

export const profileInput = z.object({
	name: z.string().trim().min(1).max(120),
	theme: z.enum(["SYSTEM", "LIGHT", "DARK"]),
	avatarUrl: z.string().url().nullable(),
	linkedinUrl: z.string().url().max(500).nullable().optional(),
	githubUrl: z.string().url().max(500).nullable().optional(),
	websiteUrl: z.string().url().max(500).nullable().optional(),
	pomodoroLength: z.coerce.number().int().min(1).max(120).default(25),
	studyView: z.enum(["weekly", "calendar", "sessions"]).default("weekly"),
	showCompletedTasks: z.boolean().default(true),
	reminders: z.boolean().default(true),
	taskReminders: z.boolean().default(true),
	examReminders: z.boolean().default(true),
	sessionReminders: z.boolean().default(true),
});

export const avatarUploadInput = z.object({
	dataUrl: z
		.string()
		.regex(/^data:image\/(png|jpeg|jpg|webp);base64,/, "Invalid avatar image")
		.max(7_000_000),
});
