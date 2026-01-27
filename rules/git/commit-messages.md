---
title: "Git 커밋 메시지 작성 가이드"
slug: "git/commit-messages"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [Git, Commit, Best Practices, Version Control]
category: [Tool, Git]
difficulty: beginner
---

# Git 커밋 메시지 작성 가이드

## 기본 구조

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type 종류

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드, 설정 파일 수정

## 예시

```
feat(auth): 사용자 로그인 기능 추가

- JWT 토큰 기반 인증 구현
- 로그인 폼 UI 작성
- API 엔드포인트 /api/auth/login 추가

Closes #123
```

## 규칙

1. 제목은 50자 이내
2. 제목과 본문 사이 빈 줄
3. 본문은 72자마다 줄바꿈
4. 제목은 명령문으로 ("추가함" 대신 "추가")
5. 이슈 번호 명시

## 좋은 예시

✅ `feat(user): 회원가입 이메일 인증 추가`
✅ `fix(api): null 참조 에러 수정`
✅ `docs(readme): 설치 가이드 업데이트`

## 나쁜 예시

❌ `update` (너무 모호함)
❌ `fix bug` (어떤 버그인지 불명확)
❌ `여러 기능 추가하고 버그도 수정함` (한 커밋에 여러 목적)
