# i18n 설정 작업 기록

## 작업 목표
- Smart Rules Archive 서비스의 다국어 지원 (KO, EN)
- 정적 사이트 생성(SSG) 지원을 위한 빌드 오류 해결

## 진행 과정
1. `next-intl` 설치 및 기본 설정.
2. `src/app/[locale]` 구조로 라우팅 마이그레이션.
3. 정적 빌드 오류 해결:
    - ghost directories(`[locale/]` 등) 정리.
    - `generateStaticParams` 추가.
    - 서버 컴포넌트에서 `useTranslations` 대신 `getTranslations` 사용.
    - 클라이언트 컴포넌트와 서버 컴포넌트의 entry point 분리.
    - `next.config.ts` 플러그인 연동.
    - `setRequestLocale` 적용으로 headers() 문제 해결.
    - `middleware.ts` 제거 (Static Export 호환불가).
    - `src/app/(index)` 라우트 그룹 생성하여 루트(`/`) 리다이렉트 처리.
    - `footer` 네임스페이스 번역 키 누락 수정.
    - `next.config.ts`의 `basePath` 설정을 `process.env.GH_PAGES`에 따라 조건부 적용하도록 수정.
    - Footer 링크 페이지(`terms`, `privacy`, `docs`) 추가 및 Async Component 호환성 수정 (`params` await 처리).

## 메모
- **Next.js 15**부터 `params`는 Promise이므로 반드시 `await` 처리해야 한다.
- `output: export`에서는 Middleware를 사용할 수 없다. 대신 루트 페이지에서 리다이렉트를 처리해야 한다.
- `basePath`가 설정되어 있으면 로컬 개발 시 리소스 경로가 깨질 수 있으므로 환경변수로 제어하는 것이 좋다.
