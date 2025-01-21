import postgres from 'postgres'

export const executeSql = async (c: any, query: string) => {
	const sql = postgres(`postgresql://${c.env.SUPABASE_USER}:${c.env.SUPABASE_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`);
	const result = await sql.unsafe(query);

	return result;
};
