# 프로젝트 분석 및 개선 항목 보고서

**작성일**: 2026-04-04  
**작성자**: Antigravity AI  
**프로젝트**: Smart Rules Archive (srules)  
**버전**: v1.0.0

---

## 1. 프로젝트 개요

### 1.1 프로젝트 정의
- **Smart Rules Archive** (srules): 개발자들이 자신만의 코딩 규칙 및 베스트 프랙티스를 마크다운 형식으로 아카이빙하고 공유하는 플랫폼.
- cursor.directory와 유사한 경험을 제공하되, 개인화와 버전 관리에 초점을 맞춤.

### 1.2 핵심 기술 스택
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **데이터 처리**: gray-matter (Frontmatter 파싱), marked (Markdown 렌더링), fuse.js (클라이언트 검색)
- **테스팅**: Jest, Playwright (E2E)
- **국제화**: next-intl (ko/en)

---

## 2. 현재 작업 진행 상태 (Phase Progress)

### ✅ 완료된 작업 (Phase 1 & 2)
- [x] **프로젝트 기반 구축**: Next.js 16 + Tailwind 4 설정 완료.
- [x] **규칙 열람 시스템**: 메인 페이지, 규칙 목록, 카테고리/태그 필터링.
- [x] **검색 기능**: 빌드 타임 인덱싱 기반 `fuse.js` 실시간 검색.
- [x] **규칙 등록 시스템**: GitHub API를 이용한 브랜치 생성 및 PR 자동 생성 로직 완료.
- [x] **국제화(i18n)**: 한/영 지원 구조 및 번역 파일 적용.

### 🔄 진행 중인 작업 (Phase 3)
- [ ] **SOLID 원칙 기반 리팩토링**: 비대한 UI 컴포넌트의 로직을 서비스 및 훅으로 분리하는 작업 진행 중.
- [ ] **버전 관리 고도화**: Git History 연동 및 `react-diff-viewer` 기반의 Diff 뷰어 상세 구현 보완.
- [ ] **개인화 기능**: 즐겨찾기(Favorites) 및 최근 본 규칙 로직의 서비스 추상화 완료 후 UI 적용 단계.

---

## 3. 개선 항목 및 계획 (SOLID 기반)

분석 결과, 현재 프로젝트는 **SOLID 원칙**을 준수하는 고도화된 아키텍처로 전환 중이나 일부 잔존하는 기술 부채가 확인되었습니다.

### 3.1 SRP (단일 책임 원칙) 준수 강화
- **현황**: `RuleActions.tsx`, `SubmitClient.tsx` 등에서 UI 렌더링과 비즈니스 로직(API 호출, 다운로드 등)이 훅으로 많이 분리되었으나, 여전히 핸들러 내부에 직접적인 서비스 호출이 포함된 경우가 있음.
- **개선**: UI 컴포넌트는 오직 Presentation에만 집중하고, 모든 비즈니스 로직은 `useRuleService` 등을 통해 주입받아 수행하도록 완전 분리.

### 3.2 OCP 및 DIP (개방-폐쇄 및 의존권 역전 원칙) 적용
- **현황**: `IRuleService`, `IStorage` 등의 인터페이스가 `src/services/interfaces`에 정의되어 있으나, 일부 컴포넌트(`RuleActions.tsx` 등)가 여전히 `github.ts`의 구체 구현체인 `createGitHubClient`를 직접 호출함.
- **개선**: 컴포넌트가 구체 클래스가 아닌 인터페이스(`IRuleService`)에 의존하도록 리팩토링하여, 향후 API에서 다른 방식(Issue 기반 제안 등)으로 확장할 때 컴포넌트 코드를 수정하지 않도록 함.

### 3.3 테스트 코드 신뢰도 향상
- **현행**: `__tests__` 폴더에 핵심 로직에 대한 테스트가 존재함 (TDD 준수).
- **개선**: 서비스 계층이 추상화됨에 따라 Mocking을 활용한 단위 테스트 범위를 확대하고, 엣지 케이스(API 실패, 네트워크 오류 등)에 대한 견고한 대응 로직 테스트 추가.

---

## 4. 제안하는 다음 단계 (Next Actions)

1. **서비스 추상화 완료**: `RuleActions.tsx` 및 `SubmitClient.tsx` 의 잔여 구체 의존성을 `IRuleService` 인터페이스로 교체.
2. **버전 관리 UI 완성**: `VersionHistory` 상세 내역 표시 및 Diff 뷰어 사용자 경험 고도화.
3. **SEO 최적화**: Next.js 16의 Metadata API를 활용하여 규칙별 OG 이미지 및 메타 정보 동적 생성 적용.
4. **빌드 안정성 강화**: `npm run dev` 시 자동 실행되는 검색 인덱스 생성 스크립트의 성능 최적화.

---
**이 보고서는 사용자 요청에 따라 현재 프로젝트를 기반으로 작성되었습니다.**
