import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import { Menu as Hamburger, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PATHS } from '@/router';
import defaultProfile from '@/assets/default-profile.png';
import BaseHeader from './BaseHeader';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <BaseHeader>
      {/* 데스크탑 */}
      <div className="hidden items-center gap-[4.2rem] sm:flex">
        <Menu ulClassName="gap-[3rem]" />
        <img src={defaultProfile} alt="사용자 프로필" className="w-[3.8rem]" />
      </div>

      {/* 모바일 */}
      <div ref={menuRef} className="flex items-center gap-[1.6rem] sm:hidden">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={24} className="text-gray-4" />
          ) : (
            <Hamburger size={24} className="text-gray-4" />
          )}
        </button>
        <div
          className={cn(
            'border-b-gray-1 absolute top-full right-0 left-0 z-50 overflow-hidden border-b bg-white transition-all duration-300',
            isMenuOpen ? 'max-h-[20rem]' : 'max-h-0',
          )}
        >
          <Menu
            navClassName="px-[2rem] py-[1.6rem]"
            ulClassName="flex-col gap-[1.6rem]"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
        <img src={defaultProfile} alt="사용자 프로필" className="w-[3.2rem]" />
      </div>
    </BaseHeader>
  );
}

interface MenuProps {
  navClassName?: string;
  ulClassName?: string;
  onClick?: () => void;
}

// [TODO] 대시보드 라우팅 변경
const MENUS = [
  { to: PATHS.PURCHASE_LIST, label: '조회', ariaLabel: '조회 페이지로 이동' },
  { to: PATHS.PURCHASE_NEW, label: '추가', ariaLabel: '추가 페이지로 이동' },
  { to: '/', label: '대시보드', ariaLabel: '대시보드 페이지로 이동' },
];
const NAVLINK_STYLE = ({ isActive }: { isActive: boolean }) =>
  `title-16-m ${isActive ? 'text-primary-3' : 'text-gray-4'}`;

function Menu({ navClassName, ulClassName, onClick }: MenuProps) {
  return (
    <nav className={navClassName}>
      <ul className={cn('flex', ulClassName)}>
        {MENUS.map(({ to, label, ariaLabel }) => (
          <li key={label}>
            <NavLink to={to} aria-label={ariaLabel} className={NAVLINK_STYLE} onClick={onClick}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
