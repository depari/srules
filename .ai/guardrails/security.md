# 보안 가드레일 (Security Guardrails)

이 파일은 srules 프로젝트의 보안 원칙과 검증 기준을 정의합니다.

---

## 1. 비밀 정보 관리

### 원칙: 코드에 비밀값 하드코딩 금지

| 유형 | 잘못된 예 | 올바른 예 |
|------|-----------|-----------|
| GitHub Token | `const token = "ghp_xxx"` | `process.env.NEXT_PUBLIC_GITHUB_TOKEN` |
| Telegram Token | `const t = "1234:AAAA"` | `process.env.TELEGRAM_TOKEN` |
| API Key | `const key = "sk-xxx"` | `process.env.API_KEY` |
| Password | `const pw = "secret"` | 환경 변수 또는 Vault |

### 환경 변수 파일 관리

```
.env.local     → 실제 값 (git 제외, .gitignore에 포함)
.env.example   → 템플릿/가이드 (git 포함, 실제 값 없음)
```

### 코드 패턴 검사 (PreCommit)

다음 패턴이 코드에 존재하면 커밋 중단:
```
/^ghp_[a-zA-Z0-9]+/    # GitHub Token
/^AIzaSy[a-zA-Z0-9]+/  # Google API Key
/^sk-[a-zA-Z0-9]+/     # OpenAI Key
/^[0-9]+:AA[a-zA-Z0-9]+/  # Telegram Token
```

---

## 2. 입력값 검증

### 사용자 입력 처리
```typescript
// ✅ 입력값 검증 후 사용
import { z } from 'zod';

const RuleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  category: z.array(z.string()),
});

function submitRule(input: unknown) {
  const parsed = RuleSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error('유효하지 않은 입력값');
  }
  return parsed.data;
}
```

### XSS 방지
```typescript
// ❌ 위험한 패턴
element.innerHTML = userContent;

// ✅ 안전한 패턴 (Markdown → sanitized HTML)
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(markdownToHtml(userContent));
```

---

## 3. 접근 제어

### 환경 변수 접근 패턴
```typescript
// ✅ 항상 존재 여부 확인
function getGitHubToken(): string {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (!token) {
    throw new Error('NEXT_PUBLIC_GITHUB_TOKEN이 설정되지 않았습니다. .env.local 확인 필요');
  }
  return token;
}
```

### API 요청 보안
```typescript
// ✅ Authorization 헤더 사용
const headers = {
  'Authorization': `Bearer ${getGitHubToken()}`,
  'Content-Type': 'application/json',
};
```

---

## 4. 보안 검사 체크리스트 (코드 리뷰 시)

- [ ] 하드코딩된 비밀값 없음
- [ ] 모든 외부 입력값 검증 (zod, 타입 가드)
- [ ] XSS 가능 패턴 없음 (`innerHTML` 직접 할당)
- [ ] 환경 변수 null check 포함
- [ ] `.env.local` 파일 git 스테이징 안 됨
- [ ] `eval()`, `new Function()` 사용 없음
- [ ] 에러 메시지에 민감 정보 포함 안 됨

---

## 5. Dependency 보안

```bash
# 주기적 취약점 검사 (CI에서 자동 실행 권장)
npm audit

# 자동 수정 (안전한 범위에서)
npm audit fix
```
