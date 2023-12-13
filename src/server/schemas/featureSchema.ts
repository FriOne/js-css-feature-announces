import { Schema, InferSchemaType } from 'mongoose';

export const FeatureSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    percentageY: { type: Number, required: true },
    percentageA: { type: Number, required: true },
  },
  { timestamps: true },
);

export type FeatureSchemaType = InferSchemaType<typeof FeatureSchema>;
export type FeatureSchemaNoTimeType = Omit<FeatureSchemaType, 'createdAt' | 'updatedAt'>;
