import { Category } from '../constants/category';

export interface PurchaseDetailProduct {
  productId: string;
  productNo: string;
  name: string;
  category: Category;
  color: string | null;
  size: string | null;
  option: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  backorderQuantity: number;
}

export interface PurchaseDetail {
  purchaseId: string;
  purchaseNo: string;
  purchasedAt: string;
  vendor: string;
  receipt: string | null;
  products: PurchaseDetailProduct[];
}

export interface ProductDetail {
  purchaseId: string;
  purchaseNo: string;
  purchasedAt: string;
  vendor: string;
  productId: string;
  productNo: string;
  name: string;
  category: Category;
  color: string | null;
  size: string | null;
  option: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  backorderQuantity: number;
}

// 사입내역 상세조회 API 응답
export interface GetPurchaseDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: PurchaseDetail;
}

// 상품사입내역 상세조회 API 응답
export interface GetProductDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: ProductDetail;
}

// 사입내역 수정 API 응답
export interface EditPurchaseResponse {
  success: boolean;
  status: number;
  message: string;
}

// 상품사입내역 수정 API 응답
export interface EditPurchaseItemResponse {
  success: boolean;
  status: number;
  message: string;
}
