---
title: "AI Coding Agent Best Practices 13선"
slug: "ai-agent/best-practices-collection"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["AI", "Best Practice", "Cursor", "Antigravity", "Copilot", "Gemini", "TDD", "SOLID", "Memory"]
category: ["AI Agent", "Best Practice"]
difficulty: intermediate
featured: true
---

# AI Coding Agent Best Practices 13선

## 개요

4대 AI Coding Agent를 효율적으로 활용하기 위한  
실전 Best Practice 13가지를 소개합니다.

---

## BP-01: 공통 컨텍스트 파일로 멀티 Agent 동기화

모든 AI Agent가 참조하는 단일 진실 공급원(Single Source of Truth)을 만듭니다.

```markdown
# AI_CONTEXT.md (프로젝트 루트)

## 프로젝트
Smart Rules Archive - 개발자 규칙 아카이빙 서비스

## 규칙
- 답변 언어: 한국어
- 개발 방법론: TDD
- 아키텍처: SOLID
- 빌드: 항상 유지

## 금지
- any 타입, API 키 하드코딩, 테스트 없는 구현
```

**효과:** Cursor → Antigravity → Copilot 전환 시에도 동일한 컨텍스트 유지

---

## BP-02: MDC 파일로 TDD 워크플로우 강제 (Cursor)

`alwaysApply: true` 규칙으로 TDD를 자동 강제합니다.

```markdown
---
description: TDD 강제
globs: ["src/**/*.ts"]
alwaysApply: true
---

새 함수/클래스 구현 시 반드시:
1. src/__tests__/ 에 실패 TC 먼저 작성
2. npm test → FAIL 확인
3. 최소 구현
4. npm test → PASS 확인

⚠️ TC 없이 구현 코드 먼저 작성 금지
```

---

## BP-03: ESLint로 보안 가드레일 자동화

AI가 생성한 코드를 린터가 자동으로 차단합니다.

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/^ghp_|^sk-|^AIza/]",
        "message": "API 키 하드코딩 금지"
      }
    ]
  }
}
```

---

## BP-04: 인터페이스 우선 개발 (SOLID DIP)

AI에게 "인터페이스 먼저, 구현은 나중에"를 명시합니다.

```typescript
// 1단계: 인터페이스만 정의 (구현 없음)
export interface IFavoriteService {
  addFavorite(ruleId: string): void;
  isFavorite(ruleId: string): boolean;
}

// 2단계: 실패 TC 작성
// 3단계: 구현
export class FavoriteService implements IFavoriteService { ... }
```

**프롬프트:**
```
"새 서비스를 만들기 전에 반드시 인터페이스를 먼저 정의하고,
실패하는 TC를 작성한 후 구현해줘"
```

---

## BP-05: 아키텍처 다이어그램을 Instructions에 포함

```markdown
# .github/copilot-instructions.md

## 올바른 의존성 방향

Component → IService (인터페이스) ← ServiceImpl
                ↓
           IStorage (인터페이스) ← LocalStorageAdapter

✅ Component → IService
❌ Component → ServiceImpl (직접 의존 금지)
```

---

## BP-06: 멀티 에이전트 전환 체크리스트

```markdown
# Agent 전환 시 체크리스트

Cursor → Antigravity:
1. .cursor/memory/04_active_context.md 업데이트
2. 완료/미완료 항목 명시
3. Antigravity에서 해당 파일 참조 요청

공통 원칙:
- AI_CONTEXT.md 항상 최신 유지
- 완료 작업 reports/ 에 기록
- 미결 작업 active_context.md 에 명시
```

---

## BP-07: 버그 재현 TC 먼저 작성

```typescript
// 버그 수정 시 항상 이 패턴 사용
it('reproduces bug: #123 - 빈 ruleId로 즐겨찾기 시 크래시', () => {
  const service = new FavoriteService(new ArrayStorageAdapter());
  
  // FAIL이어야 함 (버그 재현)
  expect(() => service.addFavorite('')).not.toThrow();
  expect(service.getFavorites()).not.toContain('');
});
```

**프롬프트:**
```
"버그를 수정하기 전에 반드시 재현하는 TC를 먼저 작성하고
FAIL 상태를 확인해줘"
```

---

## BP-08: 컨텍스트 자동 업데이트 스크립트

```bash
#!/bin/bash
# scripts/update-ai-context.sh

DATE=$(date +"%Y-%m-%d")

cat > .cursor/memory/05_progress.md << EOF
# 진행 현황 (자동 업데이트: $DATE)

## 최근 커밋
$(git log --oneline -10)

## 현재 브랜치: $(git branch --show-current)
EOF

echo "✅ AI 컨텍스트 업데이트 완료"
```

---

## BP-09: 역할별 MDC 파일 분리 (Cursor 전용)

```
.cursor/rules/
├── 00_global.mdc      # alwaysApply: true (언어, TDD, Git)
├── 10_typescript.mdc  # *.ts, *.tsx에만
├── 20_react.mdc       # *.tsx에만
├── 30_testing.mdc     # *.test.ts에만
├── 40_git.mdc         # Git 작업 시
└── 50_security.mdc    # alwaysApply: true (보안)
```

**핵심:** 파일 컨텍스트에 맞는 규칙만 자동 적용 → 토큰 낭비 없이 정확한 가이드

---

## BP-10: Telegram 알림으로 작업 완료 추적

```bash
# scripts/notify.sh - 모든 Agent 공통 사용
#!/bin/bash
export $(grep -v '^#' .env.local | xargs)
curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
  -d "chat_id=$TELEGRAM_CHAT_ID" \
  --data-urlencode "text=✅ [프로젝트] $1"

# 사용법
bash scripts/notify.sh "FavoriteService 리팩토링 완료"
```

---

## BP-11: 코드 리뷰 프롬프트 템플릿화

```markdown
# .github/prompts/code-review.md

이 PR을 다음 기준으로 리뷰해줘:

SOLID 원칙:
- [ ] SRP: 단일 책임?
- [ ] DIP: 인터페이스에 의존?

테스트:
- [ ] 새 기능에 TC 있음?
- [ ] TC PASS 100%?

보안:
- [ ] 하드코딩 비밀값 없음?
- [ ] any 타입 없음?
```

---

## BP-12: 메모리 레이어화 전략

```
영구 (변경 거의 없음): AI_CONTEXT.md, docs/, README.md
장기 (안정적):         .cursor/memory/00~03_*.md, copilot-instructions.md
중기 (주기적 갱신):    reports/, tasks/
단기 (매 세션):        04_active_context.md, 대화 컨텍스트
```

---

## BP-13: Agent별 최적 사용 시나리오

| 시나리오 | 최적 Agent | 이유 |
|---------|-----------|------|
| 대규모 리팩토링 | **Antigravity** | 전체 codebase 파악, KI 시스템 |
| 빠른 코드 완성 | **Cursor** | 인라인 완성 최적화 |
| PR 코드 리뷰 | **Copilot** | GitHub 통합, PR 컨텍스트 |
| 문서 작성 | **Gemini** | 긴 컨텍스트 처리 우수 |
| TDD 사이클 | **Cursor** | 즉각적 피드백 |
| 아키텍처 설계 | **Antigravity** | 전체 구조 파악 우수 |
| 버그 추적 | **Copilot** | GitHub Issues 통합 |

---

## 예시

- 실제 프롬프트 및 사용 사례는 관련 IDE 가이드 문서를 참조하십시오.
- 프로젝트 루트의 `AI_CONTEXT.md`와 `./scripts` 폴더의 자동화 스크립트 활용 예시를 확인하세요.
