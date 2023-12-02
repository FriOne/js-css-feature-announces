import 'tsconfig-paths/register';
import { config } from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

config({ path: `${__dirname}/../.env.local` });

yargs(hideBin(process.argv))
  .command(require('./commands/updateUsageData').command)
  .demandCommand()
  .strict()
  .parse();
