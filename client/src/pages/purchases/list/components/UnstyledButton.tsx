import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface UnstyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function UnstyledButton({ children, className, ...props }: UnstyledButtonProps) {
  return (
    <button
      type="button"
      className={cn('cursor-pointer appearance-none border-none bg-transparent p-0', className)}
      {...props}
    >
      {children}
    </button>
  );
}
