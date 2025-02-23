import textToSqlModel from "../../../utilities/models/textToSqlModel";
import dataToTextModel from "../../../utilities/models/dataToTextModel";
import { sqlParser } from "../../../utilities/sql/sqlParser";
import { executeSql } from "../../../utilities/sql/executeSql";
import {
	getDataToTextHistory,
	pushToTextToSQLHistory,
	pushToDataToTextHistory
} from "../../index";
import jsonToCsv from "../../../utilities/jsonToCsv";
import isTrainScheduleViewTable from "../../../utilities/isTrainScheduleViewTable";
import delay from "../../../utilities/delay";
import sendMessage from '../../../utilities/telegram/sendMessage';

export const webhookHandler = async (c: any) => {
	const dataToTextHistory = getDataToTextHistory();
	try {
	  const update = await c.req.json();
	  const text: string = update.message.text;
	  const chatId = update.message.chat.id;

	  // Faild attepts loop
	  const maxAttepts = 3;
	  let attepts = 0;
	  let textToSqlAnswer = null;
	  let parserResult = { valid: false };
	  let errorFeedback = null;
	  do {
			// Text-to-SQL model
		  textToSqlAnswer = await textToSqlModel(c, text, textToSqlAnswer, errorFeedback);

		  if (!textToSqlAnswer.isError) {
				// SQL query parser
			  parserResult = await sqlParser(c, textToSqlAnswer.answer, text);

				// End if it is injection query
				if (parserResult?.isInjection) {
					return c.json('SQL injection detected', 200);
				}

				if (!parserResult?.valid) {
					errorFeedback = parserResult?.error;
				}
		  }

		  if (parserResult?.valid === true) {
		  	break;
		  }
		  
	  	attepts++
	  	await delay(2000);
	  } while(attepts <= maxAttepts);

		// Read data from database
		const executeResult = await executeSql(c, textToSqlAnswer.answer);

	  // Format & beautification result
	  const formatedResult = isTrainScheduleViewTable(executeResult) ? jsonToCsv(executeResult) : executeResult

		// Data-to-Text model
		const answer = await dataToTextModel({c, text, data: formatedResult});
		
		// Push to text-to-sql history
	  pushToTextToSQLHistory(text, textToSqlAnswer.answer);

	  // Push to data-to-text history
	  pushToDataToTextHistory(text, answer);

	  console.log(
	  	"GENERATE: Answer report:\n==========\n",
	  	JSON.stringify({
	  		user: text,
	  		sql: textToSqlAnswer.answer,
	  		jsonData: executeResult,
	  		csvData: formatedResult,
	  		answer,
	  		attepts
	  	}),
	  	"\n==========\n"
	  );

	  const regex = /<\/think>\s*(.*)/s;
	  const match = answer.match(regex);

	  if (match && match[1]) {
		  const message = match[1];
		  await sendMessage(c.env, chatId, message);
		  return c.json(`${(dataToTextHistory.length / 5 + 1).toFixed(0)}: ${message}`, 200);
		} else {
			throw "No message found after </think>"
		}

	} catch(err) {
		console.error('Catch Err `webhookHandler.ts`: ', err)
		return c.json("Internal Server Error.", 200);
	}
}