import { useThemeInfoQuery } from '@/hooks/queries';
import styled from '@emotion/styled';
import { theme as appTheme } from '@/styles/theme';

export function ThemeInfoSection({ themeId }: { themeId: number }) {
  const { data: theme } = useThemeInfoQuery(themeId);

  if (!theme) {
    return (
      <InfoContainer>
        <InfoTitle>테마 정보를 찾을 수 없습니다.</InfoTitle>
      </InfoContainer>
    );
  }

  return (
    <InfoContainer style={{ background: theme.backgroundColor }}>
      <InfoTitle>{theme.name}</InfoTitle>
      <InfoSubtitle>{theme.title}</InfoSubtitle>
      <InfoDescription>{theme.description}</InfoDescription>
    </InfoContainer>
  );
}

const InfoContainer = styled.div`
  padding: ${appTheme.spacing.spacing6} ${appTheme.spacing.spacing4}
    ${appTheme.spacing.spacing8};
  color: white;
  position: relative;
  overflow: hidden;
  text-align: center;
`;

const InfoTitle = styled.h1`
  font-size: ${appTheme.typography.title1Bold.fontSize};
  font-weight: ${appTheme.typography.title1Bold.fontWeight};
  margin-bottom: ${appTheme.spacing.spacing2};
  position: relative;
  z-index: 1;
`;

const InfoSubtitle = styled.h2`
  font-size: ${appTheme.typography.subtitle1Bold.fontSize};
  font-weight: ${appTheme.typography.subtitle1Bold.fontWeight};
  margin-bottom: ${appTheme.spacing.spacing2};
  position: relative;
  z-index: 1;
`;

const InfoDescription = styled.p`
  font-size: ${appTheme.typography.body2Regular.fontSize};
  opacity: 0.9;
  position: relative;
  z-index: 1;
  margin: 0;
`;
