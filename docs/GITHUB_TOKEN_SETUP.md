# GitHub Personal Access Token 생성 가이드

## 1. GitHub Token 생성

1. GitHub 로그인
2. 우측 상단 프로필 → Settings
3. 왼쪽 메뉴 맨 아래 → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token (classic)

## 2. Token 설정

**Token 이름**: srules PR automation

**권한 (Scopes) 선택**:
- ✅ `repo` (Full control of private repositories)
  - repo:status
  - repo_deployment
  - public_repo
  - repo:invite
  - security_events

**Expiration**: 선택 (권장: 90 days)

**Generate token** 클릭

## 3. Token 복사

⚠️ **중요**: 생성된 token을 즉시 복사하세요!
(페이지를 떠나면 다시 볼 수 없습니다)

## 4. 로컬 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local
NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GITHUB_OWNER=depari
NEXT_PUBLIC_GITHUB_REPO=srules
```

## 5. 개발 서버 재시작

Token을 환경 변수로 로드하려면 서버 재시작 필요:

```bash
# 기존 서버 종료 (Ctrl+C)
npm run dev
```

## 6. 테스트

1. http://localhost:3000/submit
2. 규칙 작성 및 제출
3. 성공 시 PR URL이 표시됨!

---

## 보안 주의사항

⚠️ `.env.local` 파일은 절대 Git에 커밋하지 마세요!
- `.gitignore`에 이미 포함되어 있음
- Token은 개인 비밀 정보입니다

## Troubleshooting

### Token이 작동하지 않는 경우

1. **권한 확인**: `repo` 스코프가 선택되었는지 확인
2. **서버 재시작**: 환경 변수 변경 후 반드시 재시작
3. **Token 만료**: 만료되지 않았는지 확인
4. **저장소 권한**: depari/srules 저장소에 write 권한이 있는지 확인

### 콘솔 에러 확인

브라우저 개발자 도구 (F12) → Console 탭에서 상세 에러 확인
