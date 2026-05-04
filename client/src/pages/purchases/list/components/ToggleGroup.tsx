import type { ReactNode } from 'react';
import { ValueLabel } from '@/types/value-label';
import { cn } from '@/utils/cn';

interface ToggleGroupProps<T> {
  toggleGroup: ValueLabel<T>[];
  selectedToggle: T | null;
  onChange: (selectedToggle: T) => void;
}

interface ToggleProps {
  isLast: boolean;
  isSelected: boolean;
  onChange: () => void;
  children: ReactNode;
}

export default function ToggleGroup<T>({
  toggleGroup,
  selectedToggle,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="border-gray-1 flex w-full overflow-hidden rounded-[0.6rem] border">
      {toggleGroup.map(({ value, label }, idx) => (
        <Toggle
          key={idx}
          isLast={idx === toggleGroup.length - 1}
          isSelected={value === selectedToggle}
          onChange={() => onChange(value)}
        >
          {label}
        </Toggle>
      ))}
    </div>
  );
}

function Toggle({ isLast, isSelected, onChange, children }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={isSelected}
      className={cn(
        'font-14-m flex-1 py-[0.8rem] text-center transition-colors duration-300 ease-in-out',
        isSelected ? 'bg-primary-3 text-white' : 'text-gray-5 bg-white',
        !isLast ? 'border-gray-1 border-r-1' : 'border-0',
      )}
    >
      {children}
    </button>
  );
}
