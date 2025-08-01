import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useErrorStore } from '@/stores/errorStore';

export function useGlobalErrorHandler() {
  const navigate = useNavigate();
  const setError = useErrorStore(state => state.setError);

  const handleError = (
    error: unknown,
    customMessages?: Record<number, string>
  ) => {
    const status = (error as { status?: number })?.status;
    const message = (error as { message?: string })?.message;

    if (customMessages && status && customMessages[status]) {
      toast.error(customMessages[status]);
      return;
    }

    switch (status) {
      case 400:
        toast.error('잘못된 요청입니다.');
        break;
      case 401: {
        setError('로그인이 필요합니다.');
        sessionStorage.removeItem('userInfo');
        const currentPath = encodeURIComponent(window.location.pathname);
        navigate(`/login?redirect=${currentPath}`);
        break;
      }
      case 403:
        toast.error('접근 권한이 없습니다.');
        break;
      case 404:
        toast.error('요청한 리소스를 찾을 수 없습니다.');
        break;
      case 500:
        toast.error('서버 오류가 발생했습니다.');
        break;
      default:
        toast.error(message || '오류가 발생했습니다.');
    }
  };

  return { handleError };
}
