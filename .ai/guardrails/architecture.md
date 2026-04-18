# 아키텍처 가드레일 (Architecture Guardrails)

이 파일은 srules 프로젝트의 아키텍처 원칙과 위반 감지 기준을 정의합니다.

---

## 1. 의존성 규칙 (DIP)

### 허용되는 의존성 방향

```
✅ UI (Component/Page)
    → Application (Hook)
        → Service Interface (IService)
            ← Service Implementation
                → Storage Interface (IStorage)
                    ← Storage Adapter
```

### 금지되는 의존성

```
❌ Component → ServiceImpl (구현체 직접 참조)
❌ Component → LocalStorageAdapter (인프라 직접 접근)
❌ Service → LocalStorageAdapter (인터페이스 없이)
❌ Hook → Service (인터페이스 없이)
```

### 위반 예시 감지

```typescript
// ❌ 아키텍처 위반 감지 패턴
// 컴포넌트에서 서비스 직접 new 호출
import { FavoriteService } from '@/services/FavoriteService';
const service = new FavoriteService(...);  // 금지!

// ✅ 올바른 패턴
import { useFavoriteRule } from '@/hooks/useRuleActions';
const { isFavorite } = useFavoriteRule(ruleId);
```

---

## 2. 레이어 책임 경계

### UI Layer (src/components/, src/app/)
```
✅ 허용:
  - JSX 렌더링
  - 이벤트 핸들러 연결 (훅에서 받은 것)
  - 조건부 렌더링

❌ 금지:
  - 비즈니스 로직 직접 작성
  - localStorage 직접 접근
  - API 호출
  - 복잡한 데이터 변환
```

### Application Layer (src/hooks/)
```
✅ 허용:
  - 서비스 호출 (인터페이스 통해)
  - React 상태 관리
  - 부수 효과 처리 (useEffect)

❌ 금지:
  - localStorage 직접 접근
  - API 직접 호출
  - 10줄 이상의 로직 (서비스로 위임)
```

### Service Layer (src/services/)
```
✅ 허용:
  - 비즈니스 로직
  - IStorage 통한 데이터 접근
  - 도메인 규칙 검증

❌ 금지:
  - React 훅 사용 (useEffect 등)
  - DOM 직접 접근
  - console.log (에러/경고만)
```

### Infrastructure Layer (src/services/storage/, src/services/github/)
```
✅ 허용:
  - 외부 시스템 통신
  - 데이터 직렬화/역직렬화

❌ 금지:
  - 비즈니스 규칙 포함
  - 상위 레이어 import
```

---

## 3. 파일 위치 규칙

| 무엇을 만드는가? | 어디에 만드는가? | 선행 조건 |
|----------------|----------------|---------|
| 새 서비스 | `src/services/{Name}Service.ts` | 인터페이스 먼저! |
| 서비스 인터페이스 | `src/services/interfaces/I{Name}Service.ts` | 없음 (가장 먼저) |
| 스토리지 어댑터 | `src/services/storage/{Name}Adapter.ts` | IStorage 인터페이스 |
| GitHub 서비스 | `src/services/github/{Name}Service.ts` | IGitHub 인터페이스 |
| 커스텀 훅 | `src/hooks/use{Name}.ts` | 관련 서비스 |
| React Query 훅 | `src/hooks/queries/use{Name}Queries.ts` | 서비스 |
| 컴포넌트 | `src/components/{category}/{Name}.tsx` | 훅 (필요 시) |
| 단위 테스트 | `src/__tests__/{category}/{Name}.test.ts` | 반드시 선행! |
| E2E 테스트 | `e2e/{feature}.spec.ts` | 기능 구현 완료 후 |

---

## 4. 컴포넌트 크기 가이드라인

```
권장: 컴포넌트 파일 150줄 이하
경고: 200줄 이상 → 분리 검토
필수: 300줄 이상 → 반드시 분리
```

**분리 기준:**
- 독립적으로 테스트 가능한가?
- 다른 곳에서도 재사용 가능한가?
- 하나의 역할만 담당하는가? (SRP)

---

## 5. 아키텍처 검토 체크리스트 (PR 리뷰 시)

- [ ] 인터페이스가 구현체보다 먼저 정의되어 있는가?
- [ ] 컴포넌트가 서비스를 직접 `new` 하지 않는가?
- [ ] 훅이 비즈니스 로직을 직접 처리하지 않는가?
- [ ] 서비스가 IStorage 인터페이스를 통해 데이터 접근하는가?
- [ ] 새 파일이 올바른 레이어에 위치하는가?
- [ ] 단방향 의존성이 유지되는가?
