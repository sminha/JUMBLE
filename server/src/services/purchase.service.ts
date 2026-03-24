import prisma from "../lib/prisma.ts";
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

  getPurchases: async (userId: bigint) => {
    const purchases = await prisma.purchase.findMany({
      where: { user_id: userId },
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
      orderBy: { purchased_at: "desc" },
    });

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
        items: items.map(
          ({
            purchase_item_no,
            item_name,
            extra_option,
            unit_price,
            backorder_quantity,
            created_at: itemCreatedAt,
            ...item
          }) => ({
            ...item,
            purchaseItemNo: purchase_item_no,
            itemName: item_name,
            extraOption: extra_option,
            unitPrice: unit_price,
            backorderQuantity: backorder_quantity,
            createdAt: itemCreatedAt,
          }),
        ),
      }),
    );

    return serializeBigInt(formattedPurchases);
  },
};
