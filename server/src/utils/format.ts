export const formatPurchaseItem = ({
  purchase_item_no,
  item_name,
  extra_option,
  unit_price,
  backorder_quantity,
  ...rest
}: {
  purchase_item_no: string;
  item_name: string;
  extra_option: string | null;
  unit_price: number;
  backorder_quantity: number;
  [key: string]: unknown;
}) => ({
  ...rest,
  purchaseItemNo: purchase_item_no,
  itemName: item_name,
  extraOption: extra_option,
  unitPrice: unit_price,
  backorderQuantity: backorder_quantity,
});

export const formatPurchase = ({
  purchase_no,
  purchased_at,
  vendor,
  receipt,
  items,
  ...rest
}: {
  purchase_no: string;
  purchased_at: Date;
  vendor: { name: string };
  receipt: { receipt_image_url: string } | null | undefined;
  items: Parameters<typeof formatPurchaseItem>[0][];
  [key: string]: unknown;
}) => ({
  ...rest,
  purchaseNo: purchase_no,
  purchasedAt: purchased_at,
  vendor: vendor.name,
  receipt: receipt?.receipt_image_url ?? null,
  items: items.map(formatPurchaseItem),
});
