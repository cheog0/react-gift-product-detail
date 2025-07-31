import { useNavigate, generatePath } from 'react-router-dom';
import { GiftThemeGrid } from '@/components/features/gift-order';
import { useSuspenseThemesQuery } from '@/hooks/queries';
import type { GiftTheme } from '@/types';
import { Path } from '@/constants/endpoints';

export default function ThemesSection() {
  const { data: themes } = useSuspenseThemesQuery();
  const navigate = useNavigate();

  if (themes.length === 0) return null;

  const handleThemeClick = (theme: GiftTheme) => {
    navigate(generatePath(Path.THEME, { themeId: String(theme.themeId) }));
  };

  return <GiftThemeGrid themes={themes} onThemeClick={handleThemeClick} />;
}
