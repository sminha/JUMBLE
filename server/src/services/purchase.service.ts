import prisma from "../lib/prisma.ts";
import { formatPurchaseItem } from "../utils/format.ts";
import { serializeBigInt } from "../utils/serializeBigInt.ts";
import { CreatePurchaseDto, CreatePurchaseItemDto } from "../types/purchase.ts";

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

  getPurchases: async (userId: bigint, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const where = { user_id: userId };

    const [purchases, total] = await prisma.$transaction([
      prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { purchased_at: "desc" },
        select: {
          id: true,
          purchase_no: true,
          purchased_at: true,
          created_at: true,
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
              created_at: true,
            },
          },
          receipt: { select: { receipt_image_url: true } },
        },
      }),
      prisma.purchase.count({ where }),
    ]);

    const formattedPurchases = purchases.map(
      ({
        vendor,
        receipt,
        purchase_no,
        purchased_at,
        created_at,
        items,
        ...purchase
      }) => ({
        ...purchase,
        purchaseNo: purchase_no,
        purchasedAt: purchased_at,
        createdAt: created_at,
        vendor: vendor.name,
        receipt: receipt?.receipt_image_url ?? null,
        items: items.map(({ created_at, ...item }) => ({
          ...formatPurchaseItem(item),
          createdAt: created_at,
        })),
      }),
    );

    return { purchases: serializeBigInt(formattedPurchases), total };
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

    const { vendor, receipt, purchase_no, purchased_at, items, ...rest } =
      purchase;

    const formattedPurchase = {
      ...rest,
      purchaseNo: purchase_no,
      purchasedAt: purchased_at,
      vendor: vendor.name,
      receipt: receipt?.receipt_image_url ?? null,
      items: items.map(formatPurchaseItem),
    };

    return serializeBigInt(formattedPurchase);
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
