export const sqlErrorFeedback = (error: string, query: string, userText: string) => {
	return `Error in SQL statement: ${error}\nSQL statement: ${query}\nUser text: ${userText}`;
};
