import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { purchaseSchema } from '@jumble/shared';
import { Modal, ModalRow, LeaveConfirmationModal } from '@/components';
import { useGetPurchase } from '../apis';

interface ReceiptModalProps {
  purchaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReceiptModal({ purchaseId, open, onOpenChange }: ReceiptModalProps) {
  const { data, isPending } = useGetPurchase(purchaseId, open);

  const [isLeaveConfirmationModalOpen, setIsLeaveConfirmationModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { handleSubmit, reset } = useForm({
    resolver: standardSchemaResolver(purchaseSchema),
  });

  useEffect(() => {
    if (data) {
      reset({ ...data, purchasedAt: data.purchasedAt.slice(0, 16) });
    }
  }, [data, reset]);

  if (!open) return null;

  if (isPending || !data) {
    return (
      <div className="bg-overlay fixed inset-0 z-20 flex items-center justify-center">
        <div className="border-t-primary-3 border-gray-2 h-8 w-8 animate-spin rounded-full border-3"></div>
      </div>
    );
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (isEditing) {
      setIsLeaveConfirmationModalOpen(true);
      return;
    }
    onOpenChange(newOpen);
  };

  const handleRemove = () => {
    // TODO: 영수증 삭제 API 연동
    console.log(purchaseId);
    onOpenChange(false);
  };
  const handleSave = handleSubmit((data) => {
    // TODO: 영수증 수정 API 연동
    console.log(data);
    setIsEditing(false);
  });
  const handleCancel = () => {
    setIsLeaveConfirmationModalOpen(true);
  };
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <>
      <Modal
        title="사입내역 영수증 조회"
        open={open}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={() => setIsEditing(false)}
        leftLabel={isEditing ? '취소' : '삭제'}
        rightLabel={isEditing ? '저장' : '수정'}
        onLeftClick={isEditing ? handleCancel : handleRemove}
        onRightClick={isEditing ? handleSave : handleEdit}
      >
        <ModalRow label="사입번호" value={data.purchaseNo} />
        {data.receipt && <img src={data.receipt} alt="영수증" />}
      </Modal>

      {/* 이탈방지모달 */}
      <LeaveConfirmationModal
        open={isLeaveConfirmationModalOpen}
        onOpenChange={setIsLeaveConfirmationModalOpen}
        onEditingChange={setIsEditing}
        reset={reset}
      />
    </>
  );
}
