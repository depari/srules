# Smart Rules Archive - 개발 계획서

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: Smart Rules Archive
- **목표**: 개발자 개인 규칙 아카이빙 및 공유 플랫폼
- **배포 방식**: GitHub Pages (정적 웹사이트)
- **개발 기간**: 총 11주 (4개 Phase)
- **팀 구성**: 1-2명 (풀스택 개발자)

### 1.2 기술 스택
| 영역 | 기술 |
|------|------|
| Frontend Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Markdown Parser | Gray-matter + Marked.js |
| Syntax Highlighting | Highlight.js |
| 검색 엔진 | Fuse.js |
| Form Validation | React Hook Form + Zod |
| 백엔드 API | GitHub API + Serverless Functions |
| CI/CD | GitHub Actions |
| 호스팅 | GitHub Pages |
| Analytics | Google Analytics 4 |

## 2. 프로젝트 구조

### 2.1 디렉토리 구조
```
srules/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml              # GitHub Pages 배포
│   │   ├── pr-automation.yml       # PR 자동 생성
│   │   └── validate-rule.yml       # 규칙 검증
│   └── PULL_REQUEST_TEMPLATE.md    # PR 템플릿
├── public/
│   ├── search-index.json           # 검색 인덱스 (빌드 시 생성)
│   └── assets/
│       ├── images/
│       └── icons/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx               # 홈페이지
│   │   ├── rules/
│   │   │   ├── page.tsx           # 규칙 목록
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # 규칙 상세
│   │   ├── submit/
│   │   │   └── page.tsx           # 규칙 제출 폼
│   │   ├── categories/
│   │   │   └── [category]/
│   │   │       └── page.tsx       # 카테고리별 목록
│   │   └── api/
│   │       └── submit-rule/
│   │           └── route.ts       # 규칙 제출 API
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── rules/
│   │   │   ├── RuleCard.tsx
│   │   │   ├── RuleDetail.tsx
│   │   │   ├── RuleList.tsx
│   │   │   ├── CategorySidebar.tsx
│   │   │   └── VersionHistory.tsx
│   │   └── forms/
│   │       ├── RuleSubmitForm.tsx
│   │       └── MarkdownEditor.tsx
│   ├── lib/
│   │   ├── rules.ts               # 규칙 로딩 유틸
│   │   ├── github-api.ts          # GitHub API 래퍼
│   │   ├── search.ts              # 검색 로직
│   │   └── utils.ts               # 공통 유틸
│   ├── types/
│   │   └── rule.ts                # 타입 정의
│   └── styles/
│       └── globals.css            # Tailwind 설정
├── rules/                          # 규칙 저장소 (Markdown 파일)
│   ├── typescript/
│   │   ├── strict-mode.md
│   │   └── best-practices.md
│   ├── react/
│   │   ├── hooks-patterns.md
│   │   └── performance.md
│   └── python/
│       └── pep8-guide.md
├── scripts/
│   ├── build-search-index.js      # 검색 인덱스 생성
│   └── validate-rule.js           # 규칙 검증 스크립트
├── docs/
│   ├── PRD.md                     # 제품 요구사항 명세서
│   ├── DEVELOPMENT_PLAN.md        # 개발 계획서 (본 문서)
│   └── CONTRIBUTING.md            # 기여 가이드
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 3. 개발 단계별 계획

### Phase 1: MVP - 기본 열람 기능 (4주)

#### Week 1: 프로젝트 설정 및 기본 구조
**목표**: 개발 환경 구축 및 프로젝트 초기 설정

**Tasks**:
- [ ] Next.js 프로젝트 초기화
  ```bash
  npx create-next-app@latest srules --typescript --tailwind --app
  ```
- [ ] 필요한 패키지 설치
  ```bash
  npm install gray-matter marked highlight.js fuse.js
  npm install -D @types/marked
  ```
- [ ] Tailwind CSS 설정 (다크 모드 포함)
- [ ] 프로젝트 디렉토리 구조 생성
- [ ] Git 저장소 설정 및 `.gitignore` 구성
- [ ] ESLint, Prettier 설정
- [ ] 타입 정의 작성 (`src/types/rule.ts`)

**Deliverables**:
- 초기화된 Next.js 프로젝트
- 기본 디렉토리 구조
- 타입 정의 파일

---

#### Week 2: 홈페이지 및 규칙 목록 페이지
**목표**: 메인 페이지와 규칙 목록 페이지 구현
**상태**: ✅ 완료

**Tasks**:
- [x] 레이아웃 컴포넌트 구현
  - `Header.tsx`: 로고, 네비게이션, 검색바
  - `Footer.tsx`: 링크, 소셜 미디어, 저작권
- [x] 홈페이지 (`app/page.tsx`)
  - Hero 섹션 (검색 우선 인터페이스)
  - Featured Rules 섹션 (카드 3-6개)
  - 카테고리 개요
- [x] 규칙 목록 페이지 (`app/rules/page.tsx`)
  - 규칙 로딩 로직 (`lib/rules.ts`)
  - `RuleCard` 컴포넌트
  - `RuleList` 컴포넌트
  - Pagination (초기 20개씩)

**Deliverables**:
- 작동하는 홈페이지
- 규칙 목록 페이지
- 재사용 가능한 컴포넌트

---

#### Week 3: 규칙 상세 페이지 및 사이드바
**목표**: 규칙 상세 보기 및 카테고리 필터링

**Tasks**:
- [ ] 규칙 상세 페이지 (`app/rules/[slug]/page.tsx`)
  - Markdown 렌더링 (Marked.js)
  - Syntax Highlighting (Highlight.js)
  - Frontmatter 파싱 (Gray-matter)
  - 메타데이터 표시 (작성자, 날짜, 태그)
- [ ] 액션 버튼 구현
  - Copy 버튼 (Clipboard API)
  - Download 버튼 (Blob 생성)
  - Share 버튼 (URL 복사)
- [ ] 카테고리 사이드바 (`CategorySidebar.tsx`)
  - 카테고리별 규칙 수 집계
  - 필터링 로직
- [ ] 카테고리별 페이지 (`app/categories/[category]/page.tsx`)

**Deliverables**:
- 완전한 규칙 상세 페이지
- 카테고리 필터링 기능
- 사이드바 컴포넌트

---

#### Week 4: 검색 및 초기 콘텐츠
**목표**: 검색 기능 구현 및 초기 규칙 작성
**상태**: ✅ 완료

**Tasks**:
- [x] 검색 기능 구현
  - 빌드 타임 검색 인덱스 생성 (`scripts/build-search-index.js`)
  - Fuse.js 통합
  - 실시간 검색 UI (`SearchBar.tsx`)
- [x] 10개 초기 규칙 작성
  - TypeScript (3개)
  - React (2개)
  - Python (2개)
  - Cursor AI (2개)
  - Git (1개)
- [x] GitHub Pages 배포 설정
  - GitHub Actions 워크플로우 (`.github/workflows/deploy.yml`)
  - `next.config.js`에서 `output: 'export'` 설정

**Deliverables**:
- 작동하는 검색 기능
- 10개의 규칙
- GitHub Pages 배포 완료

---

### Phase 2: 기여 시스템 (3주)

#### Week 5: 규칙 제출 폼 UI
**목표**: 웹 기반 규칙 제출 인터페이스 구현

**Tasks**:
- [ ] 제출 페이지 (`app/submit/page.tsx`)
- [ ] `RuleSubmitForm` 컴포넌트
  - React Hook Form 통합
  - Zod 스키마 정의 및 Validation
  - 필드:
    - 제목 (필수, 5-100자)
    - 카테고리 (다중 선택, 최소 1개)
    - 태그 (콤마 구분, 최소 1개)
    - 내용 (Markdown, 최소 100자)
    - 작성자 이름 (선택)
    - 이메일 (선택, 이메일 형식 검증)
- [ ] Markdown 에디터 (`MarkdownEditor.tsx`)
  - 에디터와 미리보기 Split View
  - Syntax Highlighting in Preview
  - 툴바 (bold, italic, code, link 등)
- [ ] 로컬스토리지 임시 저장
  - Auto-save 기능 (30초마다)
  - 페이지 재방문 시 복원

**Deliverables**:
- 완전한 규칙 제출 폼
- Markdown 에디터
- 임시 저장 기능

---

#### Week 6: GitHub API 통합 - 자동 PR 생성
**목표**: 제출된 규칙을 자동으로 GitHub PR로 생성
**상태**: ✅ 완료

**Tasks**:
- [x] GitHub API 래퍼 (`lib/github.ts`)
  - GitHub API 클래스 구현
  - API 함수: `createBranch`, `createFile`, `createPullRequest`
- [x] 제출 페이지 연동 (`app/submit/page.tsx`)
  - 폼 제출 시 GitHub API 호출
  - PR 생성 결과 URL 표시
- [x] 환경 변수 설정
  - `NEXT_PUBLIC_GITHUB_TOKEN`: GitHub Personal Access Token
  - `NEXT_PUBLIC_GITHUB_OWNER`: 저장소 소유자
  - `NEXT_PUBLIC_GITHUB_REPO`: 저장소 이름

**Deliverables**:
- GitHub API 통합
- 자동 PR 생성 기능
- Serverless API

---

#### Week 7: 리뷰 워크플로우 및 자동화
**목표**: PR 검증 및 머지 자동화

**Tasks**:
- [ ] 규칙 검증 스크립트 (`scripts/validate-rule.js`)
  - Frontmatter 필수 필드 확인
  - Markdown 형식 검사 (markdownlint)
  - 중복 제목 체크
  - 파일 위치 검증
- [ ] GitHub Actions 워크플로우 (`.github/workflows/validate-rule.yml`)
  - PR 생성 시 자동 실행
  - 검증 스크립트 실행
  - 실패 시 코멘트 추가
  - 성공 시 라벨 추가 (`ready-for-review`)
- [ ] 자동 머지 설정 (Optional)
  - 관리자 승인 후 자동 머지
  - `auto-merge` 라벨 사용
- [ ] 알림 시스템
  - 머지 완료 시 Discord/Slack 웹훅 (선택)
  - RSS 피드 업데이트

**Deliverables**:
- 자동 검증 워크플로우
- 규칙 검증 스크립트
- 리뷰 프로세스 자동화

---

### Phase 3: 고도화 (4주)

#### Week 8: 버전 관리 기능
**목표**: 규칙의 변경 이력 추적 및 버전 비교

**Tasks**:
- [ ] Git History 기반 버전 추적
  - `lib/git-utils.ts`: Git log 파싱 함수
  - 파일별 커밋 히스토리 조회
- [ ] 버전 히스토리 컴포넌트 (`VersionHistory.tsx`)
  - 버전 목록 표시
  - 각 버전의 날짜, 작성자, 커밋 메시지
- [ ] Diff 뷰어
  - `react-diff-viewer` 패키지 사용
  - 이전 버전과 현재 버전 비교
  - Side-by-side 또는 Unified 모드
- [ ] Frontmatter에 버전 정보 추가
  - `version` 필드 (Semantic Versioning)
  - 수정 시 버전 자동 증가 로직

**Deliverables**:
- 버전 히스토리 페이지
- Diff 뷰어
- 버전 관리 로직

---

#### Week 9: 즐겨찾기 및 사용자 기능
**목표**: 로컬 기반 사용자 개인화 기능

**Tasks**:
- [ ] 즐겨찾기 기능
  - 로컬스토리지에 저장
  - 하트 아이콘 토글
  - "My Favorites" 페이지 (`app/favorites/page.tsx`)
- [ ] 최근 본 규칙
  - 로컬스토리지에 기록 (최대 10개)
  - 사이드바에 표시
- [ ] 다크/라이트 모드 토글
  - `ThemeToggle.tsx` 컴포넌트
  - 로컬스토리지에 설정 저장
  - Tailwind의 `dark:` variant 사용
- [ ] 읽기 진행률 표시
  - Scroll progress bar (상세 페이지)

**Deliverables**:
- 즐겨찾기 시스템
- 테마 토글
- 개인화 기능

---

#### Week 10: 다국어 지원 (i18n)
**목표**: 한글과 영어 지원

**Tasks**:
- [ ] `next-intl` 패키지 설치 및 설정
- [ ] 번역 파일 작성 (`messages/ko.json`, `messages/en.json`)
  - UI 텍스트 번역
  - 공통 레이블, 버튼, 에러 메시지
- [ ] 언어 토글 버튼
  - Header에 배치
  - 로컬스토리지에 설정 저장
- [ ] 규칙 다국어 지원 (Optional)
  - `rules/en/` 디렉토리 생성
  - 같은 규칙의 영어 버전

**Deliverables**:
- 다국어 지원 (한글/영어)
- 언어 전환 기능

---

#### Week 11: Analytics 및 SEO 최적화
**목표**: 트래픽 분석 및 검색 엔진 최적화

**Tasks**:
- [ ] Google Analytics 4 설정
  - 추적 코드 삽입
  - 이벤트 추적 (규칙 조회, 복사, 다운로드)
- [ ] SEO 최적화
  - `metadata` 설정 (Next.js 14)
  - Open Graph 태그
  - Twitter Cards
  - Sitemap 생성 (`next-sitemap`)
  - `robots.txt`
- [ ] 성능 최적화
  - 이미지 최적화 (Next.js Image 컴포넌트)
  - Code Splitting
  - Lazy Loading
  - Lighthouse 점수 90+ 달성

**Deliverables**:
- Google Analytics 통합
- 완전한 SEO 설정
- 성능 최적화

---

### Phase 4: 커뮤니티 (지속적)

#### Week 12+: 커뮤니티 기능
**목표**: 사용자 참여 증대

**Tasks (우선순위 순)**:
1. [ ] 댓글 시스템 (GitHub Discussions 임베드)
2. [ ] 사용자 프로필 페이지
   - 기여한 규칙 목록
   - 통계 (총 기여 수, 머지된 PR 등)
3. [ ] 규칙 추천 시스템
   - 태그 기반 유사 규칙 추천
4. [ ] RSS 피드 생성
5. [ ] Newsletter (선택적, Mailchimp 등)
6. [ ] 규칙 별점/투표 시스템 (GitHub Stars 활용)

**Deliverables**:
- 지속적인 커뮤니티 기능 추가

---

## 4. 기술 상세 사양

### 4.1 규칙 파일 형식 (Markdown + Frontmatter)

```markdown
---
title: "TypeScript 엄격 모드 Best Practices"
slug: "typescript-strict-mode"
version: "1.0.0"
created: "2026-01-27"
updated: "2026-01-27"
author: "홍길동"
email: "hong@example.com"
tags: [TypeScript, Best Practices, Strict Mode]
category: [Language, TypeScript]
difficulty: intermediate
featured: false
---

# TypeScript 엄격 모드 Best Practices

## 개요
...
```

**Frontmatter 필수 필드**:
- `title`: 규칙 제목 (String, 5-100자)
- `slug`: URL용 슬러그 (String, 자동 생성 가능)
- `version`: 버전 (String, semver 형식)
- `created`: 생성일 (YYYY-MM-DD)
- `tags`: 태그 배열 (Array<String>, 최소 1개)
- `category`: 카테고리 배열 (Array<String>, 최소 1개)

**선택 필드**:
- `updated`: 수정일
- `author`: 작성자 이름
- `email`: 이메일
- `difficulty`: 난이도 (beginner, intermediate, advanced)
- `featured`: 메인 페이지 노출 여부

---

### 4.2 GitHub Actions 워크플로우

#### 4.2.1 배포 워크플로우 (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build search index
        run: node scripts/build-search-index.js
      
      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: ${{ secrets.BASE_PATH || '' }}
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

#### 4.2.2 규칙 검증 워크플로우 (`.github/workflows/validate-rule.yml`)

```yaml
name: Validate Submitted Rule

on:
  pull_request:
    paths:
      - 'rules/**/*.md'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run validation script
        run: node scripts/validate-rule.js
      
      - name: Check for duplicates
        run: |
          # 중복 제목 체크 로직
          node scripts/check-duplicates.js
      
      - name: Add label
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.addLabels({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: ['ready-for-review']
            })
      
      - name: Comment on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ 규칙 검증 실패. 로그를 확인하세요.'
            })
```

---

### 4.3 규칙 제출 API (`app/api/submit-rule/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';

const ruleSchema = z.object({
  title: z.string().min(5).max(100),
  category: z.array(z.string()).min(1),
  tags: z.array(z.string()).min(1),
  content: z.string().min(100),
  author: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ruleSchema.parse(body);
    
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const branchName = `submissions/rule-${timestamp}-${randomId}`;
    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-');
    const filePath = `rules/${validated.category[0]}/${slug}.md`;
    
    // 1. 브랜치 생성
    const { data: ref } = await octokit.git.getRef({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      ref: 'heads/main',
    });
    
    await octokit.git.createRef({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });
    
    // 2. 파일 생성
    const frontmatter = `---
title: "${validated.title}"
slug: "${slug}"
version: "1.0.0"
created: "${new Date().toISOString().split('T')[0]}"
tags: [${validated.tags.map(t => `"${t}"`).join(', ')}]
category: [${validated.category.map(c => `"${c}"`).join(', ')}]
${validated.author ? `author: "${validated.author}"` : ''}
${validated.email ? `email: "${validated.email}"` : ''}
---

${validated.content}
`;
    
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: filePath,
      message: `규칙 추가: ${validated.title}`,
      content: Buffer.from(frontmatter).toString('base64'),
      branch: branchName,
    });
    
    // 3. PR 생성
    const { data: pr } = await octokit.pulls.create({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      title: `새 규칙: ${validated.title}`,
      head: branchName,
      base: 'main',
      body: `## 규칙 정보
- **제목**: ${validated.title}
- **카테고리**: ${validated.category.join(', ')}
- **태그**: ${validated.tags.join(', ')}
${validated.author ? `- **작성자**: ${validated.author}` : ''}

이 PR은 자동으로 생성되었습니다.`,
    });
    
    return NextResponse.json({
      success: true,
      prUrl: pr.html_url,
    });
    
  } catch (error) {
    console.error('Rule submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 검증 실패', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: '규칙 제출 실패' },
      { status: 500 }
    );
  }
}
```

---

### 4.4 검색 인덱스 생성 스크립트 (`scripts/build-search-index.js`)

```javascript
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rulesDir = path.join(__dirname, '../rules');
const outputPath = path.join(__dirname, '../public/search-index.json');

function getAllRules(dir) {
  let rules = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      rules = rules.concat(getAllRules(filePath));
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: body } = matter(content);
      
      rules.push({
        title: data.title,
        slug: data.slug,
        category: data.category,
        tags: data.tags,
        author: data.author || 'Anonymous',
        excerpt: body.substring(0, 200).replace(/\n/g, ' '),
        path: filePath.replace(rulesDir, '').replace('.md', ''),
      });
    }
  }
  
  return rules;
}

const searchIndex = getAllRules(rulesDir);

fs.writeFileSync(
  outputPath,
  JSON.stringify(searchIndex, null, 2),
  'utf-8'
);

console.log(`✅ Search index created: ${searchIndex.length} rules`);
```

---

## 5. 환경 변수 설정

프로젝트 root에 `.env.local` 파일 생성:

```env
# GitHub API
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-username
GITHUB_REPO=srules

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-username.github.io/srules
NEXT_PUBLIC_BASE_PATH=/srules

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**GitHub Token 생성 방법**:
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. 권한 선택:
   - `repo` (전체)
   - `workflow`
4. Token 복사하여 `.env.local`에 저장

---

## 6. 배포 가이드

### 6.1 초기 배포

1. **package.json 수정**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "node scripts/build-search-index.js && next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

2. **next.config.js 설정**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
```

3. **GitHub 저장소 설정**:
   - Settings → Pages → Source: GitHub Actions

4. **첫 배포**:
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

---

### 6.2 지속적 배포

- `main` 브랜치에 push 시 자동 배포
- GitHub Actions가 빌드 및 배포 자동 실행
- 배포 URL: `https://your-username.github.io/srules/`

---

## 7. 테스트 계획

### 7.1 단위 테스트
- **도구**: Jest + React Testing Library
- **대상**:
  - 유틸 함수 (`lib/rules.ts`, `lib/search.ts`)
  - 개별 컴포넌트 (RuleCard, SearchBar 등)

### 7.2 통합 테스트
- **도구**: Playwright
- **시나리오**:
  - 홈 → 검색 → 규칙 상세
  - 규칙 제출 플로우
  - 카테고리 필터링

### 7.3 E2E 테스트
- **도구**: Playwright
- **시나리오**:
  - 전체 사용자 플로우
  - GitHub API 통합 (Mock)

---

## 8. 성능 목표

| 지표 | 목표 |
|------|------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| 번들 사이즈 (JS) | < 200KB (gzipped) |

---

## 9. 모니터링 및 유지보수

### 9.1 모니터링
- **Google Analytics**: 트래픽, 사용자 행동
- **GitHub Insights**: PR 통계, 기여자 수
- **Sentry** (선택): 에러 추적

### 9.2 정기 작업
- **월간**: 
  - 규칙 검토 (오래된 규칙 업데이트)
  - Analytics 리뷰
- **분기**: 
  - 의존성 업데이트 (`npm audit`, `npm outdated`)
  - 성능 감사 (Lighthouse)

---

## 10. 리스크 관리

| 리스크 | 완화 전략 |
|--------|-----------|
| GitHub API Rate Limit | 캐싱, Serverless Function, 요청 제한 |
| 스팸 규칙 | reCAPTCHA, 수동 리뷰 필수 |
| 검색 성능 저하 | 서버 사이드 검색 전환, Algolia |
| 낮은 초기 트래픽 | SEO 최적화, 커뮤니티 홍보, SNS 공유 |

---

## 11. 향후 확장 계획

### 11.1 Short-term (3-6개월)
- [ ] 모바일 앱 (PWA)
- [ ] VS Code Extension (규칙 바로 적용)
- [ ] CLI 도구 (규칙 다운로드/적용)

### 11.2 Long-term (6-12개월)
- [ ] AI 기반 규칙 추천
- [ ] 규칙 A/B 테스트 플랫폼
- [ ] 팀/조직용 프라이빗 규칙 저장소

---

## 12. 참고 자료

- **Next.js 문서**: https://nextjs.org/docs
- **GitHub API**: https://docs.github.com/en/rest
- **cursor.directory**: https://cursor.directory/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Fuse.js**: https://fusejs.io/

---

**작성자**: Smart Rules Archive Team  
**작성일**: 2026-01-27  
**버전**: 1.0.0  
**다음 리뷰 일정**: 2026-02-03
