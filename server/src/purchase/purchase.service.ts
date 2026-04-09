import { Purchase, Product } from "@jumble/shared";
import prisma from "../lib/prisma.ts";
import { serializeBigInt } from "../utils/serializeBigInt.ts";
import { formatPurchase } from "../utils/format.ts";

export const PurchaseService = {
  createPurchase: async (userId: bigint, data: Purchase) => {
    return await prisma.$transaction(async (tx) => {
      let vendor = await tx.vendor.findFirst({
        where: {
          user_id: userId,
          name: data.vendor,
        },
      });

      if (!vendor) {
        vendor = await tx.vendor.create({
          data: {
            user_id: userId,
            name: data.vendor,
          },
        });
      }

      const newPurchase = await tx.purchase.create({
        data: {
          user_id: userId,
          vendor_id: vendor.id,
          purchase_no: Date.now().toString(),
          purchased_at: new Date(data.purchasedAt),
          items: {
            create: data.items.map((item: Product, idx) => ({
              purchase_item_no: `${Date.now()}${idx + 1}`,
              item_name: item.name,
              category: item.category,
              color: item.color,
              size: item.size,
              extra_option: item.option,
              unit_price: item.price,
              quantity: item.quantity,
              backorder_quantity: item.backorderQuantity,
            })),
          },
          receipt: {
            create: {
              receipt_image_url: data.receipt ?? "",
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
      }),
      prisma.purchase.count({ where }),
    ]);

    const formattedPurchases = purchases.map(formatPurchase);

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
};
