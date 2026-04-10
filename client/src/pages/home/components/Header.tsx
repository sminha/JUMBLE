import BaseHeader from '@/components/BaseHeader';
import KakaoLoginButton from './KakaoLoginButton';

export default function Header() {
  return (
    <BaseHeader>
      <KakaoLoginButton
        buttonClassName="font-16-sb py-[0.9rem] pr-[1.6rem] pl-[4.2rem]"
        imageClassName="top-[1.1rem] left-[1.6rem] w-[1.8rem]"
      />
    </BaseHeader>
  );
}
