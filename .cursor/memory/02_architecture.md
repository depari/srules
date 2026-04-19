# 아키텍처 패턴 (Architecture)

> 안정적인 정보 - 구조적 변경 시에만 업데이트

## 핵심 원칙: SOLID

```
S - Single Responsibility Principle (단일 책임)
O - Open/Closed Principle (개방-폐쇄)
L - Liskov Substitution Principle (리스코프 치환)
I - Interface Segregation Principle (인터페이스 분리)
D - Dependency Inversion Principle (의존성 역전)
```

## 계층 구조 (Layered Architecture)

```
┌─────────────────────────────────────────┐
│            UI Layer (Components)         │
│  - src/components/                       │
│  - src/app/[locale]/                     │
├─────────────────────────────────────────┤
│         Application Layer (Hooks)        │
│  - src/hooks/                            │
│  - src/hooks/queries/                    │
├─────────────────────────────────────────┤
│         Service Layer (Business Logic)   │
│  - src/services/                         │
│  - src/services/interfaces/              │
├─────────────────────────────────────────┤
│         Infrastructure Layer (Storage)   │
│  - src/services/storage/                 │
│  - src/services/github/                  │
└─────────────────────────────────────────┘
```

## 의존성 방향 (DIP)

```
Component
  → IService (인터페이스)  ← 구현체 ServiceImpl
  → IStorage (인터페이스)  ← 구현체 StorageAdapter
```

**핵심 규칙:** 위 레이어는 아래 레이어의 **인터페이스**에만 의존 (구현체 직접 참조 금지)

## 서비스 계층 패턴

### 인터페이스 정의 (src/services/interfaces/)

```typescript
// I{Name}Service.ts
export interface IFavoriteService {
  addFavorite(ruleId: string): void;
  removeFavorite(ruleId: string): void;
  isFavorite(ruleId: string): boolean;
  getFavorites(): string[];
}

export interface IStorage {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}
```

### 구현체 (src/services/)

```typescript
// {Name}Service.ts
export class FavoriteService implements IFavoriteService {
  constructor(private readonly storage: IStorage) {}  // DI

  addFavorite(ruleId: string): void {
    const favorites = this.getFavorites();
    this.storage.set('favorites', [...favorites, ruleId]);
  }
  // ...
}
```

### 스토리지 어댑터 (src/services/storage/)

```
LocalStorageAdapter   - 브라우저 LocalStorage (프로덕션)
ArrayStorageAdapter   - 인메모리 배열 (테스트용)
```

## 컴포넌트 패턴

### Atomic 컴포넌트 (단일 책임)
```tsx
// RuleCard.tsx - 렌더링만 담당
export const RuleCard: FC<{ rule: Rule }> = ({ rule }) => { ... }
```

### Composition 컴포넌트 (조합)
```tsx
// RuleActions.tsx - 훅을 통해 액션 조합
export const RuleActions: FC<{ ruleId: string }> = ({ ruleId }) => {
  const { onCopy } = useCopyRule(ruleId);
  const { isFavorite } = useFavoriteRule(ruleId);
  return <ActionButtons onCopy={onCopy} isFavorite={isFavorite} />;
}
```

### Orchestrator (페이지 레벨 조율)
```tsx
// SubmitClient.tsx - 전체 제출 흐름 조율
// 직접 비즈니스 로직 없이 훅과 컴포넌트를 조율
```

## 훅 패턴

### 단일 기능 훅 (ISP)
```typescript
// src/hooks/useRuleActions.ts
export function useCopyRule(ruleId: string) { ... }
export function useFavoriteRule(ruleId: string) { ... }
export function useShareRule(ruleId: string) { ... }
```

### React Query 훅 (서버 상태)
```typescript
// src/hooks/queries/useFavoriteQueries.ts
export function useFavoriteQuery(ruleId: string) {
  return useQuery({ queryKey: ['favorite', ruleId], queryFn: ... });
}
```

## GitHub 서비스 구조

```
src/services/github/
├── GitHubHttpClient.ts       # HTTP 클라이언트 (저수준)
├── GitOperationsService.ts   # Git 작업 (브랜치, 커밋)
├── PullRequestService.ts     # PR 관리
└── RuleSubmissionService.ts  # 규칙 제출 오케스트레이션 (고수준)
```

## 라우팅 구조 (Next.js App Router)

```
src/app/
└── [locale]/            # 다국어 (ko, en)
    ├── page.tsx         # 메인 페이지 (규칙 목록)
    ├── rules/[id]/      # 규칙 상세
    ├── categories/[category]/
    ├── tags/[tag]/
    ├── favorites/
    └── submit/
```
