# 🎯 Smart Rules Archive

개발자를 위한 규칙 아카이빙 서비스입니다. 코딩 규칙, 베스트 프랙티스, AI 프롬프트 템플릿을 체계적으로 관리하고 공유하세요.

## ✨ 주요 기능

- 📚 **규칙 아카이브**: Markdown 기반의 체계적인 규칙 관리
- 🔍 **실시간 검색**: Fuse.js를 활용한 빠른 검색
- 🎨 **Syntax Highlighting**: Highlight.js로 코드 블록 하이라이팅
- 🏷️ **카테고리 & 태그**: 효율적인 분류 시스템
- 📱 **반응형 디자인**: 모든 디바이스 지원
- 🚀 **GitHub Pages 배포**: 무료 호스팅

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Search**: Fuse.js
- **Markdown**: marked + highlight.js
- **Deployment**: GitHub Pages

## 🚀 시작하기

### 1. 설치

```bash
git clone https://github.com/YOUR_USERNAME/srules.git
cd srules
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드

```bash
# 검색 인덱스 생성
npm run build

# 정적 사이트 빌드
npm run build
```

## 📝 규칙 작성하기

`rules/` 디렉토리에 Markdown 파일을 추가하세요.

### 파일 구조

```
rules/
├── typescript/
│   ├── strict-mode.md
│   └── utility-types.md
├── react/
│   ├── hooks-patterns.md
│   └── performance-optimization.md
└── ...
```

### Frontmatter 형식

```markdown
---
title: "규칙 제목"
slug: "category/rule-name"
version: "1.0.0"
created: "2026-01-27"
author: "작성자"
tags: [Tag1, Tag2, Tag3]
category: [Category1, Category2]
difficulty: beginner # or intermediate, advanced
---

# 규칙 내용

본문 작성...
```

## 📂 프로젝트 구조

```
srules/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 워크플로우
├── docs/                       # 프로젝트 문서
│   ├── PRD.md
│   └── DEVELOPMENT_PLAN.md
├── rules/                      # 규칙 Markdown 파일
├── scripts/
│   └── build-search-index.js  # 검색 인덱스 생성 스크립트
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # React 컴포넌트
│   ├── lib/                   # 유틸리티 함수
│   └── types/                 # TypeScript 타입 정의
└── public/
    └── search-index.json      # 검색 인덱스 (자동 생성)
```

## 🌐 배포

### GitHub Pages 자동 배포

1. **GitHub 저장소 설정**
   - Settings → Pages → Source를 "GitHub Actions"로 변경

2. **환경 변수 설정** (선택사항)
   - Repository secrets에 `BASE_PATH` 추가 (서브 디렉토리 배포 시)

3. **Push to main**
   ```bash
   git push origin main
   ```

4. **배포 확인**
   - Actions 탭에서 워크플로우 실행 확인
   - 배포 완료 후 `https://YOUR_USERNAME.github.io/srules/` 접속

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 📞 문의

문제가 있으시면 [Issues](https://github.com/YOUR_USERNAME/srules/issues)를 열어주세요.

---

Made with ❤️ by [Your Name]
