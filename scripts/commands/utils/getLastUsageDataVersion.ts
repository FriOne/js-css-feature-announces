import type { FeatureSchemaNoTimeType } from '@/server/schemas/featureSchema';

const DATA_URL = 'https://raw.githubusercontent.com/Fyrd/caniuse/main/fulldata-json/data-2.0.json';

type FeatureInfo = {
  title: string;
  usage_perc_y: number;
  usage_perc_a: number;
};

type ResponsePart = {
  data: Record<string, FeatureInfo>;
};

export async function* getLastUsageDataVersion() {
  const response = await fetch(DATA_URL, { cache: 'no-cache' });
  const dataJson = (await response.json()) as ResponsePart;

  for (const key in dataJson.data) {
    const featureData = dataJson.data[key];

    yield {
      _id: key,
      title: featureData.title,
      percentageY: featureData.usage_perc_y,
      percentageA: featureData.usage_perc_a,
    } satisfies FeatureSchemaNoTimeType;
  }
}
