import addPage from '@/assets/add-page.png';
import viewPage from '@/assets/view-page.png';
import receiptPage from '@/assets/receipt-page.png';

const DESCRIPTION = [
  {
    image: addPage,
    description: '영수증 이미지만으로 사입내역을 한 번에 입력할 수 있어요',
  },
  {
    image: viewPage,
    description: '다양한 조건으로 사입내역을 손쉽게 필터링할 수 있어요',
  },
  {
    image: receiptPage,
    description: '수많은 종이 영수증을 보관할 필요 없도록 영수증 이미지까지 관리해요',
  },
];

export default function DescriptionSection() {
  return (
    <div id="description" className="flex flex-col gap-[16rem] py-[10rem]">
      {...DESCRIPTION.map(({ image, description }, idx) => (
        <section key={description} className="flex flex-col items-center gap-[7rem]">
          <div className="w-[80rem] rounded-[1.2rem] border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center gap-[0.6rem] px-[1.6rem] py-[1.2rem]">
              <span className="h-[1.2rem] w-[1.2rem] rounded-full bg-[#FF5F57]" />
              <span className="h-[1.2rem] w-[1.2rem] rounded-full bg-[#FEBC2E]" />
              <span className="h-[1.2rem] w-[1.2rem] rounded-full bg-[#28C840]" />
            </div>
            <div className="rounded-[1.2rem] bg-white pr-[1rem] pb-[1rem] pl-[1rem]">
              <img src={image} />
            </div>
          </div>
          <h3 className="title-22-m text-primary-5">{description}</h3>
        </section>
      ))}
    </div>
  );
}
