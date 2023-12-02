import { FeatureModel } from '@/server/models/features';
import { FeatureUpdateModel } from '@/server/models/featureUpdates';
import { FeatureSchemaNoTimeType } from '@/server/schemas/featureSchema';
import {
  FeatureUpdateType,
  FeatureUpdateSchemaNoTimeType,
} from '@/server/schemas/featureUpdateSchema';

import { getLastUsageDataVersion } from '../utils/getLastUsageDataVersion';
import { sendMessageToTelegram } from '../utils/sendMessageToTelegram';

type NotificationUpdate = FeatureUpdateSchemaNoTimeType;

type Params = {
  initial: boolean;
  sendToTelegram: boolean;
};

export async function updateUsageData({ initial, sendToTelegram }: Params) {
  if (initial) {
    await FeatureModel.deleteMany({});
    await FeatureUpdateModel.deleteMany({});
  }

  const notificationUpdates: Record<FeatureUpdateType, NotificationUpdate[]> = {
    twoPercent: [],
    threePercent: [],
  };

  for await (const lastFeatureData of getLastUsageDataVersion()) {
    const dbFeatureData = await FeatureModel.findById(lastFeatureData._id).exec();

    if (!dbFeatureData) {
      await FeatureModel.create(lastFeatureData);
      console.info(`New feature "${lastFeatureData._id}" was added`);
    } else if (
      lastFeatureData.percentageY > dbFeatureData.percentageY ||
      lastFeatureData.percentageA > dbFeatureData.percentageA
    ) {
      await FeatureModel.updateOne(lastFeatureData);
      console.info(`Feature "${lastFeatureData._id}" was updated`);
    }

    if (lastFeatureData.percentageY <= 97) {
      continue;
    }

    const lastDataUpdateTypes = getNewFeatureUpdateType(lastFeatureData);
    const dbDataUpdateType = dbFeatureData ? getNewFeatureUpdateType(dbFeatureData) : [];

    for (const lastDataUpdateType of lastDataUpdateTypes) {
      // We don't need to duplicate feature updates.
      if (dbDataUpdateType.includes(lastDataUpdateType)) {
        continue;
      }

      const featureUpdate: FeatureUpdateSchemaNoTimeType = {
        key: lastFeatureData._id,
        title: lastFeatureData.title,
        updateType: lastDataUpdateType,
      };

      if (sendToTelegram) {
        notificationUpdates[lastDataUpdateType].push(featureUpdate);
      }

      await FeatureUpdateModel.create(featureUpdate);
      console.info(`Feature "${lastFeatureData._id}" updated with "${lastDataUpdateType}" type`);
    }
  }

  if (sendToTelegram && notificationUpdates.threePercent.length > 0) {
    const cutUpdates = notificationUpdates.threePercent.slice(0, 100);
    const chunkSize = 10;
    for (let i = 0; i < cutUpdates.length; i += chunkSize) {
      const chunk = notificationUpdates.threePercent.slice(i, i + chunkSize);
      const message = formatTelegramMessage(chunk);
      await sendMessageToTelegram(message);
    }
  }
}

function formatTelegramMessage(featureUpdates: NotificationUpdate[]) {
  return featureUpdates
    .map((featureUpdate) => `[${featureUpdate.title}](https://caniuse.com/${featureUpdate.key})`)
    .join(`\n`);
}

function getNewFeatureUpdateType(lastFeatureData: FeatureSchemaNoTimeType) {
  const types: FeatureUpdateType[] = [];

  if (lastFeatureData.percentageY >= 98) {
    types.push('twoPercent');
  }

  if (lastFeatureData.percentageY >= 97) {
    types.push('threePercent');
  }

  return types;
}
