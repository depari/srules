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

### 3. `src/__tests__/searchbar.test.tsx` (New & Critical)
- **목표**: `SearchBar` 컴포넌트가 배포 환경(`basePath` 존재)과 로컬 환경에서 올바른 경로로 인덱스를 요청하는지 검증.
- **주요 검증 항목**:
    - `NEXT_PUBLIC_BASE_PATH` 환경변수가 설정되었을 때, fetch URL에 prefix가 포함되는지 확인 (`/srules/search-index.json`).
    - 환경변수가 없을 때, 기본 루트 경로로 요청하는지 확인 (`/search-index.json`).
- **결과**: GitHub Pages 배포 시 404 오류(`https://root/search-index.json`)를 방지.

## 결과
- `npm test` 실행 결과: **All Pass**.
- `public/rules` 구조 및 `basePath` 로직 검증 완료.

## 향후 계획
- 주요 기능 추가 시 관련 Unit Test 추가.
- CI/CD 파이프라인에 `npm test` 단계 추가 권장.
