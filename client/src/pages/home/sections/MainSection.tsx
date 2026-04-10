import Button from '@/components/Button';
import kakao from '@/assets/kakao.png';
import arrow from '@/assets/arrow.svg';

export default function MainSection() {
  return (
    <section className="flex flex-col items-center gap-[9rem] pt-[16rem] pb-[6rem]">
      <div className="flex flex-col items-center gap-[4rem]">
        <h1 className="title-40-sb text-center">
          <span className="text-primary-3">번거로운 사입내역 관리를</span>
          <br />
          <span className="text-secondary-5">한 눈에, 한 번에.</span>
        </h1>
        <h2 className="title-22-sb text-primary-3 text-center">
          부담되는 유료 서비스, 번거로운 엑셀 관리
          <br />
          이제 Jumble로 부담없이 더 스마트하게 관리하세요
        </h2>
        <Button className="title-18-sb text-primary-5 relative w-[50rem] rounded-[1rem] bg-[#FDDC3F] py-[1.6rem]">
          <img src={kakao} className="absolute top-[1.8rem] left-[19rem] w-[2.2rem]" />
          <span className="pl-[6rem]">카카오 로그인</span>
        </Button>
      </div>
      <a href="#description">
        <img src={arrow} className="animate-float" />
      </a>
    </section>
  );
}
