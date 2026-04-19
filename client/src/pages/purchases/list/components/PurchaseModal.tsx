import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaseSchema } from '@jumble/shared';
import LeaveConfirmationModal from '@/components/LeaveConfirmationModal';
import Modal, { ModalRow } from '@/components/Modal';
import ProductTable from '@/components/ProductTable';
import { formatDate } from '@/utils/format';
import { useGetPurchase } from '../apis';

interface PurchaseModalProps {
  purchaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABLE_HEADERS: { label: string; width: string }[] = [
  { label: '상품사입번호', width: 'w-[18rem]' },
  { label: '상품명', width: 'w-[16rem]' },
  { label: '구분', width: 'w-[10.9rem]' },
  { label: '컬러', width: 'w-[9.6rem]' },
  { label: '사이즈', width: 'w-[9.6rem]' },
  { label: '기타옵션', width: 'w-[16rem]' },
  { label: '단가', width: 'w-[9.6rem]' },
  { label: '수량', width: 'w-[6rem]' },
  { label: '금액합계', width: 'w-[9.6rem]' },
  { label: '미송수량', width: 'w-[6rem]' },
  { label: '', width: 'w-[4rem]' },
];

export default function PurchaseModal({ purchaseId, open, onOpenChange }: PurchaseModalProps) {
  const { data, isPending } = useGetPurchase(purchaseId);
  const [isLeaveConfirmationModalOpen, setIsLeaveConfirmationModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
  });

  useEffect(() => {
    if (data) {
      reset({ ...data, purchasedAt: data.purchasedAt.slice(0, 16) });
    }
  }, [data]);

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
    // TODO: 사입내역 삭제 API 연동
    console.log(purchaseId);
    onOpenChange(false);
  };
  const handleSave = handleSubmit((data) => {
    // TODO: 사입내역 수정 API 연동
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
        title="사입내역 조회"
        open={open}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={() => setIsEditing(false)}
        leftLabel={isEditing ? '취소' : '삭제'}
        rightLabel={isEditing ? '저장' : '수정'}
        onLeftClick={isEditing ? handleCancel : handleRemove}
        onRightClick={isEditing ? handleSave : handleEdit}
      >
        <ModalRow label="사입번호" value={data.purchaseNo} />
        {/* TODO: 시간 +3 이슈 해결 */}
        <ModalRow
          label="사입일시"
          value={formatDate(data.purchasedAt)}
          inputType="datetime-local"
          isEditing={isEditing}
          field="purchasedAt"
          register={register}
          errors={errors}
        />
        <ModalRow
          label="거래처명"
          value={data.vendor}
          isEditing={isEditing}
          field="vendor"
          register={register}
          errors={errors}
        />
        <ProductTable
          headers={TABLE_HEADERS}
          hasProductId={true}
          isEditing={isEditing}
          register={register}
          control={control}
          errors={errors}
        />
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
