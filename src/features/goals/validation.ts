import { z } from "zod";

export const goalInput = z.object({
	title: z.string().trim().min(1).max(160),
	target: z.number().int().min(1).max(100000),
	progress: z.number().int().min(0).max(100000),
	deadline: z.coerce.date().nullable(),
});

export const updateGoalInput = goalInput.extend({ id: z.string().uuid() });
export const goalIdSchema = z.object({ id: z.string().uuid() });
