import textToSqlModel from "../../../utilities/models/textToSqlModel";
import dataToTextModel from "../../../utilities/models/dataToTextModel";
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
	const dataToTextHistory = getDataToTextHistory();
	try {
		const egyptTime: string = calcTime("+2");
		const update = await c.req.json();
		const text: string = update.message.text;
		const chatId = update.message.chat.id;
		const messageId = update.message.message_id;
		const chatType = update.message.chat.type;

		// Faild attepts loop
		const textToSQLMaxAttepts = 3;
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

			if (textToSqlAnswer.answer) {
				textToSqlAnswerAfterTag = afterThinkTagText(
					textToSqlAnswer.answer,
				).afterTag;
			}

			if (!textToSqlAnswer.isError) {
				// SQL query parser
				parserResult = await sqlParser(c, textToSqlAnswerAfterTag, text);

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
		const executeResult = await executeSql(c, textToSqlAnswerAfterTag);

		// Format & beautification result
		let formatedResult = executeResult;
		if (isTrainScheduleViewTable(executeResult)) {
			// Trains simulation
			const simulatedData = simulateTrainSchedule(egyptTime, executeResult);
			formatedResult = trainSimulatedDataToCSV(simulatedData);
		} else {
			formatedResult = JSON.stringify(executeResult);
		}

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

			if (dataToTextAnswer !== null && dataToTextAnswer.isError === false) {
				break;
			}
		} while (dataToTextMaxAttepts <= dataToTextAttepts);


		const {
			matched,
			afterTag: dataToTextAfterTag,
			error,
		} = afterThinkTagText(dataToTextAnswer.answer);


		if (matched) {
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
			pushToTextToSQLHistory(text, textToSqlAnswerAfterTag);

			// Push to data-to-text history
			pushToDataToTextHistory(text, dataToTextAfterTag);

			await sendMessage(env, chatId, `${dataToTextAfterTag}\n\n${messageId}`);

			return c.json(
				`${(dataToTextHistory.length / 5 + 1).toFixed(0)}: ${dataToTextAfterTag}`,
				200,
			);
		} else {
			throw error;
		}
	} catch (err) {
		console.error("Catch Err `webhookHandler.ts`: ", err);
		return c.json("Internal Server Error.", 200);
	}
};