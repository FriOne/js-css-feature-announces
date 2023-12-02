import { Schema, InferSchemaType } from 'mongoose';

const FeatureUpdateEnum = ['twoPercent', 'threePercent'] as const;
export const FeatureUpdateSchema = new Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    updateType: { type: String, enum: FeatureUpdateEnum, required: true },
  },
  { timestamps: true },
);

export type FeatureUpdateSchemaType = InferSchemaType<typeof FeatureUpdateSchema>;
export type FeatureUpdateSchemaNoTimeType = Omit<
  FeatureUpdateSchemaType,
  'createdAt' | 'updatedAt'
>;
export type FeatureUpdateType = FeatureUpdateSchemaType['updateType'];
