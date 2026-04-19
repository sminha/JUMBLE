import { ReactNode } from 'react';
import {
  get,
  Path,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Control,
  Controller,
  RegisterOptions,
} from 'react-hook-form';
import { cn } from '@/utils/cn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/Dialog';
import Input from '@/components/Input';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import { STATUS } from '@/constants/status';
import { ValueLabel } from '@/types/value-label';

export interface ModalProps {
  title: string;
  hideTitle?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  showCloseButton?: boolean;
  leftLabel: ReactNode;
  rightLabel: ReactNode;
  onLeftClick: () => void;
  onRightClick: () => void;
  buttonClassName?: string;
  children: ReactNode;
}

export default function Modal({
  title,
  hideTitle = false,
  open,
  onOpenChange,
  onOpenChangeComplete,
  showCloseButton = true,
  leftLabel,
  rightLabel,
  onLeftClick,
  onRightClick,
  buttonClassName,
  children,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      <DialogContent
        showCloseButton={showCloseButton}
        className="flex max-h-[90vh] flex-col gap-[3.2rem] overflow-y-auto p-[5rem]"
      >
        <DialogHeader>
          <DialogTitle className={cn('title-16-sb text-gray-9', hideTitle && 'sr-only')}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[1.6rem]">{children}</div>
        <DialogFooter className="flex flex-row justify-end gap-[0.8rem] border-none bg-white">
          <Button
            size="medium"
            variant="white"
            className={cn('w-[10rem]', buttonClassName)}
            onClick={onLeftClick}
          >
            {leftLabel}
          </Button>
          <Button
            size="medium"
            variant="primary"
            className={cn('w-[10rem]', buttonClassName)}
            onClick={onRightClick}
          >
            {rightLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ModalRowProps<T extends FieldValues> = {
  label: ReactNode;
  value: ReactNode;
  numeric?: boolean;
  inputType?: string;
  isEditing?: boolean;
  field?: Path<T>;
  register?: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T>;
  errors?: FieldErrors<T>;
  className?: string;
} & (
  | { rowType?: 'input' | 'disabled'; control?: never; options?: never }
  | { rowType: 'dropdown'; control: Control<T>; options: ValueLabel<string | number>[] }
);

export function ModalRow<T extends FieldValues>({
  label,
  value,
  numeric,
  inputType,
  isEditing,
  field,
  register,
  registerOptions,
  errors,
  rowType = 'input',
  control,
  options,
  className,
}: ModalRowProps<T>) {
  const renderEditingField = () => {
    if (rowType === 'dropdown' && field && control && options) {
      return (
        <Controller
          name={field}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Dropdown
              options={options}
              value={value}
              onChange={onChange}
              status={error ? STATUS.ERROR : STATUS.DEFAULT}
            />
          )}
        />
      );
    }

    if (rowType === 'disabled') {
      return <Input type={inputType} value={value as string | number} disabled readOnly />;
    }

    if (field && register && errors) {
      return (
        <Input
          type={inputType}
          numeric={numeric}
          {...register(field, registerOptions)}
          status={get(errors, field) ? STATUS.ERROR : STATUS.DEFAULT}
        />
      );
    }
  };

  return (
    <div className={cn('flex gap-[0.8rem]', className)}>
      <span className="font-14-m text-gray-5 flex w-[8rem] shrink-0 items-center">{label}</span>
      {isEditing ? (
        renderEditingField()
      ) : (
        <span className="font-14-m text-gray-8 w-[16rem] shrink-0">{value}</span>
      )}
    </div>
  );
}
