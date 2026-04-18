---
title: "Antigravity AI 완전 설정 가이드 (User Rules + KI)"
slug: "ai-agent/antigravity-complete-guide"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["Antigravity", "User Rules", "Knowledge Items", "KI", "Memory", "AI", "Setup Guide"]
category: ["AI Agent", "Antigravity"]
difficulty: intermediate
---

# Antigravity AI 완전 설정 가이드 (User Rules + KI)

## 개요

Google DeepMind의 Antigravity AI Coding Agent에서  
**User Rules**, **AI_CONTEXT.md**, **Knowledge Items(KI)**를  
활용하는 완전한 설정 가이드입니다.

---

## 1. User Rules 설정

IDE 전역 설정에서 입력하는 **모든 프로젝트 공통 규칙**입니다.

### 권장 User Rules 구조

```markdown
[답변]
- 모든 답변은 한국어로 작성
- 코드 주석은 한국어 우선
- 인코딩: UTF-8

[Git Commit]
- 구어체 ❌ → 나열 형태 ✅
- 예: "Add: FavoriteService test, Fix storage NPE"
- 커밋은 사용자 확인 후 진행 (자동 커밋 금지)

[파일처리]
- Small Chunks 방식으로 편집
- 대용량 파일: 섹션 단위 분할 처리

[개발방법론 TDD]
1. TC 먼저 작성
2. npm test → FAIL 확인 (필수)
3. 최소 구현
4. npm test → PASS 확인
5. 100% PASS까지 반복

[빌드]
- 빌드가 항상 깨지지 않도록 유지
- 변경 후 npm run build 확인 권장

[보고서]
- reports/report_[YYYY-MM-DD]_[번호]_[설명].md 형식

[알림]
- 작업 완료 시 Telegram 알림 발송
- 환경 변수: TELEGRAM_TOKEN, TELEGRAM_CHAT_ID (.env.local)

[문제점개선]
1. 관련 unit test 먼저 작성
2. 개선 전 test FAIL 확인
3. TC PASS 되도록 구현 후 확인
- 기록: tasks/[taskname]/[date]_[num]_[description].md
```

---

## 2. AI_CONTEXT.md — 프로젝트별 컨텍스트

프로젝트 루트에 `AI_CONTEXT.md` 파일을 두면 Antigravity가 자동으로 참조합니다.

```markdown
# AI Coding Agent 공통 컨텍스트

## 프로젝트
Smart Rules Archive (srules) - 규칙 아카이빙 서비스

## 기술 스택
- Next.js 14, TypeScript strict, Tailwind CSS
- Jest (단위) + Playwright (E2E)
- SOLID 아키텍처

## 핵심 규칙
- TDD 필수
- any 타입 금지
- 빌드 항상 유지
- 서비스는 인터페이스를 통해서만 의존

## 파일 구조
src/services/interfaces/ → 인터페이스
src/services/ → 구현체
src/hooks/ → 커스텀 훅
src/__tests__/ → 단위 테스트
```

---

## 3. Knowledge Items (KI) — 장기 메모리

KI는 `~/.gemini/antigravity/knowledge/`에 저장되는 구조화된 장기 메모리입니다.

### KI 생성 요청 방법

```
"이번에 발견한 LocalStorageAdapter SSR 버그 패턴을
Knowledge Item으로 저장해줘"
```

### KI 구조

```
knowledge/
├── {project}-architecture/
│   ├── metadata.json
│   └── artifacts/
│       └── service-layer.md
├── {project}-testing/
│   └── artifacts/
│       └── test-patterns.md
└── {project}-gotchas/      # 버그 패턴, 주의사항
    └── artifacts/
        └── known-issues.md
```

### KI 불러오기

```
"srules 프로젝트 KI를 확인하고 현재 아키텍처 패턴에 맞게 개발해줘"
```

---

## 4. Task/Walkthrough Artifacts

Antigravity의 Task와 Walkthrough 기능으로 작업을 구조화합니다.

### Task (체크리스트형 작업)

```
"다음 내용으로 Task를 만들어줘:
- FavoriteService 인터페이스 정의
- 실패 TC 작성
- 구현
- PASS 확인
- 빌드 확인
- 보고서 작성"
```

### Walkthrough (단계별 설명)

```
"새 서비스를 추가하는 방법을 Walkthrough로 만들어줘"
```

---

## 5. Conversation Logs 활용

Antigravity는 대화 로그를 자동 저장합니다.

```
~/.gemini/antigravity/brain/{conversation-id}/
└── overview.txt
```

### 이전 대화 참조

```
"이전에 FavoriteService 리팩토링 관련 대화 내용을 참조해줘"
```

---

## 6. 효율적인 사용 팁

### 팁 1: 컨텍스트 명시적 제공

```
"AI_CONTEXT.md와 .cursor/memory/00_project_brief.md를 읽고
현재 프로젝트 상태를 파악한 후 작업을 시작해줘"
```

### 팁 2: 단계별 확인 요청

```
"TC FAIL 확인이 끝나면 나에게 결과를 보여주고
확인을 받은 후 구현을 진행해줘"
```

### 팁 3: 중단점 명시

```

---

## 예시

### Antigravity에 작업을 요청하는 실제 시나리오

1.  **초기 분석**: "AI_CONTEXT.md와 .cursor/rules/를 읽고 현재 프로젝트의 아키텍처 원칙을 요약해줘."
2.  **Task 생성**: "새로운 FavoriteService를 추가할 거야. TDD 절차에 따라 Task 체크리스트를 만들어줘."
3.  **구현 및 검증**: "첫 번째 테스트 케이스를 작성하고 npm test 결과가 FAIL인 것을 확인해줘."
4.  **장기 메모리 저장**: "방금 성공한 리팩토링 패턴을 Knowledge Item으로 기록해줘."
