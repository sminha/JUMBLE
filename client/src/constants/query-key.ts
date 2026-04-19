import { Draft } from '@jumble/shared';

export const QUERY_KEYS = {
  PURCHASES: {
    ALL: ['purchases'] as const,
    LIST: () => [...QUERY_KEYS.PURCHASES.ALL, 'list'] as const,
    FILTERED_LIST: (draft: Draft) => [...QUERY_KEYS.PURCHASES.ALL, 'list', draft] as const,
    DETAIL: (purchaseId: string) => [...QUERY_KEYS.PURCHASES.ALL, 'detail', purchaseId] as const,
    PRODUCT_DETAIL: (purchaseId: string, productId: string) =>
      [...QUERY_KEYS.PURCHASES.ALL, 'detail', purchaseId, 'items', productId] as const,
  },
} as const;
