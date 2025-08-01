import { useEffect } from 'react';
import { useGlobalErrorHandler } from '@/hooks';
import NotFoundPage from '@/pages/NotFoundPage';

interface Props {
  error: Error;
  onRetry: () => void;
}

export function GlobalErrorFallback({ error, onRetry }: Props) {
  const { handleError } = useGlobalErrorHandler();

  useEffect(() => {
    // 이 컴포넌트가 렌더링될 때 전역 에러 핸들러를 호출
    handleError(error);
  }, [error, handleError]);

  // 사용자에게는 NotFoundPage나 전용 에러 페이지를 보여줌
  return <NotFoundPage onRetry={onRetry} />;
}
