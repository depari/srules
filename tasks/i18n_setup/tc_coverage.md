# TC 작성 및 커버리지 확인

## 작성된 테스트 케이스 (TC)

### 1. `src/__tests__/submit.test.tsx` (Integration Test)
- **목표**: 규칙 수정 페이지(`SubmitClient`)의 데이터 로딩 및 랜더링 로직 검증.
- **주요 검증 항목**:
    - 필수 폼 요소(제목, 작성자, 난이도 등)가 올바르게 렌더링되는지 확인.
    - URL query param (`?edit=...`) 존재 시, 올바른 경로(`/rules/...`)로 `fetch` 요청을 보내는지 검증.
    - **Regression 방지**: 이전 버그였던 오잘못된 fetch 경로(공개되지 않은 `src/rules` 등)로의 요청을 방지.

### 2. `src/__tests__/file-structure.test.ts` (Build Verification)
- **목표**: 빌드 시스템이 `public/rules` 디렉토리를 올바르게 생성하고 내용을 채우는지 검증.
- **주요 검증 항목**:
    - `public/rules` 디렉토리 존재 여부.
    - 디렉토리 내 `.md` 파일 존재 여부.
    - 특정 핵심 파일 확인.

## 결과
- `npm test` 실행 결과: **All Pass** (Test Suites: 2 passed, Tests: 4 passed).
- `public/rules` 구조 검증 완료.
- `SubmitClient` fetch 로직(회귀 포인트) 검증 완료.

## 향후 계획
- 주요 기능 추가 시 관련 Unit Test 추가.
- CI/CD 파이프라인에 `npm test` 단계 추가 권장.
