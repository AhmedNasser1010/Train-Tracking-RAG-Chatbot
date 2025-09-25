import textToSqlModel from "../../../utilities/models/gpt20bTextToSqlModel";
import dataToTextModel from "../../../utilities/models/gpt20bDataToTextModel";
import { sqlParser } from "../../../utilities/sql/sqlParser";
import { executeSql } from "../../../utilities/sql/executeSql";
import {
	getDataToTextHistory,
	pushToTextToSQLHistory,
	pushToDataToTextHistory,
} from "../../index";
import trainSimulatedDataToCSV from "../../../utilities/trainSimulatedDataToCSV";
import isTrainScheduleViewTable from "../../../utilities/isTrainScheduleViewTable";
import delay from "../../../utilities/delay";
import sendMessage from "../../../utilities/telegram/sendMessage";
import afterThinkTagText from "../../../utilities/afterThinkTagText";
import simulateTrainSchedule from "../../../utilities/simulateTrainSchedule";
import calcTime from "../../../utilities/calcTime";

export const webhookHandler = async (c: any) => {
	console.log("START")
	const dataToTextHistory = getDataToTextHistory();
	try {
		const egyptTime: string = calcTime("+3");
		// const egyptTime: string = "5:40 AM";
		const update = await c.req.json();
		const text: string = update.message.text;
		const chatId = update.message.chat.id;
		const messageId = update.message.message_id;
		const chatType = update.message.chat.type;

		// Faild attepts loop
		const textToSQLMaxAttepts = 0;
		let textToSQLAttepts = 0;
		let textToSqlAnswer = null;
		let textToSqlAnswerAfterTag = null;
		let parserResult = { valid: false };
		let errorFeedback = null;
		do {
			// Text-to-SQL model
			textToSqlAnswer = await textToSqlModel(
				c,
				text,
				textToSqlAnswer,
				errorFeedback,
			);
			console.log("PASSED 1");
			console.log(textToSqlAnswer)

			if (!textToSqlAnswer.isError) {
				// SQL query parser
				parserResult = await sqlParser(c, textToSqlAnswer.answer, text);
				console.log("PASSED 2");
				console.log(textToSqlAnswer.answer)

				// End if it is injection query
				if (parserResult?.isInjection) {
					return c.json("SQL injection detected", 200);
				}

				if (!parserResult?.valid) {
					errorFeedback = parserResult?.error;
				}
			}

			if (parserResult?.valid === true) {
				break;
			}

			textToSQLAttepts++;
			await delay(2000);
		} while (textToSQLAttepts <= textToSQLMaxAttepts);

		// Read data from database
		const executeResult = await executeSql(c, textToSqlAnswer.answer);
		console.log("PASSED 3");

		// Format & beautification result
		let formatedResult = executeResult;
		if (isTrainScheduleViewTable(executeResult)) {
			// Trains simulation
			const simulatedData = simulateTrainSchedule(egyptTime, executeResult);
			formatedResult = trainSimulatedDataToCSV(simulatedData);
		} else {
			formatedResult = JSON.stringify(executeResult);
		}
		console.log("PASSED 4");

		const dataToTextMaxAttepts = 3;
		let dataToTextAttepts = 0;
		let dataToTextAnswer = null;

		do {
			// Data-to-Text model
			dataToTextAnswer = await dataToTextModel({
				c,
				text,
				data: formatedResult,
				egyptTime,
			});
			console.log("PASSED 5");
			console.log('dataToTextAnswer:')
			console.log(dataToTextAnswer)

			if (dataToTextAnswer !== null && dataToTextAnswer.isError === false) {
				break;
			}
		} while (dataToTextMaxAttepts <= dataToTextAttepts);

		console.log(
			"GENERATE: Answer report:\n==========\n",
			JSON.stringify({
				id: messageId,
				user: update,
				input: text,
				timestamp: Date.now(),
				models: {
					textToSQL: {
						...textToSqlAnswer,
						attepts: textToSQLAttepts,
					},
					dataToSQL: {
						...dataToTextAnswer,
						attepts: dataToTextAttepts,
					},
				},
				data: {
					json: executeResult,
					csv: formatedResult,
				},
			}),
			"\n==========\n",
		);
			
		// Push to text-to-sql history
		pushToTextToSQLHistory(text, textToSqlAnswer.answer);

		// Push to data-to-text history
		pushToDataToTextHistory(text, dataToTextAnswer.answer);

		await sendMessage(c.env, chatId, `${dataToTextAnswer.answer}\n\n${messageId}`);

		return c.json(
			`${(dataToTextHistory.length / 5 + 1).toFixed(0)}: ${dataToTextAnswer.answer}`,
			200,
		);
		console.log("PASSED 6");
		console.log("END")
	} catch (err) {
		console.error("Catch Err `webhookHandler.ts`: ", err);
		return c.json("Internal Server Error.", 200);
	}
};