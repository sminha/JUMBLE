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
