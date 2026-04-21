import { Navigate } from 'react-router';
import { PATHS } from '@/router';
import { Header } from '@/components';
import MainSection from './sections/MainSection';
import DescriptionSection from './sections/DescriptionSection';
import { STORAGE_KEYS } from '@/constants/storage';

export default function Home() {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    return <Navigate to={PATHS.PURCHASE_LIST} />;
  }

  return (
    <main>
      <Header />
      <MainSection />
      <DescriptionSection />
    </main>
  );
}
