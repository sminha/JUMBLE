import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.ts';
import { serializeBigInt } from '../utils/serializeBigInt.ts';
import { formatPurchaseItem } from '../utils/format.ts';
import { GetPurchaseItemsQuery } from '@jumble/shared';

export const PurchaseItemService = {
  getPurchaseItems: async (userId: bigint, params: GetPurchaseItemsQuery) => {
    const {
      page,
      limit,
      dateType,
      startDate,
      endDate,
      vendorName,
      backorderOnly,
      sortBy,
      sortOrder,
    } = params;
    const skip = (page - 1) * limit;

    const purchaseWhere: Prisma.PurchaseWhereInput = {
      user_id: userId,
      ...(vendorName && { vendor: { name: { contains: vendorName } } }),
      ...(startDate &&
        endDate &&
        dateType === 'purchased' && {
          purchased_at: {
            gte: new Date(`${startDate}T00:00:00.000+09:00`),
            lte: new Date(`${endDate}T23:59:59.999+09:00`),
          },
        }),
      ...(startDate &&
        endDate &&
        dateType === 'created' && {
          created_at: {
            gte: new Date(`${startDate}T00:00:00.000+09:00`),
            lte: new Date(`${endDate}T23:59:59.999+09:00`),
          },
        }),
    };

    const where: Prisma.PurchaseItemWhereInput = {
      purchase: purchaseWhere,
      ...(backorderOnly && { backorder_quantity: { gt: 0 } }),
    };

    const orderBy = ((): Prisma.PurchaseItemOrderByWithRelationInput => {
      switch (sortBy) {
        case 'purchasedAt':
          return { purchase: { purchased_at: sortOrder } };
        case 'unitPrice':
          return { unit_price: sortOrder };
        case 'quantity':
          return { quantity: sortOrder };
        case 'backorderQuantity':
          return { backorder_quantity: sortOrder };
        // TODO : DB에 computed column (generated column) 추가
        // case "totalAmount":      return { unit_price: sortOrder };
        default:
          return { purchase: { purchased_at: 'desc' } };
      }
    })();

    const [items, total] = await prisma.$transaction([
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
            },
          },
        },
      }),
      prisma.purchaseItem.count({ where }),
    ]);

    const formattedPurchaseItems = items.map(
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
        itemId: id,
        purchaseNo: purchase.purchase_no,
        purchaseItemNo: purchase_item_no,
        purchasedAt: purchase.purchased_at,
        vendor: purchase.vendor.name,
        itemName: item_name,
        extraOption: extra_option,
        unitPrice: unit_price,
        totalAmount: unit_price * rest.quantity,
        backorderQuantity: backorder_quantity,
        ...rest,
      }),
    );

    return { items: serializeBigInt(formattedPurchaseItems), total };
  },

  getPurchaseItem: async (userId: bigint, itemId: bigint) => {
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
      },
    });

    if (!item) return null;

    return serializeBigInt(formatPurchaseItem(item));
  },
};
