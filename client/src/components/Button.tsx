import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const SIZE_STYLE = {
  large: 'font-16-m px-[2.2rem] py-[1.2rem]',
  medium: 'font-14-m px-[2rem] py-[1rem]',
} as const;
const VARIANT_STYLE = {
  white: 'border-gray-3 border-1 text-gray-5 bg-white',
  primary: 'text-white bg-primary-3',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: keyof typeof SIZE_STYLE;
  variant: keyof typeof VARIANT_STYLE;
  children: ReactNode;
}

export default function Button({
  size,
  variant,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn('rounded-[5rem]', SIZE_STYLE[size], VARIANT_STYLE[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
