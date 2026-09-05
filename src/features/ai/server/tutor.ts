import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { requireCurrentUser } from "#/lib/server-auth";
import { generatedTutorResponse, tutorRequest } from "../validation";
import { getAiModel, getAiModelIds } from "./provider";

export const askTutor = createServerFn({ method: "POST" })
	.validator(tutorRequest)
	.handler(async ({ data }) => {
		await requireCurrentUser();
		let lastError: unknown;
		for (const modelId of getAiModelIds()) {
			try {
				const result = await generateObject({
					model: getAiModel(modelId),
					schema: generatedTutorResponse,
					temperature: 0.4,
					system:
						"You are a patient academic tutor. Explain concepts accurately in clear language suitable for a student. Use the requested subject as context when supplied. Do not invent facts, and say when a question needs more context. Return a direct answer, concise key points, one practical example, and useful follow-up questions.",
					prompt: JSON.stringify(data),
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
