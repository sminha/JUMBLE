import { ValueLabel } from '../types/draft';

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

export const CATEGORY_LABEL: ValueLabel<Category>[] = [
  { value: CATEGORY.TOP, label: '상의' },
  { value: CATEGORY.OUTER, label: '아우터' },
  { value: CATEGORY.BOTTOM, label: '하의' },
  { value: CATEGORY.SET, label: '세트' },
  { value: CATEGORY.BAG, label: '가방' },
  { value: CATEGORY.SHOES, label: '신발' },
  { value: CATEGORY.JEWELRY, label: '주얼리' },
  { value: CATEGORY.ACCESSORY, label: '악세서리' },
  { value: CATEGORY.ETC, label: '기타' },
];

export type Category = (typeof CATEGORY_VALUES)[number];
