import { z } from "zod";

export const profileInput = z.object({
	name: z.string().trim().min(1).max(120),
	theme: z.enum(["SYSTEM", "LIGHT", "DARK"]),
	avatarUrl: z.string().url().nullable(),
});

export const avatarUploadInput = z.object({
	dataUrl: z
		.string()
		.regex(/^data:image\/(png|jpeg|jpg|webp);base64,/, "Invalid avatar image")
		.max(7_000_000),
});
