export const MODELS = {
	// textToSQL: "@cf/openai/gpt-oss-20b",
	// dataToText: "@cf/openai/gpt-oss-20b",
	textToSQL: '@cf/zai-org/glm-4.7-flash',
	dataToText: '@cf/zai-org/glm-4.7-flash',
} as const;

export type ChatMessage = {
	role: string;
	content: string;
};

type RunModelResult = {
	isError: boolean;
	error: unknown;
	answer: string;
};

async function runModel(c: any, model: string, messages: ChatMessage[]): Promise<RunModelResult> {
	try {
		const response = await c.env.AI.run(model, { messages });

		const rawAnswer: string = response.choices?.[0]?.message?.content ?? '';

		return {
			isError: false,
			error: null,
			answer: rawAnswer.replace(/<think>[\s\S]*?<\/think>/g, '').trim(),
		};
	} catch (error) {
		return {
			isError: true,
			error,
			answer: '',
		};
	}
}

export default runModel;
