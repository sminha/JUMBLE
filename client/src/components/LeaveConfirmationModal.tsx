import Modal from '@/components/Modal';
import { FieldValues, UseFormReset } from 'react-hook-form';

interface LeaveConfirmationModalProps<T extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditingChange?: (editing: boolean) => void;
  onPrevOpenChange?: (open: boolean) => void;
  reset: UseFormReset<T>;
}

export default function LeaveConfirmationModal<T extends FieldValues>({
  open,
  onOpenChange,
  onEditingChange,
  onPrevOpenChange,
  reset,
}: LeaveConfirmationModalProps<T>) {
  const handleLeave = () => {
    onOpenChange(false);
    reset();

    if (onEditingChange) {
      onEditingChange(false);
    }

    if (onPrevOpenChange) {
      onPrevOpenChange(false);
    }
  };
  const handleEdit = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      leftLabel="나갈래요"
      rightLabel="계속 수정할래요"
      onLeftClick={handleLeave}
      onRightClick={handleEdit}
      buttonClassName="w-full"
    >
      <span className="font-16-m text-gray-8 mt-[1rem] text-center">
        현재 페이지를 벗어나면 수정내역이 사라져요.
        <br />
        그래도 나가시겠어요?
      </span>
    </Modal>
  );
}
