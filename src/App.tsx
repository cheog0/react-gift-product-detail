import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import {
  ProtectedRoute,
  ErrorBoundary,
  SuspenseFallback,
} from '@/components/shared/ui';
import { ROUTES } from '@/constants/routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailPage from './pages/ProductDetailPage';

const MainPage = lazy(() => import('@/pages/MainPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const MyPage = lazy(() => import('@/pages/MyPage'));
const GiftOrderPage = lazy(() => import('@/pages/GiftOrderPage'));
const ThemePage = lazy(() => import('@/pages/ThemePage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

function AppContent() {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<MainPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route
            path={ROUTES.MY_PAGE}
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ORDER_PAGE}
            element={
              <ProtectedRoute>
                <GiftOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PRODUCT}
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/themes/:themeId" element={<ThemePage />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<MainPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route
          path={ROUTES.MY_PAGE}
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDER_PAGE}
          element={
            <ProtectedRoute>
              <GiftOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PRODUCT}
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/themes/:themeId" element={<ThemePage />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </Router>
  );
}

export default App;
