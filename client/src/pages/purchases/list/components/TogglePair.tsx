import { cn } from '@/utils/cn';
import { ValueLabel } from '@/types/value-label';

interface TogglePairProps<T> {
  togglePair: [ValueLabel<T>, ValueLabel<T>];
  selectedToggle: T;
  onChange: (selectedToggle: T) => void;
}

const TOGGLE_STYLE = 'font-14-m z-10 rounded-[0.6rem] px-[1.2rem] py-[0.8rem]';

export default function TogglePair<T>({
  togglePair,
  selectedToggle,
  onChange,
}: TogglePairProps<T>) {
  return (
    <div className="bg-gray-1 relative flex w-fit gap-[0.4rem] rounded-[0.6rem] p-[0.4rem]">
      <div
        className={cn(
          'bg-primary-3 absolute top-[0.4rem] bottom-[0.4rem] left-[0.4rem] w-[calc(50%-0.6rem)] rounded-[0.6rem] transition-transform duration-300 ease-in-out',
          selectedToggle === togglePair[1].value && 'translate-x-[calc(100%+0.4rem)]',
        )}
      />
      <button
        type="button"
        onClick={() => onChange(togglePair[0].value)}
        aria-pressed={selectedToggle === togglePair[0].value}
        className={cn(
          TOGGLE_STYLE,
          selectedToggle === togglePair[0].value ? 'text-white' : 'text-gray-5',
        )}
      >
        {togglePair[0].label}
      </button>
      <button
        type="button"
        onClick={() => onChange(togglePair[1].value)}
        aria-pressed={selectedToggle === togglePair[1].value}
        className={cn(
          TOGGLE_STYLE,
          selectedToggle === togglePair[1].value ? 'text-white' : 'text-gray-5',
        )}
      >
        {togglePair[1].label}
      </button>
    </div>
  );
}
