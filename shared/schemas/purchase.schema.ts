import { z } from 'zod';
import { type Category, CATEGORY_VALUES } from '../constants/category';

export const productSchema = z
  .object({
    productId: z.string().optional(),
    productNo: z.string().optional(),
    name: z.string().min(1, '상품명을 입력하세요'),
    category: z.enum(CATEGORY_VALUES),
    color: z.string().optional().nullable(),
    size: z.string().optional().nullable(),
    option: z.string().optional().nullable(),
    price: z.number().int().positive(),
    quantity: z.number().int().positive(),
    backorderQuantity: z.number().int().min(0),
  })
  .refine((data) => data.backorderQuantity <= data.quantity, {
    message: '미송수량은 총 수량을 초과할 수 없습니다.',
    path: ['backorderQuantity'],
  });

export const purchaseSchema = z.object({
  purchasedAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      '올바른 날짜/시간 형식이 아닙니다 (YYYY-MM-DDTHH:mm)',
    ),
  vendor: z.string().min(1, '거래처명을 입력하세요'),
  products: z.array(productSchema).min(1, '상품을 1개 이상 추가하세요'),
  receipt: z.string().optional().nullable(),
});

export const updateBackorderSchema = z.object({
  backorderQuantity: z.number().int().min(0, '미송수량은 0 이상이어야 합니다.'),
});

export const productIdsSchema = z.object({
  productIds: z
    .array(z.string().regex(/^\d+$/, 'id는 정수여야 합니다.'))
    .min(1, '삭제할 항목을 1개 이상 선택하세요.'),
});

export type Purchase = z.infer<typeof purchaseSchema>;
export type Product = z.infer<typeof productSchema>;
export type UpdateBackorder = z.infer<typeof updateBackorderSchema>;
export type ProductIds = z.infer<typeof productIdsSchema>;

export const DEFAULT_PRODUCT: Product = {
  productNo: '-',
  name: '',
  category: '' as unknown as Category,
  color: '',
  size: '',
  option: '',
  price: undefined as unknown as number,
  quantity: undefined as unknown as number,
  backorderQuantity: undefined as unknown as number,
};

export const DEFAULT_PURCHASE: Purchase = {
  purchasedAt: '',
  vendor: '',
  receipt: '',
  products: [DEFAULT_PRODUCT],
};
