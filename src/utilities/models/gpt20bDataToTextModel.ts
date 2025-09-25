import promptJson from "../../prompts/data-to-text/prompts.json";
import { getDataToTextHistory } from "../../api/index";

type Props = {
	c: any;
	text: string;
	data: any;
	egyptTime: string;
};

async function gpt20bDataToTextModel({ c, text, data, egyptTime }: Props) {
	try {
		const history = getDataToTextHistory();
		const userPrompt = text;

		const payload = {
			model: "@cf/openai/gpt-oss-20b",
			input: [
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
		};

		const response = await c.env.AI.run("@cf/openai/gpt-oss-20b", payload);

		return {
			isError: false,
			error: null,
			answer: response.output[1].content[0].text,
		};
	} catch (error) {
		return {
			isError: true,
			error,
			answer: "",
		};
	}
}

export default gpt20bDataToTextModel;
