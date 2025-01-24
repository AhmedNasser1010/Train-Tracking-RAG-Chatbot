import promptJson from '../../prompts/prompts.json';
import { getHistory } from '../../api/index';

async function dataToTextModel(c: any, text: string, data: any) {
  const history = getHistory();
  const stringifyData = JSON.stringify(data);

	const llama70b = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
	const llama8b = '@cf/meta/llama-3.1-8b-instruct-fast';

	const { response: answer } = await c.env.AI.run(llama70b, {
		messages: [
			{
				role: 'system',
				content: `You are helpful train schedule assistant, answer the user on their questions depending on the tool data.
				Train Data:
				${stringifyData}`,
			},
			...history,
			{
				role: 'user',
				content: text,
			},
		],
		// temperature: 0.2, // default 0.6 min 0 max 5 Recommended 0.2 - 0.5
		// top_k: 10, // min 1 max 50 Recommended 10 - 50
		// top_p: 0.9, // min 0 max 2 Recommended 0.9
		// max_tokens: 150, // default 256 Recommended 100 - 200
		// frequency_penalty: 0.3, // min 0 max 2 Recommended 0.0 - 0.5
		// repetition_penalty: 0.3 // min 0 max 2 Recommended 0.0 - 0.5
	});

	console.log([
		{
				role: 'system',
				content: `You are helpful train schedule assistant, answer the user on their questions depending on the tool data.
				Train Data:
				${stringifyData}`,
			},
			...history,
			{
				role: 'user',
				content: text,
			}
	])

	return answer;
}

export default dataToTextModel;
