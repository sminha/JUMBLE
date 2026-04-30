import { useState } from 'react';
import { Draft, INITIAL_DRAFT } from '@jumble/shared';
import { Header } from '@/components';
import { useGetPurchases } from '@/pages/purchases/list/apis';
import FilterSection from '@/pages/purchases/list/sections/FilterSection';
import ResultSection from '@/pages/purchases/list/sections/ResultSection';

export default function PurchaseList() {
  const [draft, setDraft] = useState<Draft>(INITIAL_DRAFT);
  const [params, setParams] = useState<Draft>(INITIAL_DRAFT);
  const { data, isPending, isError } = useGetPurchases(params);

  const handleSearch = () => setParams(draft);
  const handleInstantSearch = (partial: Partial<Draft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
    setParams((prev) => ({ ...prev, ...partial }));
  };

  return (
    <main>
      <Header />
      <h1 className="title-18-m text-gray-9 hidden px-[clamp(2rem,calc(11vw-5.4rem),6.4rem)] py-[2.4rem] sm:flex">
        사입 내역 조회
      </h1>
      <div className="flex flex-col gap-[2rem] px-[2rem] px-[clamp(2rem,calc(11vw-5.4rem),6.4rem)] pt-[2rem] pb-[3.2rem] sm:pt-0">
        <FilterSection
          draft={draft}
          setDraft={setDraft}
          onSearch={handleSearch}
          onInstantSearch={handleInstantSearch}
        />
        <ResultSection
          params={params}
          setParams={setParams}
          data={data}
          isPending={isPending}
          isError={isError}
        />
      </div>
    </main>
  );
}
