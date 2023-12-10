import { z } from 'zod';
import { procedure, router } from './trpc';
import { FeatureUpdateModel } from '@/server/models/featureUpdates';
import { TRPCError } from '@trpc/server';
import { FeatureUpdateSchemaType } from '@/server/schemas/featureUpdateSchema';

const DEFAULT_LIMIT = 10;

export const appRouter = router({
  updates: procedure
    .input(
      z.object({
        limit: z.number().max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const { cursor: inputCursor, limit } = input;

      if (inputCursor) {
        const update = await FeatureUpdateModel.findById(inputCursor).exec();
        if (!update) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Cursor doesn't exists`,
          });
        }
      }

      const cursor = FeatureUpdateModel.find({ updateType: 'threePercent' })
        .sort('updatedAt')
        .cursor();
      let nextCursor = null;
      let foundNext = false;

      const responseUpdates: FeatureUpdateSchemaType[] = [];
      for await (const update of cursor) {
        if (responseUpdates.length >= (limit ?? DEFAULT_LIMIT)) {
          nextCursor = update._id.toString();
          break;
        }

        if (!foundNext && inputCursor && update._id.toString() !== inputCursor) {
          continue;
        }

        foundNext = true;
        responseUpdates.push(update.toObject());
      }

      return {
        items: responseUpdates,
        nextCursor,
      };
    }),
});

export type AppRouter = typeof appRouter;
