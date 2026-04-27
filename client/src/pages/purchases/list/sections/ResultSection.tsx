import { useState } from 'react';
import { Draft, GetPurchaseResponse, SortBy, SORT_BY, SORT_ORDER } from '@jumble/shared';
import { Button, Dropdown, useToast } from '@/components';
import { cn } from '@/utils/cn';
import { ValueLabel } from '@/types/value-label';
import pageLastIcon from '@/assets/page-last-icon.svg';
import pagePrevIcon from '@/assets/page-prev-icon.svg';
import pageNextIcon from '@/assets/page-next-icon.svg';
import pageFirstIcon from '@/assets/page-first-icon.svg';
import filterIcon from '@/assets/filter-icon.svg';
import Checkbox from '../components/Checkbox';
import PurchaseRow from '../components/PurchaseRow';
import UnstyledButton from '../components/UnstyledButton';
import BackorderModal from '../components/BackorderModal';
import ReceiptModal from '../components/ReceiptModal';
import { useDeleteProducts, useUpdateBackorders, exportPurchases } from '../apis';
import { useSelection, usePagination } from '../hooks';

interface ResultSectionProps {
  params: Draft;
  setParams: React.Dispatch<React.SetStateAction<Draft>>;
  data: GetPurchaseResponse;
  isPending: boolean;
  isError: boolean;
}

const PAGE_SIZE = [50, 100, 200, 300] as const;
type PageSize = (typeof PAGE_SIZE)[number];
const PAGE_SIZE_LABEL: ValueLabel<PageSize>[] = [
  { value: PAGE_SIZE[0], label: '50개씩' },
  { value: PAGE_SIZE[1], label: '100개씩' },
  { value: PAGE_SIZE[2], label: '200개씩' },
  { value: PAGE_SIZE[3], label: '300개씩' },
];

const TABLE_HEADERS: { label: string; width: string; sortBy?: SortBy }[] = [
  { label: '', width: 'w-[4rem]' },
  { label: '사입번호', width: 'w-[16rem]' },
  { label: '상품사입번호', width: 'w-[16rem]' },
  { label: '사입일시', width: 'w-[18rem]', sortBy: SORT_BY.PURCHASED_AT },
  { label: '거래처명', width: 'w-[16rem]' },
  { label: '상품명', width: 'w-[16rem]' },
  { label: '구분', width: 'w-[10rem]' },
  { label: '컬러', width: 'w-[10rem]' },
  { label: '사이즈', width: 'w-[8rem]' },
  { label: '기타옵션', width: 'w-[14rem]' },
  { label: '단가', width: 'w-[12rem]', sortBy: SORT_BY.PRICE },
  { label: '수량', width: 'w-[8rem]', sortBy: SORT_BY.QUANTITY },
  { label: '금액합계', width: 'w-[12rem]', sortBy: SORT_BY.TOTAL_PRICE },
  { label: '미송수량', width: 'w-[8rem]', sortBy: SORT_BY.BACKORDER_QUANTITY },
  { label: '영수증', width: 'w-[10rem]' },
];

export default function ResultSection({
  params,
  setParams,
  data,
  isPending,
  isError,
}: ResultSectionProps) {
  const { toast } = useToast();
  const [selectedReceiptPurchaseId, setSelectedReceiptPurchaseId] = useState<string | null>(null);
  const [selectedBackorderPurchaseId, setSelectedBackorderPurchaseId] = useState<string | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const { mutate: handleDeleteProducts } = useDeleteProducts();
  const { mutate: handleUpdateBackorders } = useUpdateBackorders();

  const { isAllSelected, handleToggleAll, handleToggleRow } = useSelection({
    records: data?.records,
    selectedProductIds,
    setSelectedProductIds,
  });
  const {
    handleClickPrev,
    handleClickNext,
    handleClickFirst,
    handleClickLast,
    handleClickPagination,
  } = usePagination({ setParams, totalPages: data?.pagination?.totalPages });

  if (isPending) {
    return (
      <section className="flex h-[28rem] items-center justify-center rounded-[1.6rem] bg-white">
        <span className="font-14-r text-gray-4">조회 결과를 불러오고 있어요.</span>
      </section>
    );
  }

  const { records, pagination } = data;

  if (isError || !data || records.length === 0) {
    if (isError || !data) {
      toast.error('사입내역 조회에 실패했습니다.');
    }

    return (
      <section className="flex h-[28rem] items-center justify-center rounded-[1.6rem] bg-white">
        <span className="font-14-r text-gray-4">조회 결과가 없어요.</span>
      </section>
    );
  }

  // 드롭다운 핸들러
  const handleChangeLimit = (newLimit: number) => {
    setParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const getSelectedIds = () => {
    return {
      productIds: [...selectedProductIds],
      purchaseIds: [
        ...new Set(
          records.filter((r) => selectedProductIds.has(r.productId)).map((r) => r.purchaseId),
        ),
      ],
    };
  };
  // 선택삭제 핸들러
  const handleDelete = () => {
    const { productIds, purchaseIds } = getSelectedIds();

    if (productIds.length === 0) {
      toast.error('최소 1개 이상의 내역을 선택해주세요.');
      return;
    }

    handleDeleteProducts(
      { productIds, purchaseIds },
      {
        onSuccess: () => {
          toast.success('사입내역이 삭제되었습니다.');
          setSelectedProductIds(new Set());
        },
        onError: () => {
          toast.error('사입내역 삭제에 실패했습니다.');
        },
      },
    );
  };
  // 미송 일괄변경 핸들러
  const handleEdit = () => {
    const { productIds, purchaseIds } = getSelectedIds();

    if (productIds.length === 0) {
      toast.error('최소 1개 이상의 내역을 선택해주세요.');
      return;
    }

    handleUpdateBackorders(
      { productIds, purchaseIds },
      {
        onSuccess: () => {
          toast.success('미송수량이 변경되었습니다.');
          setSelectedProductIds(new Set());
        },
        onError: () => {
          toast.error('미송수량 변경에 실패했습니다.');
        },
      },
    );
  };
  // 엑셀 다운로드 핸들러
  const handleDownload = async () => {
    try {
      await exportPurchases(params);
    } catch {
      toast.error('엑셀 다운로드에 실패했습니다.');
    }
  };
  // 정렬 핸들러
  const handleSort = (sortBy: SortBy) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      sortBy: sortBy!,
      sortOrder:
        prev.sortBy === sortBy
          ? prev.sortOrder === SORT_ORDER.DESC
            ? SORT_ORDER.ASC
            : SORT_ORDER.DESC
          : SORT_ORDER.DESC,
    }));
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
                      isFirst && 'left-0 z-20 pr-[0.2rem] pl-[1rem]',
                    )}
                  >
                    {isFirst && <Checkbox isChecked={isAllSelected} onChange={handleToggleAll} />}
                    {header.label}
                    {header.sortBy && (
                      <UnstyledButton
                        aria-label={`${header.label} 정렬`}
                        onClick={() => handleSort(header.sortBy!)}
                      >
                        <img src={filterIcon} alt="" aria-hidden="true" className="ml-[1rem]" />
                      </UnstyledButton>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <PurchaseRow
                key={record.productId}
                record={record}
                isSelected={selectedProductIds.has(record.productId)}
                onToggle={() => handleToggleRow(record.productId)}
                onBackorderModalOpenChange={(purchaseId, productId) => {
                  setSelectedBackorderPurchaseId(purchaseId);
                  setSelectedProductId(productId);
                }}
                onReceiptModalOpenChange={setSelectedReceiptPurchaseId}
              />
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
        {Array.from({ length: pagination.totalPages }).map((_, idx) => (
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

      {selectedBackorderPurchaseId && selectedProductId && (
        <BackorderModal
          purchaseId={selectedBackorderPurchaseId}
          productId={selectedProductId}
          open
          onOpenChange={(open) => !open && setSelectedBackorderPurchaseId(null)}
        />
      )}
      {selectedReceiptPurchaseId && (
        <ReceiptModal
          purchaseId={selectedReceiptPurchaseId}
          open
          onOpenChange={(open) => !open && setSelectedReceiptPurchaseId(null)}
        />
      )}
    </section>
  );
}
