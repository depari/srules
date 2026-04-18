# 신규 기능 개발 하네스 (New Feature Harness)

모든 신규 기능 개발 시 이 하네스를 따라 순서대로 진행합니다.

---

## 체크리스트

### Phase 1: 분석 및 설계
- [ ] 요구사항 명확화 (무엇을 구현하는가?)
- [ ] 기존 코드베이스 영향 범위 분석
- [ ] 관련 인터페이스 파악 (`src/services/interfaces/`)
- [ ] 구현 방식 결정 (서비스? 훅? 컴포넌트?)

### Phase 2: 인터페이스 정의 (DIP)
- [ ] `src/services/interfaces/I{Name}Service.ts` 생성
- [ ] 메서드 시그니처 정의 (구현 없음)

```typescript
// src/services/interfaces/I{Name}Service.ts
export interface I{Name}Service {
  // 핵심 메서드만 (ISP: 필요한 것만)
  method1(param: Type): ReturnType;
  method2(): void;
}
```

### Phase 3: TDD - 실패 TC 작성 (FAIL 확인 필수)
- [ ] `src/__tests__/services/{Name}Service.test.ts` 생성
- [ ] `npm test -- --testPathPattern={Name}Service` 실행
- [ ] **FAIL 상태 스크린샷/로그 확인** (반드시!)

```typescript
// src/__tests__/services/{Name}Service.test.ts
import { {Name}Service } from '../../services/{Name}Service';
import { ArrayStorageAdapter } from '../../services/storage/ArrayStorageAdapter';

describe('{Name}Service', () => {
  let service: {Name}Service;

  beforeEach(() => {
    service = new {Name}Service(new ArrayStorageAdapter());
  });

  describe('method1', () => {
    it('should {예상 동작} when {조건}', () => {
      // Arrange
      const input = '...';
      // Act
      const result = service.method1(input);
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Phase 4: 최소 구현 (PASS 목표)
- [ ] `src/services/{Name}Service.ts` 생성
- [ ] TC가 PASS 되는 최소한의 코드만 작성
- [ ] `npm test -- --testPathPattern={Name}Service` 실행
- [ ] **PASS 확인**

```typescript
// src/services/{Name}Service.ts
import type { I{Name}Service } from './interfaces/I{Name}Service';
import type { IStorage } from './interfaces/IStorage';

export class {Name}Service implements I{Name}Service {
  constructor(private readonly storage: IStorage) {}

  method1(param: string): ReturnType {
    // 최소 구현
  }
}
```

### Phase 5: 엣지 케이스 TC 추가
- [ ] 빈 입력, null, undefined, 경계값 TC 추가
- [ ] 에러 케이스 TC 추가
- [ ] `npm test` 전체 PASS 확인

### Phase 6: 통합 (훅/컴포넌트)
- [ ] 필요 시 `src/hooks/use{Name}.ts` 작성
- [ ] 필요 시 컴포넌트에 연결
- [ ] 필요 시 E2E 테스트 업데이트 (`e2e/`)

### Phase 7: 검증 및 마무리
- [ ] `npm test` 전체 PASS (TC 100%)
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] `reports/` 보고서 작성
- [ ] Telegram 알림 발송 (`bash scripts/notify.sh "기능 구현 완료"`)

---

## 빠른 참조: 공통 패턴

### 스토리지 의존 서비스
```typescript
export class {Name}Service implements I{Name}Service {
  private readonly KEY = '{name}_data';

  constructor(private readonly storage: IStorage) {}

  getData(): SomeType[] {
    return this.storage.get<SomeType[]>(this.KEY) ?? [];
  }

  setData(data: SomeType[]): void {
    this.storage.set(this.KEY, data);
  }
}
```

### GitHub API 연동 서비스
```typescript
export class {Name}Service implements I{Name}Service {
  constructor(private readonly httpClient: GitHubHttpClient) {}

  async fetchData(): Promise<SomeType> {
    try {
      return await this.httpClient.get<SomeType>('/endpoint');
    } catch (error) {
      console.error('{Name}Service fetchData 실패:', error);
      throw error;
    }
  }
}
```
