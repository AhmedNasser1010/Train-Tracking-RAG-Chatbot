import promptJson from '../../prompts/text-to-sql/prompts.json';
import { getTextToSQLHistory } from '../../api/index';

async function textToSqlModel(c: any, text: string, textToSqlAnswer: null | string, errorFeedback: null | string) {
	try {
		const history = getTextToSQLHistory();

		const llama70b = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
		const llama8b = '@cf/meta/llama-3.1-8b-instruct-fast';
		const deepseek = '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b';
		const gpt20b = '@cf/openai/gpt-oss-20b';

		const userPrompt = errorFeedback ? errorFeedback : text;

		const { response: answer } = await c.env.AI.run(deepseek, {
			messages: [
				{
					role: 'system',
					content: promptJson.systemPromptNew,
				},
				...promptJson.fewShotPrompts,
				...history,
				{
					role: 'user',
					content: userPrompt,
				},
			],
			// temperature: 0.2, // default 0.6 min 0 max 5 Recommended 0.2 - 0.5
			// top_k: 10, // min 1 max 50 Recommended 10 - 50
			// top_p: 0.9, // min 0 max 2 Recommended 0.9
			max_tokens: 5000, // default 256 Recommended 100 - 200
			// frequency_penalty: 0.3, // min 0 max 2 Recommended 0.0 - 0.5
			// repetition_penalty: 0.3 // min 0 max 2 Recommended 0.0 - 0.5
		});

		return {
			isError: false,
			error: null,
			answer
		};
	} catch(error) {
		return {
			isError: true,
			error,
			answer: null
		};
	}
}

export default textToSqlModel;
