import { FeatureUpdateSchemaNoTimeType } from '@/server/schemas/featureUpdateSchema';

import { getFeatureLinkByKey } from './getFeatureLinkByKey';

export function formatUpdatesMarkdownMessage(featureUpdates: FeatureUpdateSchemaNoTimeType[]) {
  return featureUpdates
    .map(
      (featureUpdate) =>
        `[${featureUpdate.title.replace(']', '')}](${getFeatureLinkByKey(featureUpdate.key)})`,
    )
    .join(`\n`);
}
