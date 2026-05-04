import { useState, useRef, useEffect } from 'react';
import UnstyledButton from '@/pages/purchases/list/components/UnstyledButton';

interface KebabMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function KebabMenu({ onEdit, onDelete }: KebabMenuProps) {
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setIsKebabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    onEdit();
    setIsKebabOpen(false);
  };
  const handleDelete = () => {
    onDelete();
    setIsKebabOpen(false);
  };

  return (
    <div ref={kebabRef} className="relative">
      <UnstyledButton
        className="font-16-r text-gray-4 px-[0.4rem]"
        onClick={() => setIsKebabOpen((prev) => !prev)}
      >
        ⋮
      </UnstyledButton>
      {isKebabOpen && (
        <div className="border-gray-1 absolute top-full right-0 z-10 mt-[0.4rem] flex min-w-20 flex-col overflow-hidden rounded-[0.8rem] border bg-white shadow-md">
          <UnstyledButton
            className="font-12-r text-gray-8 px-[1.6rem] py-[0.9rem]"
            onClick={handleEdit}
          >
            수정
          </UnstyledButton>
          <UnstyledButton
            className="font-12-r text-error px-[1.6rem] py-[0.9rem]"
            onClick={handleDelete}
          >
            삭제
          </UnstyledButton>
        </div>
      )}
    </div>
  );
}
