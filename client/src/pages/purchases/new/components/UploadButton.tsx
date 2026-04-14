import { cn } from '@/utils/cn';

interface UploadButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onUpload: (file: File) => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function UploadButton({
  onUpload,
  isLoading,
  children,
  className,
  ...props
}: UploadButtonProps) {
  return (
    <>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
        {...props}
      />
      <label
        htmlFor="file-upload"
        className={cn(
          'bg-primary-3 font-14-r min-w-[15.2rem] cursor-pointer rounded-[1rem] px-[2rem] py-[1rem] text-center text-white',
          isLoading && 'bg-gray-2 text-gray-4 cursor-not-allowed',
          className,
        )}
      >
        {children}
      </label>
    </>
  );
}
