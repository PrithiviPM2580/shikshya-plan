import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { AI_MODELS, DEFAULT_AI_MODEL } from "#/lib/constants";

function getOpenRouter() {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) {
		throw new Error("OPENROUTER_API_KEY is not configured");
	}

	return createOpenRouter({ apiKey });
}

export function getAiModel(modelId = DEFAULT_AI_MODEL) {
	return getOpenRouter()(modelId);
}

export function getAiModelIds() {
	const configuredModel = process.env.OPENROUTER_MODEL;
	const firstModel = configuredModel ?? DEFAULT_AI_MODEL;
	return [firstModel, ...AI_MODELS.filter((modelId) => modelId !== firstModel)];
}
