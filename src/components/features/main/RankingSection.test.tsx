import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import RankingSection from './RankingSection';

vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        throwOnError: false,
      },
      mutations: {
        retry: false,
        throwOnError: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('RankingSection', () => {
  const mockOnFilterChange = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);

    render(
      <TestWrapper>
        <RankingSection
          targetType="ALL"
          rankType="MANY_WISH"
          onFilterChange={mockOnFilterChange}
        />
      </TestWrapper>
    );
  });

  it('초기 렌더링 시 로딩 후 섹션 제목, 필터, 상품 목록이 올바르게 표시된다', async () => {
    // findBy* 쿼리로 비동기 데이터 로딩을 기다림
    expect(
      await screen.findByText('실시간 급상승 선물랭킹')
    ).toBeInTheDocument();

    // 나머지 요소들은 데이터 로드 후 동기적으로 확인 가능
    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('받고 싶어한')).toBeInTheDocument();
    expect(screen.getByText('부드러운 고구마 라떼 케이크')).toBeInTheDocument();
    expect(screen.getAllByText('뚜레쥬르')).toHaveLength(2);
    expect(screen.getByText('26350 원')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // 2. 상호작용 테스트
  describe('사용자 상호작용 시', () => {
    it('필터 버튼을 클릭하면 onFilterChange 콜백이 올바른 인자와 함께 호출된다', async () => {
      const user = userEvent.setup();
      const femaleFilterButton = await screen.findByText('여성이');
      await user.click(femaleFilterButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith('FEMALE', 'MANY_WISH');
    });

    it('카테고리 필터를 클릭하면 onFilterChange 콜백이 올바른 인자와 함께 호출된다', async () => {
      const user = userEvent.setup();
      const manyReceiveButton = await screen.findByText('많이 선물한');
      await user.click(manyReceiveButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith('ALL', 'MANY_RECEIVE');
    });

    it('상품 카드를 클릭하면 올바른 경로로 이동한다', async () => {
      const user = userEvent.setup();
      const productCard =
        await screen.findByText('부드러운 고구마 라떼 케이크');
      await user.click(productCard);

      expect(mockNavigate).toHaveBeenCalledWith('/product/11712379');
    });

    it('더보기 버튼을 클릭하면 모든 상품이 표시되고 버튼 텍스트가 "접기"로 바뀐다', async () => {
      const user = userEvent.setup();
      const showMoreButton = await screen.findByText('더보기');
      await user.click(showMoreButton);

      expect(await screen.findByText('접기')).toBeInTheDocument();
      expect(
        screen.getByText('클래식 벨기에 화이트초코 케이크(배달가능)')
      ).toBeInTheDocument();
    });

    it('접기 버튼을 클릭하면 초기 상품 수로 돌아가고 버튼 텍스트가 "더보기"로 바뀐다', async () => {
      const user = userEvent.setup();

      // 먼저 더보기 버튼 클릭
      const showMoreButton = await screen.findByText('더보기');
      await user.click(showMoreButton);

      // 접기 버튼 클릭
      const showLessButton = await screen.findByText('접기');
      await user.click(showLessButton);

      expect(await screen.findByText('더보기')).toBeInTheDocument();
      // 초기에는 6개만 표시되므로 7번째 상품은 보이지 않아야 함
      expect(
        screen.queryByText(
          '마이넘버원 초코생크림 조각케이크+마이넘버원 고구마 조각케이크 +아이스 아메리카노 2잔'
        )
      ).not.toBeInTheDocument();
    });
  });

  // 3. 필터별 콜백 테스트
  describe('필터별 콜백 호출', () => {
    it('여성 필터 선택 시 onFilterChange가 올바른 인자와 함께 호출된다', async () => {
      const user = userEvent.setup();
      const femaleFilterButton = await screen.findByText('여성이');
      await user.click(femaleFilterButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith('FEMALE', 'MANY_WISH');
    });

    it('남성 필터 선택 시 onFilterChange가 올바른 인자와 함께 호출된다', async () => {
      const user = userEvent.setup();
      const maleFilterButton = await screen.findByText('남성이');
      await user.click(maleFilterButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith('MALE', 'MANY_WISH');
    });

    it('청소년 필터 선택 시 onFilterChange가 올바른 인자와 함께 호출된다', async () => {
      const user = userEvent.setup();
      const teenFilterButton = await screen.findByText('청소년이');
      await user.click(teenFilterButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith('TEEN', 'MANY_WISH');
    });
  });

  // 4. 상품 정보 표시 테스트
  describe('상품 정보 표시', () => {
    it('상품 카드에 브랜드 정보가 올바르게 표시된다', async () => {
      await screen.findByText('부드러운 고구마 라떼 케이크');
      expect(screen.getAllByText('뚜레쥬르')).toHaveLength(2); // 뚜레쥬르 브랜드가 2개 있음
      expect(screen.getByText('성심당')).toBeInTheDocument();
      expect(screen.getByText('투썸플레이스')).toBeInTheDocument();
    });

    it('상품 카드에 가격 정보가 올바르게 표시된다', async () => {
      await screen.findByText('26350 원');
      expect(screen.getByText('50000 원')).toBeInTheDocument();
      expect(screen.getByText('29000 원')).toBeInTheDocument();
    });

    it('랭킹 배지가 올바르게 표시된다', async () => {
      await screen.findByText('1');
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
