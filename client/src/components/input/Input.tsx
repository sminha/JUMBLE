import { cn } from '@/utils/cn';
import { Search } from 'lucide-react';
import { Status, STATUS, STATUS_STYLE } from '@/constants/status';
import { SearchProps } from '@/pages/purchases/list/types/search';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  numeric?: boolean;
  status?: Status;
  errorMessage?: string;
}

type InputProps = BaseInputProps & SearchProps;

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
  hasSearchIcon = false,
  onSearch,
  onChange,
  onKeyDown,
  className,
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
          hasSearchIcon && 'pr-[3.8rem]',
          STATUS_STYLE[status],
          className,
        )}
        aria-invalid={status === STATUS.ERROR}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {hasSearchIcon === true && (
        <button
          onClick={onSearch}
          aria-label="검색"
          className="text-gray-5 absolute top-1/2 right-[1rem] shrink-0 -translate-y-1/2"
        >
          <Search size={20} />
        </button>
      )}
      {status === STATUS.ERROR && (
        <p className="font-12-r text-error absolute top-full left-[0.1rem] mt-[0.3rem]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
