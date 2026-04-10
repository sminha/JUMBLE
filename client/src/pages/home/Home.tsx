import { Navigate } from 'react-router';
import { PATHS } from '@/router';
import Header from './components/Header';
import MainSection from './sections/MainSection';
import DescriptionSection from './sections/DescriptionSection';

export default function Home() {
  const token = localStorage.getItem('accessToken');
  if (token) {
    return <Navigate to={PATHS.PURCHASELIST} />;
  }

  return (
    <main>
      <Header />
      <MainSection />
      <DescriptionSection />
    </main>
  );
}
