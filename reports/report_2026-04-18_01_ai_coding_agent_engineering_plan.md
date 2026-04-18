# AI Coding Agent 엔지니어링 계획서

> **문서 정보**  
> - 작성일: 2026-04-18  
> - 프로젝트: Smart Rules Archive (srules)  
> - 대상 Agent: Cursor IDE, Antigravity, VS Code + Codex, VS Code + Gemini  
> - 목적: 각 AI Coding Agent의 프롬프트 엔지니어링, 가드레일, 하네스, 메모리 관리 전략 수립

---

## 목차

1. [개요 및 비교 매트릭스](#1-개요-및-비교-매트릭스)
2. [Cursor IDE](#2-cursor-ide)
3. [Antigravity (Google DeepMind)](#3-antigravity-google-deepmind)
4. [VS Code + GitHub Copilot / Codex Extension](#4-vs-code--github-copilot--codex-extension)
5. [VS Code + Gemini Coding AI Extension](#5-vs-code--gemini-coding-ai-extension)
6. [장기 메모리 / 단기 메모리 전략](#6-장기-메모리--단기-메모리-전략)
7. [Best Practice 예제 모음 (10+)](#7-best-practice-예제-모음)
8. [srules 프로젝트 적용 계획](#8-srules-프로젝트-적용-계획)

---

## 1. 개요 및 비교 매트릭스

### AI Coding Agent 비교 개요

| 항목 | Cursor IDE | Antigravity | VS Code + Codex | VS Code + Gemini |
|------|-----------|-------------|-----------------|------------------|
| **기반 모델** | Claude 3.5/GPT-4o | Gemini 2.5 Pro | OpenAI Codex/GPT-4o | Gemini 1.5/2.0 |
| **프롬프트 파일** | `.cursorrules` / `.cursor/rules/*.mdc` | User Rules (IDE 설정) | `.github/copilot-instructions.md` | `.gemini/styleguide.md` |
| **가드레일 방식** | Rules 파일 + Project Rules | System Prompt + User Rules | Copilot Instructions | Gemini Config |
| **장기 메모리** | `.cursor/memory/` (Memory Bank) | KI (Knowledge Items) | GitHub Issues + Discussions | Google AI Studio Context |
| **단기 메모리** | 현재 대화 컨텍스트 | Conversation History | Chat 세션 | Chat 세션 |
| **하네스 엔지니어링** | `.cursor/rules/` MDC 파일 | Task/Walkthrough Artifacts | Instructions File | Instructions File |
| **룰 아카이빙** | MDC 파일 분리 | Knowledge Items | Copilot Instructions | Gemini Config |
| **코드베이스 이해** | `@codebase` 태깅 | 자동 (Workspace 기반) | `#file`, `#codebase` | `@workspace` |
| **무료/유료** | 유료 (월 $20~) | 유료 (Google One AI) | 유료 (월 $10~) | 유료/무료 혼합 |

---

## 2. Cursor IDE

### 2.1 특징

Cursor IDE는 VS Code Fork 기반으로 AI 기능을 네이티브로 통합한 IDE입니다.  
`.cursorrules`와 `.cursor/rules/` 디렉토리를 통해 프로젝트별 AI 동작을 완전히 제어합니다.

### 2.2 프롬프트 엔지니어링

#### 2.2.1 `.cursorrules` (레거시, 프로젝트 루트)

```plaintext
# 언어 설정
- 항상 한글로 답변해
- 코드 주석은 한글로 작성해

# 코딩 스타일
- TypeScript strict 모드 사용
- SOLID 원칙 준수
- 함수 단일 책임 원칙

# 금지 사항
- any 타입 사용 금지
- console.log 직접 사용 금지 (logger 사용)
```

#### 2.2.2 `.cursor/rules/` MDC 파일 (신 방식, 권장)

```
.cursor/
└── rules/
    ├── global.mdc           # 전역 규칙
    ├── typescript.mdc       # TypeScript 전용 규칙
    ├── testing.mdc          # 테스트 규칙 (TDD)
    ├── git.mdc              # Git 커밋 규칙
    └── react.mdc            # React 컴포넌트 규칙
```

**예시: `.cursor/rules/testing.mdc`**

```markdown
---
description: TDD 개발 방법론 가이드
globs: ["**/*.test.ts", "**/*.spec.ts", "**/__tests__/**"]
alwaysApply: false
---

# TDD 개발 규칙

## 개발 순서
1. TC(Test Case) 먼저 작성
2. TC Failed 확인
3. TC Pass 되도록 구현
4. 100% Pass 될 때까지 반복

## 테스트 작성 규칙
- describe: 모듈/기능 단위로 그룹화
- it/test: 단일 동작 검증
- AAA 패턴: Arrange, Act, Assert

## 예시
\`\`\`typescript
describe('FavoriteService', () => {
  it('should add rule to favorites', () => {
    // Arrange
    const service = new FavoriteService(mockStorage);
    // Act
    service.addFavorite('rule-001');
    // Assert
    expect(service.isFavorite('rule-001')).toBe(true);
  });
});
\`\`\`
```

**예시: `.cursor/rules/global.mdc`**

```markdown
---
description: 전역 프로젝트 규칙
alwaysApply: true
---

# srules 프로젝트 전역 규칙

## 언어
- 모든 답변은 한글로 작성
- 코드 주석은 한글 우선

## Git 커밋
- 구어체 아닌 나열 형태로 작성
- 예: "Add FavoriteService unit test, Fix storage adapter"

## 파일 처리
- Small Chunks 방식으로 처리
- 인코딩: UTF-8

## 빌드
- 빌드가 항상 깨지지 않도록 유지
- 변경 전 테스트 실행 확인
```

### 2.3 가드레일 (Guardrails)

Cursor의 가드레일은 MDC 파일의 `alwaysApply` 및 `globs` 설정으로 제어합니다.

```markdown
---
description: 보안 가드레일
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: true
---

# 보안 가드레일

## 절대 금지
- API 키, 토큰을 코드에 하드코딩 금지
- .env 파일을 git에 커밋 금지
- eval() 사용 금지
- any 타입 남용 금지

## 환경변수 패턴
\`\`\`typescript
// ❌ 금지
const token = "ghp_xxxxx";

// ✅ 허용
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN not configured');
\`\`\`
```

### 2.4 하네스 엔지니어링 (Harness Engineering)

하네스는 AI가 특정 작업 시 따라야 할 구조화된 워크플로우입니다.

**예시: `.cursor/rules/feature-harness.mdc`**

```markdown
---
description: 신규 기능 개발 하네스
alwaysApply: false
---

# 신규 기능 개발 절차 (Harness)

## Step 1: 분석
- [ ] 요구사항 파악
- [ ] 기존 코드 영향 범위 분석
- [ ] 인터페이스 설계

## Step 2: TDD 사이클
- [ ] 실패하는 TC 작성
- [ ] TC Failed 확인 (`npm test`)
- [ ] 최소 구현 코드 작성
- [ ] TC Pass 확인

## Step 3: 리팩토링
- [ ] SOLID 원칙 준수 검토
- [ ] 코드 리뷰 셀프 체크
- [ ] 빌드 확인 (`npm run build`)

## Step 4: 문서화
- [ ] reports/ 폴더에 보고서 작성
- [ ] README 업데이트 (필요시)
```

### 2.5 장기 메모리 (Memory Bank)

Cursor의 장기 메모리는 `.cursor/memory/` 폴더를 통해 구현합니다.

```
.cursor/
└── memory/
    ├── projectbrief.md       # 프로젝트 개요
    ├── activecontext.md      # 현재 작업 컨텍스트
    ├── techstack.md          # 기술 스택 정보
    ├── codebasepatterns.md   # 코드 패턴 및 컨벤션
    └── progress.md           # 진행 상황 추적
```

**예시: `.cursor/memory/projectbrief.md`**

```markdown
# srules 프로젝트 개요

## 목적
개발자를 위한 규칙 아카이빙 서비스

## 기술 스택
- Next.js 14 (App Router)
- TypeScript (Strict Mode)
- Tailwind CSS
- Jest + Playwright (TDD)
- SOLID 아키텍처

## 핵심 규칙
- TDD 필수 (TC → Failed → Pass → 반복)
- SOLID 원칙 100% 준수
- 한글 답변, 한글 주석
- 빌드 절대 깨지지 않도록 유지
```

### 2.6 단기 메모리 (Active Context)

```markdown
# activecontext.md (매 작업 세션마다 업데이트)

## 현재 작업 (2026-04-18)
- AI Coding Agent 엔지니어링 계획서 작성

## 최근 변경사항
- SOLID Phase 7 완료
- E2E 테스트 30개 통과

## 다음 작업
- [ ] AI Agent 프롬프트 룰 파일 생성
- [ ] Memory Bank 초기화
```

---

## 3. Antigravity (Google DeepMind)

### 3.1 특징

Antigravity는 VS Code에 통합된 Google DeepMind의 AI Coding Agent입니다.  
**Knowledge Items (KI)** 시스템을 통해 장기 메모리를 관리하고,  
**User Rules**와 **Task/Walkthrough Artifacts**를 통해 행동을 제어합니다.

### 3.2 프롬프트 엔지니어링

#### User Rules (전역 설정)

Antigravity의 User Rules는 IDE 설정에서 전역으로 적용됩니다.

```markdown
[답변]
- 모든 답변은 한글로 작성
- 코드 주석은 한글 우선

[Git Commit]
- 구어체 아닌 나열 형태로 작성
- 예: "Add unit test for FavoriteService"
- 작업 완료 후 사용자 확인 후 커밋

[파일처리]
- Small Chunks 방식
- UTF-8 인코딩

[개발방법론]
- TDD: TC 작성 → Failed 확인 → Pass 구현 → 반복
- 빌드 항상 유지

[보고서]
- reports/ 폴더에 report_[date]_[num]_[desc].md 형태
```

#### 프로젝트별 컨텍스트 제공

Antigravity는 workspace URI를 자동으로 인식합니다.  
프로젝트 루트에 `CLAUDE.md` 또는 `AI_CONTEXT.md` 파일을 두어 컨텍스트를 제공합니다.

**예시: `AI_CONTEXT.md`**

```markdown
# srules AI 컨텍스트

## 프로젝트 유형
규칙 아카이브 서비스 (Next.js 14, TypeScript, SOLID)

## 핵심 패턴
- 서비스 계층: src/services/ (인터페이스 → 구현체)
- 훅: src/hooks/ (단일 책임)
- 컴포넌트: src/components/ (조합 패턴)

## 테스트 위치
- 단위 테스트: src/__tests__/
- E2E: e2e/

## 절대 금지
- console.log 직접 사용
- any 타입 남용
- 인터페이스 없이 구현체 직접 의존
```

### 3.3 가드레일 (Guardrails)

Antigravity의 가드레일은 User Rules와 프로젝트 컨텍스트 파일의 조합으로 구현합니다.

```markdown
# .antigravity/guardrails.md

## 코드 품질 가드레일
- TypeScript strict 모드 필수
- ESLint 규칙 위반 금지
- 빌드 실패 코드 커밋 금지

## 보안 가드레일
- 환경변수만 사용 (하드코딩 금지)
- .env.local은 .gitignore에 유지

## 아키텍처 가드레일
- 서비스는 인터페이스를 통해서만 접근
- 컴포넌트는 하나의 역할만 담당
- 훅은 단일 책임 원칙

## TDD 가드레일
- 테스트 없는 신규 기능 구현 금지
- 테스트 커버리지 80% 이상 유지
```

### 3.4 하네스 엔지니어링

Antigravity의 Task/Walkthrough Artifacts를 활용한 하네스입니다.

**예시: Task Artifact (`.antigravity/tasks/feature-implementation.md`)**

```markdown
# 신규 기능 구현 하네스

## Phase 1: 요구사항 분석
- [ ] 기능 목적 명확화
- [ ] 기존 코드베이스 영향 분석
- [ ] 인터페이스 설계 확정

## Phase 2: TDD 사이클
- [ ] 실패 TC 작성
- [ ] `npm test` → Failed 확인
- [ ] 최소 구현
- [ ] `npm test` → Pass 확인

## Phase 3: 통합 및 리팩토링
- [ ] SOLID 원칙 검토
- [ ] `npm run build` 확인
- [ ] E2E 테스트 업데이트 (필요시)

## Phase 4: 마무리
- [ ] reports/ 보고서 작성
- [ ] Telegram 알림 발송
- [ ] Git 상태 확인 (commit은 사용자 승인 후)
```

### 3.5 장기 메모리 (Knowledge Items)

Antigravity의 장기 메모리는 **Knowledge Items (KI)** 시스템을 통해 관리됩니다.  
KI는 `<appDataDir>/knowledge/` 디렉토리에 저장됩니다.

**KI 구조:**
```
~/.gemini/antigravity/knowledge/
├── srules-architecture/
│   ├── metadata.json
│   └── artifacts/
│       ├── service-layer.md
│       └── component-patterns.md
├── srules-testing/
│   ├── metadata.json
│   └── artifacts/
│       └── test-patterns.md
└── srules-conventions/
    ├── metadata.json
    └── artifacts/
        └── coding-conventions.md
```

**KI 활용 예시:**
```markdown
# srules-architecture/artifacts/service-layer.md

## 서비스 계층 패턴
모든 서비스는 인터페이스를 먼저 정의하고 구현체를 작성한다.

### 패턴
1. src/services/interfaces/I{Name}Service.ts 생성
2. src/services/{Name}Service.ts 구현
3. src/__tests__/services/{Name}Service.test.ts 테스트

### 예시 코드
\`\`\`typescript
// 1. 인터페이스
interface IFavoriteService {
  addFavorite(ruleId: string): void;
  removeFavorite(ruleId: string): void;
  isFavorite(ruleId: string): boolean;
}

// 2. 구현체
class FavoriteService implements IFavoriteService { ... }
\`\`\`
```

### 3.6 단기 메모리 (Conversation Context)

Antigravity는 대화 로그를 자동으로 저장합니다.  
`<appDataDir>/brain/<conversation-id>/` 디렉토리에서 확인 가능합니다.

---

## 4. VS Code + GitHub Copilot / Codex Extension

### 4.1 특징

GitHub Copilot은 Microsoft/GitHub의 AI Coding Assistant로 VS Code와 완벽히 통합됩니다.  
`.github/copilot-instructions.md` 파일을 통해 프로젝트별 지시사항을 제공합니다.

### 4.2 프롬프트 엔지니어링

#### `.github/copilot-instructions.md`

```markdown
# srules 프로젝트 Copilot 지시사항

## 언어 및 응답
- 모든 답변은 한국어로 작성
- 코드 주석은 한국어 우선

## 기술 스택
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Jest (단위 테스트) + Playwright (E2E)
- SOLID 아키텍처

## 개발 원칙
1. TDD: 테스트 먼저 작성 후 구현
2. SOLID 원칙 100% 준수
3. 빌드 항상 유지
4. TypeScript strict 모드

## 코딩 패턴
- 서비스는 인터페이스를 통해서만 의존
- 컴포넌트는 단일 책임 (하나의 역할만)
- 훅은 단일 기능 담당
- `any` 타입 사용 금지

## 파일 구조 규칙
- 서비스: src/services/interfaces/ → src/services/
- 훅: src/hooks/
- 컴포넌트: src/components/
- 테스트: src/__tests__/ (단위), e2e/ (E2E)
- 보고서: reports/report_[date]_[num]_[desc].md
```

#### VS Code Settings (`.vscode/settings.json`)

```json
{
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true,
    "scminput": false
  },
  "github.copilot.advanced": {
    "inlineSuggestCount": 3,
    "length": 500
  },
  "editor.inlineSuggest.enabled": true,
  "github.copilot.chat.localeOverride": "ko"
}
```

### 4.3 가드레일 (Guardrails)

#### ESLint 기반 가드레일

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-hardcoded-credentials": "error"
  }
}
```

#### Copilot Instructions에 가드레일 명시

```markdown
# .github/copilot-instructions.md (가드레일 섹션 추가)

## ⚠️ 절대 금지 사항 (Guardrails)
1. API 토큰/비밀키 하드코딩 절대 금지
2. `any` 타입 사용 금지
3. 테스트 없는 기능 구현 금지
4. 인터페이스 없이 서비스 직접 의존 금지
5. `.env.local` 파일 git 추가 금지
6. `console.log` 직접 사용 금지
```

### 4.4 하네스 엔지니어링

Copilot Chat에서 `/new` 슬래시 커맨드와 커스텀 프롬프트를 활용합니다.

**`.github/prompts/feature-template.md`**

```markdown
# 신규 기능 개발 템플릿

다음 순서로 개발을 진행해주세요:

1. **인터페이스 정의**: `src/services/interfaces/I{Name}Service.ts`
2. **실패 TC 작성**: `src/__tests__/services/{Name}Service.test.ts`
3. **TC 실행 확인**: `npm test -- --testPathPattern={Name}`
4. **구현**: `src/services/{Name}Service.ts`
5. **TC Pass 확인**: `npm test`
6. **빌드 확인**: `npm run build`
7. **보고서 작성**: `reports/report_{date}_{num}_{desc}.md`
```

### 4.5 메모리 관리

GitHub Copilot에는 독립적인 메모리 시스템이 없습니다.  
`.github/copilot-instructions.md`가 사실상의 장기 메모리 역할을 합니다.

**장기 메모리 보완 전략:**

```
.github/
├── copilot-instructions.md    # 메인 컨텍스트 (장기 메모리)
├── prompts/
│   ├── feature-template.md   # 기능 개발 하네스
│   ├── bug-fix-template.md   # 버그 수정 하네스
│   └── refactor-template.md  # 리팩토링 하네스
└── ARCHITECTURE.md            # 아키텍처 문서
```

---

## 5. VS Code + Gemini Coding AI Extension

### 5.1 특징

VS Code용 Gemini Extension (Google AI)은 Gemini 모델을 VS Code에 통합합니다.  
`.gemini/` 디렉토리를 통해 프로젝트별 설정을 관리합니다.

### 5.2 프롬프트 엔지니어링

#### `.gemini/config.yaml`

```yaml
# Gemini AI 설정
model: gemini-2.5-pro
language: ko  # 한국어 응답

# 프로젝트 컨텍스트
project:
  name: srules
  type: nextjs-app
  framework: nextjs-14
  language: typescript
  testing: jest+playwright
  architecture: solid

# 응답 형식
response:
  language: korean
  codeComments: korean
  format: markdown
```

#### `.gemini/styleguide.md`

```markdown
# srules 코딩 스타일 가이드 (Gemini AI용)

## 필수 규칙
- TypeScript strict 모드
- SOLID 원칙 준수
- TDD 방식 개발

## 네이밍 컨벤션
- 인터페이스: `I` 접두사 (예: `IFavoriteService`)
- 서비스: `Service` 접미사
- 훅: `use` 접두사
- 컴포넌트: PascalCase

## 파일 구조
\`\`\`
src/
├── services/
│   ├── interfaces/     # 인터페이스 정의
│   └── *.ts           # 구현체
├── hooks/             # 커스텀 훅
├── components/        # React 컴포넌트
└── __tests__/         # 단위 테스트
\`\`\`
```

### 5.3 가드레일

```markdown
# .gemini/guardrails.md

## 코드 생성 제약
- TypeScript any 타입 생성 금지
- 환경변수 없이 API 키 하드코딩 금지
- 테스트 없는 비즈니스 로직 생성 금지

## 파일 수정 제약
- .env.local 수정 제안 금지
- package.json scripts 임의 변경 금지
- tsconfig.json strict 설정 완화 금지

## 응답 제약
- 영어로 답변 금지 (한국어 필수)
- 빌드를 깨는 코드 제안 금지
```

### 5.4 하네스 엔지니어링

```markdown
# .gemini/harness/new-service.md

## 신규 서비스 생성 하네스

### 실행 순서
1. 인터페이스 파일 생성
2. 테스트 파일 생성 (실패 TC)
3. 테스트 실행 (Failed 확인)
4. 서비스 구현
5. 테스트 실행 (Pass 확인)
6. 빌드 확인

### 템플릿
\`\`\`typescript
// src/services/interfaces/I{Name}Service.ts
export interface I{Name}Service {
  // 메서드 정의
}

// src/__tests__/services/{Name}Service.test.ts
describe('{Name}Service', () => {
  it('should ...', () => {
    // TC 작성
  });
});

// src/services/{Name}Service.ts
export class {Name}Service implements I{Name}Service {
  // 구현
}
\`\`\`
```

### 5.5 메모리 관리

```markdown
# .gemini/memory/project-context.md

## 프로젝트 현황 (자동 업데이트)

### 완료된 작업
- SOLID Phase 1~7 완료
- 단위 테스트 65개 통과
- E2E 테스트 30개 통과

### 현재 집중 영역
- AI Agent 엔지니어링 계획서
- 프롬프트 최적화

### 아키텍처 결정사항
- React Query 사용 (서버 상태 관리)
- 인터페이스 기반 DI 패턴
- MDC 파일로 규칙 관리
```

---

## 6. 장기 메모리 / 단기 메모리 전략

### 6.1 메모리 구조 비교

| 메모리 유형 | Cursor | Antigravity | Copilot | Gemini |
|------------|--------|-------------|---------|--------|
| **장기** | `.cursor/memory/*.md` | Knowledge Items (KI) | `.github/copilot-instructions.md` | `.gemini/memory/*.md` |
| **단기** | 대화 컨텍스트 | Conversation Logs | Chat 세션 | Chat 세션 |
| **프로젝트** | `.cursor/rules/*.mdc` | Workspace + User Rules | Copilot Instructions | `.gemini/styleguide.md` |
| **패턴** | Memory Bank 패턴 | KI 시스템 | Instructions 파일 | Config 파일 |

### 6.2 Memory Bank 패턴 (Cross-Agent 공통)

모든 AI Agent에서 공통으로 사용할 수 있는 Memory Bank 패턴입니다.

```
.ai/
├── memory/
│   ├── 00_project_brief.md      # 변경 없는 프로젝트 개요
│   ├── 01_tech_stack.md         # 기술 스택 (안정적)
│   ├── 02_architecture.md       # 아키텍처 패턴 (안정적)
│   ├── 03_conventions.md        # 코딩 컨벤션 (안정적)
│   ├── 04_active_context.md     # 현재 작업 (자주 변경)
│   └── 05_progress.md           # 진행 현황 (자주 변경)
├── harness/
│   ├── new-feature.md           # 신규 기능 하네스
│   ├── bug-fix.md               # 버그 수정 하네스
│   └── refactor.md              # 리팩토링 하네스
└── guardrails/
    ├── security.md              # 보안 가드레일
    ├── architecture.md          # 아키텍처 가드레일
    └── quality.md               # 코드 품질 가드레일
```

### 6.3 단기 메모리 관리 전략

```markdown
# .ai/memory/04_active_context.md 예시

## 세션: 2026-04-18

### 현재 작업
AI Coding Agent 엔지니어링 계획서 작성

### 관련 파일
- reports/report_2026-04-18_01_*.md
- docs/AI_AGENT_GUIDE.md

### 결정사항
- 4개 Agent 비교 분석
- Best Practice 10개 이상 포함

### 미결 사항
- [ ] srules 프로젝트에 실제 적용
- [ ] 각 Agent별 설정 파일 생성
```

---

## 7. Best Practice 예제 모음

### BP-01: 프로젝트 전역 컨텍스트 파일 통합 관리

모든 AI Agent가 공통으로 참조하는 컨텍스트 파일을 하나로 통합하여 관리합니다.

```markdown
# AI_CONTEXT.md (프로젝트 루트)

이 파일은 모든 AI Coding Agent가 참조하는 프로젝트 컨텍스트입니다.

## 프로젝트
Smart Rules Archive (srules) - 규칙 아카이빙 서비스

## 규칙
- 답변 언어: 한국어
- 개발 방법론: TDD
- 아키텍처: SOLID
- 빌드: 항상 유지

## 금지 사항
- any 타입, 하드코딩된 API 키, 테스트 없는 구현
```

---

### BP-02: MDC 파일로 TDD 워크플로우 강제화 (Cursor 전용)

```markdown
# .cursor/rules/tdd-workflow.mdc
---
description: TDD 강제 워크플로우
globs: ["src/**/*.ts", "src/**/*.tsx"]
alwaysApply: true
---

새로운 함수나 클래스를 구현할 때는:

1. 먼저 `src/__tests__/` 에 실패하는 테스트 작성
2. `npm test` 실행하여 Failed 확인
3. 최소한의 코드로 구현
4. `npm test` 실행하여 Pass 확인
5. 리팩토링 후 `npm test` 재확인

⚠️ 테스트 없이 구현 코드를 먼저 작성하지 마세요.
```

---

### BP-03: 보안 가드레일 자동화 (.cursorrules + ESLint)

```json
// .eslintrc.json - 가드레일 자동 검사
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/^ghp_|^sk-|^AIza/]",
        "message": "API 키 하드코딩 금지. 환경변수를 사용하세요."
      }
    ]
  }
}
```

---

### BP-04: 아키텍처 하네스 - 서비스 계층 패턴 (SOLID)

```typescript
// harness/service-template.ts
// 이 파일을 복사하고 {Name}을 교체하여 사용하세요

// 1. 인터페이스 (src/services/interfaces/I{Name}Service.ts)
export interface I{Name}Service {
  // 메서드 정의
}

// 2. 구현체 (src/services/{Name}Service.ts)
import { I{Name}Service } from './interfaces/I{Name}Service';
import { IStorage } from './interfaces/IStorage';

export class {Name}Service implements I{Name}Service {
  constructor(private readonly storage: IStorage) {}
}

// 3. 테스트 (src/__tests__/services/{Name}Service.test.ts)
import { {Name}Service } from '../../services/{Name}Service';
import { ArrayStorageAdapter } from '../../services/storage/ArrayStorageAdapter';

describe('{Name}Service', () => {
  let service: {Name}Service;
  
  beforeEach(() => {
    service = new {Name}Service(new ArrayStorageAdapter());
  });

  it('should ...', () => {
    // TC 작성
  });
});
```

---

### BP-05: Copilot Instructions에 아키텍처 다이어그램 포함

```markdown
# .github/copilot-instructions.md

## 아키텍처 다이어그램

\`\`\`
Request → Component → Custom Hook → Service Interface → Service Implementation → Storage
                                     ↑
                               인터페이스 (DIP)
\`\`\`

## 올바른 의존성 방향
✅ Component → IService → ServiceImpl
❌ Component → ServiceImpl (직접 의존 금지)

## 예시
\`\`\`typescript
// ✅ 올바른 방식
function useRuleActions(service: IRuleService) { ... }

// ❌ 잘못된 방식
function useRuleActions() {
  const service = new RuleService(); // 직접 의존
}
\`\`\`
```

---

### BP-06: 멀티 에이전트 동기화 전략

여러 AI Agent를 번갈아 사용할 때 컨텍스트 동기화 방법입니다.

```markdown
# .ai/sync/agent-handoff.md

## Agent 전환 시 체크리스트

### Cursor → Antigravity 전환
1. `.cursor/memory/04_active_context.md` 최신화
2. 완료/미완료 작업 명시
3. Antigravity 시작 시 해당 파일 참조 요청

### Antigravity → Copilot 전환
1. `.github/copilot-instructions.md` 현재 상태 반영
2. 진행 중인 작업 Branch 정보 기록

## 핵심 원칙
- 모든 Agent가 참조하는 `AI_CONTEXT.md` 항상 최신 유지
- 진행 상황은 `reports/` 폴더에 기록
- 미결 작업은 GitHub Issues로 관리
```

---

### BP-07: TDD 실패 케이스 문서화 하네스

```markdown
# .ai/harness/bug-fix.md

## 버그 수정 하네스

### Step 1: 재현 TC 작성
\`\`\`typescript
it('reproduces bug: {이슈 번호} - {버그 설명}', () => {
  // 버그를 재현하는 최소한의 코드
  expect(buggyFunction()).toBe(expectedValue); // 실패!
});
\`\`\`

### Step 2: Failed 확인
\`\`\`bash
npm test -- --testNamePattern="reproduces bug"
# FAIL 확인 필수
\`\`\`

### Step 3: 수정 구현
- 버그 원인 분석
- 최소한의 수정 적용

### Step 4: Pass 확인
\`\`\`bash
npm test  # 전체 테스트 Pass 확인
npm run build  # 빌드 확인
\`\`\`

### Step 5: 기록
- `tasks/{taskname}/{date}_{num}_{description}.md` 작성
```

---

### BP-08: 자동화된 컨텍스트 업데이트 스크립트

```bash
#!/bin/bash
# scripts/update-ai-context.sh
# AI Agent 컨텍스트를 자동으로 업데이트하는 스크립트

DATE=$(date +"%Y-%m-%d")
TEST_COUNT=$(npm test 2>&1 | grep -E "Tests:.*passed" | tail -1)
BUILD_STATUS=$(npm run build 2>&1 | tail -1)

cat > .ai/memory/05_progress.md << EOF
# 프로젝트 진행 현황

## 업데이트: $DATE

## 테스트 현황
$TEST_COUNT

## 빌드 상태
$BUILD_STATUS

## 완료된 작업
$(git log --oneline -10)
EOF

echo "✅ AI 컨텍스트 업데이트 완료: $DATE"
```

---

### BP-09: 역할별 MDC 파일 분리 전략 (Cursor)

```
.cursor/rules/
├── 00_global.mdc           # 전역 (alwaysApply: true)
├── 10_typescript.mdc       # TS 파일에만 적용
├── 20_react.mdc            # TSX 파일에만 적용
├── 30_testing.mdc          # 테스트 파일에만 적용
├── 40_git.mdc              # Git 작업에 적용
├── 50_security.mdc         # 보안 규칙 전역 적용
└── 60_reporting.mdc        # 보고서 작성 규칙
```

**우선순위:** `alwaysApply: true` > `globs` 매칭 > 수동 선택

---

### BP-10: Telegram 알림 통합 하네스

```markdown
# .ai/harness/notification.md

## 작업 완료 알림 하네스

### 필수 알림 시점
1. 기능 구현 완료 (TC Pass)
2. 버그 수정 완료
3. 빌드 성공
4. 보고서 작성 완료

### Telegram 알림 형식
\`\`\`
✅ [srules] {작업명} 완료
📅 날짜: {날짜}
🔧 변경사항: {핵심 내용}
📊 테스트: {통과/전체}
📝 보고서: reports/{파일명}
\`\`\`

### 스크립트 예시
\`\`\`bash
# .env.local 파일에서 읽어오거나 환경 변수로 설정
# export $(grep -v '^#' .env.local | xargs)
TELEGRAM_TOKEN="${TELEGRAM_TOKEN}"
CHAT_ID="${TELEGRAM_CHAT_ID}"
MESSAGE="✅ [srules] 작업 완료: $TASK_NAME"

curl -s -X POST \
  "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}&text=${MESSAGE}"
\`\`\`
```

---

### BP-11: 코드 리뷰 자동화 프롬프트 (PR 기반)

```markdown
# .github/prompts/code-review.md

## 코드 리뷰 체크리스트 프롬프트

이 PR을 다음 기준으로 리뷰해주세요:

### SOLID 원칙
- [ ] SRP: 각 클래스/함수가 단일 책임?
- [ ] OCP: 기존 코드 수정 없이 확장 가능?
- [ ] LSP: 인터페이스 계약 준수?
- [ ] ISP: 필요한 메서드만 의존?
- [ ] DIP: 추상화에 의존 (구현 아닌)?

### 테스트
- [ ] 새 기능에 TC 추가됨?
- [ ] TC Pass 100%?
- [ ] 엣지 케이스 커버?

### 보안
- [ ] 하드코딩된 비밀값 없음?
- [ ] 환경변수 올바르게 사용?

### 코드 품질
- [ ] any 타입 없음?
- [ ] console.log 없음?
- [ ] 빌드 성공?
```

---

### BP-12: 멀티 레이어 메모리 아키텍처

```
레이어 1 - 영구 메모리 (Permanent)
  └── AI_CONTEXT.md, docs/, README.md

레이어 2 - 장기 메모리 (Long-term)  
  └── .cursor/memory/, .gemini/memory/, KI 시스템

레이어 3 - 중기 메모리 (Medium-term)
  └── reports/, .github/copilot-instructions.md

레이어 4 - 단기 메모리 (Short-term)
  └── 활성 대화 컨텍스트, activecontext.md

레이어 5 - 즉시 메모리 (Immediate)
  └── 현재 편집 중인 파일, 선택된 코드
```

**규칙:** 상위 레이어는 거의 변경되지 않고, 하위 레이어는 자주 업데이트됩니다.

---

### BP-13: Agent별 최적 사용 시나리오

| 시나리오 | 최적 Agent | 이유 |
|---------|-----------|------|
| 대규모 리팩토링 | **Antigravity** | 전체 codebase 이해, KI 시스템 |
| 빠른 코드 완성 | **Cursor** | 인라인 완성 최적화 |
| PR 코드 리뷰 | **Copilot** | GitHub 통합, PR 컨텍스트 |
| 문서 작성 | **Gemini** | 긴 컨텍스트 처리 우수 |
| TDD 사이클 | **Cursor** | 즉각적인 피드백 |
| 아키텍처 설계 | **Antigravity** | 전체 구조 파악 우수 |
| 버그 추적 | **Copilot** | GitHub Issues 통합 |

---

## 8. srules 프로젝트 적용 계획

### 8.1 구현 우선순위

| 우선순위 | 작업 | 담당 Agent | 예상 시간 |
|---------|------|-----------|---------|
| P0 | `.cursor/rules/` MDC 파일 생성 | Cursor | 1일 |
| P0 | `.github/copilot-instructions.md` 작성 | Copilot | 0.5일 |
| P1 | `AI_CONTEXT.md` 프로젝트 루트 생성 | 공통 | 0.5일 |
| P1 | `.cursor/memory/` Memory Bank 초기화 | Cursor | 1일 |
| P1 | `.gemini/` 설정 파일 생성 | Gemini | 0.5일 |
| P2 | 하네스 파일 생성 (`.ai/harness/`) | 공통 | 1일 |
| P2 | 자동화 스크립트 (context 업데이트) | - | 1일 |
| P3 | Telegram 알림 스크립트 통합 | - | 0.5일 |

### 8.2 디렉토리 구조 계획

```
srules/
├── .cursor/
│   ├── rules/
│   │   ├── 00_global.mdc
│   │   ├── 10_typescript.mdc
│   │   ├── 20_react.mdc
│   │   ├── 30_testing.mdc
│   │   ├── 40_git.mdc
│   │   └── 50_security.mdc
│   └── memory/
│       ├── 00_project_brief.md
│       ├── 01_tech_stack.md
│       ├── 02_architecture.md
│       ├── 03_conventions.md
│       ├── 04_active_context.md
│       └── 05_progress.md
├── .gemini/
│   ├── config.yaml
│   ├── styleguide.md
│   └── guardrails.md
├── .github/
│   ├── copilot-instructions.md (신규)
│   └── prompts/
│       ├── feature-template.md
│       ├── bug-fix-template.md
│       └── code-review.md
├── .ai/
│   ├── harness/
│   │   ├── new-feature.md
│   │   ├── bug-fix.md
│   │   └── refactor.md
│   └── guardrails/
│       ├── security.md
│       └── architecture.md
├── AI_CONTEXT.md (신규, 공통 컨텍스트)
└── scripts/
    └── update-ai-context.sh (신규)
```

### 8.3 실행 스케줄

```
Week 1:
  - P0 작업 완료 (MDC 파일, Copilot Instructions)
  - AI_CONTEXT.md 생성

Week 2:
  - P1 작업 완료 (Memory Bank, Gemini 설정)
  - 각 Agent 테스트 및 검증

Week 3:
  - P2 작업 완료 (하네스, 자동화)
  - 팀 공유 및 피드백

Week 4:
  - P3 작업 완료 (Telegram 통합)
  - 전체 통합 테스트
```

---

## 부록: 참고 자료

- [Cursor Rules 공식 문서](https://docs.cursor.com/context/rules)
- [GitHub Copilot Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-instructions)
- [Google AI Studio](https://ai.google.dev/)
- [Memory Bank 패턴](https://github.com/cline/cline/discussions)
- [Antigravity Persistent Context](https://deepmind.google/technologies/antigravity/)

---

*이 계획서는 srules 프로젝트의 AI Coding Agent 엔지니어링 전략을 수립하기 위해 작성되었습니다.*  
*각 단계는 TDD 방법론에 따라 검증하며 진행합니다.*
