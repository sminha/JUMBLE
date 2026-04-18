import { ReactNode } from 'react';
import { UseFormRegister, Path, FieldErrors, get } from 'react-hook-form';
import { Purchase } from '@jumble/shared';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/Dialog';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { STATUS } from '@/constants/status';

export interface ModalProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  leftLabel: ReactNode;
  rightLabel: ReactNode;
  onLeftClick: () => void;
  onRightClick: () => void;
  children: ReactNode;
}

export default function Modal({
  title,
  open,
  onOpenChange,
  onOpenChangeComplete,
  leftLabel,
  rightLabel,
  onLeftClick,
  onRightClick,
  children,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      <DialogContent className="flex flex-col gap-[3.2rem] p-[5rem]" showCloseButton>
        <DialogHeader>
          <DialogTitle className="title-16-sb text-gray-9">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[1.6rem]">{children}</div>
        <DialogFooter className="flex flex-row justify-end gap-[0.8rem] border-none bg-white">
          <Button size="medium" variant="white" className="w-[10rem]" onClick={onLeftClick}>
            {leftLabel}
          </Button>
          <Button size="medium" variant="primary" className="w-[10rem]" onClick={onRightClick}>
            {rightLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ModalRowProps = {
  label: ReactNode;
  value: ReactNode;
  inputType?: string;
  isEditing?: boolean;
  field?: Path<Purchase>;
  register?: UseFormRegister<Purchase>;
  errors?: FieldErrors<Purchase>;
};

export function ModalRow({
  label,
  value,
  inputType,
  isEditing,
  field,
  register,
  errors,
}: ModalRowProps) {
  return (
    <div className="flex gap-[0.8rem]">
      <span className="font-14-m text-gray-5 flex w-[8rem] shrink-0 items-center">{label}</span>
      {isEditing && field && register && errors ? (
        <Input
          type={inputType}
          {...register(field)}
          status={errors && get(errors, field) ? STATUS.ERROR : STATUS.DEFAULT}
        />
      ) : (
        <span className="font-14-m text-gray-8 w-[16rem] shrink-0">{value}</span>
      )}
    </div>
  );
}
