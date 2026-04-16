import { useState } from 'react';
import { Draft, GetPurchaseRecordsResponse } from '@jumble/shared';
import { cn } from '@/utils/cn';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { ValueLabel } from '@/types/value-label';
import pageLastIcon from '@/assets/page-last-icon.svg';
import pagePrevIcon from '@/assets/page-prev-icon.svg';
import pageNextIcon from '@/assets/page-next-icon.svg';
import pageFirstIcon from '@/assets/page-first-icon.svg';
import Checkbox from '../components/Checkbox';
import PurchaseRow from '../components/PurchaseRow';
import UnstyledButton from '../components/UnstyledButton';

interface ResultSectionProps {
  params: Draft;
  setParams: React.Dispatch<React.SetStateAction<Draft>>;
  data: GetPurchaseRecordsResponse;
  isPending: boolean;
}

const PAGE_SIZE = [50, 100, 200, 300] as const;
type PageSize = (typeof PAGE_SIZE)[number];
const PAGE_SIZE_LABEL: ValueLabel<PageSize>[] = [
  { value: PAGE_SIZE[0], label: '50개씩' },
  { value: PAGE_SIZE[1], label: '100개씩' },
  { value: PAGE_SIZE[2], label: '200개씩' },
  { value: PAGE_SIZE[3], label: '300개씩' },
];

const TABLE_HEADERS: { label: string; width: string }[] = [
  { label: '', width: 'w-[4rem]' },
  { label: '사입번호', width: 'w-[16rem]' },
  { label: '상품사입번호', width: 'w-[16rem]' },
  { label: '사입일시', width: 'w-[18rem]' },
  { label: '거래처명', width: 'w-[16rem]' },
  { label: '상품명', width: 'w-[16rem]' },
  { label: '구분', width: 'w-[10rem]' },
  { label: '컬러', width: 'w-[10rem]' },
  { label: '사이즈', width: 'w-[8rem]' },
  { label: '기타옵션', width: 'w-[14rem]' },
  { label: '단가', width: 'w-[12rem]' },
  { label: '수량', width: 'w-[8rem]' },
  { label: '금액합계', width: 'w-[12rem]' },
  { label: '미송수량', width: 'w-[8rem]' },
  { label: '영수증', width: 'w-[10rem]' },
];

export default function ResultSection({ params, setParams, data, isPending }: ResultSectionProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  if (isPending) {
    return (
      <section className="flex h-[28rem] items-center justify-center rounded-[1.6rem] bg-white">
        <span className="font-14-r text-gray-4">조회 결과를 불러오고 있어요.</span>
      </section>
    );
  }

  const { records, pagination } = data;
  const totalPages = pagination.totalPages;

  if (records.length === 0) {
    return (
      <section className="flex h-[28rem] items-center justify-center rounded-[1.6rem] bg-white">
        <span className="font-14-r text-gray-4">조회 결과가 없어요.</span>
      </section>
    );
  }

  const handleChangeLimit = (newLimit: number) => {
    setParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };
  const handleDelete = () => {
    // TODO: 선택삭제 기능 구현
    alert('선택삭제');
  };
  const handleEdit = () => {
    // TODO: 미송 일괄변경 기능 구현
    alert('미송 일괄변경');
  };
  const handleDownload = () => {
    // TODO: 엑셀 다운로드 기능 구현
    alert('엑셀 다운로드');
  };
  const handleClickPrev = () => {
    setParams((prev) => ({ ...prev, page: prev.page !== 1 ? prev.page - 1 : 1 }));
  };
  const handleClickNext = () => {
    setParams((prev) => ({
      ...prev,
      page: prev.page !== totalPages ? prev.page + 1 : totalPages,
    }));
  };
  const handleClickFirst = () => {
    setParams((prev) => ({ ...prev, page: 1 }));
  };
  const handleClickLast = () => {
    setParams((prev) => ({ ...prev, page: totalPages }));
  };
  const handleClickPagination = (page: number) => {
    setParams((prev) => ({ ...prev, page: page }));
  };

  return (
    <section className="flex flex-col gap-[2rem] rounded-[1.6rem] bg-white py-[3rem] pr-[2.4rem] pl-[3.8rem]">
      {/* 전체 개수, 드롭다운, 버튼 3개 */}
      <div className="flex justify-between">
        <span className="font-14-m text-gray-9 flex shrink-0 items-center gap-[0.6rem]">
          전체 {pagination.total}
        </span>
        <div className="flex gap-[0.2rem]">
          <Dropdown
            options={PAGE_SIZE_LABEL}
            value={params.limit}
            onChange={(v) => handleChangeLimit(v)}
            className="border-none"
          />
          <div className="flex gap-[1rem]">
            <Button size="small" variant="white" onClick={handleDelete}>
              선택삭제
            </Button>
            <Button size="small" variant="white" onClick={handleEdit}>
              미송 일괄변경
            </Button>
            <Button size="small" variant="white" onClick={handleDownload}>
              엑셀 다운로드
            </Button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="max-h-[54rem] overflow-auto">
        <table className="min-w-max border-separate">
          <colgroup>
            {TABLE_HEADERS.map((header, idx) => (
              <col key={idx} className={header.width} />
            ))}
          </colgroup>
          <thead>
            <tr className="font-14-m text-gray-9">
              {TABLE_HEADERS.map((header, idx) => {
                const isFirst = idx === 0;

                return (
                  <th
                    key={idx}
                    className={cn(
                      'sticky top-0 z-10 bg-white py-[1.4rem] align-middle shadow-[0_1px_0_0_var(--color-gray-1)]',
                      isFirst && 'border-r-gray-1 left-0 z-20 border-r-1 pr-[0.2rem] pl-[1rem]',
                    )}
                  >
                    {isFirst ? (
                      <Checkbox isChecked={isChecked} onChange={setIsChecked} />
                    ) : (
                      header.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <PurchaseRow key={record.productId} record={record} />
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-[1.2rem]">
        <UnstyledButton aria-label="첫번째 페이지로 이동" onClick={handleClickFirst}>
          <img src={pageFirstIcon} alt="" aria-hidden="true" />
        </UnstyledButton>
        <UnstyledButton aria-label="앞 페이지로 이동" onClick={handleClickPrev}>
          <img src={pagePrevIcon} alt="" aria-hidden="true" />
        </UnstyledButton>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleClickPagination(idx + 1)}
            className={cn(
              'bg-gray-1 text-gray-4 h-[2.5rem] w-[2.5rem] rounded-[0.4rem]',
              pagination.page === idx + 1 && 'bg-primary-3 text-white',
            )}
          >
            {idx + 1}
          </button>
        ))}
        <UnstyledButton aria-label="뒤 페이지로 이동" onClick={handleClickNext}>
          <img src={pageNextIcon} alt="" aria-hidden="true" />
        </UnstyledButton>
        <UnstyledButton aria-label="마지막 페이지로 이동" onClick={handleClickLast}>
          <img src={pageLastIcon} alt="" aria-hidden="true" />
        </UnstyledButton>
      </div>
    </section>
  );
}
