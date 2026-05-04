import { SortBy, SORT_BY } from '@jumble/shared';
import { ValueLabel } from '@/types/value-label';

const PAGE_SIZE = [50, 100, 200, 300] as const;
type PageSize = (typeof PAGE_SIZE)[number];
export const PAGE_SIZE_LABEL: ValueLabel<PageSize>[] = [
  { value: PAGE_SIZE[0], label: '50개씩' },
  { value: PAGE_SIZE[1], label: '100개씩' },
  { value: PAGE_SIZE[2], label: '200개씩' },
  { value: PAGE_SIZE[3], label: '300개씩' },
];

export const SORT_BY_LABEL: ValueLabel<SortBy>[] = [
  { value: SORT_BY.PURCHASED_AT, label: '사입일시' },
  { value: SORT_BY.PRICE, label: '단가' },
  { value: SORT_BY.QUANTITY, label: '수량' },
  { value: SORT_BY.TOTAL_PRICE, label: '금액합계' },
  { value: SORT_BY.BACKORDER_QUANTITY, label: '미송수량' },
];

export const TABLE_HEADERS: { label: string; width: string; sortBy?: SortBy }[] = [
  { label: '', width: 'w-[4rem]' },
  { label: '사입번호', width: 'w-[16rem]' },
  { label: '상품사입번호', width: 'w-[16rem]' },
  { label: '사입일시', width: 'w-[18rem]', sortBy: SORT_BY.PURCHASED_AT },
  { label: '거래처명', width: 'w-[16rem]' },
  { label: '상품명', width: 'w-[16rem]' },
  { label: '구분', width: 'w-[10rem]' },
  { label: '컬러', width: 'w-[10rem]' },
  { label: '사이즈', width: 'w-[8rem]' },
  { label: '기타옵션', width: 'w-[14rem]' },
  { label: '단가', width: 'w-[12rem]', sortBy: SORT_BY.PRICE },
  { label: '수량', width: 'w-[8rem]', sortBy: SORT_BY.QUANTITY },
  { label: '금액합계', width: 'w-[12rem]', sortBy: SORT_BY.TOTAL_PRICE },
  { label: '미송수량', width: 'w-[8rem]', sortBy: SORT_BY.BACKORDER_QUANTITY },
  { label: '영수증', width: 'w-[10rem]' },
];
