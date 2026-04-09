import { ButtonHTMLAttributes } from "react";
import deleteIcon from "@/assets/delete.png";
import { cn } from "@/utils/cn";

interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
}

export default function DeleteButton({
  onClick,
  className,
  ...props
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("h-[1.6rem] w-[1.6rem]", className)}
      {...props}
    >
      <img src={deleteIcon} />
    </button>
  );
}
