import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseSchema } from '@jumble/shared';
import LeaveConfirmationModal from '@/components/LeaveConfirmationModal';
import Modal, { ModalRow } from '@/components/Modal';
import { PURCHASE_DETAIL_MOCK } from '../mocks/mock';

interface ReceiptModalProps {
  purchaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReceiptModal({ purchaseId, open, onOpenChange }: ReceiptModalProps) {
  const data = PURCHASE_DETAIL_MOCK.data;

  const [isLeaveConfirmationModalOpen, setIsLeaveConfirmationModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { handleSubmit, reset } = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      ...data,
      purchasedAt: data.purchasedAt.slice(0, 16),
    },
  });

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
        <img src={data.receipt} />
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
