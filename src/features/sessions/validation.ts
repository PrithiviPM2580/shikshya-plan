import { z } from "zod";

export const sessionInput = z.object({
	title: z.string().trim().min(1).max(160),
	subjectId: z.string().uuid().nullable(),
	planId: z.string().uuid().nullable(),
	scheduledDate: z.coerce.date(),
	durationMin: z.number().int().min(1).max(720),
	notes: z.string().trim().max(1000).optional(),
});

export const updateSessionInput = sessionInput.extend({
	id: z.string().uuid(),
});
export const sessionIdSchema = z.object({ id: z.string().uuid() });
