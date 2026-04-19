import { useParams } from 'react-router';
import { PATHS } from '@/router';
import PurchaseModal from '../components/PurchaseModal';
import { useModalClose } from '../hooks/useModalClose';

export default function PurchaseDetailRoute() {
  const { purchaseId } = useParams();
  const handleClose = useModalClose(PATHS.PURCHASE_LIST);
  if (!purchaseId) return null;

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
