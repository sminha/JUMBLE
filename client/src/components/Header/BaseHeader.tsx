import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { PATHS } from '@/router';
import logoIcon from '@/assets/logo-icon.png';
import logoText from '@/assets/logo-text.png';
import { STORAGE_KEYS } from '@/constants/storage';

interface BaseHeaderProps {
  children: ReactNode;
}

export default function BaseHeader({ children }: BaseHeaderProps) {
  const isLogin = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  return (
    <header className="border-b-gray-1 relative flex h-[5.6rem] w-full justify-between border-b-[0.1rem] bg-white px-[clamp(2rem,calc(11vw-5.4rem),6.4rem)]">
      <Link
        to={isLogin ? PATHS.PURCHASE_LIST : PATHS.HOME}
        className="flex items-center"
        aria-label={isLogin ? '조회 페이지로 이동' : '홈으로 이동'}
      >
        <img src={logoIcon} className="w-[3rem]" />
        <img src={logoText} className="hidden w-[8rem] sm:flex" />
      </Link>
      {children}
    </header>
  );
}
