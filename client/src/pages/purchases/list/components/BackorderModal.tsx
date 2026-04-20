import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { updateBackorderSchema } from '@jumble/shared';
import { STATUS } from '@/constants/status';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import LeaveConfirmationModal from '@/components/LeaveConfirmationModal';
import UnstyledButton from './UnstyledButton';
import { useUpdateBackorder, useGetProduct } from '../apis';

interface BackorderModalProps {
  purchaseId: string;
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BackorderModal({
  purchaseId,
  productId,
  open,
  onOpenChange,
}: BackorderModalProps) {
  const { data, isPending } = useGetProduct(purchaseId, productId, open);
  const { mutate: handleUpdateBackorder } = useUpdateBackorder(purchaseId, productId);

  const [isLeaveConfirmationModalOpen, setIsLeaveConfirmationModalOpen] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(updateBackorderSchema),
  });
  const backorderQuantity = useWatch({ control, name: 'backorderQuantity' });

  useEffect(() => {
    if (data) {
      reset(data);
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

  const handleOpenChange = () => {
    setIsLeaveConfirmationModalOpen(true);
  };

  const handleSave = handleSubmit((data) => {
    handleUpdateBackorder(data, {
      onSuccess: () => {
        // TODO: 추후 토스트 추가
        onOpenChange(false);
      },
      onError: () => {
        // TODO: 추후 토스트로 변경
        alert('미송수량 수정에 실패했습니다. 다시 시도해주세요.');
      },
    });
  });
  const handleCancel = () => {
    setIsLeaveConfirmationModalOpen(true);
  };

  const handleMinus = () => {
    const current = Number.isFinite(backorderQuantity) ? backorderQuantity : 0;
    setValue('backorderQuantity', Math.max(0, current - 1));
  };
  const handlePlus = () => {
    const current = Number.isFinite(backorderQuantity) ? backorderQuantity : 0;
    setValue('backorderQuantity', Math.min(data.quantity, current + 1));
  };

  return (
    <>
      <Modal
        title="미송수량 수정"
        open={open}
        onOpenChange={handleOpenChange}
        leftLabel="취소"
        rightLabel="저장"
        onLeftClick={handleCancel}
        onRightClick={handleSave}
      >
        <div className="flex justify-center gap-[1rem] px-[14rem]">
          <UnstyledButton onClick={handleMinus}>
            <span className="text-gray-9 font-20-m">-</span>
          </UnstyledButton>
          <div className="w-[8rem]">
            <Input
              numeric
              {...register('backorderQuantity', {
                valueAsNumber: true,
                validate: (value) =>
                  value <= data.quantity || '미송수량은 총 수량을 초과할 수 없습니다.',
              })}
              status={errors.backorderQuantity ? STATUS.ERROR : STATUS.DEFAULT}
              className="text-center"
            />
          </div>
          <UnstyledButton onClick={handlePlus}>
            <span className="text-gray-9 font-20-m">+</span>
          </UnstyledButton>
        </div>
      </Modal>

      {/* 이탈방지모달 */}
      <LeaveConfirmationModal
        open={isLeaveConfirmationModalOpen}
        onOpenChange={setIsLeaveConfirmationModalOpen}
        onPrevOpenChange={onOpenChange}
        reset={reset}
      />
    </>
  );
}
