import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { generatedStudyPlan, studyPlanRequest } from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const generateStudyPlan = createServerFn({ method: "POST" })
	.validator(studyPlanRequest)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const [profile, subjects, exams] = await Promise.all([
			prisma.profile.findUnique({
				where: { userId: user.id },
				select: {
					weeklyHours: true,
					targetGpa: true,
					program: true,
					semester: true,
				},
			}),
			prisma.subject.findMany({
				where: { userId: user.id },
				select: { name: true, description: true },
				orderBy: { name: "asc" },
			}),
			prisma.exam.findMany({
				where: {
					userId: user.id,
					completed: false,
					examDate: { gte: new Date() },
				},
				select: {
					title: true,
					examDate: true,
					syllabus: true,
					subject: { select: { name: true } },
				},
				orderBy: { examDate: "asc" },
				take: 8,
			}),
		]);

		const prompt = JSON.stringify({
			request: {
				days: data.days,
				focus: data.focus ?? "Balance upcoming exams and unfinished coursework",
			},
			student: {
				name: user.name,
				program: profile?.program,
				semester: profile?.semester,
				weeklyHours: profile?.weeklyHours,
				targetGpa: profile?.targetGpa,
			},
			subjects,
			upcomingExams: exams.map((exam) => ({
				...exam,
				examDate: exam.examDate.toISOString(),
			})),
		});

		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedStudyPlan,
					temperature: 0.4,
					system:
						"You are a practical academic study planner. Create achievable schedules, avoid overloading students, and use only the provided subjects and exams. You must return a non-empty days array. Create one day entry for each requested day and at least one task inside every day. Return exactly the requested structured plan.",
					prompt,
				});
				return result.object;
			} catch (error) {
				lastError = error;
			}
		}

		throw new Error(
			lastError instanceof Error
				? `All AI models are currently unavailable: ${lastError.message}`
				: "All AI models are currently unavailable. Please retry shortly.",
		);
	});
