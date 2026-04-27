import { Prisma } from '@prisma/client';
import * as XLSX from 'xlsx';
import prisma from '../lib/prisma';
import { serializeBigInt } from '../utils/serializeBigInt';
import { Draft, DATE, FILTER, SORT_BY, PERIOD, Period, CATEGORY_LABEL_NEW } from '@jumble/shared';

const getTodayKST = (): string => {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
};

const getPeriodStartDate = (periodType: Exclude<Period, 'ALL'>): string => {
  const daysAgoMap: Record<Exclude<Period, 'ALL'>, number> = {
    [PERIOD.TODAY]: 0,
    [PERIOD.ONE_WEEK]: 6,
    [PERIOD.ONE_MONTH]: 29,
    [PERIOD.THREE_MONTH]: 89,
  };
  const kst = new Date(
    Date.now() - daysAgoMap[periodType] * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
  );
  return kst.toISOString().split('T')[0];
};

const buildPurchaseItemQuery = (
  userId: bigint,
  params: Omit<Draft, 'page' | 'limit'>,
): {
  where: Prisma.PurchaseItemWhereInput;
  orderBy: Prisma.PurchaseItemOrderByWithRelationInput;
} => {
  const {
    dateType,
    periodType,
    startDate,
    endDate,
    filterType,
    keyword,
    isBackorderOnly,
    sortBy,
    sortOrder,
  } = params;

  const resolvedStartDate =
    startDate || (periodType && periodType !== PERIOD.ALL ? getPeriodStartDate(periodType) : '');
  const resolvedEndDate = endDate || (periodType && periodType !== PERIOD.ALL ? getTodayKST() : '');

  const purchaseWhere: Prisma.PurchaseWhereInput = {
    user_id: userId,
    ...(filterType === FILTER.VENDOR && { vendor: { name: { contains: keyword } } }),
    ...(resolvedStartDate &&
      resolvedEndDate &&
      dateType === DATE.PURCHASED_AT && {
        purchased_at: {
          gte: new Date(`${resolvedStartDate}T00:00:00.000+09:00`),
          lte: new Date(`${resolvedEndDate}T23:59:59.999+09:00`),
        },
      }),
    ...(resolvedStartDate &&
      resolvedEndDate &&
      dateType === DATE.CREATED_AT && {
        created_at: {
          gte: new Date(`${resolvedStartDate}T00:00:00.000+09:00`),
          lte: new Date(`${resolvedEndDate}T23:59:59.999+09:00`),
        },
      }),
  };

  const where: Prisma.PurchaseItemWhereInput = {
    purchase: purchaseWhere,
    ...(filterType === FILTER.PRODUCT && { item_name: { contains: keyword } }),
    ...(isBackorderOnly && { backorder_quantity: { gt: 0 } }),
  };

  const orderBy = ((): Prisma.PurchaseItemOrderByWithRelationInput => {
    switch (sortBy) {
      case SORT_BY.PURCHASED_AT:
        return { purchase: { purchased_at: sortOrder } };
      case SORT_BY.PRICE:
        return { unit_price: sortOrder };
      case SORT_BY.QUANTITY:
        return { quantity: sortOrder };
      case SORT_BY.BACKORDER_QUANTITY:
        return { backorder_quantity: sortOrder };
      case SORT_BY.TOTAL_PRICE:
        return { total_price: sortOrder };
      default:
        return { purchase: { purchased_at: 'desc' } };
    }
  })();

  return { where, orderBy };
};

export const PurchaseItemService = {
  // 사입내역 조회 API
  getPurchaseItems: async (userId: bigint, params: Draft) => {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const { where, orderBy } = buildPurchaseItemQuery(userId, params);

    const [records, total] = await prisma.$transaction([
      prisma.purchaseItem.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          purchase_item_no: true,
          item_name: true,
          category: true,
          color: true,
          size: true,
          extra_option: true,
          unit_price: true,
          quantity: true,
          backorder_quantity: true,
          purchase: {
            select: {
              id: true,
              purchase_no: true,
              purchased_at: true,
              vendor: { select: { name: true } },
              receipt: { select: { receipt_image_url: true } },
            },
          },
        },
      }),
      prisma.purchaseItem.count({ where }),
    ]);

    const formattedPurchaseItems = records.map(
      ({
        purchase,
        id,
        purchase_item_no,
        item_name,
        extra_option,
        unit_price,
        backorder_quantity,
        ...rest
      }) => ({
        purchaseId: purchase.id,
        productId: id,
        purchaseNo: purchase.purchase_no,
        productNo: purchase_item_no,
        purchasedAt: purchase.purchased_at,
        vendor: purchase.vendor.name,
        receipt: purchase.receipt?.receipt_image_url ?? null,
        product: item_name,
        option: extra_option,
        price: unit_price,
        totalPrice: unit_price * rest.quantity,
        backorderQuantity: backorder_quantity,
        ...rest,
      }),
    );

    return { records: serializeBigInt(formattedPurchaseItems), total };
  },

  // 미송수량 일괄 변경 API
  resetBackorderQuantities: async (userId: bigint, productIds: string[]) => {
    const { count } = await prisma.purchaseItem.updateMany({
      where: {
        id: { in: productIds.map(BigInt) },
        purchase: { user_id: userId },
      },
      data: { backorder_quantity: 0 },
    });
    return count;
  },

  // 엑셀 다운로드 API
  exportPurchaseItems: async (userId: bigint, params: Omit<Draft, 'page' | 'limit'>) => {
    const { where, orderBy } = buildPurchaseItemQuery(userId, params);

    const records = await prisma.purchaseItem.findMany({
      where,
      orderBy,
      select: {
        id: true,
        purchase_item_no: true,
        item_name: true,
        category: true,
        color: true,
        size: true,
        extra_option: true,
        unit_price: true,
        quantity: true,
        backorder_quantity: true,
        purchase: {
          select: {
            purchase_no: true,
            purchased_at: true,
            vendor: { select: { name: true } },
          },
        },
      },
    });

    const rows = records.map((r) => ({
      사입번호: r.purchase.purchase_no,
      상품사입번호: r.purchase_item_no,
      사입일시: r.purchase.purchased_at.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      거래처명: r.purchase.vendor.name,
      상품명: r.item_name,
      구분: CATEGORY_LABEL_NEW[r.category as keyof typeof CATEGORY_LABEL_NEW],
      컬러: r.color ?? '',
      사이즈: r.size ?? '',
      기타옵션: r.extra_option ?? '',
      단가: r.unit_price,
      수량: r.quantity,
      금액합계: r.unit_price * r.quantity,
      미송수량: r.backorder_quantity,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '사입내역');

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  },
};
