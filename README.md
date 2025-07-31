# 테스트 및 자동화 가이드

이 프로젝트는 **React Testing Library**, **Jest**, **MSW**, **GitHub Actions**를 활용해 테스트를 수행하고 자동화했습니다.

## 1. 컴포넌트 테스트

- 대상: `FormField`, `Typography`
- 내용: 렌더링, props 반영, 이벤트 처리 검증

## 2. 로그인 페이지 시나리오 테스트

- 성공 → 홈 이동
- 실패 → 에러 메시지 표시
- 엣지 케이스: 빈 입력, 서버 오류, 네트워크 장애

## 3. 선물하기 홈 랭킹 테스트 (MSW)

- 실시간 급상승 랭킹 Mock API 테스트
- 정상, 지연, 오류 시 UI 동작 검증

## 4. GitHub Actions 테스트 자동화

- **PR 생성 / main 브랜치 머지 시 테스트 실행**
- `.github/workflows/test.yml` 사용
