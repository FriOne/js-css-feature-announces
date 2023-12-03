import { formatUpdatesMarkdownMessage } from './formatUpdatesMarkdownMessage';
import { sendTelegramMessageToTreePercentChat } from './sendTelegramMessageToTreePercentChat';
import {
  FeatureUpdateType,
  FeatureUpdateSchemaNoTimeType,
} from '@/server/schemas/featureUpdateSchema';

type Params = {
  sendToTelegram: boolean;
};

export type FeatureUpdatesByType = Record<FeatureUpdateType, FeatureUpdateSchemaNoTimeType[]>;

const MAX_CHUNK_SIZE = 10;
const MAX_UPDATES_COUNT = 100;

export async function sendNotifications(
  featureUpdatesByType: FeatureUpdatesByType,
  { sendToTelegram }: Params,
) {
  if (!sendToTelegram || featureUpdatesByType.threePercent.length === 0) {
    return;
  }

  const cutUpdates = featureUpdatesByType.threePercent.slice(0, MAX_UPDATES_COUNT);
  for (let i = 0; i < cutUpdates.length; i += MAX_CHUNK_SIZE) {
    const chunk = featureUpdatesByType.threePercent.slice(i, i + MAX_CHUNK_SIZE);
    const message = formatUpdatesMarkdownMessage(chunk);
    await sendTelegramMessageToTreePercentChat(message);
  }
}
