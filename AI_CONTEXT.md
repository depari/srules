# AI Coding Agent 공통 컨텍스트

> 이 파일은 모든 AI Coding Agent (Cursor, Antigravity, Copilot, Gemini)가 참조하는 프로젝트 컨텍스트입니다.
> 프로젝트 루트에 위치하며 항상 최신 상태로 유지합니다.

---

## 프로젝트 개요

- **이름**: Smart Rules Archive (srules)
- **목적**: 개발자를 위한 규칙 아카이빙 서비스 (코딩 규칙, 베스트 프랙티스, AI 프롬프트 템플릿)
- **URL**: https://depari.github.io/srules/

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict 모드)
- **Styling**: Tailwind CSS
- **Testing**: Jest (단위, 65개) + Playwright (E2E, 30개)
- **State**: React Query (TanStack Query)
- **Search**: Fuse.js
- **i18n**: next-intl (한국어/영어)
- **Architecture**: SOLID 원칙 100% 적용

## 응답 규칙

- **언어**: 한국어로 답변
- **코드 주석**: 한국어 우선
- **인코딩**: UTF-8

## 개발 방법론

### TDD (필수)
1. TC (Test Case) 먼저 작성
2. `npm test` 실행 → **Failed** 확인
3. 최소한의 코드로 구현
4. `npm test` 실행 → **Pass** 확인
5. 100% Pass 될 때까지 반복

### SOLID 원칙
- **SRP**: 각 모듈 단일 책임
- **OCP**: 인터페이스 기반 확장
- **LSP**: 인터페이스 계약 준수
- **ISP**: 필요한 메서드만 의존
- **DIP**: 추상화에 의존 (구현체 직접 의존 금지)

## 파일 구조 핵심

```
src/
├── services/
│   ├── interfaces/     # I{Name}Service.ts 인터페이스 정의
│   └── *.ts           # 서비스 구현체
├── hooks/             # use{Name}.ts 커스텀 훅
├── components/        # React 컴포넌트
└── __tests__/         # 단위 테스트
e2e/                   # Playwright E2E 테스트
reports/               # 작업 보고서
docs/                  # 프로젝트 문서
```

## 절대 금지 사항 (Guardrails)

| 금지 | 대안 |
|------|------|
| `any` 타입 사용 | 명시적 타입 정의 |
| API 키 하드코딩 | `process.env.NEXT_PUBLIC_*` |
| `console.log` 직접 사용 | `console.warn/error` 또는 logger |
| 인터페이스 없이 서비스 직접 의존 | `I{Name}Service` 인터페이스 사용 |
| 테스트 없이 기능 구현 | TDD 사이클 필수 |
| `.env.local` git 추가 | `.gitignore`에 유지 |
| 빌드 깨는 코드 커밋 | `npm run build` 확인 후 커밋 |

## Git 규칙

- **커밋 메시지**: 구어체 아닌 나열 형태
  - ✅ `Add unit test for FavoriteService, Fix storage adapter null check`
  - ❌ `서비스 테스트를 추가했습니다`
- **커밋 시점**: 작업자(사용자) 확인 후 진행
- **브랜치**: feature/{기능명}, fix/{이슈}

## 보고서 작성

- **위치**: `reports/`
- **형식**: `report_[YYYY-MM-DD]_[번호]_[작업설명].md`
- **예시**: `reports/report_2026-04-18_01_ai_coding_agent_engineering_plan.md`

## 알림

- **채널**: Telegram AntigravityNotiHelper_bot
- **관리**: `.env.local` 파일의 `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID` 사용
- **시점**: 주요 작업 완료 시

---

*최종 업데이트: 2026-04-19
