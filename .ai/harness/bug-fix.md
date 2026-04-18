# 버그 수정 하네스 (Bug Fix Harness)

버그 또는 문제점 개선 시 이 하네스를 따라 순서대로 진행합니다.

---

## 체크리스트

### Phase 1: 버그 재현 및 분석
- [ ] 버그 증상 명확히 기록
- [ ] 재현 조건 파악 (어떤 입력/상태에서 발생?)
- [ ] 관련 코드 파악 (`src/` 내 연관 파일)
- [ ] GitHub Issue 번호 확인 (있을 경우)

### Phase 2: 재현 TC 작성 (FAIL 확인 필수)
- [ ] 해당 버그를 재현하는 TC 작성
- [ ] `npm test -- --testNamePattern="reproduces bug"` 실행
- [ ] **FAIL 상태 확인** (TC가 버그를 올바르게 재현하는지 검증)

```typescript
// 버그 재현 TC 패턴
it('reproduces bug: #{이슈번호} - {버그 설명}', () => {
  // Arrange: 버그가 발생하는 조건 설정
  const service = new FavoriteService(new ArrayStorageAdapter());

  // Act: 버그를 발생시키는 동작
  service.addFavorite('');  // 빈 문자열로 호출 시 크래시 발생

  // Assert: 기대하는 (수정 후) 동작
  expect(service.getFavorites()).not.toContain('');  // 빈 값은 추가 금지
});
```

### Phase 3: 원인 분석
- [ ] 코드 추적으로 근본 원인(Root Cause) 파악
- [ ] 수정 범위 결정 (최소 변경으로 수정)
- [ ] 사이드 이펙트 가능성 검토

### Phase 4: 수정 구현
- [ ] 최소한의 코드 변경으로 버그 수정
- [ ] `npm test -- --testNamePattern="reproduces bug"` 실행
- [ ] **PASS 확인**
- [ ] 기존 테스트 전체 실행: `npm test`
- [ ] **기존 TC 모두 PASS 확인** (회귀 없음)

### Phase 5: 추가 엣지 케이스 검증
- [ ] 유사한 버그 패턴 추가 TC 작성 (예방)
- [ ] `npm test` 전체 PASS

### Phase 6: 검증 및 마무리
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] `tasks/{taskname}/{date}_{num}_{description}.md` 기록 작성
- [ ] Telegram 알림 발송 (`bash scripts/notify.sh "버그 #{번호} 수정 완료"`)

---

## 버그 기록 파일 템플릿

```markdown
# {date}_{num}_{버그설명}.md

## 버그 정보
- **이슈**: #{번호}
- **증상**: {어떤 문제가 발생했는가}
- **재현 조건**: {어떤 상황에서 발생}

## 근본 원인
{원인 분석 내용}

## 수정 내용
{변경한 코드/로직 요약}

## 검증
- TC: {테스트 이름} → PASS
- 전체 테스트: npm test → {통과/전체}
- 빌드: npm run build → 성공

## 예방 조치
{유사 버그 방지를 위한 추가 조치}
```

---

## 자주 발생하는 버그 패턴

### Null/Undefined 접근
```typescript
// ❌ 버그 패턴
const title = rule.title.trim();  // rule이 null이면 크래시

// ✅ 수정 패턴
const title = rule?.title?.trim() ?? '';
```

### LocalStorage 접근 (SSR 환경)
```typescript
// ❌ 버그 패턴
const data = localStorage.getItem('key');  // SSR에서 오류

// ✅ 수정 패턴
const data = typeof window !== 'undefined'
  ? localStorage.getItem('key')
  : null;
```

### 비동기 상태 경쟁 조건
```typescript
// ❌ 버그 패턴
useEffect(() => {
  fetchData().then(setData);
}, [id]);

// ✅ 수정 패턴 (cleanup 포함)
useEffect(() => {
  let cancelled = false;
  fetchData().then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, [id]);
```
