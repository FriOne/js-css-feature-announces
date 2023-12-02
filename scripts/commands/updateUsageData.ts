import { Argv } from 'yargs';

import { dbPromise } from '@/server/utils/mongodbConnect';

import { updateUsageData } from './handlers/updateUsageData';

export const command = {
  command: 'updateUsageData',
  desc: 'Updates features usage statistic and adds row for features that are available now',
  builder,
  handler,
};

function builder(yargs: Argv) {
  return yargs
    .option('initial', {
      type: 'boolean',
      description: 'Removes all feature data from db and add everything from scratch',
      default: false,
    })
    .option('telegram', {
      type: 'boolean',
      description: 'Send new updates to telegram chat',
      default: false,
    });
}

async function handler(argv: Record<string, unknown>) {
  try {
    await updateUsageData({
      initial: !!argv.initial,
      sendToTelegram: !!argv.telegram,
    });
  } catch (error) {
    console.error('Error while updating usage data', error);
  }

  const connection = await dbPromise;
  await connection.disconnect();
}
