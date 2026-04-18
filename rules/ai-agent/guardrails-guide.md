---
title: "AI Coding Agent 가드레일(Guardrails) 설정 가이드"
slug: "ai-agent/guardrails-guide"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["AI", "Guardrails", "Security", "Cursor", "Copilot", "Gemini", "Best Practice"]
category: ["AI Agent", "Guardrails"]
difficulty: intermediate
featured: true
---

# AI Coding Agent 가드레일(Guardrails) 설정 가이드

## 개요

AI Agent가 위험하거나 잘못된 코드를 생성하지 않도록 제한하는
**가드레일(Guardrails)** 설정 방법을 정리합니다.

---

## 가드레일이 필요한 이유

AI Agent가 자동으로 생성하는 코드에는 다음과 같은 위험이 있습니다:

- API 키 하드코딩 (보안 누출)
- `any` 타입 남용 (TypeScript 타입 안전성 파괴)
- 테스트 없는 기능 구현 (TDD 위반)
- 빌드를 깨는 코드 추천
- `eval()` 등 위험한 패턴

---

## 1. Cursor — MDC 파일 가드레일

`alwaysApply: true`인 MDC 파일로 전역 가드레일을 구현합니다.

```markdown
---
description: 보안 가드레일 (전역 적용)
alwaysApply: true
---

## 🚨 절대 금지 사항

### API 키 하드코딩 금지
\`\`\`typescript
// ❌ 절대 금지
const token = "ghp_xxxxx";

// ✅ 허용
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
if (!token) throw new Error('토큰 미설정');
\`\`\`

### any 타입 금지
\`\`\`typescript
// ❌ 금지
const data: any = response;

// ✅ 허용
const data: Rule[] = response;
\`\`\`

### console.log 금지
\`\`\`typescript
// ❌ 금지
console.log('debug:', data);

// ✅ 허용
console.warn('경고:', message);
\`\`\`
```

---

## 2. ESLint — 자동 가드레일

린터로 빌드 단계에서 금지 패턴을 강제합니다.

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/^ghp_|^sk-|^AIza/]",
        "message": "API 키 하드코딩 금지. process.env를 사용하세요."
      }
    ]
  }
}
```

---

## 3. Copilot Instructions — 가드레일 명시

`.github/copilot-instructions.md`에 금지 사항을 구조화하여 작성합니다.

```markdown
## ⚠️ 절대 금지 (Guardrails)

| 금지 항목 | 이유 | 대안 |
|----------|------|------|
| `any` 타입 | 타입 안전성 파괴 | 명시적 타입 또는 `unknown` |
| API 키 하드코딩 | 보안 사고 | `process.env.*` |
| `console.log` | 프로덕션 오염 | `console.warn/error` |
| 테스트 없는 구현 | TDD 위반 | TC 먼저 작성 |
| 빌드 깨는 코드 | CI/CD 장애 | `npm run build` 확인 후 제안 |
```

---

## 4. Gemini — guardrails.md

`.gemini/guardrails.md` 파일에 제약 조건 정의:

```markdown
## 코드 생성 제약
- TypeScript any 타입 생성 금지
- 환경변수 없이 API 키 하드코딩 금지
- 테스트 없는 비즈니스 로직 금지

## 파일 수정 제약
- .env.local 수정 제안 금지
- tsconfig strict 완화 금지
- package.json scripts 임의 변경 금지
```

---

## 가드레일 계층화 전략

```
레이어 1: IDE 규칙 파일 (실시간 경고)
  → .cursor/rules/50_security.mdc
  → .github/copilot-instructions.md
  → .gemini/guardrails.md

레이어 2: ESLint (코드 작성 중 경고)
  → no-explicit-any
  → no-console
  → no-restricted-syntax

레이어 3: TypeScript 컴파일러 (빌드 타임)
  → strict: true
  → noImplicitAny: true

레이어 4: CI/CD (PR 차단)
  → npm run lint (실패 시 머지 차단)
  → npm test (실패 시 머지 차단)
```

---

## 보안 체크리스트 (코드 리뷰 시)

- [ ] 하드코딩된 API 키/토큰 없음
- [ ] `any` 타입 없음
- [ ] `eval()`, `innerHTML` 직접 할당 없음
- [ ] 모든 외부 입력 검증 (zod 등)
- [ ] `.env.local` git 스테이징 안 됨
- [ ] 에러 메시지에 민감 정보 없음
