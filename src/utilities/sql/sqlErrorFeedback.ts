export const sqlErrorFeedback = (error: string, query: string, userText: string) => {
	return `Your previous SQL statement was rejected. Generate a corrected PostgreSQL SELECT query for the original user request.\nError: ${error}\nRejected statement: ${query}\nOriginal user request: ${userText}\nReturn only the corrected SQL query with no additional text.`;
};
