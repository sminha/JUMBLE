import { useState } from 'react';
import { Draft, FILTER_LABEL, DATE_LABEL, PERIOD_LABEL } from '@jumble/shared';
import { Input, Button, useToast } from '@/components';
import Checkbox from '@/pages/purchases/list/components/Checkbox';
import FilterBar from '@/pages/purchases/list/components/FilterBar';
import AddonInput from '@/pages/purchases/list/components/AddonInput';
import TogglePair from '@/pages/purchases/list/components/TogglePair';
import ToggleGroup from '@/pages/purchases/list/components/ToggleGroup';
import FilterDrawer from '@/pages/purchases/list/components/FilterDrawer';

interface FilterSectionProps {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  // 둘 다 검색 핸들러지만, onSearch는 검색버튼 클릭 시, onDirectSearch는 필터칩 클릭 시
  onSearch: () => void;
  onInstantSearch: (partial: Partial<Draft>) => void;
}

export default function FilterSection({
  draft,
  setDraft,
  onSearch,
  onInstantSearch,
}: FilterSectionProps) {
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleSearch = () => {
    if (draft.periodType === null && (!draft.startDate || !draft.endDate)) {
      toast.error('조회기간을 정확히 입력해주세요.');
      return;
    }
    onSearch();
  };

  return (
    <>
      {/* 모바일 */}
      <section className="flex flex-col gap-[1.2rem] rounded-[1.6rem] bg-white px-[1.6rem] py-[1.6rem] sm:hidden">
        <AddonInput
          filters={FILTER_LABEL}
          selectedFilter={draft.filterType}
          keyword={draft.keyword}
          onChangeFilter={(v) => setDraft((prev) => ({ ...prev, filterType: v }))}
          onChangeKeyword={(v) => setDraft((prev) => ({ ...prev, keyword: v }))}
          hasSearchIcon={true}
          onSearch={handleSearch}
        />
        <FilterBar
          draft={draft}
          onInstantSearch={onInstantSearch}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
        <FilterDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          draft={draft}
          setDraft={setDraft}
          onSearch={handleSearch}
        />
      </section>

      {/* 데스크탑 */}
      <section className="hidden w-fit flex-col gap-[0.8rem] rounded-[1.6rem] bg-white px-[3.8rem] py-[3rem] sm:flex">
        <div className="flex gap-[3.6rem]">
          {/* 조회기간 */}
          <div className="flex gap-[2.4rem]">
            <h2 className="title-16-m text-gray-9 my-[1rem] shrink-0">조회기간</h2>
            <div className="flex flex-col gap-[1.6rem]">
              <TogglePair
                togglePair={DATE_LABEL}
                selectedToggle={draft.dateType}
                onChange={(v) => setDraft((prev) => ({ ...prev, dateType: v }))}
              />
              <ToggleGroup
                toggleGroup={PERIOD_LABEL}
                selectedToggle={draft.periodType}
                onChange={(v) =>
                  setDraft((prev) => ({ ...prev, periodType: v, startDate: '', endDate: '' }))
                }
              />
              <div className="flex gap-[0.8rem]">
                <Input
                  type="date"
                  aria-label="조회 시작일"
                  max={draft.endDate}
                  value={draft.startDate}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, startDate: e.target.value, periodType: null }))
                  }
                  className="border-gray-1 text-gray-5 w-[16rem]"
                />
                <Input
                  type="date"
                  aria-label="조회 종료일"
                  min={draft.startDate}
                  max={new Date().toISOString().split('T')[0]}
                  value={draft.endDate}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, endDate: e.target.value, periodType: null }))
                  }
                  className="border-gray-1 text-gray-5 w-[16rem]"
                />
              </div>
            </div>
          </div>
          {/* 상세조건 */}
          <div className="flex gap-[2.4rem]">
            <h2 className="title-16-m text-gray-0 my-[1rem] shrink-0">상세조건</h2>
            <div className="flex flex-col gap-[1.6rem]">
              <AddonInput
                filters={FILTER_LABEL}
                selectedFilter={draft.filterType}
                keyword={draft.keyword}
                onChangeFilter={(v) => setDraft((prev) => ({ ...prev, filterType: v }))}
                onChangeKeyword={(v) => setDraft((prev) => ({ ...prev, keyword: v }))}
              />
              <Checkbox
                isChecked={draft.isBackorderOnly}
                onChange={(v) => setDraft((prev) => ({ ...prev, isBackorderOnly: v }))}
              >
                미송건만 조회
              </Checkbox>
            </div>
          </div>
        </div>
        {/* 검색버튼 */}
        <div className="flex justify-end">
          <Button size="medium" variant="primary" onClick={handleSearch}>
            검색
          </Button>
        </div>
      </section>
    </>
  );
}
