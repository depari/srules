---
title: "VS Code + GitHub Copilot 완전 설정 가이드"
slug: "ai-agent/vscode-copilot-complete-guide"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["VS Code", "GitHub Copilot", "Copilot Instructions", "Prompts", "AI", "Setup Guide"]
category: ["AI Agent", "GitHub Copilot"]
difficulty: beginner
---

# VS Code + GitHub Copilot 완전 설정 가이드

## 개요

VS Code + GitHub Copilot Extension에서 프로젝트별 AI 동작을  
커스터마이징하는 완전한 설정 가이드입니다.

---

## 1. 기본 설정

### VS Code settings.json

```json
{
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.chat.localeOverride": "ko",
  "editor.inlineSuggest.enabled": true,
  "github.copilot.advanced": {
    "inlineSuggestCount": 3
  }
}
```

---

## 2. copilot-instructions.md — 핵심 설정

`.github/copilot-instructions.md` 파일이 저장소 전체에 자동 적용됩니다.

### 파일 위치

```
your-project/
└── .github/
    └── copilot-instructions.md   ← 여기에 작성
```

### 권장 내용 구조

```markdown
# 프로젝트 Copilot 지시사항

## 언어
- 한국어로 답변
- 코드 주석 한국어 우선

## 기술 스택
- Next.js 14 + TypeScript strict
- Jest + Playwright (TDD)
- SOLID 아키텍처

## 개발 원칙 (TDD)
1. TC 먼저 작성 (src/__tests__/)
2. npm test → FAIL 확인 (필수)
3. 구현
4. npm test → PASS 확인

## 코딩 패턴
- 서비스: 인터페이스 먼저 (src/services/interfaces/)
- 훅: 단일 기능 담당 (use{Name}.ts)
- 컴포넌트: 렌더링만, 비즈니스 로직 금지

## ⚠️ 절대 금지 (Guardrails)
| 금지 | 대안 |
|------|------|
| any 타입 | 명시적 타입 |
| API 키 하드코딩 | process.env.* |
| console.log | console.warn/error |
| 테스트 없는 구현 | TC 먼저 작성 |
| 빌드 깨는 코드 | npm run build 확인 |

## 파일 구조
- 인터페이스: src/services/interfaces/I{Name}Service.ts
- 서비스: src/services/{Name}Service.ts
- 훅: src/hooks/use{Name}.ts
- 컴포넌트: src/components/{category}/{Name}.tsx
- 단위 테스트: src/__tests__/{category}/{Name}.test.ts
- E2E: e2e/{feature}.spec.ts
- 보고서: reports/report_{date}_{num}_{desc}.md
```

---

## 3. Prompts 폴더 — 작업별 템플릿

`.github/prompts/` 폴더에 작업별 프롬프트 템플릿을 저장합니다.

```
.github/
├── copilot-instructions.md  # 전체 컨텍스트 (장기 메모리)
└── prompts/
    ├── feature-template.md  # 신규 기능 개발
    ├── bug-fix-template.md  # 버그 수정
    └── code-review.md       # 코드 리뷰
```

### feature-template.md 예시

```markdown
"다음 기능을 개발해줘: {기능 설명}"

순서:
1. I{Name}Service.ts 인터페이스 생성
2. {Name}Service.test.ts TC 작성 → FAIL 확인
3. {Name}Service.ts 구현
4. npm test → PASS 확인
5. npm run build 확인
6. reports/ 보고서 작성
```

---

## 4. Copilot Chat 활용법

### 컨텍스트 파일 참조

```
#file:.github/copilot-instructions.md 를 참조해서 개발해줘
#codebase 전체를 분석해서 아키텍처를 설명해줘
```

### 슬래시 커맨드

| 커맨드 | 용도 |
|--------|------|
| `/explain` | 선택 코드 설명 |
| `/fix` | 버그 수정 제안 |
| `/tests` | TC 자동 생성 |
| `/doc` | 문서 생성 |
| `/new` | 새 파일 생성 |

---

## 5. GitHub Actions 연동

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test          # TC PASS 확인
      - run: npm run build     # 빌드 확인
      - run: npm run lint      # 린트 확인
```

---

## 6. 효율적인 사용 팁

### 팁 1: 컨텍스트 명시

```
"#file:.github/copilot-instructions.md 의 개발 원칙에 따라
FavoriteService를 리팩토링해줘"
```

### 팁 2: TC 자동 생성 후 수정

```
"/tests" 커맨드로 기본 TC 생성 후
엣지 케이스와 에러 케이스 추가
```

### 팁 3: 코드 리뷰 자동화

```
"#file:.github/prompts/code-review.md 의 기준으로
이 PR을 리뷰해줘"
```
