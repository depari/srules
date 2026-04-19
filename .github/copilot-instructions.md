# srules 프로젝트 Copilot 지시사항

이 파일은 GitHub Copilot이 srules 프로젝트에서 참조하는 지시사항입니다.

---

## 기본 설정

### 응답 언어
- **한국어**로 답변 및 코드 주석 작성
- 인코딩: UTF-8

### 프로젝트 정보
- 이름: Smart Rules Archive (srules)
- 프레임워크: Next.js 14 (App Router) + TypeScript
- 스타일: Tailwind CSS
- 테스트: Jest (단위) + Playwright (E2E)
- 아키텍처: SOLID 원칙

---

## 개발 원칙

### TDD (필수 준수)
모든 기능 개발은 반드시 다음 순서로 진행합니다:
1. 테스트 코드 먼저 작성 (`src/__tests__/`)
2. `npm test` 실행하여 **실패** 확인
3. 최소한의 코드로 구현
4. `npm test` 실행하여 **통과** 확인
5. 전체 통과까지 반복

### SOLID 원칙
- **SRP**: 각 클래스/컴포넌트는 단 하나의 책임
- **OCP**: 인터페이스 기반 확장 (수정 없이 확장 가능)
- **LSP**: 인터페이스 계약 준수
- **ISP**: 필요한 메서드만 노출
- **DIP**: 구현체가 아닌 인터페이스에 의존

---

## 코딩 패턴

### 서비스 계층
```typescript
// 1. 인터페이스 먼저 (src/services/interfaces/I{Name}Service.ts)
export interface IFavoriteService {
  addFavorite(ruleId: string): void;
  removeFavorite(ruleId: string): void;
  isFavorite(ruleId: string): boolean;
  getFavorites(): string[];
}

// 2. 구현체 (src/services/{Name}Service.ts)
export class FavoriteService implements IFavoriteService {
  constructor(private readonly storage: IStorage) {}
  // 구현
}
```

### 훅 패턴
```typescript
// src/hooks/use{Name}.ts - 단일 기능
export function useFavoriteRule(ruleId: string) {
  const [isFavorite, setIsFavorite] = useState(false);
  const onToggle = useCallback(() => { ... }, [ruleId]);
  return { isFavorite, onToggle };
}
```

### 컴포넌트 패턴
```tsx
// src/components/{category}/{Name}.tsx
export const RuleCard: FC<RuleCardProps> = ({ rule }) => {
  return <div>{/* 렌더링만 담당 */}</div>;
};
```

---

## ⚠️ 절대 금지 사항 (Guardrails)

| 금지 항목 | 이유 | 대안 |
|----------|------|------|
| `any` 타입 | 타입 안전성 훼손 | 명시적 타입, `unknown` |
| API 키 하드코딩 | 보안 위협 | `process.env.NEXT_PUBLIC_*` |
| `console.log` | 프로덕션 로그 오염 | `console.warn/error` |
| 인터페이스 없이 서비스 직접 의존 | SOLID 위반 | `I{Name}Service` 인터페이스 |
| `.env.local` git 추가 | 비밀 노출 | `.gitignore` 유지 |
| 테스트 없이 기능 구현 | TDD 위반 | TC 먼저 작성 |
| 빌드 깨는 코드 | CI/CD 장애 | `npm run build` 확인 |

---

## 파일 구조

```
src/
├── services/
│   ├── interfaces/         # I{Name}Service.ts (인터페이스)
│   ├── storage/            # 스토리지 구현체
│   └── *.ts               # 서비스 구현체
├── hooks/
│   ├── queries/            # React Query 훅
│   └── use*.ts            # 커스텀 훅
├── components/
│   ├── common/             # 공통 컴포넌트
│   ├── rules/              # 규칙 관련
│   └── submit/             # 제출 폼
├── __tests__/
│   ├── services/           # 서비스 단위 테스트
│   └── hooks/              # 훅 단위 테스트
e2e/                        # Playwright E2E 테스트
reports/                    # 작업 보고서 (report_[날짜]_[번호]_[설명].md)
docs/                       # 프로젝트 문서
```

---

## Git 규칙

### 커밋 메시지
- **형식**: `{Type}: {변경사항1}, {변경사항2}`
- **올바른 예**: `Add: FavoriteService unit test, Fix storage null check`
- **잘못된 예**: `테스트를 추가했습니다` (구어체 금지)
- 커밋 전 사용자 확인 필요

---

## 보고서 작성

작업 완료 시 `reports/` 폴더에 Markdown 보고서 작성:
- 파일명: `report_YYYY-MM-DD_번호_설명.md`
- 예시: `reports/report_2026-04-18_01_ai_agent_setup.md`
