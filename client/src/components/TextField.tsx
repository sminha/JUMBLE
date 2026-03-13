import { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const STATUS_STYLE = {
  default: 'border-gray-2 focus:border-primary-3',
  error: 'border-error',
} as const;

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  status?: keyof typeof STATUS_STYLE;
}

export default function TextField({ status = 'default', className, ...props }: TextFieldProps) {
  return (
    <input
      className={cn(
        'font-14-r text-gray-6 placeholder:text-gray-4 w-full rounded-[0.8rem] border bg-white p-[1.2rem]',
        STATUS_STYLE[status],
        className,
      )}
      aria-invalid={status === 'error'}
      {...props}
    />
  );
}
