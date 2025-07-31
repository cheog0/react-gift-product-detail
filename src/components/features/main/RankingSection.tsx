import { RealTimeRanking, ProductCard } from '@/components/features/gift-order';
import { useSuspenseRankingProductsQuery } from '@/hooks/queries';

interface RankingSectionProps {
  targetType: string;
  rankType: string;
  onFilterChange: (nextTarget: string, nextRank: string) => void;
}

export default function RankingSection({
  targetType,
  rankType,
  onFilterChange,
}: RankingSectionProps) {
  const { data: products } = useSuspenseRankingProductsQuery(
    targetType,
    rankType
  );

  return (
    <RealTimeRanking
      products={products}
      ProductCardComponent={ProductCard}
      targetType={targetType}
      rankType={rankType}
      onFilterChange={onFilterChange}
    />
  );
}
