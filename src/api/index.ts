import { Hono } from "hono";
const app = new Hono();
import { webhookHandler } from "./routes/webhook/webhookHandler"

// Temporary text-to-sql history data store
type textToSQLHistoryTypes = {
  role: 'user' | 'assistant';
  content: string;
};

let textToSQLHistory: textToSQLHistoryTypes[] = [];
export const getTextToSQLHistory = () => textToSQLHistory;
export const clearTextToSQLHistory = () => (textToSQLHistory = []);
export const pushToTextToSQLHistory = (userContent: string, assistantContent: string) => {
  textToSQLHistory.push({ role: "user", content: userContent });
  textToSQLHistory.push({ role: "assistant", content: assistantContent });

  if (textToSQLHistory.length > 30) {
    const excessItems = textToSQLHistory.length - 30;
    textToSQLHistory.splice(0, excessItems);
  }
};

// Temporary data-to-text history data store
type dataToTextHistoryTypes = {
  role: 'user' | 'assistant' | 'tool';
  content: string;
};

let dataToTextHistory: dataToTextHistoryTypes[] = [];
export const getDataToTextHistory = () => dataToTextHistory;
export const clearDataToTextHistory = () => (dataToTextHistory = []);
export const pushToDataToTextHistory = (userContent: string, assistantContent: string) => {
  dataToTextHistory.push({ role: "user", content: userContent });
  dataToTextHistory.push({ role: "assistant", content: assistantContent });

  if (dataToTextHistory.length > 30) {
    const excessItems = dataToTextHistory.length - 30;
    dataToTextHistory.splice(0, excessItems);
  }
};

app.post("/webhook", webhookHandler);

app.delete("/history", (c) => {
  clearTextToSQLHistory();
  clearDataToTextHistory();
  return c.json("Chat history has been cleared successfully.", 200);
});

app.get("/history", (c) => {
  return c.json(dataToTextHistory, 200);
});

export default app;
