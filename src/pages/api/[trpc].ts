import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '@/server/router';

import '@/server/utils/mongodbConnect';

export default trpcNext.createNextApiHandler({
  router: appRouter,
});
