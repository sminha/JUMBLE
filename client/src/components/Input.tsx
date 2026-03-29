import { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { Status, STATUS, STATUS_STYLE } from '@/constants/status';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  status?: Status;
  errorMessage?: string;
}

export default function Input({
  type = 'text',
  status = STATUS.DEFAULT,
  errorMessage = '',
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative flex w-full flex-col gap-[0.4rem]">
      <input
        type={type}
        className={cn(
          'font-14-r text-gray-6 placeholder:text-gray-4 rounded-[0.8rem] border bg-white p-[1.2rem]',
          STATUS_STYLE[status],
          className,
        )}
        aria-invalid={status === STATUS.ERROR}
        {...props}
      />
      {status === STATUS.ERROR && (
        <p className="font-12-r text-error absolute top-full left-[0.1rem] mt-[0.3rem]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
