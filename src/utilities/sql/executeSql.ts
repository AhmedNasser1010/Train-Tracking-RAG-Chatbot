import postgres from 'postgres'

export const executeSql = async (c: any, query: string, explain: boolean = false) => {
	// Supavisor requires the tenant identifier in the username: "postgres.<project-ref>"
	const username = `${c.env.SUPABASE_USER ?? ''}`.trim();
	const password = `${c.env.SUPABASE_DB_PASSWORD ?? ''}`.trim();

	if (!username || !password) {
		throw new Error('Missing SUPABASE_USER or SUPABASE_DB_PASSWORD secret.');
	}

	if (/[/@]|^[a-z][a-z0-9+.-]*:\/\//i.test(username)) {
		throw new Error(
			'SUPABASE_USER must be only "postgres.<project-ref>" (e.g. "postgres.abcdefghijklmnop"), not a full connection string.',
		);
	}

	if (/:\/\//.test(password)) {
		throw new Error(
			'SUPABASE_DB_PASSWORD must contain only the database password — it looks like a connection string was pasted.',
		);
	}

	// Options-object form avoids URL parsing pitfalls with special characters.
	const sql = postgres({
		host: 'aws-0-eu-central-1.pooler.supabase.com',
		port: 6543,
		database: 'postgres',
		username,
		password,
		// The transaction pooler on port 6543 does not support prepared statements.
		prepare: false,
		max: 1,
		// Set SUPABASE_SSL=false in .dev.vars when developing behind a network that
		// intercepts TLS with a self-signed certificate (workerd cannot skip verification).
		ssl: `${c.env.SUPABASE_SSL ?? 'true'}`.toLowerCase() === 'false' ? false : 'require',
	});
	try {
		const rawSql = explain ? `EXPLAIN ${query}` : query
		const result = await sql.unsafe(rawSql);

		return result;
	} finally {
		await sql.end({ timeout: 5 });
	}
};
