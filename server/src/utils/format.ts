export const formatPurchaseItem = ({
  id,
  purchase_item_no,
  item_name,
  extra_option,
  unit_price,
  quantity,
  backorder_quantity,
  ...rest
}: {
  id: bigint;
  purchase_item_no: string;
  item_name: string;
  extra_option: string | null;
  unit_price: number;
  quantity: number;
  backorder_quantity: number;
  [key: string]: unknown;
}) => ({
  ...rest,
  productId: id,
  productNo: purchase_item_no,
  name: item_name,
  option: extra_option,
  price: unit_price,
  quantity,
  totalPrice: unit_price * quantity,
  backorderQuantity: backorder_quantity,
});

export const formatPurchase = ({
  id,
  purchase_no,
  purchased_at,
  vendor,
  receipt,
  items,
  ...rest
}: {
  id: bigint;
  purchase_no: string;
  purchased_at: Date;
  vendor: { name: string };
  receipt: { receipt_image_url: string } | null | undefined;
  items: Parameters<typeof formatPurchaseItem>[0][];
  [key: string]: unknown;
}) => ({
  ...rest,
  purchaseId: id,
  purchaseNo: purchase_no,
  purchasedAt: purchased_at,
  vendor: vendor.name,
  receipt: receipt?.receipt_image_url ?? null,
  products: items.map(formatPurchaseItem),
});
