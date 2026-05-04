import { Draft, DATE_LABEL, PERIOD_LABEL } from '@jumble/shared';
import { Input, Button, Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components';
import Checkbox from '@/pages/purchases/list/components/Checkbox';
import ToggleGroup from '@/pages/purchases/list/components/ToggleGroup';

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  onSearch: () => void;
}

export default function FilterDrawer({
  open,
  onOpenChange,
  draft,
  setDraft,
  onSearch,
}: FilterDrawerProps) {
  const handleSearch = () => {
    onSearch();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="sr-only">필터</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-[3rem] px-[2rem] pb-[2.6rem]">
          {/* 조회기간 */}
          <div className="flex flex-col gap-[1.2rem]">
            <h2 className="title-16-m text-gray-9">조회기간</h2>
            <ToggleGroup
              toggleGroup={DATE_LABEL}
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
            <div className="flex gap-[0.8rem]" onPointerDown={(e) => e.stopPropagation()}>
              <Input
                type="date"
                aria-label="조회 시작일"
                max={draft.endDate}
                value={draft.startDate}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                    periodType: null,
                  }))
                }
                className="border-gray-1 text-gray-5 w-full"
              />
              <Input
                type="date"
                aria-label="조회 종료일"
                min={draft.startDate}
                max={new Date().toISOString().split('T')[0]}
                value={draft.endDate}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                    periodType: null,
                  }))
                }
                className="border-gray-1 text-gray-5 w-full"
              />
            </div>
          </div>
          {/* 상세조건 */}
          <div className="flex flex-col gap-[1.2rem]">
            <h2 className="title-16-m text-gray-9">상세조건</h2>
            <Checkbox
              isChecked={draft.isBackorderOnly}
              onChange={(v) => setDraft((prev) => ({ ...prev, isBackorderOnly: v }))}
            >
              미송건만 조회
            </Checkbox>
          </div>
          {/* 검색버튼 */}
          <div className="flex justify-end">
            <Button
              size="medium"
              variant="primary"
              onClick={handleSearch}
              className="flex flex-1 justify-center rounded-[0.4rem]"
            >
              검색
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
