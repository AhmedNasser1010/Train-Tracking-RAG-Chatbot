import { detectSQLInjection } from "./detectSQLInjection";
import { sqlFirewall } from "./sqlFirewall";
import { executeSql } from "./executeSql";
import { sqlErrorFeedback } from "./sqlErrorFeedback";

export const sqlParser = async (c: any, query: string, userText: string) => {

  if (!query || query === "invalid query") {
    return { valid: false, error: "SQL statement is empty." };
  }

  const injectionsResult = detectSQLInjection(query)

  if (injectionsResult.isInjection) {
  	return { valid: false, ...injectionsResult }
  }

  // Only read-only SELECT statements are allowed to touch the database.
  const firewallResult = sqlFirewall(query);

  if (!firewallResult.valid) {
  	return { valid: false, error: firewallResult.error };
  }

  try {
  	await executeSql(c, query, true);
  	return { valid: true, error: null };
  } catch(error: any) {
  	return { valid: false, error: sqlErrorFeedback(error, query, userText) };
  }
};
