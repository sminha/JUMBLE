import { Link, NavLink } from 'react-router';
import logoIcon from '../assets/logo-icon.png';
import logoText from '../assets/logo-text.png';
import defaultProfile from '../assets/default-profile.png';

export default function Header() {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `title-16-m ${isActive ? 'text-primary-3' : 'text-gray-4'}`;

  // [TODO] 라우팅 변경
  return (
    <header className="border-b-gray-1 flex w-full justify-between border-b-[0.1rem] bg-white px-[6.4rem] py-[1.2rem]">
      <Link to="/" className="flex items-center" aria-label="홈으로 이동">
        <img src={logoIcon} className="w-[3rem]" />
        <img src={logoText} className="w-[8rem]" />
      </Link>
      <div className="flex items-center gap-[4.2rem]">
        <nav>
          <ul className="flex gap-[3rem]">
            <li>
              <NavLink to="/" className={navLinkStyle} aria-label="조회 페이지로 이동">
                조회
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className={navLinkStyle} aria-label="추가 페이지로 이동">
                추가
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className={navLinkStyle} aria-label="대시보드로 이동">
                대시보드
              </NavLink>
            </li>
          </ul>
        </nav>
        <img src={defaultProfile} alt="사용자 프로필" className="w-[3.8rem]" />
      </div>
    </header>
  );
}
