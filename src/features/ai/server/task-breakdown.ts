import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { generatedTaskBreakdown, taskBreakdownRequest } from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const generateTaskBreakdown = createServerFn({ method: "POST" })
	.validator(taskBreakdownRequest)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		if (data.subjectId) {
			const subject = await prisma.subject.findFirst({
				where: { id: data.subjectId, userId: user.id },
				select: { name: true },
			});
			if (!subject) throw new Error("Subject not found");
		}

		const prompt = JSON.stringify({
			student: user.name,
			goal: data.goal,
			subjectId: data.subjectId,
		});
		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedTaskBreakdown,
					temperature: 0.3,
					system:
						"You break large academic goals into practical, ordered tasks. Return 3 to 8 concrete tasks, each with a realistic duration and priority. Never return an empty task list.",
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
