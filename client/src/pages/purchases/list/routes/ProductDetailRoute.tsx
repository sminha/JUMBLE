import { useParams } from 'react-router';
import { PATHS } from '@/router';
import ProductModal from '../components/ProductModal';
import { useModalClose } from '../hooks/useModalClose';

export default function ProductDetailRoute() {
  const { productId } = useParams();
  const handleClose = useModalClose(PATHS.PURCHASE_LIST);
  if (!productId) return null;

  return (
    <ProductModal
      productId={productId}
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    />
  );
}
