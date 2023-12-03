import { FeatureModel } from '@/server/models/features';
import { FeatureUpdateModel } from '@/server/models/featureUpdates';

import { getLastUsageDataVersion } from '../utils/getLastUsageDataVersion';
import { getNewFeatureUpdateType } from '../utils/getNewFeatureUpdateType';
import { FeatureUpdatesByType, sendNotifications } from '../utils/sendNotifications';
import { isFeatureChanged } from '../utils/isFeatureChanged';

type Params = {
  initial: boolean;
  sendToTelegram: boolean;
};

export async function updateUsageData({ initial, sendToTelegram }: Params) {
  if (initial) {
    await FeatureModel.deleteMany({});
    await FeatureUpdateModel.deleteMany({});
  }

  const nextFeatureUpdates: FeatureUpdatesByType = {
    twoPercent: [],
    threePercent: [],
  };

  for await (const lastFeatureData of getLastUsageDataVersion()) {
    const dbFeatureData = await FeatureModel.findById(lastFeatureData._id).exec();

    if (!dbFeatureData) {
      await FeatureModel.create(lastFeatureData);
      console.info(`New feature "${lastFeatureData._id}" was added`);
    } else if (isFeatureChanged(lastFeatureData, dbFeatureData)) {
      await FeatureModel.updateOne(lastFeatureData);
      console.info(`Feature "${lastFeatureData._id}" was updated`);
    }

    const lastDataUpdateTypes = getNewFeatureUpdateType(lastFeatureData);
    const dbDataUpdateType = dbFeatureData ? getNewFeatureUpdateType(dbFeatureData) : [];

    for (const lastDataUpdateType of lastDataUpdateTypes) {
      // We don't need to duplicate feature updates.
      if (dbDataUpdateType.includes(lastDataUpdateType)) {
        continue;
      }

      const featureUpdate = {
        key: lastFeatureData._id,
        title: lastFeatureData.title,
        updateType: lastDataUpdateType,
      };

      nextFeatureUpdates[lastDataUpdateType].push(featureUpdate);

      await FeatureUpdateModel.create(featureUpdate);
      console.info(`Feature "${lastFeatureData._id}" updated with "${lastDataUpdateType}" type`);
    }
  }

  await sendNotifications(nextFeatureUpdates, { sendToTelegram });
}
