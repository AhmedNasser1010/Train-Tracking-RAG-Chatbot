import { detectSQLInjection } from "./detectSQLInjection";
import { executeSql } from "./executeSql";
import { sqlErrorFeedback } from "./sqlErrorFeedback";

export const sqlParser = async (c, query, userText) => {

  if (!query || query === "invalid query") {
    return { valid: false, error: "SQL statement is empty." };
  }

  const injectionsResult = detectSQLInjection(query)

  if (injectionsResult.isInjection) {
  	return { valid: false, ...injectionsResult }
  }

  try {
  	const explainResult = await executeSql(c, query, true);
  	return { valid: true, error: null };
  } catch(error: any) {
  	return { valid: false, error: sqlErrorFeedback(error, query, userText) };
  }
};
