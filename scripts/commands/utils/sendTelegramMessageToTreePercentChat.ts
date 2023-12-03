import { sendTelegramMessage } from './sendTelegramMessage';

export async function sendTelegramMessageToTreePercentChat(message: string) {
  const token = process.env.BOT_API_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token) {
    throw new Error(`Telegram bot api token is not set`);
  }
  if (!chatId) {
    throw new Error(`Telegram chat id is not set`);
  }

  await sendTelegramMessage(message, { chatId, token });
}
