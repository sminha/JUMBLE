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

      return serializeBigInt(newPurchase.id);
    });
  },
};
