---
title: "Cursor IDE 완전 설정 가이드 (MDC + Memory Bank)"
slug: "ai-agent/cursor-ide-complete-guide"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["Cursor", "MDC", "Memory Bank", "Rules", "AI", "Setup Guide"]
category: ["AI Agent", "Cursor"]
difficulty: intermediate
---

# Cursor IDE 완전 설정 가이드 (MDC + Memory Bank)

## 개요

Cursor IDE에서 MDC(Markdown with Config) 규칙 파일과  
Memory Bank 패턴을 활용한 완전한 AI 작업 환경 구성 가이드입니다.

---

## 1. 디렉토리 구조

```
your-project/
├── .cursor/
│   ├── rules/                    # AI 프롬프트 규칙
│   │   ├── 00_global.mdc         # 전역 (항상 적용)
│   │   ├── 10_typescript.mdc     # TS 파일에만
│   │   ├── 20_react.mdc          # TSX 파일에만
│   │   ├── 30_testing.mdc        # 테스트 파일에만
│   │   ├── 40_git.mdc            # Git 작업 시
│   │   └── 50_security.mdc       # 보안 (항상 적용)
│   └── memory/                   # Memory Bank
│       ├── 00_project_brief.md   # 프로젝트 개요 (불변)
│       ├── 01_tech_stack.md      # 기술 스택 (안정)
│       ├── 02_architecture.md    # 아키텍처 (안정)
│       ├── 03_conventions.md     # 컨벤션 (안정)
│       ├── 04_active_context.md  # 현재 작업 (변동)
│       └── 05_progress.md        # 자동 업데이트 (변동)
└── AI_CONTEXT.md                 # 공통 컨텍스트 (모든 Agent)
```

---

## 2. MDC 파일 작성법

### 전역 규칙 (00_global.mdc)

```markdown
---
description: 프로젝트 전역 규칙
alwaysApply: true
---

# 전역 규칙

## 언어
- 모든 답변은 한국어로 작성
- 코드 주석 한국어 우선

## 개발 방법론 (TDD)
1. TC 먼저 작성
2. npm test → FAIL 확인 (필수)
3. 구현
4. npm test → PASS 확인

## Git
- 커밋: 구어체 ❌, 나열 형태 ✅
- 예: "Add: FavoriteService test, Fix storage NPE"
```

### 파일별 규칙 (10_typescript.mdc)

```markdown
---
description: TypeScript 규칙
globs: ["**/*.ts", "**/*.tsx", "!node_modules/**"]
alwaysApply: false
---

# TypeScript 규칙

- `any` 타입 절대 금지
- strict 모드 필수
- 인터페이스 I 접두사 사용
```

---

## 3. alwaysApply vs globs

| 설정 | 동작 | 사용 시기 |
|------|------|-----------|
| `alwaysApply: true` | 모든 파일/상황에 적용 | 언어, 보안, 커밋 규칙 |
| `globs: ["**/*.ts"]` | 해당 파일 편집 시만 적용 | 언어별 코딩 규칙 |
| `alwaysApply: false` (globs 없음) | 수동 선택 시만 적용 | 특수 작업 하네스 |

---

## 4. Memory Bank 초기화

### 00_project_brief.md

```markdown
# 프로젝트 개요

## 목적
{프로젝트 목적 한 줄}

## 기술 스택
- Framework: Next.js 14
- Language: TypeScript (strict)
- Testing: Jest + Playwright
- Architecture: SOLID

## 핵심 규칙
- TDD 필수
- 빌드 항상 유지
- 한국어 답변
```

### 04_active_context.md (매 세션 업데이트)

```markdown
# 현재 작업 컨텍스트

## 세션: {날짜}

## 현재 작업
{지금 하고 있는 작업}

## 완료된 항목
- [x] 완료한 것
- [ ] 미완료 항목  ← 중단점

## 다음 세션 시작 시
이 파일 먼저 읽고 미완료 항목부터 재개
```

---

## 5. 세션 운영 Best Practice

### 시작 시

```
1. bash scripts/update-ai-context.sh
2. Cursor에게: ".cursor/memory/ 파일들을 읽고 현재 상태 파악 후 시작해줘"
```

### 작업 중

```
→ AI가 자동으로 관련 MDC 규칙 참조 (globs 기반)
→ 중요 결정은 .cursor/memory/03_conventions.md 에 추가 요청
```

### 종료 시

```
1. "04_active_context.md를 지금 상태로 업데이트해줘"
2. 완료된 경우 reports/ 보고서 작성
```

---

## 6. 주의사항

- `.gitignore`에 `04_active_context.md`, `05_progress.md` 추가 (개인 세션 정보)
- `00~03_*.md`는 git 추적 권장 (팀 공유 가능)
- MDC 파일은 반드시 git 추적 (팀 전체 규칙 공유)
