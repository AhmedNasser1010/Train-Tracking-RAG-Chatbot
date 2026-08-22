export const MODELS = {
	// textToSQL: "@cf/openai/gpt-oss-20b",
	// dataToText: "@cf/openai/gpt-oss-20b",
	textToSQL: '@cf/openai/gpt-oss-120b',
	dataToText: '@cf/openai/gpt-oss-120b',
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
		const response: any = await c.env.AI.run(model, {
			messages,
			max_tokens: 4096,
			reasoning_effort: 'low',
			temperature: 0.1,
			top_p: 0.9,
			seed: 42,
		});

		// Support both Chat Completions and Responses API response shapes.
		const rawAnswer: string = (
			response.choices?.[0]?.message?.content ??
			response.output_text ??
			''
		)
			.replace(/<think>[\s\S]*?<\/think>/g, '')
			.trim();

		if (!rawAnswer) {
			return {
				isError: true,
				error: new Error('Model returned an empty answer.'),
				answer: '',
			};
		}

		return {
			isError: false,
			error: null,
			answer: rawAnswer,
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
