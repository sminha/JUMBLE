import { Category } from '@jumble/shared';

const BASE_RECORD = {
  purchaseId: '1',
  purchaseNo: '174839280',
  purchasedAt: '2024.11.24 02:39',
  vendor: '동대문상사',
  product: '반팔 티셔츠',
  category: 'TOP' as Category,
  color: '화이트',
  size: 'M',
  option: null,
  price: 12000,
  quantity: 10,
  totalPrice: 120000,
  backorderQuantity: 2,
};

const records = Array.from({ length: 24 }, (_, i) => ({
  ...BASE_RECORD,
  productId: String(i + 1),
  productNo: `174839280${i + 1}`,
}));

export const MOCK = {
  success: true,
  status: 200,
  message: '사입내역 조회에 성공했습니다.',
  records,
  pagination: {
    total: 528,
    page: 1,
    limit: 50,
    totalPages: Math.ceil(528 / 50),
  },
};
