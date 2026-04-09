export const CATEGORY_VALUES = [
  'TOP',
  'OUTER',
  'BOTTOM',
  'SET',
  'BAG',
  'SHOES',
  'JEWELRY',
  'ACCESSORY',
  'ETC',
] as const;

export const CATEGORY = Object.fromEntries(CATEGORY_VALUES.map((v) => [v, v])) as Record<
  Category,
  Category
>;

export type Category = (typeof CATEGORY_VALUES)[number];
