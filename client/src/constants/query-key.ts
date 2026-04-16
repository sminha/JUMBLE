import { Draft } from '@/pages/purchases/list/constants/draft';

export const QUERY_KEYS = {
  PURCHASES: {
    ALL: ['purchases'] as const,
    LIST: (draft: Draft) => [...QUERY_KEYS.PURCHASES.ALL, draft] as const,
    DETAIL: (purchaseId: string) => [...QUERY_KEYS.PURCHASES.ALL, purchaseId] as const,
    ITEM_DETAIL: (purchaseId: string, productId: string) =>
      [...QUERY_KEYS.PURCHASES.ALL, purchaseId, 'items', productId] as const,
  },
} as const;
