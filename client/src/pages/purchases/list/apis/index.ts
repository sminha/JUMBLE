import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/libs/api';
import { Draft } from '@jumble/shared';
import { QUERY_KEYS } from '@/constants/query-key';

export const getPurchases = async (draft: Draft) => {
  const searchParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(draft)
        .filter(([_, v]) => v !== '')
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
