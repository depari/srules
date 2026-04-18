# 리팩토링 하네스 (Refactoring Harness)

기능 변경 없이 코드 구조를 개선할 때 이 하네스를 따릅니다.

---

## 황금 규칙

> **리팩토링 전후 외부 동작이 동일해야 합니다.**
> TC가 리팩토링 안전망 역할을 합니다.

---

## 체크리스트

### Phase 1: 현 상태 확인 (리팩토링 전)
- [ ] `npm test` 실행 → **현재 TC PASS 수/전체 수 확인**
- [ ] `npm run build` 성공 확인
- [ ] 리팩토링 대상 코드 범위 파악
- [ ] 리팩토링 목표 명확화 (무엇을 개선하는가?)

### Phase 2: 리팩토링 목표 분류

**SOLID 원칙 기준:**
- [ ] SRP 위반 → 클래스/함수 분리
- [ ] OCP 위반 → 인터페이스 기반 구조로 전환
- [ ] LSP 위반 → 인터페이스 계약 준수
- [ ] ISP 위반 → 인터페이스 분리
- [ ] DIP 위반 → 의존성 역전 적용

### Phase 3: 리팩토링 실행

**원칙:** 한 번에 작은 변경 → TC 확인 → 다음 변경

```bash
# 각 변경 후 반드시 TC 실행
npm test

# 빌드도 주기적으로 확인
npm run build
```

**일반적인 리팩토링 패턴:**

```typescript
// ① Extract Method (메서드 추출)
// Before
function doEverything() {
  // 100줄의 코드
}
// After
function doEverything() {
  step1();
  step2();
  step3();
}
function step1() { ... }

// ② Extract Interface (인터페이스 추출)
// Before: 구현체에 직접 의존
class Service {
  private storage = new LocalStorageAdapter();
}
// After: 인터페이스에 의존
class Service {
  constructor(private storage: IStorage) {}
}

// ③ Single Responsibility Split (책임 분리)
// Before: 하나의 큰 훅
function useRuleActions() {
  // copy, download, share, favorite, delete 모두
}
// After: 개별 훅으로 분리
function useCopyRule() { ... }
function useFavoriteRule() { ... }
```

### Phase 4: TC 리팩토링 (필요 시)
- [ ] 리팩토링된 구조에 맞게 TC 업데이트
- [ ] TC 코드 자체도 DRY/SOLID 원칙 적용
- [ ] `npm test` 전체 PASS 확인

### Phase 5: 최종 검증
- [ ] `npm test` → **리팩토링 전과 동일하거나 더 많은 TC PASS**
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 기능 동작 수동 확인 (주요 Use Case)

### Phase 6: 마무리
- [ ] `reports/` 보고서 작성 (리팩토링 전/후 비교)
- [ ] Telegram 알림 발송 (`bash scripts/notify.sh "리팩토링 완료"`)

---

## srules 주요 리팩토링 패턴

### 서비스 추출 패턴
```
Before: 컴포넌트 내부에 비즈니스 로직
After: src/services/{Name}Service.ts로 추출
       src/services/interfaces/I{Name}Service.ts 인터페이스 생성
       src/hooks/use{Name}.ts 훅으로 연결
```

### 훅 분리 패턴 (ISP)
```
Before: useRuleActions() - 모든 액션 포함
After:  useCopyRule()    - 복사만
        useFavoriteRule() - 즐겨찾기만
        useShareRule()   - 공유만
        useDeleteRule()  - 삭제만
```

### 스토리지 추상화 패턴
```
Before: 컴포넌트/서비스가 localStorage 직접 사용
After:  IStorage 인터페이스 
        LocalStorageAdapter (프로덕션)
        ArrayStorageAdapter (테스트)
```
