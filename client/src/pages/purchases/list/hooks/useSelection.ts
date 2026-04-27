import { PurchaseRecord } from '@jumble/shared';
import { SetStateAction } from 'react';

interface UseSelectionArgs {
  records: PurchaseRecord[];
  selectedProductIds: Set<string>;
  setSelectedProductIds: React.Dispatch<SetStateAction<Set<string>>>;
}

export const useSelection = ({
  records,
  selectedProductIds,
  setSelectedProductIds,
}: UseSelectionArgs) => {
  const allProductIds = records.map((r) => r.productId);
  const isAllSelected =
    allProductIds.length > 0 && allProductIds.every((id: string) => selectedProductIds.has(id));

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedProductIds(new Set());
      return;
    }
    setSelectedProductIds(new Set(allProductIds));
  };

  const handleToggleRow = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  return {
    isAllSelected,
    handleToggleAll,
    handleToggleRow,
  };
};
