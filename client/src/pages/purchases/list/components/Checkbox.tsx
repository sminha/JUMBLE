import { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import checkIcon from '@/assets/check-icon.svg';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  children: React.ReactNode;
}

const CHECKBOX_STYLE =
  'bg-gray-2 absolute h-[2rem] w-[2rem] rounded-[0.4rem] transition-opacity duration-150 ease-in-out';

export default function Checkbox({ isChecked, onChange, children }: CheckboxProps) {
  return (
    <label className="flex w-fit gap-[0.8rem]">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onChange(!isChecked)}
        className="sr-only"
      />
      <div className="relative h-[2rem] w-[2rem]">
        <div className={cn(CHECKBOX_STYLE, !isChecked ? 'opacity-100' : 'opacity-0')} />
        <img
          src={checkIcon}
          className={cn(CHECKBOX_STYLE, isChecked ? 'opacity-100' : 'opacity-0')}
        />
      </div>
      <span className="font-14-m text-gray-5">{children}</span>
    </label>
  );
}
