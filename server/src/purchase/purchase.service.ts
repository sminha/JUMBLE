import { Purchase, Product, ProductDetail } from '@jumble/shared';
import prisma from '../lib/prisma';
import { serializeBigInt } from '../utils/serializeBigInt';
import { formatPurchase, formatPurchaseItem } from '../utils/format';

export const PurchaseService = {
  // 사입내역 추가 API
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
            create: data.products.map((item: Product, idx) => ({
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
          ...(data.receipt && {
            receipt: {
              create: {
                receipt_image_url: data.receipt,
              },
            },
          }),
        },
        select: {
          id: true,
        },
      });

      return serializeBigInt(newPurchase);
    });
  },

  // 사입내역 상세조회 API
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

  // 상품사입내역 상세조회 API
  getProduct: async (userId: bigint, itemId: bigint): Promise<ProductDetail | null> => {
    const item = await prisma.purchaseItem.findFirst({
      where: { id: itemId, purchase: { user_id: userId } },
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

  // 사입내역 수정 API
  updatePurchase: async (
    userId: bigint,
    purchaseId: bigint,
    data: Purchase,
  ): Promise<boolean | null> => {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findFirst({
        where: { id: purchaseId, user_id: userId },
      });

      if (!existing) return null;

      let vendor = await tx.vendor.findFirst({
        where: { user_id: userId, name: data.vendor },
      });

      if (!vendor) {
        vendor = await tx.vendor.create({
          data: { user_id: userId, name: data.vendor },
        });
      }

      const incomingIds = data.products.filter((p) => p.productId).map((p) => BigInt(p.productId!));

      await tx.purchaseItem.deleteMany({
        where: { purchase_id: purchaseId, id: { notIn: incomingIds } },
      });

      await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          vendor_id: vendor.id,
          purchased_at: new Date(data.purchasedAt),
        },
      });

      for (const [idx, item] of data.products.entries()) {
        if (item.productId) {
          await tx.purchaseItem.update({
            where: { id: BigInt(item.productId) },
            data: {
              item_name: item.name,
              category: item.category,
              color: item.color,
              size: item.size,
              extra_option: item.option,
              unit_price: item.price,
              quantity: item.quantity,
              backorder_quantity: item.backorderQuantity,
            },
          });
        } else {
          await tx.purchaseItem.create({
            data: {
              purchase_id: purchaseId,
              purchase_item_no: `${Date.now()}${idx + 1}`,
              item_name: item.name,
              category: item.category,
              color: item.color,
              size: item.size,
              extra_option: item.option,
              unit_price: item.price,
              quantity: item.quantity,
              backorder_quantity: item.backorderQuantity,
            },
          });
        }
      }

      return true;
    });
  },

  // 상품사입내역 수정 API
  updateProduct: async (userId: bigint, itemId: bigint, data: Product): Promise<boolean | null> => {
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

  // 미송수량 수정 API
  updateBackorder: async (
    userId: bigint,
    itemId: bigint,
    backorderQuantity: number,
  ): Promise<boolean | null> => {
    const existing = await prisma.purchaseItem.findFirst({
      where: { id: itemId, purchase: { user_id: userId } },
    });

    if (!existing) return null;

    if (backorderQuantity > existing.quantity) {
      throw new Error('미송수량은 총 수량을 초과할 수 없습니다.');
    }

    await prisma.purchaseItem.update({
      where: { id: itemId },
      data: { backorder_quantity: backorderQuantity },
    });

    return true;
  },

  // 사입내역 삭제 API
  deletePurchase: async (userId: bigint, purchaseId: bigint): Promise<boolean | null> => {
    const existing = await prisma.purchase.findFirst({
      where: { id: purchaseId, user_id: userId },
    });

    if (!existing) return null;

    await prisma.purchase.delete({
      where: { id: purchaseId },
    });

    return true;
  },

  // 상품사입내역 삭제 API
  deleteProduct: async (userId: bigint, itemId: bigint): Promise<boolean | null> => {
    const existing = await prisma.purchaseItem.findFirst({
      where: { id: itemId, purchase: { user_id: userId } },
    });

    if (!existing) return null;

    await prisma.purchaseItem.delete({
      where: { id: itemId },
    });

    return true;
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
