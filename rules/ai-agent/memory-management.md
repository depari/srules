---
title: "AI Coding Agent 메모리 관리 전략 (장기/단기)"
slug: "ai-agent/memory-management"
version: "1.0.0"
created: "2026-04-18"
author: "서대원"
tags: ["AI", "Memory", "Memory Bank", "Knowledge Items", "Context", "Long-term", "Short-term"]
category: ["AI Agent", "Memory Management"]
difficulty: advanced
featured: true
---

# AI Coding Agent 메모리 관리 전략 (장기/단기)

## 개요

AI Agent는 기본적으로 대화 세션이 끝나면 컨텍스트를 잊어버립니다.  
**장기/단기 메모리 전략**으로 일관된 개발 환경을 유지하는 방법을 정리합니다.

---

## 메모리 계층 구조

```
레이어 1: 영구 메모리 (Permanent)
  └── AI_CONTEXT.md, docs/, README.md
  └── 거의 변경 안 됨 / 모든 Agent가 참조

레이어 2: 장기 메모리 (Long-term)
  └── .cursor/memory/00~03_*.md
  └── Antigravity KI (Knowledge Items)
  └── .github/copilot-instructions.md

레이어 3: 중기 메모리 (Medium-term)
  └── reports/ (작업 보고서)
  └── tasks/ (문제 해결 기록)

레이어 4: 단기 메모리 (Short-term)
  └── .cursor/memory/04_active_context.md
  └── 현재 대화 컨텍스트

레이어 5: 즉시 메모리 (Immediate)
  └── 현재 편집 중인 파일
  └── 선택된 코드 영역
```

---

## Cursor — Memory Bank 패턴

`.cursor/memory/` 폴더를 Memory Bank로 활용합니다.

### 파일 구조

```
.cursor/memory/
├── 00_project_brief.md    # 프로젝트 개요 (거의 변경 안 됨)
├── 01_tech_stack.md       # 기술 스택 (안정적)
├── 02_architecture.md     # 아키텍처 패턴 (안정적)
├── 03_conventions.md      # 코딩 컨벤션 (안정적)
├── 04_active_context.md   # 현재 작업 (매 세션 업데이트) ← 단기 메모리
└── 05_progress.md         # 진행 현황 (자동 업데이트) ← 단기 메모리
```

### active_context.md 활용법

```markdown
# 현재 작업 컨텍스트 (2026-04-18)

## 현재 작업
FavoriteService 리팩토링 - SOLID DIP 적용

## 완료된 작업
- [x] 인터페이스 정의 (IFavoriteService.ts)
- [x] TC 작성 및 FAIL 확인

## 진행 중
- [ ] FavoriteService 구현 ← 여기서 중단됨

## 다음 세션 시작 시
04_active_context.md를 먼저 읽고 현재 상태 파악 후 시작
```

### 세션 시작 프롬프트

```
".cursor/memory/ 폴더의 파일들을 읽고 현재 프로젝트 상태를 파악한 후 작업을 시작해줘"
```

---

## Antigravity — Knowledge Items (KI)

KI는 `~/.gemini/antigravity/knowledge/`에 저장되는 구조화된 장기 메모리입니다.

### KI 구조

```
knowledge/
├── srules-architecture/
│   ├── metadata.json
│   └── artifacts/
│       └── service-layer.md
└── srules-conventions/
    ├── metadata.json
    └── artifacts/
        └── coding-conventions.md
```

### KI 활용
- 대화 종료 후에도 패턴과 규칙이 유지됨
- 새 세션에서 "KI를 확인하고 시작해줘" 프롬프트로 불러오기
- 중요한 아키텍처 결정사항은 KI로 저장 요청

---

## Copilot — Instructions 파일 (장기 메모리)

`.github/copilot-instructions.md`가 사실상의 장기 메모리 역할 담당.

### 장기 메모리 강화 전략

```
.github/
├── copilot-instructions.md  # 장기 메모리 (프로젝트 전체 컨텍스트)
├── prompts/
│   ├── feature-template.md  # 작업별 단기 컨텍스트
│   ├── bug-fix-template.md
│   └── code-review.md
└── ARCHITECTURE.md          # 추가 아키텍처 문서
```

---

## 멀티 Agent 동기화 전략

여러 Agent를 번갈아 사용할 때 컨텍스트 동기화:

```markdown
# Agent 전환 체크리스트

## Cursor → Antigravity 전환
1. .cursor/memory/04_active_context.md 최신화
2. 미완료 작업 및 중단점 명시
3. Antigravity 시작 시 해당 파일 참조 요청

## 공통 원칙
- AI_CONTEXT.md 항상 최신 유지 (모든 Agent 공통 참조)
- 완료 작업은 reports/ 에 기록
- 미결 작업은 GitHub Issues 또는 active_context.md에 명시
```

---

## 메모리 자동화 스크립트

```bash
#!/bin/bash
# scripts/update-ai-context.sh
# 단기 메모리(05_progress.md) 자동 업데이트

DATE=$(date +"%Y-%m-%d")

cat > .cursor/memory/05_progress.md << EOF
# 프로젝트 진행 현황 (auto-updated: $DATE)

## 최근 커밋
$(git log --oneline -10)

## 현재 브랜치
$(git branch --show-current)

## Git 상태
$(git status --short)
EOF

echo "✅ 컨텍스트 업데이트 완료: $DATE"
```

```bash
# 사용법
bash scripts/update-ai-context.sh
```

---

## Best Practice

### BP: 세션 시작 루틴

```
1. bash scripts/update-ai-context.sh  (자동 컨텍스트 업데이트)
2. AI에게 "memory/ 파일들을 읽고 현재 상태 파악 후 시작해줘" 요청
3. 04_active_context.md 확인 (어디서 중단했는지)
4. 작업 재개
```

### BP: 세션 종료 루틴

```
1. 04_active_context.md 업데이트 (중단점, 미완료 항목 기록)
2. reports/ 보고서 작성 (완료된 경우)
3. bash scripts/notify.sh "세션 종료: {완료 내용}"
```

---

## 예시

- 실제 프롬프트 및 사용 사례는 관련 IDE 가이드 문서를 참조하십시오.
- 프로젝트 루트의 `AI_CONTEXT.md`와 `./scripts` 폴더의 자동화 스크립트 활용 예시를 확인하세요.
