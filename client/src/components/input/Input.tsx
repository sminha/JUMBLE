import { cn } from '@/utils/cn';
import { Status, STATUS, STATUS_STYLE } from '@/constants/status';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  numeric?: boolean;
  status?: Status;
  errorMessage?: string;
}

const NUMERIC_ALLOWED_KEYS = [
  'Backspace',
  'Delete',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
];

export default function Input({
  type = 'text',
  disabled = false,
  numeric = false,
  status = STATUS.DEFAULT,
  errorMessage = '',
  className,
  onChange,
  onKeyDown,
  ...props
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (numeric) {
      e.target.value = e.target.value.replace(/\D/g, '');
    }
    onChange?.(e);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      numeric &&
      !/^\d$/.test(e.key) &&
      !NUMERIC_ALLOWED_KEYS.includes(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return (
    <div className="relative flex w-full flex-col gap-[0.4rem]">
      <input
        type={type}
        disabled={disabled}
        className={cn(
          'font-14-r text-gray-6 placeholder:text-gray-4 rounded-[0.8rem] border bg-white p-[1.2rem]',
          disabled && 'bg-gray-1 cursor-not-allowed',
          STATUS_STYLE[status],
          className,
        )}
        aria-invalid={status === STATUS.ERROR}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
