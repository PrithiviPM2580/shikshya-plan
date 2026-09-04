import { z } from "zod";

export const taskIdSchema = z.object({ id: z.string().uuid() });

export const taskInput = z.object({
	title: z.string().trim().min(1).max(160),
	description: z.string().trim().max(1000).optional(),
	subjectId: z.string().uuid().nullable(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
	dueDate: z.coerce.date().nullable(),
});

export const updateTaskInput = taskInput.extend({ id: z.string().uuid() });

export type TaskInput = z.infer<typeof taskInput>;
