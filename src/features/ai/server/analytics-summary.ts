import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import {
	analyticsSummaryRequest,
	generatedAnalyticsSummary,
} from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const generateAnalyticsSummary = createServerFn({ method: "POST" })
	.validator(analyticsSummaryRequest)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		start.setDate(start.getDate() - data.days + 1);

		const [logs, pomodoros, tasks, profile] = await Promise.all([
			prisma.studyLog.findMany({
				where: { userId: user.id, loggedAt: { gte: start } },
				include: { subject: { select: { name: true } } },
			}),
			prisma.pomodoroSession.findMany({
				where: { userId: user.id, startedAt: { gte: start } },
				select: { completed: true },
			}),
			prisma.task.findMany({
				where: { userId: user.id },
				select: { completed: true },
			}),
			prisma.profile.findUnique({
				where: { userId: user.id },
				select: { weeklyHours: true, targetGpa: true },
			}),
		]);

		const subjectMinutes = new Map<string, number>();
		for (const log of logs) {
			const subject = log.subject?.name ?? "General study";
			subjectMinutes.set(
				subject,
				(subjectMinutes.get(subject) ?? 0) + log.minutes,
			);
		}
		const totalMinutes = logs.reduce((total, log) => total + log.minutes, 0);
		const dailyMinutes = new Map<string, number>();
		for (const log of logs) {
			const day = log.loggedAt.toISOString().slice(0, 10);
			dailyMinutes.set(day, (dailyMinutes.get(day) ?? 0) + log.minutes);
		}
		const activeDays = dailyMinutes.size;
		const expectedHours = profile?.weeklyHours
			? (profile.weeklyHours / 7) * data.days
			: null;

		const prompt = JSON.stringify({
			periodDays: data.days,
			totalStudyHours: Math.round((totalMinutes / 60) * 10) / 10,
			activeDays,
			averageMinutesPerActiveDay: activeDays
				? Math.round(totalMinutes / activeDays)
				: 0,
			subjectDistribution: [...subjectMinutes.entries()]
				.sort((a, b) => b[1] - a[1])
				.map(([name, minutes]) => ({
					name,
					hours: Math.round((minutes / 60) * 10) / 10,
				})),
			taskCompletionRate: tasks.length
				? Math.round(
						(tasks.filter((task) => task.completed).length / tasks.length) *
							100,
					)
				: 0,
			pomodoroCompletionRate: pomodoros.length
				? Math.round(
						(pomodoros.filter((session) => session.completed).length /
							pomodoros.length) *
							100,
					)
				: 0,
			weeklyTargetHours: profile?.weeklyHours ?? null,
			expectedHoursForPeriod: expectedHours,
			targetGpa: profile?.targetGpa ?? null,
		});

		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedAnalyticsSummary,
					temperature: 0.3,
					system:
						"You are an encouraging but honest study analyst. Turn the supplied activity metrics into a concise summary. Mention patterns supported by the data, avoid judging the student, and make recommendations specific and achievable. Never invent metrics or claim causation that the data does not support.",
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
