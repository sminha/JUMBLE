import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { serializeBigInt } from '../utils/serializeBigInt';
import { formatPurchaseItem } from '../utils/format';
import {
  Draft,
  DATE,
  FILTER,
  SORT_BY,
  PERIOD,
  Period,
  ProductDetail,
  Product,
} from '@jumble/shared';

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

export const PurchaseItemService = {
  // 사입내역 조회 API
  getPurchaseItems: async (userId: bigint, params: Draft) => {
    const {
      page,
      limit,
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
    const skip = (page - 1) * limit;

    const resolvedStartDate =
      startDate || (periodType && periodType !== PERIOD.ALL ? getPeriodStartDate(periodType) : '');
    const resolvedEndDate =
      endDate || (periodType && periodType !== PERIOD.ALL ? getTodayKST() : '');

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

  // 상품사입내역 상세조회 API
  getPurchaseItem: async (userId: bigint, itemId: bigint): Promise<ProductDetail | null> => {
    const item = await prisma.purchaseItem.findFirst({
      where: {
        id: itemId,
        purchase: { user_id: userId },
      },
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
          },
        },
      },
    });

    if (!item) return null;

    const { purchase, ...rest } = item;
    const formatted = {
      purchaseId: purchase.id,
      purchaseNo: purchase.purchase_no,
      purchasedAt: purchase.purchased_at,
      vendor: purchase.vendor.name,
      ...formatPurchaseItem(rest),
    };

    return serializeBigInt(formatted);
  },

  // 상품사입내역 수정 API
  updatePurchaseItem: async (
    userId: bigint,
    itemId: bigint,
    data: Product,
  ): Promise<boolean | null> => {
    const existing = await prisma.purchaseItem.findFirst({
      where: { id: itemId, purchase: { user_id: userId } },
    });

    if (!existing) return null;

    await prisma.purchaseItem.update({
      where: { id: itemId },
      data: {
        item_name: data.name,
        category: data.category,
        color: data.color,
        size: data.size,
        extra_option: data.option,
        unit_price: data.price,
        quantity: data.quantity,
        backorder_quantity: data.backorderQuantity,
      },
    });

    return true;
  },
};
