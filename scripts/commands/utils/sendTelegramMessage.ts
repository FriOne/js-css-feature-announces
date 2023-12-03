import { URLSearchParams } from 'url';

type Params = {
  token: string;
  chatId: string;
};

export async function sendTelegramMessage(message: string, { chatId, token }: Params) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = new URLSearchParams({ chat_id: chatId, text: message, parse_mode: 'markdown' });
  const response = await fetch(url, { method: 'POST', body });

  if (!response.ok || response.status !== 200) {
    throw new Error(`Can't send telegram message "${response.statusText}"`);
  }
}
