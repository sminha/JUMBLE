import { cn } from '@/utils/cn';
import { ValueLabel } from '@/types/value-label';
import { Status, STATUS, STATUS_STYLE } from '@/constants/status';
import caretDownIcon from '@/assets/caret-down-icon.svg';

interface DropdownProps<T extends string | number> extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'onChange'
> {
  options: ValueLabel<T>[];
  value: T;
  placeholder?: string;
  status?: Status;
  errorMessage?: string;
  onChange: (value: T) => void;
}

export default function Dropdown<T extends string | number>({
  options,
  value,
  placeholder,
  status = STATUS.DEFAULT,
  errorMessage = '',
  onChange,
  className,
  ...props
}: DropdownProps<T>) {
  return (
    <div className="relative flex w-fit shrink-0 flex-col gap-[0.4rem]">
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          aria-invalid={status === STATUS.ERROR}
          className={cn(
            'font-14-r text-gray-6 w-full appearance-none rounded-[0.8rem] border bg-white p-[1.2rem] pr-[3.2rem] focus:outline-none',
            STATUS_STYLE[status],
            className,
          )}
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
