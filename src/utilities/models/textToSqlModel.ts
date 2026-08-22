import promptJson from "../../prompts/text-to-sql/prompts.json";
import { getTextToSQLHistory } from "../../api/index";
import runModel, { MODELS, type ChatMessage } from "./runModel";

async function textToSqlModel(
	c: any,
	text: string,
	errorFeedback: null | string
) {
	const history = getTextToSQLHistory();
	const userPrompt = errorFeedback ? errorFeedback : text;

	const input: ChatMessage[] = [
		{
			role: "system",
			content: promptJson.systemPromptNew,
		},
		...promptJson.fewShotPrompts,
		...history,
		{
			role: "user",
			content: userPrompt,
		},
	];

	return runModel(c, MODELS.textToSQL, input);
}

export default textToSqlModel;
