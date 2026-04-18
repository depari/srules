# srules 코딩 스타일 가이드 (Gemini AI용)

이 파일은 Gemini Coding AI가 srules 프로젝트 코드를 생성할 때 따라야 할 스타일 가이드입니다.

---

## 필수 규칙

### 언어
- **답변**: 한국어
- **코드 주석**: 한국어 우선
- **인코딩**: UTF-8

### 개발 방법론 (TDD 필수)
```
1. TC 먼저 작성 (src/__tests__/)
2. npm test → FAIL 확인 (필수)
3. 최소 구현
4. npm test → PASS 확인
5. 100% PASS까지 반복
```

### TypeScript 엄격 모드
- `strict: true` 항상 준수
- `any` 타입 **절대 금지**
- `unknown` + 타입 가드 사용

---

## 네이밍 컨벤션

| 유형 | 패턴 | 예시 |
|------|------|------|
| 인터페이스 | `I` 접두사 | `IFavoriteService` |
| 서비스 | `Service` 접미사 | `FavoriteService` |
| 훅 | `use` 접두사 | `useFavoriteRule` |
| 컴포넌트 | PascalCase | `RuleCard` |
| 상수 | UPPER_SNAKE_CASE | `MAX_FAVORITES` |

---

## SOLID 원칙 적용 패턴

### SRP (단일 책임)
```typescript
// ✅ 각 클래스는 하나의 역할
class FavoriteService { /* 즐겨찾기만 */ }
class RecentViewService { /* 최근 본 규칙만 */ }

// ❌ 하나의 클래스에 여러 책임
class RuleManager { /* 즐겨찾기 + 최근 본 + 제출 + 검색 전부 */ }
```

### DIP (의존성 역전)
```typescript
// ✅ 인터페이스에 의존
class FavoriteService implements IFavoriteService {
  constructor(private storage: IStorage) {}
}

// ❌ 구현체에 직접 의존
class FavoriteService {
  private storage = new LocalStorageAdapter(); // 금지
}
```

---

## 파일 생성 순서 (SOLID 패턴)

새 서비스 생성 시 반드시 이 순서 준수:

1. **인터페이스 정의**: `src/services/interfaces/I{Name}Service.ts`
2. **실패 TC 작성**: `src/__tests__/services/{Name}Service.test.ts`
3. **TC 실행 확인** (FAIL): `npm test -- --testPathPattern={Name}`
4. **구현체 작성**: `src/services/{Name}Service.ts`
5. **TC PASS 확인**: `npm test`
6. **빌드 확인**: `npm run build`

---

## 컴포넌트 패턴

```tsx
// src/components/{category}/{Name}.tsx
import type { FC } from 'react';

interface {Name}Props {
  // 명시적 prop 타입 (any 금지)
}

// named export 사용 (default export 지양)
export const {Name}: FC<{Name}Props> = ({ prop1 }) => {
  return (
    <div>
      {/* 렌더링 로직만, 비즈니스 로직은 훅으로 분리 */}
    </div>
  );
};
```

---

## 환경 변수 사용

```typescript
// ✅ 환경 변수 + null check
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN이 설정되지 않았습니다');

// ❌ 하드코딩 금지
const token = 'ghp_xxxxx';
```

---

## 보고서 작성

작업 완료 시 `reports/` 폴더에 Markdown 보고서 작성:
- 형식: `report_YYYY-MM-DD_번호_설명.md`
- 내용: 목적, 변경사항, TC 결과, 빌드 결과
