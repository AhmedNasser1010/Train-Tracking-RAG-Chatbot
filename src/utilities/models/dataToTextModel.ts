import promptJson from "../../prompts/data-to-text/prompts.json";
import { getDataToTextHistory } from "../../api/index";

type Props = {
	c: any;
	text: string;
	data: any;
	egyptTime: string;
};

async function dataToTextModel({ c, text, data, egyptTime }: Props) {
	try {
		const history = getDataToTextHistory();

		const { response: answer } = await c.env.AI.run(
			"@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
			{
				messages: [
					{
						role: "system",
						content: promptJson.systemPrompt,
					},
					...promptJson.examplePrompts,
					...history,
					{
						role: "user",
						content: `الوقت الحالي: ${egyptTime}.\البيانات الحالية: ${data}.\nسؤال المستخدم: ${text}.`,
					},
				],
				temperature: 0.3,
				top_k: 25,
				top_p: 0.85,
				max_tokens: 5000
			}
		);

		return {
			isError: false,
			error: null,
			answer
		};
	} catch (error) {
		return {
			isError: true,
			error,
			answer: null
		};
	}
}

export default dataToTextModel;
