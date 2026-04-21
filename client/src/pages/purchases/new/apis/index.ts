import { UseFormSetValue, UseFieldArrayReplace } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-key';
import { Purchase } from '@jumble/shared';
import { fetchWithAuth } from '@/lib/api';

const compressImage = (file: File, maxWidth = 1024): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
    };

    img.src = url;
  });
};

const parseImage = async (file: File) => {
  const compressed = await compressImage(file);
  const formData = new FormData();
  formData.append('image', compressed, 'receipt.jpg');

  const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/v1/ocr/parse`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('OCR 요청 실패');

  const result = await res.json();

  if (!result || typeof result !== 'object' || !('data' in result) || !result.data) {
    throw new Error('OCR 응답 형식이 올바르지 않습니다.');
  }

  return result.data;
};

// OCR API
export const useImageUpload = ({
  setValue,
  replace,
}: {
  setValue: UseFormSetValue<Purchase>;
  replace: UseFieldArrayReplace<Purchase, 'products'>;
}) => {
  return useMutation({
    mutationFn: parseImage,
    onSuccess: (data) => {
      if (data.purchasedAt) setValue('purchasedAt', data.purchasedAt);
      if (data.vendor) setValue('vendor', data.vendor);
      if (data.products?.length) replace(data.products);
    },
    onError: () => {
      // TODO: 추후 토스트로 변경
      alert('영수증 분석에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

const createPurchase = async (form: Purchase) => {
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/v1/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!res.ok) throw new Error('사입내역 추가 요청 실패');

  const result = await res.json();

  return result;
};

// 사입내역 추가 API
export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASES.LIST() });
    },
  });
};
