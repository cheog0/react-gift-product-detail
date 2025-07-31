import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  rank?: number;
  onClick?: (product: Product) => void;
  showRankBadge?: boolean;
}

const formatPrice = (price: number) => `${price} 원`;

export function ProductCard({
  product,
  rank,
  onClick,
  showRankBadge = false,
}: ProductCardProps) {
  return (
    <Card onClick={() => onClick?.(product)}>
      {showRankBadge && rank !== undefined && <RankBadge>{rank}</RankBadge>}
      <ProductImage src={product.imageURL} alt={product.name} />
      <ProductInfo>
        <BrandName>{product.brandInfo.name}</BrandName>
        <ProductName>{product.name}</ProductName>
        <Price>{formatPrice(product.price.sellingPrice)}</Price>
      </ProductInfo>
    </Card>
  );
}

const Card = styled.div`
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
  border-radius: 6px;
  cursor: pointer;
`;

const RankBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.spacing2};
  left: ${theme.spacing.spacing2};
  width: 20px;
  height: 20px;
  background: ${theme.colors.red700};
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.label2Bold.fontSize};
  font-weight: ${theme.typography.label2Bold.fontWeight};
  z-index: 1;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 224px;
  object-fit: cover;
  display: block;

  @media (max-width: 480px) {
    height: 100px;
  }
`;

const ProductInfo = styled.div`
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing3}
    ${theme.spacing.spacing3} 0;
`;

const BrandName = styled.div`
  font-size: ${theme.typography.label2Regular.fontSize};
  color: ${theme.colors.textSub};
  line-height: 1.2;
  margin-bottom: ${theme.spacing.spacing1};
`;

const ProductName = styled.div`
  font-size: ${theme.typography.body1Regular.fontSize};
  color: ${theme.colors.textDefault};
  line-height: 1.3;
  margin-bottom: ${theme.spacing.spacing1};
  font-weight: ${theme.typography.body1Regular.fontWeight};
`;

const Price = styled.div`
  font-size: ${theme.typography.title2Bold.fontSize};
  font-weight: ${theme.typography.title2Bold.fontWeight};
  color: ${theme.colors.gray1000};

  @media (max-width: 480px) {
    font-size: ${theme.typography.label1Bold.fontSize};
  }
`;
