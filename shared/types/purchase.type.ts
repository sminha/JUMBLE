import { Category } from '../constants/category';

export interface PurchaseRecord {
  purchaseId: string;
  productId: string;
  purchaseNo: string;
  productNo: string;
  purchasedAt: string;
  vendor: string;
  product: string;
  category: Category;
  color: string | null;
  size: string | null;
  option: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  backorderQuantity: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPurchaseRecordsResponse {
  success: boolean;
  status: number;
  message: string;
  records: PurchaseRecord[];
  pagination: PaginationMeta;
}
