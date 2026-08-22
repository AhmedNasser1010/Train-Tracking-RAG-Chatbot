import { Parser } from "node-sql-parser";

const parser = new Parser();

// Firewall that only allows read-only (SELECT) statements to reach the database.
// Accepts the raw SQL string, parses it into an AST and rejects anything
// that is not a pure SELECT (INSERT / UPDATE / DELETE / DDL / multiple statements).
export const sqlFirewall = (query: string) => {
	let ast;

	try {
		ast = parser.astify(query, { database: "postgresql" });
	} catch {
		return { valid: false, error: "Incorrect SQL statement.", ast: null };
	}

	const statements = Array.isArray(ast) ? ast : [ast];
	const isReadOnly = statements.every(
		(statement: any) =>
			typeof statement?.type === "string" &&
			statement.type.toLowerCase() === "select",
	);

	if (!isReadOnly) {
		return { valid: false, error: "Incorrect SQL statement.", ast: null };
	}

	return { valid: true, error: null, ast };
};

export default sqlFirewall;
