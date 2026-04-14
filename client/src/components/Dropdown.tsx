import { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { Status, STATUS, STATUS_STYLE } from '@/constants/status';
import caretDownIcon from '@/assets/caret-down-icon.svg';

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
  status?: Status;
  errorMessage?: string;
}

export default function Dropdown({
  options,
  placeholder,
  status = STATUS.DEFAULT,
  errorMessage = '',
  className,
  ...props
}: DropdownProps) {
  return (
    <div className="relative flex w-full flex-col gap-[0.4rem]">
      <div className="relative w-full">
        <select
          className={cn(
            'font-14-r text-gray-6 w-full appearance-none rounded-[0.8rem] border bg-white p-[1.2rem] pr-[3.2rem] focus:outline-none',
            STATUS_STYLE[status],
            className,
          )}
          aria-invalid={status === STATUS.ERROR}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img src={caretDownIcon} className="absolute top-1/2 right-[1.2rem] -translate-y-1/2" />
      </div>
      {status === STATUS.ERROR && (
        <p className="font-12-r text-error absolute top-full left-[0.1rem] mt-[0.3rem]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
