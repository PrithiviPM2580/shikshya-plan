import { z } from "zod";

export const examInput = z.object({
	title: z.string().trim().min(1).max(160),
	subjectId: z.string().uuid().nullable(),
	examDate: z.coerce.date(),
	syllabus: z.string().trim().max(2000).optional(),
	readinessPercentage: z.coerce.number().int().min(0).max(100).default(0),
});

export const updateExamInput = examInput.extend({ id: z.string().uuid() });
export const examIdSchema = z.object({ id: z.string().uuid() });
