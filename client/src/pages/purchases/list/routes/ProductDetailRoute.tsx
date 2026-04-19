import { useNavigate, useParams, useLocation } from 'react-router';
import { PATHS } from '@/router';
import ProductModal from '../components/ProductModal';

export default function ProductDetailRoute() {
  const { productId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleClose = () => {
    if (state?.background) navigate(-1);
    else navigate(PATHS.PURCHASELIST);
  };

  return (
    <ProductModal
      productId={productId!}
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    />
  );
}
