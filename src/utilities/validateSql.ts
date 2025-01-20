import { Parser } from 'node-sql-parser';
const parser = new Parser();

export const validateSql = (sql: string) => {
	// Trim whitespace
	const clearSql = sql.trim();

	// Basic checks for empty statements
	if (!clearSql || clearSql === 'invalid query') {
		return { valid: false, error: 'SQL statement is empty.' };
	}

	try {
		// Parse the SQL statement
		const ast: any = parser.astify(clearSql);
		console.log('ast', ast)

		// Make sure only read
		if (ast.type !== 'select') {
			return { valid: false, error: 'Incorrect SQL statement.' };
		}

		// If parsing is successful, the SQL is valid
		return { valid: true, error: null, ast };
	} catch (error: any) {
		// If parsing fails, return the error message
		return { valid: false, error: error.message };
	}
};
