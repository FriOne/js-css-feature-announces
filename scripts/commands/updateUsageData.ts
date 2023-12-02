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
  return yargs.option('initial', {
    type: 'boolean',
    description:
      'Treat all data as new, those features that pass check will be added as new update',
    default: false,
  });
}

async function handler(argv: Record<string, unknown>) {
  try {
    await updateUsageData(!!argv.initial);
  } catch (error) {
    console.error('Error while updating usage data', error);
  }

  const connection = await dbPromise;
  await connection.disconnect();
}
