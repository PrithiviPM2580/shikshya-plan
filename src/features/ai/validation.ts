import { z } from "zod";

export const studyPlanRequest = z.object({
	focus: z.string().trim().max(500).optional(),
	days: z.coerce.number().int().min(1).max(7).default(7),
});

export const generatedStudyPlan = z.object({
	title: z.string(),
	overview: z.string(),
	days: z.array(
		z.object({
			day: z.string(),
			focus: z.string(),
			tasks: z.array(
				z.object({
					title: z.string(),
					durationMinutes: z.number().int().min(15).max(240),
					priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
				}),
			),
		}),
	),
});

export type GeneratedStudyPlan = z.infer<typeof generatedStudyPlan>;
