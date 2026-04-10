import { NavLink } from 'react-router';
import { PATHS } from '@/router';
import defaultProfile from '@/assets/default-profile.png';
import BaseHeader from './BaseHeader';

const NAVLINK_STYLE = ({ isActive }: { isActive: boolean }) =>
  `title-16-m ${isActive ? 'text-primary-3' : 'text-gray-4'}`;

export default function Header() {
  // [TODO] 라우팅 변경
  return (
    <BaseHeader>
      <div className="flex items-center gap-[4.2rem]">
        <nav>
          <ul className="flex gap-[3rem]">
            <li>
              <NavLink
                to={PATHS.PURCHASELIST}
                className={NAVLINK_STYLE}
                aria-label="조회 페이지로 이동"
              >
                조회
              </NavLink>
            </li>
            <li>
              <NavLink
                to={PATHS.PURCHASENEW}
                className={NAVLINK_STYLE}
                aria-label="추가 페이지로 이동"
              >
                추가
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className={NAVLINK_STYLE} aria-label="대시보드로 이동">
                대시보드
              </NavLink>
            </li>
          </ul>
        </nav>
        <img src={defaultProfile} alt="사용자 프로필" className="w-[3.8rem]" />
      </div>
    </BaseHeader>
  );
}
