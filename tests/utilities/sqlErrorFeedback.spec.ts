import { sqlErrorFeedback } from '../../src/utilities/sql/sqlErrorFeedback';

describe('sqlErrorFeedback', () => {
	it('Should returns llm prompt describe the error', () => {
		const error =
			'Expected "#", ",", "--", "/*", ";", "COLLATE", "FOR", "GO", "GROUP", "HAVING", "INTERSECT", "INTO", "LIMIT", "LOCK", "MINUS", "ORDER", "UNION", "WHERE", "WINDOW", [ \\t\\n\\r], or end of input but "F" found.';
		const sql = 'SELECT * FROMM users';
		const userText = 'Give me all users';
		const result = sqlErrorFeedback(error, sql, userText);
		expect(result).toContain(`Error: ${error}`);
		expect(result).toContain(`Rejected statement: ${sql}`);
		expect(result).toContain(`Original user request: ${userText}`);
	});
});
