import { http, HttpResponse } from 'msw';
import type { Product } from '@/types';

const mockProducts: Product[] = [
  {
    id: 11712379,
    name: '부드러운 고구마 라떼 케이크',
    price: {
      basicPrice: 31000,
      sellingPrice: 26350,
      discountRate: 15,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250218142602_030fce0196af42189694554c03a54fbb.jpg',
    brandInfo: {
      id: 27,
      name: '뚜레쥬르',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20250331162129_e8de4166853848729c5abad9834405b0.jpg',
    },
  },
  {
    id: 10349024,
    name: '5만원권',
    price: {
      basicPrice: 50000,
      sellingPrice: 50000,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20200924101152_16bb00f28a984b03a2efbdb9cec990d1.jpg',
    brandInfo: {
      id: 4784,
      name: '성심당',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20200923160929_0ad3cff2a7564c4a967e30670b179a91.jpg',
    },
  },
  {
    id: 11477185,
    name: '스트로베리 요거트 생크림',
    price: {
      basicPrice: 29000,
      sellingPrice: 29000,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250408081816_d201654a475e46bd8a480849de51ea30.jpg',
    brandInfo: {
      id: 27,
      name: '뚜레쥬르',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20250331162129_e8de4166853848729c5abad9834405b0.jpg',
    },
  },
  {
    id: 11526708,
    name: '떠먹는 티라미수 + 아메리카노 R 2잔',
    price: {
      basicPrice: 16200,
      sellingPrice: 16200,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250324154718_23d0ce897922417e83a7ac72ecfadca8.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 11169604,
    name: '우유가득 생크림케이크 1호',
    price: {
      basicPrice: 33500,
      sellingPrice: 33500,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250421155731_3de0cb1b4e994aac8d450de0b31877bc.jpg',
    brandInfo: {
      id: 2,
      name: '파리바게뜨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20241127182106_b80d1ec588bd49d985f46db44b827aa2.jpg',
    },
  },
  {
    id: 11169673,
    name: '우유듬뿍 생크림케이크(6호)',
    price: {
      basicPrice: 49900,
      sellingPrice: 49900,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250214140120_cc117535f56949a7aceb76acf62fe5e4.jpg',
    brandInfo: {
      id: 2,
      name: '파리바게뜨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20241127182106_b80d1ec588bd49d985f46db44b827aa2.jpg',
    },
  },
  {
    id: 11526850,
    name: '떠먹는 스트로베리 초콜릿 생크림 + 떠먹는 티라미수 + 아메리카노 R 2잔',
    price: {
      basicPrice: 23400,
      sellingPrice: 23400,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250324154737_ade537cda4bd4280a726395739280afe.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 11725708,
    name: '마이넘버원 초코생크림 조각케이크+마이넘버원 고구마 조각케이크 +아이스 아메리카노 2잔',
    price: {
      basicPrice: 19600,
      sellingPrice: 19600,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250604103401_d7abb11954e64251b21748784f1ef850.jpg',
    brandInfo: {
      id: 2,
      name: '파리바게뜨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20241127182106_b80d1ec588bd49d985f46db44b827aa2.jpg',
    },
  },
  {
    id: 11518444,
    name: '위시캣 아이냥 케이크(픽업가능)',
    price: {
      basicPrice: 33000,
      sellingPrice: 33000,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250415150001_bac62e3d78c743b0bf728c6054d4612c.jpg',
    brandInfo: {
      id: 2,
      name: '파리바게뜨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20241127182106_b80d1ec588bd49d985f46db44b827aa2.jpg',
    },
  },
  {
    id: 11527063,
    name: '떠먹는 화이트 스초생',
    price: {
      basicPrice: 7200,
      sellingPrice: 7200,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250123142412_b3b0a3e8c2e74f928aa5e1531d7d5da4.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 10795494,
    name: '도너츠 6개입',
    price: {
      basicPrice: 11400,
      sellingPrice: 11400,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20241014112403_bad0f28b6c814a16aad4bab2d3596fa7.jpg',
    brandInfo: {
      id: 7,
      name: '던킨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20200331035637_912cd69641ea4723861dc213f6a0619f',
    },
  },
  {
    id: 10994421,
    name: '춘식이와 파티파티 케이크',
    price: {
      basicPrice: 27000,
      sellingPrice: 27000,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20240130160541_9159d29e4af54139bc7ad4da1e588460.jpg',
    brandInfo: {
      id: 2,
      name: '파리바게뜨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20241127182106_b80d1ec588bd49d985f46db44b827aa2.jpg',
    },
  },
  {
    id: 11527042,
    name: '떠먹는 티라미수',
    price: {
      basicPrice: 6800,
      sellingPrice: 6800,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250311111113_d22947f1c95042fcb6c6e7ecd2b5f213.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 11527228,
    name: '카페라떼 R',
    price: {
      basicPrice: 5200,
      sellingPrice: 5200,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20231005101943_5dad54f5a2a14663b704f91faa5f75ac.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 11527208,
    name: '마이 투썸 하트',
    price: {
      basicPrice: 37000,
      sellingPrice: 37000,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250305180202_44ab4285c87948e6898aff497919ad6a.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 11720569,
    name: '오리지널 글레이즈드 하프더즌',
    price: {
      basicPrice: 10800,
      sellingPrice: 10800,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20240919141825_bd40874b226c476480fddc80d33d9153.jpg',
    brandInfo: {
      id: 78,
      name: '크리스피크림',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20201022174148_47db523539f443e0a8af6cd038ca25ad.jpeg',
    },
  },
  {
    id: 11527127,
    name: '투썸 오벌 티라미수 (쁘띠) + 아메리카노 R',
    price: {
      basicPrice: 12700,
      sellingPrice: 12700,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250324155205_fe175c1b31124304b11997d2b5253268.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 11430963,
    name: '행운 가득 복 케이크',
    price: {
      basicPrice: 28000,
      sellingPrice: 28000,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250401142101_8423c355b7c94bd49464ec91fc30aeaf.jpg',
    brandInfo: {
      id: 2,
      name: '파리바게뜨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20241127182106_b80d1ec588bd49d985f46db44b827aa2.jpg',
    },
  },
  {
    id: 11607165,
    name: '떠먹는 망고 생크림 케이크',
    price: {
      basicPrice: 6800,
      sellingPrice: 6800,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20250429110443_1a3a0db90e944590a5744a39cad6eae4.jpg',
    brandInfo: {
      id: 33,
      name: '투썸플레이스',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20240318104050_6ad6dbbadf2b4acd860e549d5c0fcc5e.png',
    },
  },
  {
    id: 11170088,
    name: '클래식 벨기에 화이트초코 케이크(배달가능)',
    price: {
      basicPrice: 32900,
      sellingPrice: 32900,
      discountRate: 0,
    },
    imageURL:
      'https://st.kakaocdn.net/product/gift/product/20221227105433_e012276ff96b42fc955ed55c08d60f2a.jpg',
    brandInfo: {
      id: 2,
      name: '파리바게뜨',
      imageURL:
        'https://st.kakaocdn.net/product/gift/gift_brand/20241127182106_b80d1ec588bd49d985f46db44b827aa2.jpg',
    },
  },
];

export const handlers = [
  http.get('/api/products/ranking', ({ request }) => {
    const url = new URL(request.url);
    const targetType = url.searchParams.get('targetType') || 'ALL';
    const rankType = url.searchParams.get('rankType') || 'MANY_WISH';

    if (targetType === 'FEMALE' && rankType === 'MANY_WISH') {
      return HttpResponse.json({ data: mockProducts.slice(0, 4) });
    }

    if (targetType === 'MALE' && rankType === 'MANY_RECEIVE') {
      return HttpResponse.json({ data: mockProducts.slice(2, 6) });
    }

    if (targetType === 'TEEN' && rankType === 'MANY_WISH_RECEIVE') {
      return HttpResponse.json({ data: mockProducts.slice(4, 8) });
    }

    return HttpResponse.json({ data: mockProducts });
  }),

  http.get('/api/products/:productId', ({ params }) => {
    const productId = params.productId as string;
    const product = mockProducts.find(p => p.id === parseInt(productId));

    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ data: product });
  }),
];
