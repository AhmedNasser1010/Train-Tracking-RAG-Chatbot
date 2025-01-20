import textToSqlModel from "../../../utilities/models/textToSqlModel";
import { validateSql } from "../../../utilities/validateSql";
import { getHistory, pushHistory } from "../../index";

export const webhookHandler = async (c: any) => {
	try {
	  const update = await c.req.json();
	  const chat_id: string = update.message.chat.id;
	  const text: string = update.message.text;

	  const textToSqlAnswer = await textToSqlModel(c, text);
	  
	  const validationResult = validateSql(textToSqlAnswer);

	  if (validationResult.valid) {
	    console.log("SQL statement is valid.");
	    console.log("AST:", validationResult.ast);
	  } else {
	    console.error("SQL statement is invalid:", validationResult.error);
	  }
		
	  pushHistory(text, textToSqlAnswer);
	  const history = getHistory()

	  return c.json(`${history.length / 2}: ${textToSqlAnswer}`, 200);
	} catch(err) {
		console.error('err', err)
		return c.json(err, 500);
	}
}