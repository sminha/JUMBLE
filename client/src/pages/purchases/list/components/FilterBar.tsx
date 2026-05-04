import { SlidersHorizontal } from 'lucide-react';
import { Draft, DATE, PERIOD, PERIOD_LABEL } from '@jumble/shared';
import FilterChip from '@/pages/purchases/list/components/FilterChip';

interface FilterBarProps {
  draft: Draft;
  onInstantSearch: (partial: Partial<Draft>) => void;
  onOpenDrawer: () => void;
}

export default function FilterBar({ draft, onInstantSearch, onOpenDrawer }: FilterBarProps) {
  const isPeriodActive =
    (draft.periodType !== null && draft.periodType !== PERIOD.ALL) ||
    (!!draft.startDate && !!draft.endDate);

  const periodLabel = (() => {
    if (draft.startDate && draft.endDate) {
      const formatPrice = (d: string) => d.slice(5).replace('-', '/');
      return `${formatPrice(draft.startDate)}~${formatPrice(draft.endDate)}`;
    }
    if (draft.periodType && draft.periodType !== PERIOD.ALL) {
      return PERIOD_LABEL.find((p) => p.value === draft.periodType)?.label ?? '기간';
    }
    return '기간';
  })();

  return (
    <div className="flex items-center gap-[0.8rem]">
      <button
        onClick={onOpenDrawer}
        aria-label="필터 열기"
        className="border-gray-2 text-gray-5 shrink-0 rounded-full border p-[0.8rem]"
      >
        <SlidersHorizontal size={16} />
      </button>
      <div className="flex items-center gap-[0.8rem] overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <FilterChip
          onClick={() => onInstantSearch({ isBackorderOnly: !draft.isBackorderOnly })}
          isSelected={draft.isBackorderOnly}
        >
          미송건만
        </FilterChip>
        <FilterChip
          onClick={() => onInstantSearch({ dateType: DATE.PURCHASED_AT })}
          isSelected={draft.dateType === DATE.PURCHASED_AT}
        >
          사입일
        </FilterChip>
        <FilterChip
          onClick={() => onInstantSearch({ dateType: DATE.CREATED_AT })}
          isSelected={draft.dateType === DATE.CREATED_AT}
        >
          등록일
        </FilterChip>
        <FilterChip onClick={onOpenDrawer} isSelected={isPeriodActive}>
          {periodLabel}
        </FilterChip>
      </div>
    </div>
  );
}
