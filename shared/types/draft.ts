export type ValueLabel<T> = { value: T; label: string };

export const DATE = {
  PURCHASED_AT: 'PURCHASED_AT',
  CREATED_AT: 'CREATED_AT',
} as const;

export const DATE_LABEL: [ValueLabel<DateType>, ValueLabel<DateType>] = [
  { value: DATE.PURCHASED_AT, label: '사입일' },
  { value: DATE.CREATED_AT, label: '등록일' },
];

export const PERIOD = {
  ALL: 'ALL',
  TODAY: 'TODAY',
  ONE_WEEK: 'ONE_WEEK',
  ONE_MONTH: 'ONE_MONTH',
  THREE_MONTH: 'THREE_MONTH',
} as const;

export const PERIOD_LABEL: ValueLabel<Period>[] = [
  { value: PERIOD.ALL, label: '전체' },
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

export const SORT_BY = {
  PURCHASED_AT: 'PURCHASED_AT',
  PRICE: 'PRICE',
  QUANTITY: 'QUANTITY',
  TOTAL_PRICE: 'TOTAL_PRICE',
  BACKORDER_QUANTITY: 'BACKORDER_QUANTITY',
} as const;

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type DateType = keyof typeof DATE;
export type Period = keyof typeof PERIOD;
export type Filter = keyof typeof FILTER;
export type SortBy = keyof typeof SORT_BY;
export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
export type Draft = {
  page: number;
  limit: number;
  dateType: DateType;
  periodType: Period | null;
  startDate: string;
  endDate: string;
  filterType: Filter;
  keyword: string;
  isBackorderOnly: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export const INITIAL_DRAFT: Draft = {
  page: 1,
  limit: 50,
  dateType: DATE.PURCHASED_AT,
  periodType: PERIOD.ALL,
  startDate: '',
  endDate: '',
  filterType: FILTER.VENDOR,
  keyword: '',
  isBackorderOnly: false,
  sortBy: SORT_BY.PURCHASED_AT,
  sortOrder: SORT_ORDER.DESC,
};
