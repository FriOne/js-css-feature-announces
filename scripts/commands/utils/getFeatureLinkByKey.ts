export function getFeatureLinkByKey(key: string) {
  return `https://caniuse.com/${key}` as const;
}
