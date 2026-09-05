import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import {
	generatedScheduleAdjustment,
	scheduleAdjustmentRequest,
} from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const generateScheduleAdjustment = createServerFn({ method: "POST" })
	.validator(scheduleAdjustmentRequest)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const [tasks, sessions, profile] = await Promise.all([
			prisma.task.findMany({
				where: { userId: user.id, completed: false },
				include: { subject: { select: { name: true } } },
				orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
				take: 30,
			}),
			prisma.studySession.findMany({
				where: { userId: user.id, completed: false },
				include: { subject: { select: { name: true } } },
				orderBy: { scheduledDate: "asc" },
				take: 20,
			}),
			prisma.profile.findUnique({
				where: { userId: user.id },
				select: { weeklyHours: true },
			}),
		]);

		if (tasks.length === 0 && sessions.length === 0) {
			throw new Error("There is no unfinished work to reschedule");
		}

		const prompt = JSON.stringify({
			currentDate: new Date().toISOString().slice(0, 10),
			days: data.days,
			weeklyStudyHours: profile?.weeklyHours ?? null,
			unfinishedTasks: tasks.map((task) => ({
				title: task.title,
				description: task.description,
				priority: task.priority,
				dueDate: task.dueDate?.toISOString().slice(0, 10) ?? null,
				subject: task.subject?.name ?? "General",
			})),
			unfinishedSessions: sessions.map((session) => ({
				title: session.title,
				durationMinutes: session.durationMin,
				scheduledDate: session.scheduledDate.toISOString().slice(0, 10),
				subject: session.subject?.name ?? "General",
			})),
		});

		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedScheduleAdjustment,
					temperature: 0.3,
					system:
						"You are a realistic study scheduler. Reschedule unfinished work into the requested number of future days. Prioritize overdue and high-priority work, preserve important subjects, keep each day manageable, and never invent more tasks than necessary. Return a concise summary and at least one actionable task per day.",
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
