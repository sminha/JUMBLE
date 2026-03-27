import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.ts";
import { serializeBigInt } from "../utils/serializeBigInt.ts";
import { formatPurchase, formatPurchaseItem } from "../utils/format.ts";
import {
  CreatePurchaseDto,
  CreatePurchaseItemDto,
  GetPurchaseItemsQuery,
} from "../types/purchase.ts";

export const PurchaseService = {
  createPurchase: async (userId: bigint, data: CreatePurchaseDto) => {
    return await prisma.$transaction(async (tx) => {
      let vendor = await tx.vendor.findFirst({
        where: {
          user_id: userId,
          name: data.vendorName,
        },
      });

      if (!vendor) {
        vendor = await tx.vendor.create({
          data: {
            user_id: userId,
            name: data.vendorName,
          },
        });
      }

      const newPurchase = await tx.purchase.create({
        data: {
          user_id: userId,
          vendor_id: vendor.id,
          purchase_no: Date.now().toString(),
          purchased_at: new Date(data.purchasedDate),
          items: {
            create: data.items.map((item: CreatePurchaseItemDto, idx) => ({
              purchase_item_no: `${Date.now()}${idx + 1}`,
              item_name: item.productName,
              category: item.category,
              color: item.color,
              size: item.size,
              extra_option: item.extraOption,
              unit_price: item.unitPrice,
              quantity: item.quantity,
              backorder_quantity: item.backorderQuantity,
            })),
          },
          receipt: {
            create: {
              receipt_image_url: data.receipt,
            },
          },
        },
        select: {
          id: true,
        },
      });

      return serializeBigInt(newPurchase);
    });
  },

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
        dateType === "purchased" && {
          purchased_at: {
            gte: new Date(startDate),
            lte: new Date(`${endDate}T23:59:59.999`),
          },
        }),
      ...(startDate &&
        endDate &&
        dateType === "created" && {
          created_at: {
            gte: new Date(startDate),
            lte: new Date(`${endDate}T23:59:59.999`),
          },
        }),
    };

    const where: Prisma.PurchaseItemWhereInput = {
      purchase: purchaseWhere,
      ...(backorderOnly && { backorder_quantity: { gt: 0 } }),
    };

    const orderBy = ((): Prisma.PurchaseItemOrderByWithRelationInput => {
      switch (sortBy) {
        case "purchasedAt":
          return { purchase: { purchased_at: sortOrder } };
        case "unitPrice":
          return { unit_price: sortOrder };
        case "quantity":
          return { quantity: sortOrder };
        case "backorderQuantity":
          return { backorder_quantity: sortOrder };
        // TODO : DB에 computed column (generated column) 추가
        // case "totalAmount":      return { unit_price: sortOrder };
        default:
          return { purchase: { purchased_at: "desc" } };
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
        productId: id,
        purchaseNo: purchase.purchase_no,
        purchaseItemNo: purchase_item_no,
        purchasedAt: purchase.purchased_at,
        vendorName: purchase.vendor.name,
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

  getPurchase: async (userId: bigint, purchaseId: bigint) => {
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, user_id: userId },
      select: {
        id: true,
        purchase_no: true,
        purchased_at: true,
        vendor: { select: { name: true } },
        items: {
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
        },
        receipt: { select: { receipt_image_url: true } },
      },
    });

    if (!purchase) return null;

    return serializeBigInt(formatPurchase(purchase));
  },

  getPurchaseReceipt: async (userId: bigint, purchaseId: bigint) => {
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, user_id: userId },
      select: {
        id: true,
        purchase_no: true,
        receipt: { select: { receipt_image_url: true } },
      },
    });

    if (!purchase) return null;

    return serializeBigInt({
      id: purchase.id,
      purchaseNo: purchase.purchase_no,
      receipt: purchase.receipt?.receipt_image_url ?? null,
    });
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
