import { z } from 'zod';

export const purchaseItemSchema = z.object({
  name: z.string().min(1, '상품명을 입력하세요'),
  category: z.enum(
    ['TOP', 'OUTER', 'BOTTOM', 'SET', 'BAG', 'SHOES', 'JEWELRY', 'ACCESSORY', 'ETC'],
    {
      error: '구분을 선택하세요',
    },
  ),
  color: z.string().optional(),
  size: z.string().optional(),
  option: z.string().optional(),
  price: z.number({ error: '단가를 입력하세요' }).int().positive(),
  quantity: z.number({ error: '수량을 입력하세요' }).int().positive(),
  backorderQuantity: z.number().int().min(0),
});

export const purchaseNewSchema = z.object({
  purchasedAt: z.string().min(1, '사입일시를 입력하세요'),
  vendor: z.string().min(1, '거래처명을 입력하세요'),
  items: z.array(purchaseItemSchema).min(1, '상품을 1개 이상 추가하세요'),
});

export type PurchaseNewFormData = z.infer<typeof purchaseNewSchema>;
