---
title: "AI Coding Agent 하네스 엔지니어링 가이드"
slug: "ai-agent/harness-engineering"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["AI", "Harness", "TDD", "Workflow", "Cursor", "Copilot", "Best Practice"]
category: ["AI Agent", "Harness Engineering"]
difficulty: advanced
featured: true
---

# AI Coding Agent 하네스 엔지니어링 가이드

## 개요

**하네스(Harness)**는 AI Agent가 특정 작업을 수행할 때  
반드시 따라야 할 **구조화된 워크플로우**입니다.

"어떻게 만들어"가 아닌 **"이 순서대로 만들어"**를 강제합니다.

---

## 하네스가 필요한 이유

AI Agent에게 단순히 "기능을 만들어줘"라고 하면:
- 테스트 없이 구현 코드만 작성
- 인터페이스 없이 구현체 직접 생성
- 빌드 확인 생략
- SOLID 원칙 무시

→ **하네스로 올바른 순서를 강제합니다.**

---

## 신규 기능 개발 하네스

### Cursor MDC 방식 (`.cursor/rules/feature-harness.mdc`)

```markdown
---
description: 신규 기능 개발 하네스
alwaysApply: false
---

새 기능 구현 시 반드시 이 순서를 따르세요:

## Step 1: 인터페이스 정의
src/services/interfaces/I{Name}Service.ts 먼저 생성

## Step 2: 실패 TC 작성
src/__tests__/services/{Name}Service.test.ts 작성 후
`npm test` 실행 → FAIL 확인 (필수!)

## Step 3: 최소 구현
TC PASS 되는 최소한의 코드만 작성

## Step 4: PASS 확인
`npm test` 전체 PASS 확인

## Step 5: 마무리
`npm run build` 성공 확인
reports/ 보고서 작성
```

### GitHub Prompts 방식 (`.github/prompts/feature-template.md`)

Copilot Chat에서 이 파일을 참조하여 프롬프트를 구성합니다:

```markdown
"다음 기능을 개발해줘: {기능 설명}"

순서:
1. I{Name}Service.ts 인터페이스 생성
2. {Name}Service.test.ts TC 작성 → FAIL 확인
3. {Name}Service.ts 구현
4. npm test → PASS 확인
5. npm run build 확인
6. 보고서 작성
```

---

## 버그 수정 하네스

```markdown
버그 수정 시 반드시 이 순서를 따르세요:

1. **재현 TC 작성** (FAIL 확인 필수)
   \`\`\`typescript
   it('reproduces bug: #{이슈번호} - {버그 설명}', () => {
     // 버그를 재현하는 최소 코드
     expect(buggyFn()).toBe(expected); // FAIL!
   });
   \`\`\`

2. **원인 분석** - 근본 원인(Root Cause) 파악

3. **최소 수정** - 코드 변경 범위 최소화

4. **PASS + 회귀 확인**
   - npm test → PASS
   - 기존 TC 모두 PASS (회귀 없음)

5. **기록**
   - tasks/{taskname}/{date}_{num}_{설명}.md 작성
```

---

## 리팩토링 하네스

```markdown
리팩토링 황금 규칙:
"리팩토링 전후 외부 동작이 동일해야 합니다"

1. npm test → 현재 PASS 수 확인 (기준점)
2. 작은 단위로 변경
3. npm test → PASS 유지 확인
4. 반복 (2 → 3)
5. npm run build → 성공 확인
6. 기능 동작 수동 확인
```

---

## 하네스 적용 팁

### 팁 1: 단계별 확인을 명시적으로 요청

```
"다음 기능을 개발해줘. 각 단계마다 실행 결과를 보여줘.
특히 TC FAIL과 PASS를 반드시 확인해줘."
```

### 팁 2: 중단점 설정

```
"3단계(TC FAIL 확인)가 완료되면 나에게 확인을 받아줘.
확인 없이 다음 단계로 진행하지 마."
```

### 팁 3: 체크리스트 형태로 진행 상황 요청

```
"진행 후 완료된 항목을 체크리스트로 보여줘"

결과:
- [x] 인터페이스 정의
- [x] TC 작성 (FAIL 확인)
- [x] 구현
- [ ] TC PASS 확인 ← 현재 단계
```
