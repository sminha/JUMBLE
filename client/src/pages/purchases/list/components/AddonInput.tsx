import Input from '@/components/Input';
import DropDown from '@/components/Dropdown';
import { ValueLabel } from '@/types/value-label';

interface AddonInputProps<T extends string | number> {
  filters: ValueLabel<T>[];
  selectedFilter: T;
  keyword: string;
  onChangeFilter: (selectedFilter: T) => void;
  onChangeKeyword: (keyword: string) => void;
}

export default function AddonInput<T extends string | number>({
  filters,
  selectedFilter,
  keyword,
  onChangeFilter,
  onChangeKeyword,
}: AddonInputProps<T>) {
  return (
    <div className="border-gray-1 focus-within:border-primary-3 flex rounded-[0.8rem] border-1">
      <DropDown
        options={filters}
        value={selectedFilter}
        onChange={onChangeFilter}
        className="border-none pl-[1.6rem]"
      />
      <Input
        placeholder="입력하세요"
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        className="min-w-[30rem] border-none"
      />
    </div>
  );
}
