import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

import { FeatureUpdateSchema, FeatureUpdateSchemaType } from '../schemas/featureUpdateSchema';

export type FeatureUpdateModelType = Model<FeatureUpdateSchemaType>;

export const FeatureUpdateModel = mongoose.model<FeatureUpdateSchemaType, FeatureUpdateModelType>(
  'FeatureUpdate',
  FeatureUpdateSchema,
);
