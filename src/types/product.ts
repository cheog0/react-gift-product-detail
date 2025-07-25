export interface Product {
  id: number;
  name: string;
  imageURL: string;
  brandName: string;
  price: number;
  brandInfo: {
    id: number;
    name: string;
    imageURL: string;
  };
}

export type TargetFilter = '전체' | '여성이' | '남성이' | '청소년이';
export type CategoryFilter = '받고 싶어한' | '많이 선물한' | '위시로 받은';
