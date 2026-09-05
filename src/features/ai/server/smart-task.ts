import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { generatedSmartTask, smartTaskRequest } from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const createSmartTask = createServerFn({ method: "POST" })
	.validator(smartTaskRequest)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const subjects = await prisma.subject.findMany({
			where: { userId: user.id },
			select: { id: true, name: true },
		});
		const today = new Date().toISOString().slice(0, 10);
		const subjectNames = subjects.map((subject) => subject.name);
		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedSmartTask,
					temperature: 0.2,
					system:
						"Extract one task from the user request. Use dates in YYYY-MM-DD format relative to today. Only choose a subject from the supplied subject list; otherwise return null. Keep the title concise.",
					prompt: JSON.stringify({
						today,
						userRequest: data.request,
						subjects: subjectNames,
					}),
				});
				const task = result.object;
				const subject = subjects.find(
					(item) =>
						item.name.toLowerCase() === task.subjectName?.trim().toLowerCase(),
				);
				const dueDate = task.dueDate
					? new Date(`${task.dueDate}T23:59:59`)
					: null;
				if (dueDate && Number.isNaN(dueDate.getTime())) {
					throw new Error("AI returned an invalid due date");
				}
				return prisma.task.create({
					data: {
						userId: user.id,
						title: task.title,
						description: task.description || undefined,
						priority: task.priority,
						dueDate,
						subjectId: subject?.id ?? null,
					},
				});
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
