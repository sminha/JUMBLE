import { cn } from '@/utils/cn';
import kakao from '@/assets/kakao.png';
import { Button } from '@/components';

interface KakaoLoginButtonProps {
  buttonClassName?: string;
  imageClassName?: string;
}

export default function KakaoLoginButton({
  buttonClassName,
  imageClassName,
}: KakaoLoginButtonProps) {
  const handleKakaoLogin = () =>
    (window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/kakao`);

  return (
    <Button
      className={cn('text-primary-5 relative rounded-[1rem] bg-[#FDDC3F]', buttonClassName)}
      onClick={handleKakaoLogin}
    >
      <img src={kakao} className={cn('absolute', imageClassName)} />
      카카오 로그인
    </Button>
  );
}
