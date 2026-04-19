# Gemini Coding AI 가드레일 (Guardrails)

이 파일은 Gemini Coding AI가 절대 위반해서는 안 되는 제약 조건들을 정의합니다.

---

## 🚨 코드 생성 절대 금지

### 1. TypeScript 타입 안전성

```typescript
// ❌ 생성 금지
const data: any = response;
function process(x: any) {}
const result = value as any;

// ✅ 올바른 방식
const data: Rule[] = response;
function process(x: unknown) {
  if (Array.isArray(x)) { ... }
}
```

### 2. 보안 위반

```typescript
// ❌ 절대 생성 금지 (API 키 등 비밀값 하드코딩)
const token = "ghp_1234567890abcdef";
const apiKey = "AIzaSy_xxxxx";
const password = "secret123";

// ✅ 환경 변수만 사용
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
```

### 3. 디버그 코드

```typescript
// ❌ 생성 금지
console.log('debug:', userData);
console.log('state:', JSON.stringify(state));

// ✅ 의미있는 로그만
console.error('GitHub API 호출 실패:', error.message);
console.warn('토큰이 설정되지 않았습니다');
```

### 4. 위험한 코드 패턴

```typescript
// ❌ 절대 생성 금지
eval(userInput);
new Function(code)();
innerHTML = userInput;  // XSS 위험
```

---

## 🚧 파일 수정 제약

| 파일 | 제약 |
|------|------|
| `.env.local` | 참조만 허용, 수정 제안 금지 |
| `tsconfig.json` | `strict` 설정 완화 제안 금지 |
| `package.json` > `scripts` | 임의 변경 금지 |
| `.gitignore` | 보안 파일 제외 항목 삭제 금지 |

---

## 📋 아키텍처 가드레일

### 의존성 규칙 (DIP)

```
✅ Component → IService (인터페이스)
✅ Service → IStorage (인터페이스)
❌ Component → ServiceImpl (구현체 직접 참조)
❌ Service → LocalStorageAdapter (구현체 직접 참조)
```

### 파일 위치 규칙

```
인터페이스 → src/services/interfaces/ (필수, 먼저 생성)
서비스 구현 → src/services/ (인터페이스 없으면 생성 금지)
훅 → src/hooks/ (비즈니스 로직은 서비스로 위임)
컴포넌트 → src/components/ (렌더링만, 비즈니스 로직 금지)
테스트 → src/__tests__/ (서비스보다 먼저 작성)
```

---

## ✅ 응답 규칙

- **언어**: 한국어로만 답변 (영어 금지)
- **코드 제안**: 빌드가 깨지는 코드 제안 금지
- **인터페이스 없는 서비스**: 구현 제안 금지
- **테스트 없는 기능**: 구현 제안 금지 (TDD 필수)

---

## 🚀 배포 가드레일

- PR 전 `npm test` PASS 확인 필수
- PR 전 `npm run build` 성공 확인 필수
- 환경 변수 없이 배포 코드 생성 금지
- `.env.local` 내용 노출 금지
