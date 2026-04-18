# srules 프로젝트 Memory Bank

## 프로젝트 개요 (변경 없음)

- **이름**: Smart Rules Archive (srules)
- **목적**: 개발자를 위한 규칙 아카이빙 서비스
- **URL**: https://depari.github.io/srules/
- **저장소**: https://github.com/depari/srules

## 기술 스택 (안정적)

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14 | App Router |
| TypeScript | 5.x | strict 모드 |
| Tailwind CSS | 3.x | 스타일링 |
| Jest | 29.x | 단위 테스트 |
| Playwright | 1.x | E2E 테스트 |
| React Query | 5.x | 서버 상태 |
| Fuse.js | 7.x | 검색 |
| next-intl | - | i18n |

## 아키텍처 패턴 (안정적)

### 서비스 계층
```
src/services/
├── interfaces/           # 인터페이스 정의 (DIP)
│   ├── IStorage.ts
│   ├── IRuleService.ts
│   └── IGitHubService.ts
├── storage/              # 스토리지 어댑터
│   ├── LocalStorageAdapter.ts
│   └── ArrayStorageAdapter.ts
├── github/               # GitHub 서비스
└── FavoriteService.ts
    RecentViewService.ts
```

### 의존성 방향
```
Component → Custom Hook → I{Name}Service (인터페이스)
                                ↓
                         {Name}Service (구현체)
                                ↓
                          IStorage (인터페이스)
                                ↓
                        LocalStorageAdapter
```

## 코딩 컨벤션 (안정적)

- 언어: 한국어 답변, 한국어 주석
- 네이밍: 인터페이스 `I` 접두사, 훅 `use` 접두사
- 에러: try-catch + 명시적 에러 타입
- 환경변수: `process.env.NEXT_PUBLIC_*`
- 금지: `any`, `console.log`, 하드코딩

## 테스트 현황 (자주 변경)

| 구분 | 수량 | 상태 |
|------|------|------|
| 단위 테스트 | 65개 | ✅ 통과 |
| E2E 테스트 | 30개 | ✅ 통과 |
| 서비스 커버리지 | 100% | ✅ |

## 완료된 Phase (안정적)

- [x] Phase 1: 서비스 추상화 계층
- [x] Phase 2: 컴포넌트 책임 분리
- [x] Phase 3: GitHub API 리팩토링
- [x] Phase 4: E2E 테스트 (Playwright)
- [x] Phase 5: React Query 성능 최적화
- [x] Phase 6: 검색 고도화
- [x] Phase 7: CI/CD GitHub Actions
