import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { requireCurrentUser } from "#/lib/server-auth";
import { generatedQuiz, quizRequest } from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const generateQuiz = createServerFn({ method: "POST" })
	.validator(quizRequest)
	.handler(async ({ data }) => {
		await requireCurrentUser();
		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedQuiz,
					temperature: 0.5,
					system:
						"You are a careful academic quiz writer. Create clear factual multiple-choice questions with exactly four distinct options, one correct option, and a concise explanation. Avoid trick questions.",
					prompt: JSON.stringify({
						topic: data.topic,
						questionCount: data.questionCount,
					}),
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
