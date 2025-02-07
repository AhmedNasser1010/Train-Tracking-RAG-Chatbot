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

export const webhookHandler = async (c: any) => {
	const dataToTextHistory = getDataToTextHistory();
	try {
	  const update = await c.req.json();
	  const text: string = update.message.text;
	  console.log("PASSED: get user text");

	  // Faild attepts loop
	  const maxAttepts = 3;
	  let attepts = 0;
	  let textToSqlAnswer = null;
	  let parserResult = { valid: false };
	  let errorFeedback = null;
	  do {
			// Text-to-SQL model
		  textToSqlAnswer = await textToSqlModel(c, text, textToSqlAnswer, errorFeedback);
		  console.log("PASSED: text-to-sql");

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
		  
			console.log("ATTEPTS: ", attepts);
	  	attepts++
	  	await delay(2000);
	  } while(attepts <= maxAttepts);
		 
		console.log("PASSED: sql parser");

		// Read data from database
		const executeResult = await executeSql(c, textToSqlAnswer.answer);
	  console.log("PASSED: read data from database");

	  // Format & beautification result
	  const formatedResult = isTrainScheduleViewTable(executeResult) ? jsonToCsv(executeResult) : executeResult
	  console.log("PASSED: Format & beautification result")

		// Data-to-Text model
		const answer = await dataToTextModel({c, text, query: textToSqlAnswer.answer, executeResult});
		
		// Push to text-to-sql history
	  pushToTextToSQLHistory(text, textToSqlAnswer.answer);
	  console.log("PASSED: Push text to SQL history");

	  // Push to data-to-text history
	  pushToDataToTextHistory(text, answer);
	  console.log("PASSED: Push data ro text history");

	  console.log(
	  	"GENERATE: Answer report:\n==========\n",
	  	{
	  		user: text,
	  		sql: textToSqlAnswer.answer,
	  		jsonData: executeResult,
	  		csvData: formatedResult,
	  		answer,
	  		attepts
	  	},
	  	"\n==========\n"
	  );

	  return c.json(`${(dataToTextHistory.length / 5 + 1).toFixed(0)}: ${JSON.stringify(answer)}`, 200);
	} catch(err) {
		console.error('Catch Err `webhookHandler.ts`: ', err)
		return c.json("Internal Server Error.", 200);
	}
}