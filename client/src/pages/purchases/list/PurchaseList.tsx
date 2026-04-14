import { useState } from 'react';
import Header from '@/components/Header';
import FilterSection from './sections/FilterSection';
import ResultSection from './sections/ResultSection';
import { Draft, INITIAL_DRAFT } from './constants/draft';
import { MOCK } from './mocks/mock';

export default function PurchaseList() {
  const [draft, setDraft] = useState<Draft>(INITIAL_DRAFT);

  return (
    <main>
      <Header />
      <h1 className="title-18-m text-gray-9 px-[7.2rem] py-[3.2rem]">사입 내역 조회</h1>
      <div className="flex flex-col gap-[3.2rem] px-[6.4rem] pb-[3.2rem]">
        <FilterSection draft={draft} setDraft={setDraft} />
        <ResultSection data={MOCK} />
      </div>
    </main>
  );
}
