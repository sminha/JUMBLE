import { useNavigate, useParams, useLocation } from 'react-router';
import { PATHS } from '@/router';
import PurchaseModal from '../components/PurchaseModal';

export default function PurchaseDetailRoute() {
  const { purchaseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleClose = () => {
    if (state?.background) navigate(-1);
    else navigate(PATHS.PURCHASELIST);
  };

  return (
    <PurchaseModal
      purchaseId={purchaseId!}
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    />
  );
}
