import { Outlet, Navigate, createBrowserRouter, useNavigate } from 'react-router';
import Home from '@/pages/home/Home';
import KakaoCallback from './pages/home/KakaoCallback';
import PurchaseNew from '@/pages/purchases/new/PurchaseNew';
import PurchaseList from './pages/purchases/list/PurchaseList';

export const PATHS = {
  HOME: '/',
  KAKAOCALLBACK: '/auth/kakao/callback',
  PURCHASENEW: '/purchases/new',
  PURCHASELIST: '/purchases/list',
} as const;

function ProtectedRoute() {
  useNavigate();
  const token = localStorage.getItem('accessToken');
  return token ? <Outlet /> : <Navigate to={PATHS.HOME} replace />;
}

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <Home />,
  },
  {
    path: PATHS.KAKAOCALLBACK,
    element: <KakaoCallback />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: PATHS.PURCHASENEW,
        element: <PurchaseNew />,
      },
      {
        path: PATHS.PURCHASELIST,
        element: <PurchaseList />,
      },
    ],
  },
]);
