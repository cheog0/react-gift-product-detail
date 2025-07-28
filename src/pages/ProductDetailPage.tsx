import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Heart } from 'lucide-react';
import { theme } from '@/styles/theme';
import { NavigationHeader } from '@/components/shared/layout';
import {
  useProductQuery,
  useProductDetailQuery,
  useProductReviewsQuery,
  useProductWishQuery,
  useToggleWishMutation,
} from '@/hooks/queries';

type TabType = '상품설명' | '선물후기' | '상세정보';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();

  const productFromState = location.state?.product;
  const numericProductId = productFromState
    ? productFromState.id
    : Number(productId);

  const [activeTab, setActiveTab] = useState<TabType>('상품설명');

  const { data: product } = useProductQuery(numericProductId);
  const { data: productDetail } = useProductDetailQuery(numericProductId);
  const { data: reviewData } = useProductReviewsQuery(numericProductId);
  const { data: wishData } = useProductWishQuery(numericProductId);

  const { mutate, isPending } = useToggleWishMutation();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleOrderClick = () => {
    if (product) {
      navigate(`/order/${product.id}`, { state: { product } });
    }
  };

  const handleWishClick = () => {
    if (isPending) return;

    if (wishData && product) {
      mutate({
        productId: product.id,
        isWished: wishData.isWished,
      });
    }
  };

  const formatPrice = (price: {
    basicPrice: number;
    sellingPrice: number;
    discountRate: number;
  }) => {
    return `${price.sellingPrice.toLocaleString()}원`;
  };

  if (!numericProductId) {
    throw new Error('상품 ID가 유효하지 않습니다.');
  }

  if (!product) {
    return (
      <AppContainer>
        <MobileViewport>
          <NavigationHeader title="선물하기" onBackClick={handleBackClick} />
          <div style={{ padding: '20px', textAlign: 'center' }}>
            상품 정보를 찾을 수 없습니다.
          </div>
        </MobileViewport>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <MobileViewport>
        <NavigationHeader title="선물하기" onBackClick={handleBackClick} />

        <ProductImageContainer>
          <ProductImage src={product.imageURL} alt={product.name} />
        </ProductImageContainer>

        <ProductInfoSection>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductPrice>{formatPrice(product.price)}</ProductPrice>

          <BrandContainer>
            <BrandLogo>
              {product?.brandInfo?.imageURL ? (
                <BrandImage
                  src={product.brandInfo.imageURL}
                  alt={product.brandInfo.name}
                />
              ) : (
                <BrandIcon />
              )}
            </BrandLogo>
            <BrandName>
              {product?.brandInfo?.name || '브랜드 정보 없음'}
            </BrandName>
          </BrandContainer>

          <ActionButtonsContainer>
            <ActionButton
              isActive={activeTab === '상품설명'}
              onClick={() => setActiveTab('상품설명')}
            >
              상품설명
            </ActionButton>
            <ActionButton
              isActive={activeTab === '선물후기'}
              onClick={() => setActiveTab('선물후기')}
            >
              선물후기
            </ActionButton>
            <ActionButton
              isActive={activeTab === '상세정보'}
              onClick={() => setActiveTab('상세정보')}
            >
              상세정보
            </ActionButton>
          </ActionButtonsContainer>

          {activeTab === '상품설명' && (
            <TabContent>
              <ProductDescription
                dangerouslySetInnerHTML={{
                  __html: productDetail?.description || '상품 설명이 없습니다.',
                }}
              />
            </TabContent>
          )}

          {activeTab === '선물후기' && (
            <TabContent>
              {reviewData?.reviews && reviewData.reviews.length > 0 ? (
                <ReviewList>
                  {reviewData.reviews.map((review: any) => (
                    <ReviewItem key={review.id}>
                      <ReviewAuthor>{review.authorName}</ReviewAuthor>
                      <ReviewContent>{review.content}</ReviewContent>
                    </ReviewItem>
                  ))}
                </ReviewList>
              ) : (
                <EmptyReview>아직 후기가 없습니다.</EmptyReview>
              )}
            </TabContent>
          )}

          {activeTab === '상세정보' && (
            <TabContent>
              {productDetail?.announcements &&
              productDetail.announcements.length > 0 ? (
                <CleanDetailSection>
                  {productDetail.announcements
                    .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
                    .map((item: any, index: number) => (
                      <DetailSection key={index}>
                        <DetailSectionTitle>{item.name}</DetailSectionTitle>
                        <DetailSectionContent>
                          {item.value}
                        </DetailSectionContent>
                      </DetailSection>
                    ))}
                </CleanDetailSection>
              ) : (
                <LoadingText>상세 정보가 없습니다.</LoadingText>
              )}
            </TabContent>
          )}
        </ProductInfoSection>

        <BottomSection>
          <LikeButton onClick={handleWishClick} disabled={isPending}>
            <Heart
              size={20}
              fill={wishData?.isWished ? '#ff4757' : 'none'}
              color={wishData?.isWished ? '#ff4757' : '#666'}
            />
            <LikeCount>{wishData?.wishCount || 0}</LikeCount>
          </LikeButton>

          <OrderButton onClick={handleOrderClick}>주문하기</OrderButton>
        </BottomSection>
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
  padding-bottom: 80px;

  @media (max-width: 768px) {
    max-width: 100%;
    box-shadow: none;
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  background: #f5f5f5;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

const ProductInfoSection = styled.div`
  padding: ${theme.spacing.spacing4};
`;

const ProductTitle = styled.h1`
  font-size: ${theme.typography.body1Bold.fontSize};
  font-weight: ${theme.typography.body1Bold.fontWeight};
  color: ${theme.colors.textDefault};
  margin: 0 0 ${theme.spacing.spacing2} 0;
`;

const ProductPrice = styled.div`
  font-size: ${theme.typography.title1Bold.fontSize};
  font-weight: ${theme.typography.title1Bold.fontWeight};
  color: ${theme.colors.textDefault};
  margin-bottom: ${theme.spacing.spacing4};
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.spacing2};
  margin-bottom: ${theme.spacing.spacing4};
`;

const BrandLogo = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${theme.colors.red700};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandIcon = styled.div`
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 2px;
`;

const BrandImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const BrandName = styled.span`
  font-size: ${theme.typography.body2Regular.fontSize};
  color: ${theme.colors.textDefault};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.borderDefault};
  margin-bottom: ${theme.spacing.spacing4};
`;

const ActionButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: ${theme.spacing.spacing3} 0;
  border: none;
  background: none;
  font-size: ${theme.typography.body2Regular.fontSize};
  color: ${props =>
    props.isActive ? theme.colors.textDefault : theme.colors.textSub};
  border-bottom: 2px solid
    ${props => (props.isActive ? theme.colors.textDefault : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.textDefault};
  }
`;

const TabContent = styled.div`
  min-height: 200px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: ${theme.colors.textSub};
  padding: ${theme.spacing.spacing6} 0;
`;

const ProductDescription = styled.div`
  font-size: ${theme.typography.body2Regular.fontSize};
  color: ${theme.colors.textSub};
  line-height: 1.6;
  margin: 0 0 ${theme.spacing.spacing4} 0;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: ${theme.spacing.spacing2} 0;
  }
  p {
    margin: ${theme.spacing.spacing2} 0;
  }
`;

const CleanDetailSection = styled.div`
  padding: ${theme.spacing.spacing4} 0;
`;

const DetailSection = styled.div`
  margin-bottom: ${theme.spacing.spacing4};
`;

const DetailSectionTitle = styled.h4`
  font-size: ${theme.typography.body1Bold.fontSize};
  font-weight: ${theme.typography.body1Bold.fontWeight};
  color: ${theme.colors.textDefault};
  margin: ${theme.spacing.spacing4} 0 ${theme.spacing.spacing2} 0;

  &:first-of-type {
    margin-top: 0;
  }
`;

const DetailSectionContent = styled.div`
  font-size: ${theme.typography.body2Regular.fontSize};
  color: ${theme.colors.textDefault};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.spacing4};
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing4};
  padding-top: ${theme.spacing.spacing4};
`;

const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing1};
`;

const ReviewAuthor = styled.div`
  font-size: ${theme.typography.body1Bold.fontSize};
  font-weight: ${theme.typography.body1Bold.fontWeight};
  color: ${theme.colors.textDefault};
`;

const ReviewContent = styled.div`
  font-size: ${theme.typography.body2Regular.fontSize};
  color: ${theme.colors.textDefault};
  line-height: 1.6;
  white-space: pre-line;
`;

const EmptyReview = styled.div`
  text-align: center;
  color: ${theme.colors.textSub};
  padding: ${theme.spacing.spacing6} 0;
`;

const BottomSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: center;
  padding: ${theme.spacing.spacing4};
  background: ${theme.colors.default};
  border-top: 1px solid ${theme.colors.borderDefault};
  gap: ${theme.spacing.spacing4};

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const LikeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.spacing1};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.spacing2};
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
`;

const LikeCount = styled.span`
  font-size: ${theme.typography.label2Regular.fontSize};
  color: ${theme.colors.textSub};
`;

const OrderButton = styled.button`
  flex: 1;
  padding: ${theme.spacing.spacing4};
  background: ${theme.colors.kakaoYellow};
  border: none;
  border-radius: 8px;
  font-size: ${theme.typography.body1Bold.fontSize};
  font-weight: ${theme.typography.body1Bold.fontWeight};
  color: ${theme.colors.gray1000};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.kakaoYellowHover};
  }

  &:active {
    background: ${theme.colors.kakaoYellowActive};
  }
`;
