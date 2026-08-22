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
import simulateTrainSchedule from "../../../utilities/simulateTrainSchedule";
import calcTime from "../../../utilities/calcTime";
import type { TrainScheduleViewEntry } from "../../../types/TrainScheduleViewEntry";

export const webhookHandler = async (c: any) => {
	console.log("START")
	const dataToTextHistory = getDataToTextHistory();
	try {
		const egyptTime: string = calcTime("+3");
		const update = await c.req.json();
		const text: string = update.message.text;
		const chatId = update.message.chat.id;
		const messageId = update.message.message_id;

		// Failed attempts loop
		const textToSQLMaxAttepts = 3;
		let textToSQLAttepts = 0;
		let textToSqlAnswer = null;
		let parserResult: {
			valid: boolean;
			isInjection?: boolean;
			error?: string | null;
		} = { valid: false };
		let errorFeedback: string | null = null;
		do {
			// Text-to-SQL model
			textToSqlAnswer = await textToSqlModel(
				c,
				text,
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
					errorFeedback = parserResult?.error ?? null;
				}
			}

			if (parserResult?.valid === true) {
				break;
			}

			textToSQLAttepts++;
			await delay(2000);
		} while (textToSQLAttepts <= textToSQLMaxAttepts);

		// Never execute anything that failed validation.
		if (parserResult?.valid !== true || textToSqlAnswer.isError) {
			await sendMessage(
				c.env,
				chatId,
				"عذراً، لم أتمكن من فهم طلبك أو تحويله إلى استعلام آمن. حاول صياغة سؤالك بشكل مختلف.",
			);
			return c.json("Failed to generate a valid SQL statement.", 200);
		}

		// Read data from database
		const executeResult = await executeSql(c, textToSqlAnswer.answer);
		console.log("PASSED 3");

		// Format & beautification result
		const scheduleRows = executeResult as unknown as TrainScheduleViewEntry[];
		let formatedResult: string;
		if (isTrainScheduleViewTable(scheduleRows)) {
			// Trains simulation
			const simulatedData = simulateTrainSchedule(egyptTime, scheduleRows);
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
			dataToTextAttepts++;
			console.log("PASSED 5");
			console.log('dataToTextAnswer:')
			console.log(dataToTextAnswer)
		} while (
			(dataToTextAnswer === null || dataToTextAnswer.isError !== false) &&
			dataToTextAttepts <= dataToTextMaxAttepts
		);

		if (dataToTextAnswer === null || dataToTextAnswer.isError !== false) {
			await sendMessage(
				c.env,
				chatId,
				"عذراً، حدث خطأ أثناء تجهيز الإجابة. حاول مرة أخرى.",
			);
			return c.json("Failed to generate a natural language answer.", 200);
		}

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
					dataToText: {
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
			`${Math.ceil(dataToTextHistory.length / 2)}: ${dataToTextAnswer.answer}`,
			200,
		);
	} catch (err) {
		console.error("Catch Err `webhookHandler.ts`: ", err);
		return c.json("Internal Server Error.", 200);
	}
};
