import { z } from "zod";

export const subjectIdSchema = z.object({
	id: z.string("Subject ID must be a string"),
});

export const subjectInput = z.object({
	name: z.string().trim().min(1).max(120),
	description: z.string().trim().max(500).optional(),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const updateSubjectInput = subjectInput.extend({
	id: z.string("Subject ID must be a string"),
});

export type SubjectInput = z.infer<typeof subjectInput>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectInput>;
