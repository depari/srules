---
title: "AI Coding Agent 프롬프트 엔지니어링 비교 가이드"
slug: "ai-agent/prompt-engineering-comparison"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["AI", "Prompt Engineering", "Cursor", "Antigravity", "Copilot", "Gemini", "Best Practice"]
category: ["AI Agent", "Prompt Engineering"]
difficulty: intermediate
featured: true
---

# AI Coding Agent 프롬프트 엔지니어링 비교 가이드

## 개요

4대 AI Coding Agent(Cursor IDE, Antigravity, VS Code + Copilot, VS Code + Gemini)에서
프롬프트 엔지니어링을 설정하는 방법과 각 Agent별 특징을 비교합니다.

---

## 비교 매트릭스

| 항목 | Cursor IDE | Antigravity | VS Code + Copilot | VS Code + Gemini |
|------|-----------|-------------|------------------|-----------------|
| **프롬프트 파일** | `.cursor/rules/*.mdc` | User Rules (IDE 설정) | `.github/copilot-instructions.md` | `.gemini/styleguide.md` |
| **적용 범위** | 파일 glob 패턴 | 전역 / 워크스페이스 | 전체 저장소 | 전체 저장소 |
| **자동 적용** | `alwaysApply: true` | 항상 자동 | 항상 자동 | 항상 자동 |
| **컨텍스트 범위** | `@codebase` 태깅 | 워크스페이스 자동 인식 | `#file`, `#codebase` | `@workspace` |

---

## 1. Cursor IDE — MDC 파일 방식

Cursor의 가장 강력한 기능은 **파일 패턴별 규칙 자동 적용**입니다.

### 구조

```
.cursor/
└── rules/
    ├── 00_global.mdc      # alwaysApply: true (전역)
    ├── 10_typescript.mdc  # *.ts, *.tsx 파일일 때만
    ├── 20_react.mdc       # *.tsx 파일일 때만
    ├── 30_testing.mdc     # *.test.ts 파일일 때만
    └── 50_security.mdc    # alwaysApply: true (보안)
```

### MDC 파일 형식

```markdown
---
description: TypeScript 코딩 규칙
globs: ["**/*.ts", "**/*.tsx", "!node_modules/**"]
alwaysApply: false
---

# TypeScript 규칙

- `any` 타입 사용 금지
- strict 모드 필수
- 인터페이스 I 접두사 사용
```

### 핵심 포인트
- `alwaysApply: true` → 파일 타입 무관 항상 적용
- `globs` → 특정 파일에만 선택적 적용
- 번호 접두사(00, 10, 20...)로 우선순위 제어

---

## 2. Antigravity — User Rules + AI_CONTEXT.md

Antigravity는 **IDE 전역 User Rules**와 **프로젝트별 컨텍스트 파일** 조합으로 동작합니다.

### User Rules 설정 위치
IDE 설정 → User Rules 섹션에 직접 입력

### AI_CONTEXT.md (프로젝트별 컨텍스트)

```markdown
# AI_CONTEXT.md (프로젝트 루트)

## 프로젝트
Next.js 14 + TypeScript + SOLID 아키텍처

## 규칙
- 한국어로 답변
- TDD 필수 (TC → FAIL → 구현 → PASS)
- 빌드 항상 유지

## 금지
- any 타입, 하드코딩 API 키, 테스트 없는 구현
```

### 핵심 포인트
- User Rules는 **모든 프로젝트**에 전역 적용
- `AI_CONTEXT.md`로 **프로젝트별** 컨텍스트 추가
- Knowledge Items(KI)로 장기 메모리 관리

---

## 3. VS Code + GitHub Copilot — Instructions 파일

`.github/copilot-instructions.md` 파일이 저장소 전체에 자동 적용됩니다.

```markdown
# 프로젝트 Copilot 지시사항

## 언어
한국어로 답변

## 기술 스택
Next.js 14, TypeScript strict, Jest, Playwright

## 개발 원칙
- TDD: 테스트 먼저, 구현 나중
- SOLID 원칙 100% 준수

## 절대 금지
- any 타입, API 키 하드코딩, console.log 직접 사용
```

### 핵심 포인트
- `.github/copilot-instructions.md` 단일 파일로 관리
- VS Code settings에서 `"github.copilot.chat.localeOverride": "ko"` 설정
- `.github/prompts/` 폴더로 작업별 템플릿 분리 가능

---

## 4. VS Code + Gemini — styleguide.md

`.gemini/styleguide.md` 파일이 Gemini Extension의 컨텍스트로 동작합니다.

```markdown
# 코딩 스타일 가이드 (Gemini AI용)

## 필수 규칙
- TypeScript strict 모드
- SOLID 원칙 준수
- TDD 방식 개발

## 파일 생성 순서
1. 인터페이스 먼저
2. 실패 TC 작성
3. 구현
4. TC PASS 확인
```

---

## 공통 Best Practice

### BP-01: 공통 컨텍스트 파일로 멀티 Agent 동기화

```markdown
# AI_CONTEXT.md (프로젝트 루트)
# 모든 AI Agent가 참조하는 단일 진실 공급원

## 프로젝트 핵심 정보
## 개발 규칙
## 금지 사항
```

### BP-02: 계층화된 규칙 (Cursor)

```
전역 규칙 (alwaysApply: true)
  └── 언어, 커밋, 빌드 유지

파일별 규칙 (globs)
  └── TypeScript → TS 규칙
  └── *.test.ts → TDD 규칙
  └── *.tsx → React 규칙
```

### BP-03: 구체적인 예시로 규칙 명확화

```markdown
## 커밋 메시지

✅ 올바른 예: `Add: FavoriteService unit test, Fix storage NPE`
❌ 잘못된 예: `테스트를 추가했습니다`
```
