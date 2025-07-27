export interface Product {
  id: number;
  name: string;
  imageURL: string;
  price: {
    basicPrice: number;
    sellingPrice: number;
    discountRate: number;
  };
  brandInfo: {
    id: number;
    name: string;
    imageURL: string;
  };
}

export interface ProductDetail {
  description: string;
  announcements: Array<{
    name: string;
    value: string;
    displayOrder: number;
  }>;
}

export interface ProductReview {
  totalCount: number;
  reviews: Array<{
    id: string;
    authorName: string;
    content: string;
  }>;
}
export interface ProductWish {
  wishCount: number;
  isWished: boolean;
}

export type TargetFilter = '전체' | '여성이' | '남성이' | '청소년이';
export type CategoryFilter = '받고 싶어한' | '많이 선물한' | '위시로 받은';
