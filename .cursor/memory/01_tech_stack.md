# 기술 스택 (Tech Stack)

> 안정적인 정보 - 주요 기술 변경 시에만 업데이트

## Core Framework

| 기술 | 버전 | 역할 | 비고 |
|------|------|------|------|
| Next.js | 14.x | App Router 기반 SSG/SSR | GitHub Pages 정적 배포 |
| TypeScript | 5.x | strict 모드 필수 | `tsconfig.json` 참조 |
| React | 18.x | UI 라이브러리 | Server/Client Components 분리 |
| Node.js | 20.x LTS | 런타임 | - |

## 스타일링

| 기술 | 버전 | 역할 |
|------|------|------|
| Tailwind CSS | 3.x | 유틸리티 CSS |
| PostCSS | - | CSS 처리 |

## 상태 관리

| 기술 | 버전 | 역할 |
|------|------|------|
| TanStack Query (React Query) | 5.x | 서버 상태 관리 |
| React useState/useReducer | - | 로컬 UI 상태 |
| LocalStorage | - | 클라이언트 영속 상태 (즐겨찾기 등) |

## 데이터 및 검색

| 기술 | 버전 | 역할 |
|------|------|------|
| Fuse.js | 7.x | 퍼지 검색 |
| marked | - | Markdown → HTML 파싱 |
| highlight.js | - | 코드 구문 강조 |

## 국제화 (i18n)

| 기술 | 역할 |
|------|------|
| next-intl | 한국어/영어 다국어 지원 |
| 지원 언어 | `ko` (한국어), `en` (영어) |

## 테스트

| 기술 | 버전 | 역할 | 커버리지 목표 |
|------|------|------|------|
| Jest | 29.x | 단위 테스트 런너 | 서비스 100%, 전체 80%+ |
| @testing-library/react | - | React 컴포넌트 테스트 | - |
| Playwright | 1.x | E2E 테스트 | 주요 기능 100% |

## 코드 품질

| 기술 | 역할 |
|------|------|
| ESLint | 정적 분석, 규칙 강제 |
| TypeScript Compiler | 타입 체크 |

## 빌드 및 배포

| 기술 | 역할 |
|------|------|
| Next.js Static Export | 정적 사이트 빌드 (`npm run build`) |
| GitHub Actions | CI/CD 자동화 |
| GitHub Pages | 무료 정적 파일 호스팅 |

## 주요 스크립트

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드 + 정적 Export
npm test             # 단위 테스트 (Jest)
npm run test:e2e     # E2E 테스트 (Playwright)
npm run lint         # ESLint 검사
```

## 환경 변수 관리

- **개발**: `.env.local` (git 제외, 로컬 전용)
- **템플릿**: `.env.example` (git 포함, 팀 공유)
- **CI/CD**: GitHub Actions Secrets

### 주요 환경 변수

```
NEXT_PUBLIC_GITHUB_TOKEN     # GitHub API 토큰
NEXT_PUBLIC_GITHUB_OWNER     # GitHub 조직/사용자명
NEXT_PUBLIC_GITHUB_REPO      # 저장소 이름
NEXT_PUBLIC_BASE_PATH        # GitHub Pages 경로
TELEGRAM_TOKEN               # 텔레그램 봇 토큰
TELEGRAM_CHAT_ID             # 텔레그램 채팅 ID
```
