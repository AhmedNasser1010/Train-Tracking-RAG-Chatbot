import promptJson from "../../prompts/data-to-text/prompts.json";
import { getDataToTextHistory } from "../../api/index";
import calcTime from "../../utilities/calcTime";

type Props = {
	c: any;
	text: string;
	data: any;
};

async function dataToTextModel({ c, text, data }: Props) {
	try {
		const history = getDataToTextHistory();
		const stringifyData = JSON.stringify(data);
		const egyptTime: string = calcTime("+2");

		const { response: answer } = await c.env.AI.run(
			"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
			{
				messages: [
					{
						role: "system",
						content: promptJson.systemPrompt,
					},
					...promptJson.examplePrompts,
					// ...history,
					{
						role: "user",
						content: `Current Date: ${egyptTime}.\nCurrent Data: ${stringifyData}.\nUser Question: ${text}.`,
					},
				],
				temperature: 0.3,
				top_k: 25,
				top_p: 0.85,
				max_tokens: 5000
			}
		);

		return answer;
	} catch (err) {
		return err;
	}
}

export default dataToTextModel;
