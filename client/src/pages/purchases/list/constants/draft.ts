import { ValueLabel } from '@/types/value-label';

export const DATE = {
  PURCHASED_AT: 'PURCHASED_AT',
  CREATED_AT: 'CREATED_AT',
} as const;

export const DATE_LABEL: [ValueLabel<Date>, ValueLabel<Date>] = [
  { value: DATE.PURCHASED_AT, label: '사입일' },
  { value: DATE.CREATED_AT, label: '등록일' },
];

export const PERIOD = {
  TODAY: 'TODAY',
  ONE_WEEK: 'ONE_WEEK',
  ONE_MONTH: 'ONE_MONTH',
  THREE_MONTH: 'THREE_MONTH',
} as const;

export const PERIOD_LABEL: ValueLabel<Period>[] = [
  { value: PERIOD.TODAY, label: '오늘' },
  { value: PERIOD.ONE_WEEK, label: '일주일' },
  { value: PERIOD.ONE_MONTH, label: '1개월' },
  { value: PERIOD.THREE_MONTH, label: '3개월' },
];

export const FILTER = {
  VENDOR: 'VENDOR',
  PRODUCT: 'PRODUCT',
} as const;

export const FILTER_LABEL: ValueLabel<Filter>[] = [
  { value: FILTER.VENDOR, label: '거래처명' },
  { value: FILTER.PRODUCT, label: '상품명' },
];

export type Date = keyof typeof DATE;
export type Period = keyof typeof PERIOD;
export type Filter = keyof typeof FILTER;
export type Draft = {
  dateType: Date;
  periodType: Period;
  startDate: string;
  endDate: string;
  filterType: Filter;
  keyword: string;
  isBackorderOnly: boolean;
  sortBy: string;
  sortOrder: string;
};

export const INITIAL_DRAFT: Draft = {
  dateType: DATE.PURCHASED_AT,
  periodType: PERIOD.TODAY,
  startDate: '',
  endDate: '',
  filterType: FILTER.VENDOR,
  keyword: '',
  isBackorderOnly: false,
  sortBy: '',
  sortOrder: '',
};
