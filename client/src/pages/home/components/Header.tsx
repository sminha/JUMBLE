import BaseHeader from '@/components/BaseHeader';
import Button from '@/components/Button';
import kakao from '@/assets/kakao.png';

export default function Header() {
  return (
    <BaseHeader>
      <Button className="font-16-sb text-primary-5 relative rounded-[1rem] bg-[#FDDC3F] py-[0.9rem] pr-[1.6rem] pl-[4.2rem]">
        <img src={kakao} className="absolute top-[1.1rem] left-[1.6rem] w-[1.8rem]" />
        카카오 로그인
      </Button>
    </BaseHeader>
  );
}
