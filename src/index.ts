import { Hono } from 'hono'
import promptJson from './prompts.json'
import sendMessage from './handlers/telegram/sendMessage'
import { type TelegramUpdate } from './types/TelegramUpdate'
const app = new Hono()

// Public Hook
// https://api.telegram.org/bot7817484472:AAHsg-cQC8U5WwHP0o4h4jefHI_t2wEDGlE/setWebHook?url=https://survivor-speaker-tribal-testament.trycloudflare.com/webhook

// cloudflared tunnel --url http://localhost:8787
// npm run dev

let history = [];

app.post('/webhook', async (c) => {
	const update: TelegramUpdate = await c.req.json()
	const chat_id = update.message.chat.id
	const text = update.message.text

	const answer = await c.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
		messages: [
			{ role: 'system', content: promptJson.systemPrompt },
			...promptJson.fewShotPrompts,
			...history,
			{ role: 'user', content: text }
		],
		// temperature: 0, // default 0.6 min 0 max 5
		// top_k: 1 // min 1 max 50
	});

	await sendMessage(c.env, chat_id, answer.response);
	history.push({ role: 'user', content: text });
	history.push({ role: 'assistant', content: answer.response });

	return c.json("Done", 200);
})

export default app