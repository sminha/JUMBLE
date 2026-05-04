import { Input, Dropdown } from '@/components';
import { ValueLabel } from '@/types/value-label';
import { SearchProps } from '@/pages/purchases/list/types/search';

interface BaseAddonInputProps<T extends string | number> {
  filters: ValueLabel<T>[];
  selectedFilter: T;
  keyword: string;
  onChangeFilter: (selectedFilter: T) => void;
  onChangeKeyword: (keyword: string) => void;
}

type AddonInputProps<T extends string | number> = BaseAddonInputProps<T> & SearchProps;

export default function AddonInput<T extends string | number>({
  filters,
  selectedFilter,
  keyword,
  onChangeFilter,
  onChangeKeyword,
  ...searchProps
}: AddonInputProps<T>) {
  return (
    <div className="border-gray-1 focus-within:border-primary-3 flex w-full rounded-[0.8rem] border-1">
      <Dropdown
        options={filters}
        value={selectedFilter}
        onChange={onChangeFilter}
        className="border-none pl-[1.6rem]"
      />
      <Input
        placeholder="입력하세요"
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        className="border-none"
        {...searchProps}
      />
    </div>
  );
}
