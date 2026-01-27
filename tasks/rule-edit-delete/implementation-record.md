# Task: 규칙 수정 및 삭제 기능 구현

## 작업 내용
1.  **GitHub API 클라이언트 확장 (`src/lib/github.ts`)**
    *   `getFileInfo(path)`: 특정 파일의 SHA와 내용을 가져오는 기능 추가
    *   `updateRule(params)`: 기존 파일을 업데이트하거나 경로 변경 시 삭제 후 재생성하여 PR을 올리는 기능 구현
    *   `deleteRule(params)`: 파일을 삭제하고 PR을 올리는 기능 구현
    *   내부 메서드 `createFile` (SHA 지원) 및 `deleteFile` 기능 보강

2.  **규칙 상세 페이지 액션 버튼 강화 (`src/components/rules/RuleActions.tsx`)**
    *   '수정' 버튼 추가: `/submit?edit=slug` 경로로 이동
    *   '삭제' 버튼 추가: 클릭 시 확인 창을 띄우고 `deleteRule` API 호출
    *   삭제 요청 성공 시 PR 링크를 보여주는 인라인 알림 UI 구현

3.  **규칙 등록 페이지의 수정 모드 지원 (`src/app/submit/page.tsx`)**
    *   `useSearchParams`를 통해 `edit` 파라미터 감지
    *   수정 모드일 때 GitHub에서 기존 데이터를 로딩하여 폼 필드 자동 완성
    *   수정 시 `updateRule`, 신규 등록 시 `submitRule`을 호출하도록 분기 처리
    *   Next.js 클라이언트 사이드 데이터 로딩을 위한 `Suspense` 적용

4.  **상세 페이지 데이터 전달 수정 (`src/app/rules/[...slug]/page.tsx`)**
    *   `RuleActions` 컴포넌트에 `title`과 `author` 정보를 추가로 전달하도록 props 수정

## 결과
*   사용자가 기존 규칙을 직관적으로 수정 또는 삭제 요청할 수 있게 됨.
*   모든 변경 사항은 Pull Request를 통해 버전 관리 및 검토가 이루어짐.
*   `npm run build` 결과 이상 없음.

## 향후 과제
*   사용자 개인화 기능 (즐겨찾기, 최근 본 규칙 등) 구현 예정.
