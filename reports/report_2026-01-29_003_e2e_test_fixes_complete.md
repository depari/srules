# 작업 보고서: E2E Test Failures 완전 해결

**작업 일자**: 2026-01-29
**작업자**: Antigravity

## 1. 개요
프로젝트 내에서 발생하던 E2E 테스트 실패들을 모두 분석하고 해결하였습니다. 특히 `favorites`, `rule-detail`, `submit` 스펙에서의 이슈들을 중점적으로 수정하였으며, 테스트 안정성을 위해 소스 코드의 접근성(Accessibility)과 식별자(Metadata)를 보강했습니다.

## 2. 상세 수정 내용

### 2.1 테스트 스크립트 수정 (`e2e/*.spec.ts`)
- **`favorites.spec.ts`**: "즐겨찾기 취소" 버튼 텍스트 매칭을 위한 정규식 수정 (`/해제|Remove|Added|취소/i`).
- **`rule-detail.spec.ts`**:
    - `data-testid` 도입: `rule-metadata`, `breadcrumb-list` 등을 사용하여 깨지기 쉬운 클래스/텍스트 셀렉터 대체.
    - URL 검증 로직 개선: 트레일링 슬래시(`/`) 유무에 관계없이 통과하도록 정규식 수정 (`/\/rules\/?$/`).
    - 중복 요소 처리: `h1` 태그가 여러 개 검색되는 문제를 `.first()` 메서드로 해결.
- **`submit.spec.ts`**:
    - "닫기" 버튼 셀렉터 개선: `getByLabel(/닫기|Close/i)`를 사용하여 SVG 버튼을 정확히 찾도록 수정.

### 2.2 소스 코드 수정 (`src/**/*.tsx`)
- **`src/app/[locale]/rules/[...slug]/page.tsx`**: 테스트 대상 요소(`Breadcrumb`, `Metadata`)에 `data-testid` 속성 추가.
- **`src/components/submit/PreviewModal.tsx`**:
    - 접근성 표준 준수: `role="dialog"`, `aria-modal="true"` 속성 추가.
    - 접근성 개선: 닫기 버튼에 `aria-label="Close"` 속성 추가 (테스트 용이성 및 스크린 리더 지원).

## 3. 결과 검증
- **수행 환경**: Chromium (Desktop)
- **결과**: 총 34개 테스트 중 **33개 통과(Passed)**, 1개 스킵(Skipped - GitHub 토큰 필요).
- `filtering`, `home`, `search` 등 기존 통과되던 테스트들도 회귀 테스트 결과 정상 확인됨.

## 4. 제언
- 향후 UI 변경 시 테스트가 깨지는 것을 방지하기 위해, 주요 상호작용 요소에는 `data-testid`를 적극적으로 활용하는 것을 권장합니다.
- 접근성 속성(`aria-label`, `role`)은 테스트뿐만 아니라 실제 사용자 경험 향상에도 기여하므로 개발 시 고려가 필요합니다.
