import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@jumble/shared';
import { STATUS } from '@/constants/status';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import LeaveConfirmationModal from '@/components/LeaveConfirmationModal';
import { PRODUCT_DETAIL_MOCK } from '../mocks/mock';
import UnstyledButton from './UnstyledButton';

interface BackorderModalProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BackorderModal({ productId, open, onOpenChange }: BackorderModalProps) {
  const data = PRODUCT_DETAIL_MOCK.data;

  const [isLeaveConfirmationModalOpen, setIsLeaveConfirmationModalOpen] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: data,
  });
  const backorderQuantity = useWatch({ control, name: 'backorderQuantity' });

  const handleOpenChange = () => {
    setIsLeaveConfirmationModalOpen(true);
  };

  const handleSave = handleSubmit((data) => {
    // TODO: 미송수량 수정 API 연동
    console.log(data);
    console.log(productId);
  });
  const handleCancel = () => {
    setIsLeaveConfirmationModalOpen(true);
  };

  const handleMinus = () => {
    setValue('backorderQuantity', Math.max(0, backorderQuantity - 1));
  };
  const handlePlus = () => {
    setValue('backorderQuantity', Math.min(data.quantity, backorderQuantity + 1));
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
              {...register('backorderQuantity', { valueAsNumber: true })}
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
