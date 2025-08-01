import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { NavigationHeader } from '@/components/shared/layout';
import { LoginForm } from '@/components/features/auth';
import { theme } from '@/styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginMutation } from '@/hooks/queries';
import type { LoginRequest } from '@/types/api';
import { useEffect } from 'react';
import { useErrorStore } from '@/stores/errorStore';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const loginMutation = useLoginMutation();
  const { errorMessage, clearError } = useErrorStore();

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      clearError();
    }
  }, [errorMessage, clearError]);

  const handleRedirect = (replace: boolean = true) => {
    const redirect = searchParams.get('redirect');
    const from = redirect || location.state?.from || '/';
    navigate(from, { replace });
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const credentials: LoginRequest = { email, password };
      const result = await loginMutation.mutateAsync(credentials);

      const authToken = result?.authToken;
      const userEmail = result?.user?.email || email;
      const userName = result?.user?.name || '사용자';

      if (!authToken) {
        throw new Error('인증 토큰을 받지 못했습니다.');
      }

      login({
        authToken,
        email: userEmail,
        name: userName,
      });
      handleRedirect(true);
    } catch (error: unknown) {
      const msg = (error as Error)?.message || '로그인에 실패했습니다.';
      toast.error(msg);
    }
  };

  return (
    <AppContainer>
      <MobileViewport>
        <NavigationHeader
          title="선물하기"
          onBackClick={() => handleRedirect(false)}
        />
        <LoginForm onSubmit={handleLogin} isLoading={loginMutation.isPending} />
      </MobileViewport>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.gray200};
  display: flex;
  justify-content: center;
  padding: 0 ${theme.spacing.spacing4};

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const MobileViewport = styled.div`
  width: 100%;
  max-width: 720px;
  min-height: 100vh;
  background: ${theme.colors.default};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    box-shadow: none;
  }
`;
