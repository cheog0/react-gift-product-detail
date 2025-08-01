import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import LoginPage from './LoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginMutation } from '@/hooks/queries';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/stores/errorStore', () => ({
  useErrorStore: () => ({
    errorMessage: null,
    clearError: vi.fn(),
  }),
}));

vi.mock('@/hooks/queries', () => ({
  useLoginMutation: vi.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  const mockLogin = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
    });

    (useLoginMutation as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it('로그인 페이지의 모든 UI 요소가 올바르게 렌더링된다', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByText('선물하기')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('폼 요소들이 올바른 접근성 속성을 가진다', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('이메일');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(loginButton).toHaveAttribute('type', 'submit');
  });

  describe('로그인 시도 시', () => {
    it('올바른 정보를 입력하면 로그인에 성공하고, useAuth의 login 함수를 호출한다', async () => {
      const user = userEvent.setup();
      const successResponse = {
        authToken: 'fake-token',
        user: { email: 'test@example.com', name: 'Test User' },
      };
      mockMutateAsync.mockResolvedValue(successResponse);

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      await user.type(
        screen.getByPlaceholderText('이메일'),
        'test@example.com'
      );
      await user.type(screen.getByPlaceholderText('비밀번호'), 'password123');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith({
        authToken: 'fake-token',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('잘못된 정보를 입력하면 로그인에 실패하고, 에러 토스트를 보여준다', async () => {
      const user = userEvent.setup();
      const errorMessage = '로그인 실패!';
      mockMutateAsync.mockRejectedValue(new Error(errorMessage));

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      await user.type(
        screen.getByPlaceholderText('이메일'),
        'test@example.com'
      );
      await user.type(
        screen.getByPlaceholderText('비밀번호'),
        'wrong-password'
      );
      await user.click(screen.getByRole('button', { name: '로그인' }));

      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('인증 토큰이 없으면 에러 토스트를 보여준다', async () => {
      const user = userEvent.setup();
      const responseWithoutToken = {
        authToken: null,
        user: { email: 'test@example.com', name: 'Test User' },
      };
      mockMutateAsync.mockResolvedValue(responseWithoutToken);

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      await user.type(
        screen.getByPlaceholderText('이메일'),
        'test@example.com'
      );
      await user.type(screen.getByPlaceholderText('비밀번호'), 'password123');
      await user.click(screen.getByRole('button', { name: '로그인' }));

      expect(toast.error).toHaveBeenCalledWith('인증 토큰을 받지 못했습니다.');
    });

    it('로딩 중일 때 버튼이 비활성화되고 로딩 텍스트를 표시한다', () => {
      (useLoginMutation as ReturnType<typeof vi.fn>).mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
      });

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>
      );

      const loginButton = screen.getByRole('button', { name: '로그인 중...' });
      expect(loginButton).toBeDisabled();
    });
  });
});
