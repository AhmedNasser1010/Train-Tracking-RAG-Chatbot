import { sqlErrorFeedback } from './sqlErrorFeedback';
import { Parser } from 'node-sql-parser';
const parser = new Parser();

export const sqlParser = (sql: string, userText: string) => {
	const clearSql = sql.trim();

	if (!clearSql || clearSql === 'invalid query') {
		return { valid: false, error: 'SQL statement is empty.', ast: null };
	}

	try {
		const ast = parser.astify(clearSql);

		return { valid: true, error: null, ast };
	} catch (error: any) {
		sqlErrorFeedback(error.message, sql, userText);
		return { valid: false, error: error.message, ast: null };
	}
};
