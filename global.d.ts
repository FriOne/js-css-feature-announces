declare global {
  namespace NodeJs {
    interface ProcessEnv {
      MONGODB_URI?: string;
      BOT_API_TOKEN?: string;
      TELEGRAM_CHAT_ID?: string;
    }
  }
}
