import promptJson from "../../prompts/data-to-text/prompts.json";
import { getDataToTextHistory } from "../../api/index";
import calcTime from "../../utilities/calcTime";

type Props = {
	c: any;
	text: string;
	query: string;
	data: any;
};

async function dataToTextModel({ c, text, query, data }: Props) {
	try {
		const history = getDataToTextHistory();
		const stringifyData = JSON.stringify(data);
		const egyptTime: string = calcTime("+2");

		const dummyData = `train_number, train_type, stop_points, arrival_time
	"1111", "Russian", ["Faiyum","Wasta","Ayat","Giza","Cairo"], ["12:50 pm","01:39 pm","02:05 pm","02:49 pm","03:10 pm"]`;
		const dummyTime = `1/27/2025 01:39:14 PM`;

		const systemPrompt = `${promptJson.systemPrompt}

=== Current Date ===
${egyptTime}.

=== Current Data ===
${stringifyData}`;
		const fullPrompt = [
			{
				role: "system",
				content: systemPrompt,
			},
			...promptJson.fewShotPrompts,
			...history,
			{
				role: "user",
				content: text,
			},
		];

		const llama70b = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
		const llama8b = "@cf/meta/llama-3.1-8b-instruct-fast";
		const deepseek = "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b";

		const { response: answer } = await c.env.AI.run(llama8b, {
			messages: fullPrompt,
			temperature: 0.3, // default 0.6 min 0 max 5 Recommended 0.2 - 0.5
			top_k: 20, // min 1 max 50 Recommended 10 - 50
			top_p: 0.9, // min 0 max 2 Recommended 0.9
			// max_tokens: 10000, // default 256 Recommended 100 - 200
			// frequency_penalty: 0.3, // min 0 max 2 Recommended 0.0 - 0.5
			// repetition_penalty: 0.3 // min 0 max 2 Recommended 0.0 - 0.5
		});

		return answer;
	} catch (err) {
		return err;
	}
}

export default dataToTextModel;
