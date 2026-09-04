import { z } from "zod";

export const pomodoroInput = z.object({
	title: z.string().trim().max(160).optional(),
	subjectId: z.string().uuid().nullable(),
	focusMinutes: z.number().int().min(1).max(120),
});

export const pomodoroIdSchema = z.object({ id: z.string().uuid() });
