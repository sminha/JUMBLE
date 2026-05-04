import { cn } from '@/utils/cn';
import { type ReactNode } from 'react';

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  isSelected: boolean;
  children: ReactNode;
}

const CHIP_BASE =
  'font-14-m shrink-0 rounded-full px-[1.2rem] py-[0.6rem] transition-colors duration-150';
const CHIP_ACTIVE = 'bg-primary-3 text-white';
const CHIP_INACTIVE = 'bg-gray-1 text-gray-5';

export default function FilterChip({ onClick, isSelected, children }: FilterChipProps) {
  return (
    <button onClick={onClick} className={cn(CHIP_BASE, isSelected ? CHIP_ACTIVE : CHIP_INACTIVE)}>
      {children}
    </button>
  );
}
