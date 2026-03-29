import { ReactNode } from 'react';

interface UploadButtonProps {
  children: ReactNode;
}

export default function UploadButton({ children }: UploadButtonProps) {
  return (
    <>
      <input id="file-upload" type="file" className="hidden" />
      <label
        htmlFor="file-upload"
        className="bg-primary-3 font-14-r cursor-pointer rounded-[1rem] px-[2rem] py-[1rem] text-white"
      >
        {children}
      </label>
    </>
  );
}
