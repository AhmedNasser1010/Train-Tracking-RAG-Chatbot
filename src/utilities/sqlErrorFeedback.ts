export const sqlErrorFeedback = (error: string, sql: string, userText: string) => {
	return `Error in SQL query: ${error}\nIncorrect SQL: ${sql}\nOriginal user text: ${userText}`;
};
