import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, CATEGORY_LABEL, CATEGORY_LABEL_NEW } from '@jumble/shared';
import LeaveConfirmationModal from '@/components/LeaveConfirmationModal';
import { formatPrice, formatDate } from '@/utils/format';
import Modal, { ModalRow } from '@/components/Modal';
import { cn } from '@/utils/cn';
import { useGetProduct } from '../apis';

interface ProductModalProps {
  purchaseId: string;
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductModal({
  purchaseId,
  productId,
  open,
  onOpenChange,
}: ProductModalProps) {
  const { data, isPending } = useGetProduct(purchaseId, productId, open);
  const [isLeaveConfirmationModalOpen, setIsLeaveConfirmationModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });
  const [price, quantity] = useWatch({ control, name: ['price', 'quantity'] });
  const totalPrice = (price || 0) * (quantity || 0) || 0;

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

  const handleOpenChange = (newOpen: boolean) => {
    if (isEditing) {
      setIsLeaveConfirmationModalOpen(true);
      return;
    }
    onOpenChange(newOpen);
  };

  const handleRemove = () => {
    // TODO: 상품 사입내역 삭제 API 연동
    console.log(productId);
    onOpenChange(false);
  };
  const handleSave = handleSubmit((data) => {
    // TODO: 상품 사입내역 수정 API 연동
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
        title="상품 사입내역 조회"
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
        <ModalRow label="사입일시" value={formatDate(data.purchasedAt)} />
        <ModalRow label="거래처명" value={data.vendor} />
        <div
          className={cn(
            'grid grid-cols-2 gap-x-[1.6rem]',
            isEditing ? 'gap-y-[0.8rem]' : 'gap-y-[1.6rem]',
          )}
        >
          <ModalRow
            label="상품명"
            value={data.name}
            isEditing={isEditing}
            field="name"
            register={register}
            errors={errors}
            className="col-span-2"
          />
          <ModalRow
            label="구분"
            value={CATEGORY_LABEL_NEW[data.category]}
            isEditing={isEditing}
            field="category"
            register={register}
            errors={errors}
            rowType="dropdown"
            control={control}
            options={CATEGORY_LABEL}
          />
          <ModalRow
            label="컬러"
            value={data.color}
            isEditing={isEditing}
            field="color"
            register={register}
            errors={errors}
          />
          <ModalRow
            label="사이즈"
            value={data.size}
            isEditing={isEditing}
            field="size"
            register={register}
            errors={errors}
          />
          <ModalRow
            label="옵션"
            value={data.option}
            isEditing={isEditing}
            field="option"
            register={register}
            errors={errors}
          />
          <ModalRow
            label="단가"
            value={`${formatPrice(data.price)}원`}
            numeric
            isEditing={isEditing}
            field="price"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            errors={errors}
          />
          <ModalRow
            label="수량"
            value={`${data.quantity}개`}
            numeric
            isEditing={isEditing}
            field="quantity"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            errors={errors}
          />
          <ModalRow
            label="금액합계"
            value={`${formatPrice(totalPrice)}${isEditing ? '' : '원'}`}
            isEditing={isEditing}
            rowType="disabled"
          />
          <ModalRow
            label="미송수량"
            value={`${data.backorderQuantity}개`}
            numeric
            isEditing={isEditing}
            field="backorderQuantity"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            errors={errors}
          />
        </div>
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
