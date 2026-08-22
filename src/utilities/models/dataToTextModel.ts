import promptJson from "../../prompts/data-to-text/prompts.json";
import { getDataToTextHistory } from "../../api/index";
import runModel, { MODELS, type ChatMessage } from "./runModel";

type Props = {
	c: any;
	text: string;
	data: any;
	egyptTime: string;
};

async function dataToTextModel({ c, text, data, egyptTime }: Props) {
	const history = getDataToTextHistory();

	const input: ChatMessage[] = [
		{
			role: "system",
			content: promptJson.systemPrompt,
		},
		...promptJson.examplePrompts,
		...history,
		{
			role: "user",
			content: `الوقت الحالي: ${egyptTime}.\nالبيانات الحالية: ${data}.\nسؤال المستخدم: ${text}.`,
		},
	];

	return runModel(c, MODELS.dataToText, input);
}

export default dataToTextModel;
