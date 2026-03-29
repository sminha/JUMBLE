export const CATEGORY = {
  TOP: 'TOP',
  OUTER: 'OUTER',
  BOTTOM: 'BOTTOM',
  SET: 'SET',
  BAG: 'BAG',
  SHOES: 'SHOES',
  JEWELRY: 'JEWELRY',
  ACCESSORY: 'ACCESSORY',
  ETC: 'ETC',
} as const;

export type Category = keyof typeof CATEGORY;
