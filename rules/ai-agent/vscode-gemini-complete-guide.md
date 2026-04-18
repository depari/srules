---
title: "VS Code + Gemini Coding AI 완전 설정 가이드"
slug: "ai-agent/vscode-gemini-complete-guide"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["VS Code", "Gemini", "Google AI", "styleguide", "guardrails", "AI", "Setup Guide"]
category: ["AI Agent", "Gemini"]
difficulty: beginner
---

# VS Code + Gemini Coding AI 완전 설정 가이드

## 개요

VS Code용 Gemini Coding AI Extension에서  
프로젝트별 AI 동작을 커스터마이징하는 설정 가이드입니다.

---

## 1. 디렉토리 구조

```
your-project/
└── .gemini/
    ├── config.yaml       # 모델, 언어 설정 (git 제외 권장)
    ├── styleguide.md     # 코딩 스타일 가이드 (git 포함)
    └── guardrails.md     # 금지 목록 (git 포함)
```

---

## 2. config.yaml

모델과 기본 동작을 설정합니다. API 키 등 민감 정보가 포함될 수 있으므로 `.gitignore`에 추가 권장.

```yaml
# .gemini/config.yaml
model: gemini-2.5-pro
language: ko              # 한국어 응답

project:
  name: my-project
  type: nextjs-app
  language: typescript
  testing: jest+playwright
  architecture: solid-principles

response:
  language: korean
  code_comments: korean
  format: markdown

context_files:
  - AI_CONTEXT.md
  - .cursor/memory/00_project_brief.md
  - .cursor/memory/02_architecture.md
```

---

## 3. styleguide.md — 코딩 스타일 가이드

Gemini가 코드를 생성할 때 따라야 할 스타일을 정의합니다.

```markdown
# 코딩 스타일 가이드

## 필수 규칙
- TypeScript strict 모드
- SOLID 원칙 준수
- TDD 방식 개발

## 네이밍
- 인터페이스: I 접두사 (IFavoriteService)
- 서비스: Service 접미사
- 훅: use 접두사
- 컴포넌트: PascalCase

## 개발 순서 (SOLID + TDD)
1. 인터페이스 먼저 정의
2. 실패 TC 작성 → FAIL 확인
3. 최소 구현
4. PASS 확인
5. 빌드 확인

## 환경 변수
\`\`\`typescript
// ✅ 항상 이 패턴 사용
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
if (!token) throw new Error('토큰 미설정');
\`\`\`
```

---

## 4. guardrails.md — 제약 조건

Gemini가 생성하면 안 되는 코드 패턴을 정의합니다.

```markdown
# 가드레일 (Guardrails)

## 절대 생성 금지

### TypeScript
\`\`\`typescript
const data: any = ...;    // ❌ any 타입 금지
\`\`\`

### 보안
\`\`\`typescript
const token = "ghp_xxx";  // ❌ API 키 하드코딩 금지
\`\`\`

### 디버그
\`\`\`typescript
console.log(data);        // ❌ console.log 금지
\`\`\`

## 파일 수정 제약
- .env.local 수정 제안 금지
- tsconfig strict 완화 금지
- package.json scripts 임의 변경 금지

## 응답 제약
- 영어로 답변 금지 (한국어 필수)
- 빌드가 깨지는 코드 제안 금지
- TC 없는 구현 코드 제안 금지
```

---

## 5. @workspace 컨텍스트 활용

```
@workspace 전체 코드베이스를 분석해서 서비스 계층 패턴을 설명해줘
@workspace 에서 any 타입이 사용된 곳을 찾아줘
```

---

## 6. 효율적인 사용 팁

### 팁 1: 긴 컨텍스트 활용 (Gemini 강점)

Gemini는 대용량 컨텍스트 처리가 강점입니다.

```
"다음 파일들을 모두 읽고 분석해줘:
- src/services/ 전체
- src/hooks/ 전체
- src/__tests__/ 전체
그리고 SOLID 원칙 위반 사항을 찾아줘"
```

### 팁 2: 문서 생성 활용

```
"현재 src/services/ 디렉토리 구조를 바탕으로
서비스 계층 아키텍처 문서를 작성해줘"
```

### 팁 3: 코드 분석 + 개선 제안

```
"@workspace 전체에서 다음을 확인해줘:
1. any 타입 사용 위치
2. 인터페이스 없이 구현체에 직접 의존하는 곳
3. TDD 패턴이 누락된 서비스
그리고 개선 우선순위를 알려줘"
```

---

## 7. 주의사항

- `.gemini/config.yaml`은 로컬 전용 (`.gitignore`에 추가)
- `.gemini/styleguide.md`, `guardrails.md`는 팀 공유 가능 (git 추적)
- API 사용 비용에 주의 (긴 컨텍스트는 토큰 소비 많음)

---

## 예시

- 실제 프롬프트 및 사용 사례는 관련 IDE 가이드 문서를 참조하십시오.
- 프로젝트 루트의 `AI_CONTEXT.md`와 `./scripts` 폴더의 자동화 스크립트 활용 예시를 확인하세요.
