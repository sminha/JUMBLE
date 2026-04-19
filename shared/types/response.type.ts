import { Category } from '../constants/category';

// TODO: 사입내역 추가 API 응답 추가

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
  receipt: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 사입내역 조회 API 응답
export interface GetPurchaseResponse {
  success: boolean;
  status: number;
  message: string;
  records: PurchaseRecord[];
  pagination: PaginationMeta;
}

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
export interface EditProductResponse {
  success: boolean;
  status: number;
  message: string;
}

// 미송수량 수정 API 응답
export interface EditBackorderResponse {
  success: boolean;
  status: number;
  message: string;
}
