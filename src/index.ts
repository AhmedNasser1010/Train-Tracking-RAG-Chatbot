// import { get } from 'node-fetch';
import sendMessage from "./handlers/sendMessage";
import generateTrainRecord from "./utilite/getTrainRecordUtilities/main";
import { TelegramUpdate } from "./types/TelegramUpdate"

// Public Hook
// https://api.telegram.org/bot7817484472:AAHsg-cQC8U5WwHP0o4h4jefHI_t2wEDGlE/setWebHook?url=https://telegram-tracker-bot.ahmedn-coder.workers.dev/webhook

// cloudflared tunnel --url http://localhost:8787
// npm run dev

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    const url = new URL(req.url);

    if (url.pathname === `/webhook`) {
      const update: TelegramUpdate = await req.json();

      if (update.message) {
        // const text = JSON.stringify(update, null, 2);
        const chat_id = update.message.chat.id;
        const text = update.message.text;

        generateTrainRecord(update)
        await sendMessage(env, chat_id, text);
      }

      return new Response('OK');
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
