import { ReactNode } from 'react';
import { Link } from 'react-router';
import logoIcon from '@/assets/logo-icon.png';
import logoText from '@/assets/logo-text.png';

interface BaseHeaderProps {
  children: ReactNode;
}

export default function BaseHeader({ children }: BaseHeaderProps) {
  return (
    <header className="border-b-gray-1 flex w-full justify-between border-b-[0.1rem] bg-white px-[6.4rem] py-[1.2rem]">
      <Link to="/" className="flex items-center" aria-label="홈으로 이동">
        <img src={logoIcon} className="w-[3rem]" />
        <img src={logoText} className="w-[8rem]" />
      </Link>
      {children}
    </header>
  );
}
