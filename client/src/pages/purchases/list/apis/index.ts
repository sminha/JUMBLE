import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import {
  Draft,
  Purchase,
  Product,
  PurchaseDetail,
  ProductDetail,
  GetPurchaseDetailResponse,
  GetProductDetailResponse,
  UpdatePurchaseResponse,
  UpdateProductResponse,
  UpdateBackorder,
  UpdateBackorderResponse,
} from '@jumble/shared';
import { QUERY_KEYS } from '@/constants/query-key';

export const getPurchases = async (draft: Draft) => {
  const searchParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(draft)
        .filter(([_, v]) => v !== '' && v !== false)
        .map(([k, v]) => [k, String(v)]),
    ),
  );

  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/items?${searchParams}`,
    {
      method: 'GET',
    },
  );

  if (!res.ok) {
    throw new Error('사입내역 조회 요청 실패');
  }

  const result = await res.json();

  return result;
};

// 사입내역 조회 API
export const useGetPurchases = (draft: Draft) => {
  return useQuery({
    queryFn: () => getPurchases(draft),
    queryKey: QUERY_KEYS.PURCHASES.FILTERED_LIST(draft),
    enabled: !!draft,
    placeholderData: keepPreviousData,
  });
};

const getPurchase = async (purchaseId: string): Promise<PurchaseDetail> => {
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/${purchaseId}`,
    {
      method: 'GET',
    },
  );

  if (!res.ok) {
    throw new Error('사입내역 상세조회 요청 실패');
  }

  const data: GetPurchaseDetailResponse = await res.json();

  return data.data;
};

// 사입내역 상세조회 API
export const useGetPurchase = (purchaseId: string, open: boolean) => {
  return useQuery({
    queryFn: () => getPurchase(purchaseId!),
    queryKey: QUERY_KEYS.PURCHASES.DETAIL(purchaseId!),
    enabled: open && !!Number(purchaseId),
  });
};

const getProduct = async (productId: string): Promise<ProductDetail> => {
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/products/${productId}`,
    {
      method: 'GET',
    },
  );

  if (!res.ok) {
    throw new Error('상품사입내역 상세조회 요청 실패');
  }

  const data: GetProductDetailResponse = await res.json();

  return data.data;
};

// 상품사입내역 상세조회 API
export const useGetProduct = (purchaseId: string, productId: string, open: boolean) => {
  return useQuery({
    queryFn: () => getProduct(productId),
    queryKey: QUERY_KEYS.PURCHASES.PRODUCT_DETAIL(purchaseId, productId),
    enabled: open && !!Number(purchaseId) && !!Number(productId),
  });
};

const updatePurchase = async (purchaseId: string, form: Purchase) => {
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/${purchaseId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    },
  );

  if (!res.ok) {
    throw new Error('사입내역 수정 요청 실패');
  }

  const data: UpdatePurchaseResponse = await res.json();

  return data;
};

// 사입내역 수정 API
export const useUpdatePurchase = (purchaseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: Purchase) => updatePurchase(purchaseId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.DETAIL(purchaseId) });
    },
  });
};

const updateProduct = async (productId: string, form: Product) => {
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/products/${productId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    },
  );

  if (!res.ok) {
    throw new Error('상품사입내역 수정 요청 실패');
  }

  const data: UpdateProductResponse = await res.json();

  return data;
};

// 상품사입내역 수정 API
export const useUpdateProduct = (purchaseId: string, productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: Product) => updateProduct(productId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.DETAIL(purchaseId) });
    },
  });
};

const updateBackorder = async (productId: string, form: UpdateBackorder) => {
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/products/${productId}/backorder`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    },
  );

  if (!res.ok) {
    throw new Error('미송수량 수정 요청 실패');
  }

  const data: UpdateBackorderResponse = await res.json();

  return data;
};

// 미송수량 수정 API
export const useUpdateBackorder = (purchaseId: string, productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: UpdateBackorder) => updateBackorder(productId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.DETAIL(purchaseId) });
    },
  });
};

const deletePurchase = async (purchaseId: string) => {
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/${purchaseId}`,
    {
      method: 'DELETE',
    },
  );

  if (!res.ok) {
    throw new Error('사입내역 삭제 요청 실패');
  }

  const data = await res.json();

  return data;
};

// 사입내역 삭제 API
export const useDeletePurchase = (purchaseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePurchase(purchaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.DETAIL(purchaseId) });
    },
  });
};

const deleteProduct = async (productId: string) => {
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/v1/purchases/products/${productId}`,
    {
      method: 'DELETE',
    },
  );

  if (!res.ok) {
    throw new Error('상품사입내역 삭제 요청 실패');
  }

  const data = await res.json();

  return data;
};

// 상품사입내역 삭제 API
export const useDeleteProduct = (purchaseId: string, productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.DETAIL(purchaseId) });
    },
  });
};
