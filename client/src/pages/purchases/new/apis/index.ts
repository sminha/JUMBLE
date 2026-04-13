import { UseFormSetValue, UseFieldArrayReplace } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Purchase } from '@jumble/shared';
import { fetchWithAuth } from '@/lib/api';
import { useNavigate } from 'react-router';
import { PATHS } from '@/router';

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

  return result.data;
};

// OCR API
export const useImageUpload = ({
  setValue,
  replace,
}: {
  setValue: UseFormSetValue<Purchase>;
  replace: UseFieldArrayReplace<Purchase, 'items'>;
}) => {
  return useMutation({
    mutationFn: parseImage,
    onSuccess: (data) => {
      if (data.purchasedAt) setValue('purchasedAt', data.purchasedAt);
      if (data.vendor) setValue('vendor', data.vendor);
      if (data.items?.length) replace(data.items);
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      navigate(PATHS.PURCHASELIST);
    },
    onError: () => {
      // TODO: 추후 토스트로 변경
      alert('사입내역 추가에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
