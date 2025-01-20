import { Hono } from "hono";
const app = new Hono();
import { webhookHandler } from "./routes/webhook/webhookHandler"


// Public Hook
// https://api.telegram.org/bot7817484472:AAHsg-cQC8U5WwHP0o4h4jefHI_t2wEDGlE/setWebHook?url=https://picked-themselves-alternative-milan.trycloudflare.com/webhook

// cloudflared tunnel --url http://localhost:8787
// npm run dev

// Temporary history data store
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

let history: Message[] = [];
export const getHistory = () => history;
export const clearHistory = () => history = [];
export const pushHistory = (userContent: string, assistantContent: string) => {
  history.push({ role: "user", content: userContent });
  history.push({ role: "assistant", content: assistantContent });

  if (history.length > 20) {
    const excessItems = history.length - 20;
    history.splice(0, excessItems);
  }
}

app.post("/webhook", webhookHandler);

app.delete("/history", (c) => {
  clearHistory()
  return c.json("Chat history has been cleared successfully.", 200);
});

app.get("/history", (c) => {
  return c.json(history, 200);
});

export default app;
