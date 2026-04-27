import { useParams } from 'react-router';
import { PATHS } from '@/router';
import ProductModal from '../components/ProductModal';
import { useModalClose } from '../hooks';

export default function ProductDetailRoute() {
  const { purchaseId, productId } = useParams();
  const handleClose = useModalClose(PATHS.PURCHASE_LIST);
  if (!purchaseId || !productId) return null;

  return (
    <ProductModal
      purchaseId={purchaseId}
      productId={productId}
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    />
  );
}
