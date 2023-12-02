import { FeatureModel } from '@/server/models/features';
import { FeatureUpdateModel } from '@/server/models/featureUpdates';
import { FeatureSchemaNoTimeType } from '@/server/schemas/featureSchema';
import { FeatureUpdateType } from '@/server/schemas/featureUpdateSchema';

import { getLastUsageDataVersion } from '../utils/getLastUsageDataVersion';

export async function updateUsageData(initial: boolean) {
  if (initial) {
    await FeatureModel.deleteMany({});
    await FeatureUpdateModel.deleteMany({});
  }

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

      await FeatureUpdateModel.create({
        key: lastFeatureData._id,
        title: lastFeatureData.title,
        updateType: lastDataUpdateType,
      });
      console.info(`Feature "${lastFeatureData._id}" updated with "${lastDataUpdateType}" type`);
    }
  }
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
