import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { DEFAULT_AI_MODEL } from "#/lib/constants";

export function getAiModel() {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) {
		throw new Error("OPENROUTER_API_KEY is not configured");
	}

	const openrouter = createOpenRouter({ apiKey });
	return openrouter(process.env.OPENROUTER_MODEL ?? DEFAULT_AI_MODEL);
}
