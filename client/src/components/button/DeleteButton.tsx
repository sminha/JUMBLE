import xIcon from '@/assets/x-icon.svg';
import { cn } from '@/utils/cn';

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
}

export default function DeleteButton({ onClick, className, ...props }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('h-[1.6rem] w-[1.6rem]', className)}
      {...props}
    >
      <img src={xIcon} />
    </button>
  );
}
