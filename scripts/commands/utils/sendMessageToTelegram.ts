import { URLSearchParams } from 'url';

export async function sendMessageToTelegram(message: string) {
  const token = process.env.BOT_API_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token) {
    throw new Error(`Telegram bot api token is not set`);
  }
  if (!chatId) {
    throw new Error(`Telegram chat id is not set`);
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = new URLSearchParams({ chat_id: chatId, text: message, parse_mode: 'markdown' });
  const response = await fetch(url, { method: 'POST', body });

  if (!response.ok || response.status !== 200) {
    throw new Error(`Can't send telegram message "${response.statusText}"`);
  }
}
