export const CATEGORIES = [
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

export type Category = (typeof CATEGORIES)[number];

export interface CreatePurchaseItemDto {
  productName: string;
  category: Category;
  color?: string;
  size?: string;
  extraOption?: string;
  unitPrice: number;
  quantity: number;
  backorderQuantity?: number;
}

export interface CreatePurchaseDto {
  vendorName: string;
  purchasedDate: string;
  receipt: string;
  items: CreatePurchaseItemDto[];
}
