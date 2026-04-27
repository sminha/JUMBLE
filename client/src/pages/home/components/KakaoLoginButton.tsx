import { cn } from '@/utils/cn';
import kakaoIcon from '@/assets/kakao-icon.svg';
import { Button } from '@/components';

interface KakaoLoginButtonProps {
  buttonClassName?: string;
  imageClassName?: string;
}

export default function KakaoLoginButton({
  buttonClassName,
  imageClassName,
}: KakaoLoginButtonProps) {
  const handleKakaoLogin = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/kakao`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    const { redirectUrl } = await res.json();
    window.location.href = redirectUrl;
  };

  return (
    <Button
      aria-label="카카오 로그인"
      onClick={handleKakaoLogin}
      className={cn('text-primary-5 relative rounded-[1rem] bg-[#FDDC3F]', buttonClassName)}
    >
      <img src={kakaoIcon} alt="" aria-hidden="true" className={cn('absolute', imageClassName)} />
      카카오 로그인
    </Button>
  );
}
