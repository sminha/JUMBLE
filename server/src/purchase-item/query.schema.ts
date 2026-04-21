import { z } from 'zod';
import {
  DATE,
  FILTER,
  INITIAL_DRAFT,
  PERIOD,
  SORT_BY,
  SORT_ORDER,
  DateType,
  Period,
  Filter,
  SortBy,
  SortOrder,
} from '@jumble/shared';

const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const querySchema = z
  .object({
    page: z.coerce.number().int().min(1, 'page는 1 이상이어야 합니다.').default(INITIAL_DRAFT.page),
    limit: z.coerce
      .number()
      .int()
      .min(1, 'limit은 1 이상이어야 합니다.')
      .max(300, 'limit은 300 이하여야 합니다.')
      .default(INITIAL_DRAFT.limit),
    dateType: z
      .enum(Object.values(DATE) as [DateType, ...DateType[]], {
        message: `dateType은 ${Object.values(DATE).join(', ')} 중 하나여야 합니다.`,
      })
      .default(INITIAL_DRAFT.dateType),
    periodType: z
      .enum(Object.values(PERIOD) as [Period, ...Period[]])
      .nullable()
      .default(INITIAL_DRAFT.periodType),
    startDate: z.string().default(INITIAL_DRAFT.startDate),
    endDate: z.string().default(INITIAL_DRAFT.endDate),
    filterType: z
      .enum(Object.values(FILTER) as [Filter, ...Filter[]], {
        message: `filterType은 ${Object.values(FILTER).join(', ')} 중 하나여야 합니다.`,
      })
      .default(INITIAL_DRAFT.filterType),
    keyword: z.string().default(INITIAL_DRAFT.keyword),
    isBackorderOnly: z.stringbool().default(INITIAL_DRAFT.isBackorderOnly),
    sortBy: z
      .enum(Object.values(SORT_BY) as [SortBy, ...SortBy[]], {
        message: `sortBy는 ${Object.values(SORT_BY).join(', ')} 중 하나여야 합니다.`,
      })
      .default(INITIAL_DRAFT.sortBy),
    sortOrder: z
      .enum(Object.values(SORT_ORDER) as [SortOrder, ...SortOrder[]], {
        message: `sortOrder는 ${Object.values(SORT_ORDER).join(', ')} 중 하나여야 합니다.`,
      })
      .default(INITIAL_DRAFT.sortOrder),
  })
  .refine((data) => !!data.startDate === !!data.endDate, {
    message: 'startDate와 endDate는 함께 제공되어야 합니다.',
  })
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      (VALID_DATE.test(data.startDate) &&
        !isNaN(Date.parse(data.startDate)) &&
        VALID_DATE.test(data.endDate) &&
        !isNaN(Date.parse(data.endDate))),
    { message: 'startDate와 endDate는 유효한 YYYY-MM-DD 형식이어야 합니다.' },
  );
