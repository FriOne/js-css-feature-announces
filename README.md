# I CAN USE
Service provides updates about features that passes a condition (for now it is 3 percent global availability).
This repo contains two parts: script to update data and get feature that pass a condition, and also NextJS app to show these updates.

## Getting Started

Before you start, create `.env.local` from `.env.example`

The project uses MongoDB, I have plans to add dev docker images, but now you need to install it locally.
So, you need to set `MONGODB_URI` variable inside `.env.local`.

First part is a [Next.js](https://nextjs.org/) project, to start development run:

```bash
npm run dev
```

The second one is a console app that is made with [yargs](https://www.npmjs.com/package/yargs).
```bash
npx ts-node scripts updateUsageData --help
```
To send telegram notifications set `BOT_API_TOKEN` and `TELEGRAM_CHAT_ID` variables:
