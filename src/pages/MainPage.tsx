import { useSearchParams } from 'react-router-dom';
import { Suspense } from 'react';
import { Spinner } from '@/components/shared/ui';
import { NavigationHeader } from '@/components/shared/layout';
import {
  FriendSelector,
  PromotionBanner,
} from '@/components/features/gift-order';
import { ThemesSection, RankingSection } from '@/components/features/main';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

const DEFAULT_TARGET = 'ALL';
const DEFAULT_RANK = 'MANY_WISH';

export default function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetType = searchParams.get('targetType') || DEFAULT_TARGET;
  const rankType = searchParams.get('rankType') || DEFAULT_RANK;

  const handleAddFriend = (): void => {};

  const handleRankingFilterChange = (nextTarget: string, nextRank: string) => {
    setSearchParams(
      { targetType: nextTarget, rankType: nextRank },
      { replace: true }
    );
  };

  return (
    <AppContainer>
      <MobileViewport>
        <Suspense fallback={<Spinner />}>
          <NavigationHeader title="선물하기" />
          <FriendSelector onAddFriend={handleAddFriend} />
          <ThemesSection />
          <PromotionBanner
            subtitle="카카오테크 캠퍼스 3기 여러분"
            title="프론트엔드 2단계 과제 화이팅!"
          />
          <RankingSection
            targetType={targetType}
            rankType={rankType}
            onFilterChange={handleRankingFilterChange}
          />
        </Suspense>
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
  background: ${theme.colors.fill};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    box-shadow: none;
  }
`;
