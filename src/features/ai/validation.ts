import { z } from "zod";

export const studyPlanRequest = z.object({
	focus: z.string().trim().max(500).optional(),
	days: z.coerce.number().int().min(1).max(7).default(7),
});

export const generatedStudyPlan = z.object({
	title: z.string(),
	overview: z.string(),
	days: z
		.array(
			z.object({
				day: z.string(),
				focus: z.string(),
				tasks: z
					.array(
						z.object({
							title: z.string(),
							durationMinutes: z.number().int().min(15).max(240),
							priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
						}),
					)
					.min(1),
			}),
		)
		.min(1),
});

export const saveGeneratedStudyPlanInput = z.object({
	plan: generatedStudyPlan,
	selectedTaskKeys: z.array(z.string().min(1)).min(1),
	subjectId: z.string().uuid().nullable(),
});

export const taskBreakdownRequest = z.object({
	goal: z.string().trim().min(3).max(500),
	subjectId: z.string().uuid().nullable(),
});

export const generatedTaskBreakdown = z.object({
	goal: z.string(),
	overview: z.string(),
	tasks: z
		.array(
			z.object({
				title: z.string(),
				durationMinutes: z.number().int().min(15).max(240),
				priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
			}),
		)
		.min(1),
});

export const examInsightRequest = z.object({
	examId: z.string().uuid(),
});

export const generatedExamInsight = z.object({
	readinessSummary: z.string(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
	nextActions: z.array(z.string()).min(1).max(6),
	focusTopics: z.array(z.string()).min(1).max(6),
});

export type GeneratedTaskBreakdown = z.infer<typeof generatedTaskBreakdown>;
export type GeneratedExamInsight = z.infer<typeof generatedExamInsight>;

export type GeneratedStudyPlan = z.infer<typeof generatedStudyPlan>;
