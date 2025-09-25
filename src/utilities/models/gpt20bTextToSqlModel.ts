import promptJson from "../../prompts/text-to-sql/prompts.json";
import { getTextToSQLHistory } from "../../api/index";

async function gpt20bTextToSqlModel(
  c: any,
  text: string,
  textToSqlAnswer: null | string,
  errorFeedback: null | string
) {
  try {
    const history = getTextToSQLHistory();
    const userPrompt = errorFeedback ? errorFeedback : text;

    const payload = {
	    model: "@cf/openai/gpt-oss-20b",
	    input: [
	      {
	        role: "system",
	        content: promptJson.systemPromptNew,
	      },
	      ...promptJson.fewShotPrompts,
	      ...history,
	      {
	        role: "user",
	        content: text,
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

export default gpt20bTextToSqlModel;
