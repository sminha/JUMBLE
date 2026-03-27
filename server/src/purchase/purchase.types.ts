import { Category } from "@prisma/client";

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
