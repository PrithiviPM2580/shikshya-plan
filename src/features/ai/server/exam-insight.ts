import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { getExamReadinessForEntity } from "#/features/exams/server/readiness";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { examInsightRequest, generatedExamInsight } from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const generateExamInsight = createServerFn({ method: "POST" })
	.validator(examInsightRequest)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const exam = await prisma.exam.findFirst({
			where: { id: data.examId, userId: user.id },
			include: { subject: { select: { name: true } } },
		});
		if (!exam) throw new Error("Exam not found");

		const [tasks, studyMinutes] = await Promise.all([
			prisma.task.findMany({
				where: {
					userId: user.id,
					...(exam.subjectId ? { subjectId: exam.subjectId } : {}),
				},
				select: { title: true, completed: true, priority: true },
				take: 30,
			}),
			prisma.studyLog.aggregate({
				where: {
					userId: user.id,
					...(exam.subjectId ? { subjectId: exam.subjectId } : {}),
				},
				_sum: { minutes: true },
			}),
		]);
		const readiness = await getExamReadinessForEntity({
			userId: user.id,
			subjectId: exam.subjectId,
			examDate: exam.examDate,
			manualReadiness: exam.readinessPercentage,
		});
		const daysRemaining = Math.max(
			0,
			Math.ceil((exam.examDate.getTime() - Date.now()) / 86400000),
		);
		const prompt = JSON.stringify({
			exam: {
				title: exam.title,
				subject: exam.subject?.name ?? "General",
				syllabus: exam.syllabus,
				daysRemaining,
				readiness,
			},
			recentStudyMinutes: studyMinutes._sum.minutes ?? 0,
			tasks,
		});
		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedExamInsight,
					temperature: 0.3,
					system:
						"You are an academic exam coach. Give honest, specific, achievable advice based only on the supplied exam data. Keep next actions concrete and prioritize the most urgent work.",
					prompt,
				});
				return { ...result.object, readiness, daysRemaining };
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
