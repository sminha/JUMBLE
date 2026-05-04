import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Draft, GetPurchaseResponse, SortBy, SORT_ORDER, PurchaseRecord } from '@jumble/shared';
import { Button, Dropdown, useToast } from '@/components';
import { cn } from '@/utils/cn';
import { PATHS } from '@/router';
import filterIcon from '@/assets/filter-icon.svg';
import pageLastIcon from '@/assets/page-last-icon.svg';
import pagePrevIcon from '@/assets/page-prev-icon.svg';
import pageNextIcon from '@/assets/page-next-icon.svg';
import pageFirstIcon from '@/assets/page-first-icon.svg';
import Checkbox from '@/pages/purchases/list/components/Checkbox';
import PurchaseRow from '@/pages/purchases/list/components/PurchaseRow';
import PurchaseCard from '@/pages/purchases/list/components/PurchaseCard';
import ReceiptModal from '@/pages/purchases/list/components/ReceiptModal';
import UnstyledButton from '@/pages/purchases/list/components/UnstyledButton';
import BackorderModal from '@/pages/purchases/list/components/BackorderModal';
import { useSelection, usePagination } from '@/pages/purchases/list/hooks';
import {
  useDeleteProducts,
  useUpdateBackorders,
  exportPurchases,
} from '@/pages/purchases/list/apis';
import {
  TABLE_HEADERS,
  SORT_BY_LABEL,
  PAGE_SIZE_LABEL,
} from '@/pages/purchases/list/constants/result';

interface ResultSectionProps {
  params: Draft;
  setParams: React.Dispatch<React.SetStateAction<Draft>>;
  data: GetPurchaseResponse;
  isPending: boolean;
  isError: boolean;
}

export default function ResultSection({
  params,
  setParams,
  data,
  isPending,
  isError,
}: ResultSectionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [prevParams, setPrevParams] = useState(params);
  const [selectedReceiptPurchaseId, setSelectedReceiptPurchaseId] = useState<string | null>(null);
  const [selectedBackorderPurchaseId, setSelectedBackorderPurchaseId] = useState<string | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const { mutate: handleDeleteProducts } = useDeleteProducts();
  const { mutate: handleUpdateBackorders } = useUpdateBackorders();

  const { isAllSelected, handleToggleAll, handleToggleRow } = useSelection({
    records: data?.records ?? [],
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

  useEffect(() => {
    if (isError) toast.error('사입내역 조회에 실패했습니다.');
  }, [isError]);

  if (isPending) {
    return (
      <section className="flex h-[28rem] items-center justify-center rounded-[1.6rem] bg-white">
        <span className="font-14-r text-gray-4">조회 결과를 불러오고 있어요.</span>
      </section>
    );
  }

  if (isError || !data || data.records.length === 0) {
    return (
      <section className="flex h-[28rem] items-center justify-center rounded-[1.6rem] bg-white">
        <span className="font-14-r text-gray-4">조회 결과가 없어요.</span>
      </section>
    );
  }

  const { records, pagination } = data;

  if (prevParams !== params) {
    setPrevParams(params);
    setSelectedProductIds(new Set());
  }

  // 페이지사이즈 드롭다운 핸들러
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
  // 정렬 핸들러 (데스크탑)
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
  // 미송수량 모달 핸들러
  const handleBackorderModalOpenChange = (purchaseId: string, productId: string) => {
    setSelectedBackorderPurchaseId(purchaseId);
    setSelectedProductId(productId);
  };

  /* 모바일 전용 핸들러 */
  // 정렬 핸들러
  const handleSortBy = (sortBy: SortBy) => {
    setParams((prev) => ({ ...prev, page: 1, sortBy, sortOrder: SORT_ORDER.ASC }));
  };
  // 수정 핸들러
  const handleEditProduct = (record: PurchaseRecord) => {
    navigate(`${PATHS.PURCHASES}/${record.purchaseId}/products/${record.productId}`, {
      state: { background: location },
    });
  };
  // 삭제 핸들러
  const handleDeleteProduct = (record: PurchaseRecord) => {
    handleDeleteProducts(
      { productIds: [record.productId], purchaseIds: [record.purchaseId] },
      {
        onSuccess: () => toast.success('사입내역이 삭제되었습니다.'),
        onError: () => toast.error('사입내역 삭제에 실패했습니다.'),
      },
    );
  };

  return (
    <>
      {/* 모바일 */}
      <section className="flex flex-col gap-[1.2rem] rounded-[1.6rem] bg-white px-[1.6rem] py-[1.6rem] sm:hidden">
        {/* 상단 바 */}
        <div className="flex items-center justify-between">
          <UnstyledButton className="font-12-r text-gray-5 px-[0.8rem]" onClick={handleToggleAll}>
            전체 선택
          </UnstyledButton>
          <div className="flex items-center">
            <Dropdown
              options={SORT_BY_LABEL}
              value={params.sortBy}
              onChange={handleSortBy}
              className="border-none"
            />
            <Dropdown
              options={PAGE_SIZE_LABEL}
              value={params.limit}
              onChange={handleChangeLimit}
              className="border-none"
            />
          </div>
        </div>
        {/* 카드 목록 */}
        <div className="flex flex-col gap-[1.2rem]">
          {records.map((record) => (
            <PurchaseCard
              key={record.productId}
              record={record}
              isSelected={selectedProductIds.has(record.productId)}
              onToggle={() => handleToggleRow(record.productId)}
              onBackorderModalOpenChange={handleBackorderModalOpenChange}
              onReceiptModalOpenChange={setSelectedReceiptPurchaseId}
              onEdit={() => handleEditProduct(record)}
              onDelete={() => handleDeleteProduct}
            />
          ))}
        </div>
        {/* 페이지네이션 */}
        <div className="flex items-center justify-center gap-[2rem]">
          <UnstyledButton aria-label="앞 페이지로 이동" onClick={handleClickPrev}>
            <img src={pagePrevIcon} alt="" aria-hidden="true" />
          </UnstyledButton>
          <span className="font-14-r text-gray-6">
            {pagination.page} / {pagination.totalPages}
          </span>
          <UnstyledButton aria-label="뒤 페이지로 이동" onClick={handleClickNext}>
            <img src={pageNextIcon} alt="" aria-hidden="true" />
          </UnstyledButton>
        </div>
      </section>

      {/* 선택 플로팅 바 */}
      {selectedProductIds.size > 0 && (
        <div className="fixed right-[1.6rem] bottom-[2.4rem] left-[1.6rem] z-50 flex items-center justify-between rounded-[1.2rem] bg-white px-[1.6rem] py-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] sm:hidden">
          <span className="font-14-m text-gray-7">{selectedProductIds.size}개 선택됨</span>
          <div className="flex items-center gap-[0.8rem]">
            <Button size="small" variant="white" onClick={() => setSelectedProductIds(new Set())}>
              선택 해제
            </Button>
            <div className="bg-gray-2 h-[1.6rem] w-[0.1rem]" />
            <Button size="small" variant="primary" onClick={handleDelete}>
              선택삭제
            </Button>
            <Button size="small" variant="primary" onClick={handleEdit}>
              미송변경
            </Button>
          </div>
        </div>
      )}

      {/* 데스크탑 */}
      <section className="hidden flex-col gap-[2rem] rounded-[1.6rem] bg-white py-[3rem] pr-[2.4rem] pl-[3.8rem] sm:flex">
        {/* 상단 바 */}
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
                  onBackorderModalOpenChange={handleBackorderModalOpenChange}
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
      </section>

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
    </>
  );
}
