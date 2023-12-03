import { FeatureSchemaNoTimeType } from '@/server/schemas/featureSchema';
import { FeatureUpdateType } from '@/server/schemas/featureUpdateSchema';

export function getNewFeatureUpdateType(lastFeatureData: FeatureSchemaNoTimeType) {
  const types: FeatureUpdateType[] = [];

  if (lastFeatureData.percentageY >= 98) {
    types.push('twoPercent');
  }

  if (lastFeatureData.percentageY >= 97) {
    types.push('threePercent');
  }

  return types;
}
