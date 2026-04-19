import { Outlet, Navigate, Routes, Route, useLocation, useNavigate } from 'react-router';
import Home from '@/pages/home/Home';
import KakaoCallback from '@/pages/home/KakaoCallback';
import PurchaseNew from '@/pages/purchases/new/PurchaseNew';
import PurchaseList from '@/pages/purchases/list/PurchaseList';
import PurchaseDetailRoute from '@/pages/purchases/list/routes/PurchaseDetailRoute';
import ProductDetailRoute from '@/pages/purchases/list/routes/ProductDetailRoute';
import { STORAGE_KEYS } from '@/constants/storage';

export const PATHS = {
  HOME: '/',
  KAKAOCALLBACK: '/auth/kakao/callback',
  PURCHASES: '/purchases',
  PURCHASENEW: '/purchases/new',
  PURCHASELIST: '/purchases/list',
  PURCHASE_DETAIL: '/purchases/:purchaseId',
  PRODUCT_DETAIL: '/purchases/products/:productId',
} as const;

function ProtectedRoute() {
  useNavigate();
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return token ? <Outlet /> : <Navigate to={PATHS.HOME} replace />;
}

export function AppRoutes() {
  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.KAKAOCALLBACK} element={<KakaoCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path={PATHS.PURCHASENEW} element={<PurchaseNew />} />
          <Route path={PATHS.PURCHASELIST} element={<PurchaseList />} />
          <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetailRoute />} />
          <Route path={PATHS.PURCHASE_DETAIL} element={<PurchaseDetailRoute />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetailRoute />} />
            <Route path={PATHS.PURCHASE_DETAIL} element={<PurchaseDetailRoute />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
