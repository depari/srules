# 코딩 컨벤션 (Coding Conventions)

> 안정적인 정보 - 팀 합의된 컨벤션

## 언어 및 인코딩

- **답변 언어**: 한국어
- **코드 주석**: 한국어 우선
- **인코딩**: UTF-8

## 네이밍 컨벤션

### 파일명
| 유형 | 패턴 | 예시 |
|------|------|------|
| 인터페이스 | `I{Name}.ts` | `IFavoriteService.ts` |
| 서비스 | `{Name}Service.ts` | `FavoriteService.ts` |
| 어댑터 | `{Name}Adapter.ts` | `LocalStorageAdapter.ts` |
| 훅 | `use{Name}.ts` | `useFavoriteRule.ts` |
| 컴포넌트 | `{Name}.tsx` (PascalCase) | `RuleCard.tsx` |
| 테스트 | `{Name}.test.ts(x)` | `FavoriteService.test.ts` |
| E2E | `{feature}.spec.ts` | `favorites.spec.ts` |

### 변수/함수명
```typescript
// 변수: camelCase
const ruleId = 'rule-001';

// 함수: camelCase, 동사 시작
function addFavorite(ruleId: string) {}
function getRuleById(id: string) {}

// 상수: UPPER_SNAKE_CASE
const MAX_FAVORITES = 100;
const DEFAULT_LOCALE = 'ko';

// 타입/인터페이스: PascalCase
type Rule = { id: string; title: string };
interface IRuleService { ... }

// React 컴포넌트: PascalCase
const RuleCard: FC<Props> = () => {};
```

## Import 순서

```typescript
// 1. React/Next.js 관련
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import Link from 'next/link';

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query';

// 3. 내부 타입
import type { Rule } from '@/types/rule';

// 4. 내부 서비스/훅/유틸
import { useFavoriteRule } from '@/hooks/useRuleActions';
import { FavoriteService } from '@/services/FavoriteService';

// 5. 내부 컴포넌트
import { RuleCard } from './RuleCard';

// 6. 스타일
import styles from './Component.module.css';
```

## TypeScript 규칙

```typescript
// ✅ 명시적 타입
const rules: Rule[] = [];
function process(input: string): number { ... }

// ❌ any 타입 금지
const data: any = ...;

// ✅ unknown 사용 (타입 가드와 함께)
function handleUnknown(data: unknown) {
  if (typeof data === 'string') { ... }
}

// ✅ 옵셔널 체이닝
const title = rule?.title ?? '제목 없음';

// ✅ 환경변수 null 체크
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN이 설정되지 않았습니다');
```

## 에러 처리

```typescript
// 외부 API 호출은 반드시 try-catch
try {
  const result = await githubService.submit(rule);
  return result;
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API 오류:', error.message);
  }
  throw error;  // 재throw로 상위 처리
}
```

## 로깅 규칙

```typescript
// ❌ console.log 직접 사용 금지
console.log('debug:', data);

// ✅ warn/error만 허용 (프로덕션 의미 있는 로그만)
console.warn('경고: 토큰이 설정되지 않았습니다');
console.error('오류:', error.message);
```

## 보고서 작성 규칙

- **위치**: `reports/`
- **형식**: `report_YYYY-MM-DD_번호_작업설명.md`
- **예시**: `report_2026-04-18_01_ai_coding_agent_engineering_plan.md`
- **내용**: 목적, 변경사항, 테스트 결과, 다음 단계

## Git 커밋 컨벤션

### 형식
```
{Type}: {변경사항1}, {변경사항2}
```

### Type 목록
- `Add` - 신규 기능/파일 추가
- `Fix` - 버그 수정
- `Refactor` - 리팩토링
- `Test` - 테스트 추가/수정
- `Docs` - 문서 업데이트
- `Chore` - 빌드, 설정 변경

### 예시
```
Add: FavoriteService unit test, LocalStorageAdapter NPE fix
Fix: E2E test flakiness on CI, TypeScript strict mode violation
Refactor: Extract useRuleActions into separate hooks per ISP
```

## TDD 순서 (필수)

```
1. TC 작성     → npm test (FAIL)
2. 구현        → npm test (PASS)
3. 리팩토링    → npm test (PASS)
4. 빌드 확인   → npm run build
```
