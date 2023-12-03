import { FeatureSchemaNoTimeType } from '@/server/schemas/featureSchema';

export function isFeatureChanged(
  lastFeatureData: FeatureSchemaNoTimeType,
  dbFeatureData: FeatureSchemaNoTimeType,
) {
  return (
    lastFeatureData.percentageY > dbFeatureData.percentageY ||
    lastFeatureData.percentageA > dbFeatureData.percentageA
  );
}
