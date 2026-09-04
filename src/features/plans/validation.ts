import { z } from "zod";

export const planInput = z.object({
	title: z.string().trim().min(1).max(160),
	description: z.string().trim().max(1000).optional(),
	goal: z.string().trim().max(500).optional(),
	startDate: z.coerce.date().nullable(),
	endDate: z.coerce.date().nullable(),
	subjectIds: z.array(z.string().uuid()),
});

export const updatePlanInput = planInput.extend({ id: z.string().uuid() });
export const planIdSchema = z.object({ id: z.string().uuid() });
export const planStatusInput = z.object({
	id: z.string().uuid(),
	status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]),
});
