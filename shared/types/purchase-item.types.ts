export const DATE_TYPES = ["purchased", "created"] as const;
export type DateType = (typeof DATE_TYPES)[number];

export const SORT_ORDERS = ["asc", "desc"] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export const SORT_BY = [
  "purchasedAt",
  "unitPrice",
  "quantity",
  "totalAmount",
  "backorderQuantity",
] as const;
export type PurchaseItemSortBy = (typeof SORT_BY)[number];

export interface GetPurchaseItemsQuery {
  page: number;
  limit: number;
  dateType: DateType;
  startDate?: string;
  endDate?: string;
  vendorName?: string;
  backorderOnly: boolean;
  sortBy: PurchaseItemSortBy;
  sortOrder: SortOrder;
}
