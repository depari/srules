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
4. 빌드 확인 및 성공.

## 메모
- `output: export`를 사용할 때는 `next-intl`의 `setRequestLocale`이 필수적이다.
- Client Component에서는 `generateStaticParams`를 Export할 수 없으므로 Server Component Wrapper가 필요하다.
- 디렉토리 경로 지정 시 오타가 발생하지 않도록 주의가 필요하다 (`[locale]` vs `[locale/]`).
