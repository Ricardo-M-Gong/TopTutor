export const REGION_OPTIONS = [
  "西湖区",
  "滨江区",
  "余杭区",
  "上城区",
  "萧山区",
  "拱墅区",
  "临平区",
  "钱塘区",
] as const;

export type RegionName = (typeof REGION_OPTIONS)[number];

export function mapRegions(records: { regionName: string }[]): string[] {
  return records.map((r) => r.regionName);
}

export function isValidRegion(name: string): name is RegionName {
  return (REGION_OPTIONS as readonly string[]).includes(name);
}

export function validateRegions(regions: unknown): regions is string[] {
  return (
    Array.isArray(regions) &&
    regions.length > 0 &&
    regions.every((r) => typeof r === "string" && isValidRegion(r.trim()))
  );
}
