import Input from '@/components/Input';
import Button from '@/components/Button';
import Checkbox from '../components/Checkbox';
import AddonInput from '../components/AddonInput';
import TogglePair from '../components/TogglePair';
import ToggleGroup from '../components/ToggleGroup';
import { Draft, FILTER_LABEL, DATE_LABEL, PERIOD_LABEL } from '../constants/draft';

interface FilterSectionProps {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
}

export default function FilterSection({ draft, setDraft }: FilterSectionProps) {
  return (
    <section className="flex w-fit flex-col gap-[0.8rem] rounded-[1.6rem] bg-white px-[3.8rem] py-[3rem]">
      <div className="flex gap-[3.6rem]">
        {/* 조회기간 */}
        <div className="flex gap-[2.4rem]">
          <span className="title-16-m text-gray-9 my-[1rem] shrink-0">조회기간</span>
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
                value={draft.startDate}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, startDate: e.target.value, periodType: null }))
                }
                className="border-gray-1 text-gray-5 w-[15rem]"
              />
              <Input
                type="date"
                aria-label="조회 종료일"
                value={draft.endDate}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, endDate: e.target.value, periodType: null }))
                }
                className="border-gray-1 text-gray-5 w-[15rem]"
              />
            </div>
          </div>
        </div>

        {/* 상세조건 */}
        <div className="flex gap-[2.4rem]">
          <span className="title-16-m text-gray-0 my-[1rem] shrink-0">상세조건</span>
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

      {/* 검색 */}
      <div className="flex justify-end">
        <Button size="medium" variant="primary">
          검색
        </Button>
      </div>
    </section>
  );
}
