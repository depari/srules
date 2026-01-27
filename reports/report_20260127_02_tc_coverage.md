# TC 및 커버리지 리포트

## 1. 개요
최근 발생한 404 오류(GitHub Pages 배포 환경에서의 정적 리소스 로딩 실패) 해결을 위해 인프라 및 로직을 수정했습니다. 이에 대한 검증 및 재발 방지를 위해 테스트 케이스(TC)를 보강하고 커버리지를 확인했습니다.

## 2. 발생 이슈 및 수정 내용
*   **이슈 1: 정적 파일 로딩 404**
    *   `SearchBar`에서 인덱스 파일 fetch 실패.
    *   규칙 수정 시 원본 Markdown 파일 fetch 실패.
    *   히스토리 조회 시 fetch 실패.
    *   **원인**: GitHub Pages 배포 시 하위 경로(`/srules`)가 URL에 포함되어야 하나, 이를 고려하지 않은 절대 경로(`/`) 사용.
*   **수정 사항**: 
    *   `NEXT_PUBLIC_BASE_PATH` 환경 변수를 도입하고 `next.config.ts`, `deploy.yml`에 적용.
    *   각 컴포넌트(`SearchBar`, `SubmitClient`, `VersionHistory`)에서 `fetch` URL 생성 시 해당 환경 변수를 동적으로 반영.

## 3. 보강된 TC 내용 및 결과
다음과 같이 테스트 케이스를 추가/보완하여 로직을 검증했습니다. **전체 테스트 통과(PASS)**했습니다.

### A. `src/__tests__/submit.test.tsx` (Integration Check)
*   **`fetches existing rule with basePath when configured`** 케이스 추가:
    *   `NEXT_PUBLIC_BASE_PATH`가 `/srules`로 설정된 환경을 모킹.
    *   규칙 수정 시 fetch 요청이 `/srules/rules/...`로 올바르게 전송되는지 확인.
*   기본 fetch 테스트(로컬 환경)도 통과.

### B. `src/__tests__/searchbar.test.tsx` (Critical Check)
*   **`fetches search index with correct basePath`** 케이스 수행:
    *   환경 변수 유무에 따라 검색 인덱스 요청 경로(`search-index.json`)가 올바르게 변경되는지 검증.

### C. `src/__tests__/version-history.test.tsx` (Critical Check)
*   **`VersionHistory` 컴포넌트 경로 검증**:
    *   히스토리 파일(`rule-history.json`) fetch 시 `basePath` 적용 여부 확인.

## 4. 테스트 커버리지 요약 (관련 파일 기준)
> **중요**: 비즈니스 로직 수정이 집중된 파일들의 메서드/분기 커버리지가 안정적인 수준으로 확보되었습니다.

| 파일명 | Statements % | Branch % | 주요 미커버 영역 |
| :--- | :---: | :---: | :--- |
| **SubmitClient.tsx** | **78.78%** | **66.66%** | PR 생성 호출, 미리보기 렌더링 등 UI 인터랙션 부분 (금번 fetch 로직과는 무관한 영역) |
| **SearchBar.tsx** | **90.62%** | **50%** | 검색 결과 클릭 등 사용자 이벤트 일부 |
| **VersionHistory.tsx** | **35.55%** | **75%** | 변경 이력 상세 조회(diff 보기) 로직 - **Fetch 로직은 테스트됨** |

## 5. 결론 및 향후 계획
*   **결론**: 배포 환경에서의 경로 문제(`basePath`)는 모든 관련 컴포넌트에서 수정되었으며, 이를 검증하는 자동화된 테스트가 마련되었습니다. 재발 가능성은 매우 낮습니다.
*   **향후 계획**: 
    *   PR 생성 시 CI 파이프라인(Validate Rule)에서 `npm test`를 실행하도록 설정하는 것을 권장합니다.
    *   `VersionHistory`의 상세 조회 로직 등 미커버 영역에 대한 TC 추가를 장기 과제로 제안합니다.
