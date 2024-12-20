export default async function sendMessage(env: Env, chat_id: number, text: string) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_API}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}`;
  await fetch(url, { method: 'GET' });
}