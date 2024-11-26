import { get } from 'node-fetch';

interface Env {
  TELEGRAM_API: string
  BOT_ID: string
  CHAT_ID: string
}

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// utilites
		async function sendMessage(chat_id: string, text: string) {
		  const url = `${env.TELEGRAM_API}sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}`;
		  await fetch(url, { method: 'GET' });
		}

		const url = new URL(req.url);

		if (url.pathname === `/webhook`) {
      const update = await req.json();

      // Parse the incoming Telegram message
      if (update.message) {
        const text = update.message.text;
        const chat_id = update.message.chat.id;

        // Respond to the message (e.g., echo the message)
        await sendMessage(chat_id, `You said: ${text}`);
      }

      return new Response('OK');
    }

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
