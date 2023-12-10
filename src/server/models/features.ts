import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

import { FeatureSchema, FeatureSchemaType } from '../schemas/featureSchema';

export type FeatureModelType = Model<FeatureSchemaType>;

export const FeatureModel =
  mongoose.models.Feature ||
  mongoose.model<FeatureSchemaType, FeatureModelType>('Feature', FeatureSchema);
