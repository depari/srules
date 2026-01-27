# Smart Rules Archive

개발자를 위한 개인 맞춤형 코딩 규칙 아카이빙 서비스

## 📌 프로젝트 소개

**Smart Rules Archive**는 개발자들이 자신만의 코딩 규칙, 베스트 프랙티스, AI 프롬프트 템플릿 등을 체계적으로 관리하고 공유할 수 있는 플랫폼입니다. [cursor.directory](https://cursor.directory/)에서 영감을 받아, 개인화되고 버전 관리가 가능한 규칙 저장소를 제공합니다.

## ✨ 주요 기능

### 🔍 규칙 열람
- **카드 기반 UI**: 직관적인 규칙 탐색
- **강력한 검색**: 실시간 퍼지 검색 (Fuse.js)
- **카테고리 필터링**: 언어, 프레임워크, 도구별 분류
- **다크 모드**: 개발자 친화적인 테마

### 📝 규칙 기여
- **웹 기반 제출**: 로그인 없이 간편하게 규칙 등록
- **자동 PR 생성**: GitHub API를 통한 자동화된 기여 프로세스
- **Markdown 에디터**: 실시간 미리보기 지원
- **임시 저장**: 로컬스토리지 기반 자동 저장

### 🔄 버전 관리
- **Git 기반 이력**: 규칙의 모든 변경 사항 추적
- **Diff 뷰어**: 버전 간 차이 시각화
- **Semantic Versioning**: 체계적인 버전 관리

### 🌍 다국어 지원
- 한글/영어 지원
- 확장 가능한 i18n 구조

## 🛠️ 기술 스택

| 카테고리 | 기술 |
|----------|------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript |
| **Styling** | Tailwind CSS |
| **Markdown** | Gray-matter, Marked.js, Highlight.js |
| **Search** | Fuse.js |
| **API** | GitHub API (Octokit) |
| **Deployment** | GitHub Pages, GitHub Actions |

## 📁 프로젝트 구조

```
srules/
├── .github/
│   ├── workflows/          # CI/CD 워크플로우
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
│   └── search-index.json   # 검색 인덱스
├── src/
│   ├── app/                # Next.js 페이지
│   ├── components/         # React 컴포넌트
│   ├── lib/                # 유틸리티 함수
│   └── types/              # TypeScript 타입
├── rules/                  # 규칙 저장소 (Markdown)
├── scripts/                # 빌드 스크립트
└── docs/                   # 문서
    ├── PRD.md
    └── DEVELOPMENT_PLAN.md
```

## 🚀 시작하기

### 사전 요구사항
- Node.js 20+
- npm 또는 yarn
- GitHub 계정

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/srules.git
cd srules

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 GitHub Token 등을 설정

# 개발 서버 실행
npm run dev
```

서버가 실행되면 http://localhost:3000에서 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 로컬에서 프로덕션 빌드 실행 (테스트용)
npm run start
```

GitHub Pages 배포는 `main` 브랜치에 push 하면 자동으로 진행됩니다.

## 📝 규칙 작성 가이드

### 규칙 파일 형식

규칙은 `rules/` 디렉토리 내에 Markdown 파일로 저장됩니다. 각 파일은 YAML Frontmatter를 포함해야 합니다.

```markdown
---
title: "TypeScript 엄격 모드 Best Practices"
slug: "typescript-strict-mode"
version: "1.0.0"
created: "2026-01-27"
tags: [TypeScript, Best Practices]
category: [Language, TypeScript]
author: "홍길동"
---

# TypeScript 엄격 모드 Best Practices

## 개요
TypeScript의 엄격 모드를 활성화하여 더 안전한 코드를 작성하는 방법...

## 규칙

### 1. strict 모드 활성화
\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

...
```

### 필수 Frontmatter 필드

- `title`: 규칙 제목
- `slug`: URL용 슬러그
- `version`: 버전 (semver)
- `created`: 생성일 (YYYY-MM-DD)
- `tags`: 태그 배열
- `category`: 카테고리 배열

## 🤝 기여 방법

### 1. 웹 인터페이스를 통한 기여 (권장)
1. 웹사이트의 "Submit Rule" 버튼 클릭
2. 양식 작성 (제목, 카테고리, 태그, 내용)
3. 미리보기 확인 후 제출
4. 자동으로 PR이 생성됩니다
5. 담당자 리뷰 후 승인되면 규칙이 공개됩니다

### 2. 직접 PR 생성
1. Fork 및 Clone
```bash
git clone https://github.com/your-username/srules.git
cd srules
```

2. 브랜치 생성
```bash
git checkout -b add-rule-typescript-best-practices
```

3. 규칙 파일 작성
```bash
# 적절한 카테고리 디렉토리에 파일 생성
# 예: rules/typescript/strict-mode.md
```

4. Commit 및 Push
```bash
git add .
git commit -m "규칙 추가: TypeScript 엄격 모드 Best Practices"
git push origin add-rule-typescript-best-practices
```

5. PR 생성
   - GitHub에서 Pull Request 생성
   - PR 템플릿에 따라 정보 입력

### 3. 규칙 검증

PR을 생성하면 자동으로 다음 검증이 실행됩니다:
- Frontmatter 필수 필드 확인
- Markdown 형식 검사
- 중복 제목 체크

검증을 통과하면 `ready-for-review` 라벨이 자동으로 추가됩니다.

## 📊 개발 로드맵

### Phase 1: MVP (4주) ✅
- [x] 기본 규칙 열람 기능
- [x] 검색 및 카테고리 필터링
- [x] GitHub Pages 배포
- [x] 초기 규칙 10개 작성

### Phase 2: 기여 시스템 (3주) 🚧
- [ ] 웹 기반 규칙 제출 폼
- [ ] 자동 PR 생성
- [ ] 리뷰 워크플로우

### Phase 3: 고도화 (4주) 📝
- [ ] 버전 관리 기능
- [ ] 즐겨찾기 시스템
- [ ] 다국어 지원 (한글/영어)
- [ ] Google Analytics

### Phase 4: 커뮤니티 (지속) 🌱
- [ ] 댓글 시스템 (GitHub Discussions)
- [ ] 사용자 프로필
- [ ] RSS 피드
- [ ] 규칙 추천 시스템

## 📚 문서

- [제품 요구사항 명세서 (PRD)](./docs/PRD.md)
- [개발 계획서](./docs/DEVELOPMENT_PLAN.md)
- [기여 가이드](./docs/CONTRIBUTING.md) (작성 예정)

## 📄 라이선스

MIT License

Copyright (c) 2026 Smart Rules Archive Team

## 🙏 감사의 글

이 프로젝트는 [cursor.directory](https://cursor.directory/)에서 영감을 받았습니다.

## 📞 문의

- 이슈: [GitHub Issues](https://github.com/your-username/srules/issues)
- 이메일: your-email@example.com

---

**Made with ❤️ by developers, for developers**
