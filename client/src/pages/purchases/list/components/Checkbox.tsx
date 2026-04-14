import { cn } from '@/utils/cn';
import checkIcon from '@/assets/check-icon.svg';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  children?: React.ReactNode;
}

const CHECKBOX_STYLE =
  'bg-gray-2 absolute h-[1.8rem] w-[1.8rem] rounded-[0.4rem] transition-opacity duration-150 ease-in-out';

export default function Checkbox({
  isChecked,
  onChange,
  children,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label className={cn('flex w-fit', children ? 'gap-[0.8rem]' : 'gap-0')}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        className="sr-only"
        {...props}
      />
      <div className={cn('relative h-[1.8rem] w-[1.8rem]', className)}>
        <div className={cn(CHECKBOX_STYLE, !isChecked ? 'opacity-100' : 'opacity-0', className)} />
        <img
          src={checkIcon}
          alt=""
          aria-hidden="true"
          className={cn(CHECKBOX_STYLE, isChecked ? 'opacity-100' : 'opacity-0', className)}
        />
      </div>
      <span className="font-14-m text-gray-5">{children}</span>
    </label>
  );
}
