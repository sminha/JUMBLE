import { z } from 'zod';
import { CATEGORY_VALUES } from '../constants/category';

export const productSchema = z
  .object({
    name: z.string().min(1, '상품명을 입력하세요'),
    category: z.enum(CATEGORY_VALUES),
    color: z.string().optional(),
    size: z.string().optional(),
    option: z.string().optional(),
    price: z.number().int().positive(),
    quantity: z.number().int().positive(),
    backorderQuantity: z.number().int().min(0),
  })
  .refine((data) => data.backorderQuantity <= data.quantity, {
    message: '미송 수량은 총 수량을 초과할 수 없습니다.',
    path: ['backorderQuantity'],
  });

export const purchaseSchema = z.object({
  purchasedAt: z.string().min(1, '사입일시를 입력하세요'),
  vendor: z.string().min(1, '거래처명을 입력하세요'),
  items: z.array(productSchema).min(1, '상품을 1개 이상 추가하세요'),
  receipt: z.string().optional(),
});

export type Purchase = z.infer<typeof purchaseSchema>;
export type Product = z.infer<typeof productSchema>;
