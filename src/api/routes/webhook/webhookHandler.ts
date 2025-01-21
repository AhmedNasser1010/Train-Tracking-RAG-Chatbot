import textToSqlModel from "../../../utilities/models/textToSqlModel";
import { sqlParser } from "../../../utilities/sqlParser";
import { sqlFirewall } from "../../../utilities/sqlFirewall";
import { executeSql } from "../../../utilities/executeSql";
import { getHistory, pushHistory } from "../../index";

export const webhookHandler = async (c: any) => {
	const history = getHistory()
	try {
	  const update = await c.req.json();
	  // const chat_id: string = update.message.chat.id;
	  const text: string = update.message.text;

		// Text-to-SQL model
	  const textToSqlAnswer = await textToSqlModel(c, text);
	  
		// SQL query parser
	  const parserResult = sqlParser(textToSqlAnswer, text);

		// End if it is empty query
		if (parserResult.error === 'SQL statement is empty.') {
			return c.json(`${history.length / 2}: ${textToSqlAnswer}`, 200);
		}

		// Firewall malicious query check
		const maliciousResult = sqlFirewall(parserResult.ast);

		// End if it is malicious query
		if (maliciousResult.error === 'Incorrect SQL statement.') {
			console.log('malicious')
			return c.json(`${history.length / 2}: invalid query`, 200);
		}

		// Read data from database
		const executeResult = await executeSql(c, textToSqlAnswer);

		console.log(executeResult)
		
		// Push to the chat history
	  // pushHistory(text, textToSqlAnswer);

	  return c.json(`${history.length / 2}: ${textToSqlAnswer}`, 200);
	} catch(err) {
		// console.error('err', err)
		return c.json(err, 500);
	}
}