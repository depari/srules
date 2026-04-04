# Turbopack Panic 에러 개선 기록

## 1. 문제 상황
- `npm run dev` 실행 중 Turbopack에서 예기치 않은 에러(`Panic`) 발생. 
- 에러 로그 확인 결과 `Next.js package not found`로 인한 캐시 불일치 또는 경로 탐색 실패가 원인으로 분석됨.
- 특히 `/[locale]/rules/[...slug]/page` 엔드포인트 처리 중 문제 발생.

## 2. 원인 분석
- Next.js 16/Turbopack의 자동 캐시 시스템(`Turbo cache`)이 불완전하거나, 이전에 수행한 `next build` 결과와 충돌하여 발생할 수 있음. 
- 포트 충돌(`Port 3000 in use`) 등으로 비정상 종료된 프로세스가 남긴 오염된 캐시가 원인으로 추측됨.

## 3. 개선 작업
- **즉각 조치**: `.next` 디렉토리와 관련 캐시 데이터를 수동으로 삭제하여 상태 초기화 (`rm -rf .next`).
- **영구 개선**: 향후 동일 문제 발생 시 손쉽게 해결할 수 있도록 `package.json`에 `clean` 스크립트 추가.
  - `"clean": "rm -rf .next .swc out"` 추가 완료.
- **검증**: `npm run dev` 재실행을 통해 서버가 정상적으로 포트 3001에서 "Ready" 상태가 됨을 확인.

## 4. 검증 결과
- **Step 1 (테스트)**: `npm run dev` 실행 시 포트 3001에서 정상 기동됨을 확인 (400ms 내외).
- **Step 2 (스크립트)**: `npm run clean`이 정상적으로 `.next` 폴더를 삭제함을 확인.

**조치 완료**: 이제 `npm run clean && npm run dev`를 통해 안전하게 개발 서버를 재시작할 수 있습니다.
