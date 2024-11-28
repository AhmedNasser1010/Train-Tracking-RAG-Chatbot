import { get } from 'node-fetch';

// Public Hook
// https://api.telegram.org/bot7817484472:AAHsg-cQC8U5WwHP0o4h4jefHI_t2wEDGlE/setWebHook?url=https://telegram-tracker-bot.ahmedn-coder.workers.dev/webhook

interface Env {
  TELEGRAM_API: string
  BOT_ID: string
  CHAT_ID: string
}

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log(req.body)

		// utilites
		async function sendMessage(chat_id: string, text: string) {
		  const url = `https://api.telegram.org/bot${env.TELEGRAM_API}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}`;
		  await fetch(url, { method: 'GET' });
		}

		const url = new URL(req.url);

		if (url.pathname === `/webhook`) {
      const update = await req.json();

      // Parse the incoming Telegram message
      if (update.message) {
        // const text = update.message.text;
        const chat_id = update.message.chat.id;
        const text = JSON.stringify(update, null, 2)

        await sendMessage(chat_id, text);
      }

      return new Response('OK');
    }

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
