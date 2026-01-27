# Smart Rules Archive - 제품 요구사항 명세서 (PRD)

## 1. 프로젝트 개요

### 1.1 프로젝트 명
**Smart Rules Archive** - 개인 맞춤형 개발 규칙 아카이빙 서비스

### 1.2 프로젝트 목적
개발자들이 자신만의 코딩 규칙, 베스트 프랙티스, AI 프롬프트 템플릿 등을 체계적으로 관리하고 공유할 수 있는 플랫폼을 제공합니다. cursor.directory와 유사하지만, 개인화되고 버전 관리가 가능한 규칙 저장소를 지향합니다.

### 1.3 참고 사이트
- **cursor.directory**: 규칙 카드 기반 UI, 카테고리별 분류, 검색 및 필터링 기능 참고
- GitHub Pages 기반의 정적 웹사이트로 구현하여 간편한 배포와 무료 호스팅 활용

## 2. 핵심 기능 요구사항

### 2.1 규칙 열람 기능 (Public)

#### 2.1.1 메인 페이지
- **검색 우선 인터페이스**: 상단에 눈에 띄는 검색바 배치
- **Featured Rules**: 주요/인기 규칙을 카드 형태로 표시
- **카테고리 네비게이션**: 프레임워크, 언어, 도구별 분류
- **다크 테마**: 개발자 친화적인 다크 모드 UI 기본 제공

#### 2.1.2 규칙 목록 페이지
- **카드 기반 레이아웃**: 각 규칙을 카드로 표시
  - 규칙 제목
  - 간단한 설명 (첫 3-4줄)
  - 태그 (예: TypeScript, React, Python)
  - 작성자 정보
  - 생성/수정 날짜
- **좌측 사이드바**: 카테고리별 필터링
  - All Rules
  - Trending
  - My Favorites (로컬스토리지 활용)
  - 언어별 (TypeScript, Python, JavaScript 등)
  - 프레임워크별 (React, Vue, Next.js 등)
  - 도구별 (Cursor, VS Code, Git 등)
- **상단 필터**: All / Popular / Recent / Official
- **실시간 검색**: 타이핑 시 즉시 필터링

#### 2.1.3 규칙 상세 페이지
- **전체 규칙 내용**: 모노스페이스 폰트로 가독성 확보
- **메타데이터 표시**:
  - 작성자 및 기여자
  - 생성/수정 날짜
  - 버전 정보 (v1.0.0 형식)
  - 관련 태그 (클릭 가능)
- **액션 버튼**:
  - **Copy**: 클립보드에 복사
  - **Download**: `.md` 파일로 다운로드
  - **Share**: URL 공유 (복사)
  - **Favorite**: 로컬스토리지에 즐겨찾기 저장
- **변경 이력 (Version History)**: 이전 버전 보기 가능
- **댓글 시스템 (Optional)**: GitHub Discussions 연동

### 2.2 규칙 등록/수정 기능 (Contribution)

#### 2.2.1 웹 기반 등록 인터페이스
- **로그인 없이 기여 가능**: GitHub 계정 불필요 (선택적)
- **규칙 작성 폼**:
  - 제목 (필수)
  - 카테고리 선택 (다중 선택 가능)
  - 태그 입력 (콤마 구분)
  - 규칙 내용 (Markdown 에디터)
    - 실시간 미리보기
    - Syntax Highlighting
  - 작성자 이름/닉네임 (선택)
  - 이메일 (선택, PR 알림용)
- **임시 저장**: 로컬스토리지에 초안 저장
- **미리보기 모드**: 실제 표시될 모습 확인

#### 2.2.2 제출 프로세스
1. **브랜치 자동 생성**: 
   - 제출 시 `submissions/rule-{timestamp}-{random-id}` 형식의 브랜치 자동 생성
   - 예: `submissions/rule-20260127-a3f2b9`

2. **자동 커밋**:
   - 규칙 파일을 `rules/{category}/{slug}.md` 경로에 저장
   - Commit 메시지 형식: `규칙 추가: {규칙 제목}`
   - 작성자 정보는 파일의 frontmatter에 포함

3. **GitHub API 활용**:
   - GitHub Contents API로 파일 생성
   - GitHub Actions로 자동 PR 생성
   - PR 템플릿에 규칙 정보 및 체크리스트 포함

#### 2.2.3 검토 및 승인 프로세스
- **담당자 리뷰**:
  - PR에서 규칙 내용 검토
  - 형식, 품질, 중복 여부 확인
  - 필요 시 수정 요청 (PR 코멘트)
- **승인 및 머지**:
  - 승인 후 `main` 브랜치로 머지
  - 머지 시 GitHub Pages 자동 재배포
- **자동 알림**:
  - 머지 완료 시 작성자에게 이메일 알림 (제공된 경우)
  - 새로운 규칙 등록 시 RSS 피드 업데이트

### 2.3 버전 관리 기능

#### 2.3.1 규칙 버전 추적
- **Frontmatter에 버전 정보 포함**:
  ```yaml
  ---
  title: "TypeScript Best Practices"
  version: "1.2.0"
  created: "2026-01-15"
  updated: "2026-01-27"
  author: "John Doe"
  tags: [TypeScript, Best Practices]
  category: [Language, TypeScript]
  ---
  ```
- **Git History 활용**: 파일의 커밋 히스토리로 변경 내역 추적
- **Changelog 자동 생성**: 버전별 변경사항 요약

#### 2.3.2 버전 비교
- **Diff 뷰어**: 이전 버전과의 차이점 시각화
- **버전 리스트**: 해당 규칙의 모든 버전 목록 제공

## 3. 비기능적 요구사항

### 3.1 성능
- **정적 사이트**: 빠른 로딩 속도 (First Contentful Paint < 1.5초)
- **검색 최적화**: 클라이언트 사이드 인덱싱으로 실시간 검색 (< 100ms)
- **이미지 최적화**: WebP 포맷 사용, Lazy Loading

### 3.2 접근성
- **WCAG 2.1 AA 준수**
- **키보드 네비게이션**: 모든 기능 키보드로 접근 가능
- **스크린 리더 지원**: Semantic HTML, ARIA 속성 활용
- **색상 대비**: 최소 4.5:1 비율 유지

### 3.3 보안
- **GitHub API 인증**: Personal Access Token (서버 사이드에서 관리)
- **입력 검증**: XSS, Injection 공격 방지
- **Rate Limiting**: API 호출 제한으로 남용 방지

### 3.4 확장성
- **모듈형 구조**: 새로운 카테고리 추가 용이
- **플러그인 시스템**: 커스텀 파서, 렌더러 추가 가능
- **다국어 지원**: i18n 구조 준비 (초기는 한글/영어)

## 4. 기술 스택

### 4.1 프론트엔드
- **Framework**: Next.js (Static Site Generation)
- **Styling**: Tailwind CSS + CSS Modules
- **Markdown**: Marked.js + Highlight.js (Syntax Highlighting)
- **검색**: Fuse.js (Fuzzy Search)
- **상태 관리**: React Context API (간단한 상태)
- **폼**: React Hook Form + Zod (Validation)

### 4.2 백엔드/인프라
- **호스팅**: GitHub Pages
- **CI/CD**: GitHub Actions
  - PR 생성 자동화
  - 빌드 및 배포 자동화
  - 규칙 검증 (Linting, Format Check)
- **API**: 
  - GitHub Contents API (파일 생성/수정)
  - GitHub Pulls API (PR 관리)
  - (Optional) Serverless Functions (Vercel/Netlify) for Form Submission

### 4.3 데이터 저장
- **규칙 저장소**: `rules/` 디렉토리 내 Markdown 파일
- **메타데이터**: YAML Frontmatter
- **검색 인덱스**: 빌드 타임에 JSON 생성 (`public/search-index.json`)

## 5. 사용자 플로우

### 5.1 규칙 열람 플로우
```
홈페이지 접속 
  → 검색 또는 카테고리 선택 
  → 규칙 목록 확인 
  → 규칙 카드 클릭 
  → 상세 페이지 열람 
  → Copy/Download/Share
```

### 5.2 규칙 등록 플로우
```
등록 버튼 클릭 
  → 작성 폼 입력 
  → 미리보기 확인 
  → 제출 
  → GitHub에 자동 브랜치 생성 및 커밋 
  → PR 자동 생성 
  → 담당자 리뷰 
  → 승인 및 머지 
  → GitHub Pages 재배포 
  → 새 규칙 공개
```

### 5.3 규칙 수정 플로우 (기여자)
```
기존 규칙 상세 페이지 
  → "Suggest Edit" 버튼 클릭 
  → 수정 폼 (기존 내용 로드) 
  → 변경 사항 입력 
  → 제출 
  → 새 브랜치 및 PR 생성 (수정 제안) 
  → 리뷰 및 머지
```

## 6. UI/UX 디자인 가이드라인

### 6.1 디자인 원칙
- **Developer-First**: 개발자가 편안하게 느끼는 디자인
- **Clean & Minimal**: 불필요한 요소 제거, 콘텐츠 중심
- **Fast & Responsive**: 빠른 인터랙션, 모든 디바이스 지원
- **Accessible**: 모든 사용자가 접근 가능한 디자인

### 6.2 컬러 팔레트
- **Primary**: Deep Purple (`#5B21B6`)
- **Secondary**: Cyan (`#06B6D4`)
- **Background**: 
  - Dark Mode: `#0F172A` (Slate 900)
  - Light Mode: `#F8FAFC` (Slate 50)
- **Text**: 
  - Dark Mode: `#F1F5F9` (Slate 100)
  - Light Mode: `#1E293B` (Slate 800)
- **Accent**: Amber (`#F59E0B`) for highlights

### 6.3 타이포그래피
- **Headings**: Inter (Google Fonts), Bold, 1.2 line-height
- **Body**: Inter, Regular, 1.6 line-height
- **Code**: Fira Code, Monospace, 1.5 line-height

### 6.4 컴포넌트 스타일
- **Cards**: 
  - 둥근 모서리 (8px border-radius)
  - 미세한 그림자 (`shadow-lg`)
  - Hover 시 약간 상승 효과 (transform: translateY(-2px))
- **Buttons**:
  - Primary: Gradient background
  - Ghost: 투명 배경, 테두리만
  - Hover: 밝기 변화 + 미세 애니메이션
- **Inputs**:
  - Focus 시 테두리 색상 변경
  - 에러 시 빨간 테두리 + 메시지

### 6.5 애니메이션
- **Micro-interactions**: 
  - 버튼 클릭 시 ripple 효과
  - 카드 호버 시 lift 효과
- **Transitions**: 
  - 페이지 전환: Fade + Slide (300ms)
  - 로딩: Skeleton UI
- **Scroll Animations**: 
  - Fade-in on scroll (Intersection Observer)

## 7. 성공 지표 (KPI)

### 7.1 트래픽
- **월간 방문자 수**: 500명 (3개월 후 목표)
- **페이지뷰**: 평균 3 페이지/세션
- **평균 체류 시간**: 2분 이상

### 7.2 기여
- **월간 새 규칙 등록**: 10개
- **PR 머지율**: 80% 이상
- **평균 리뷰 시간**: 48시간 이내

### 7.3 사용성
- **검색 성공률**: 70% 이상 (검색 후 클릭)
- **Copy 버튼 사용률**: 50% 이상
- **모바일 트래픽 비율**: 30% 이상

## 8. 릴리즈 계획

### 8.1 Phase 1 - MVP (4주)
- 기본 규칙 열람 기능
- 카테고리 및 검색 기능
- 10개의 초기 규칙 작성
- GitHub Pages 배포

### 8.2 Phase 2 - 기여 시스템 (3주)
- 웹 기반 규칙 등록 폼
- 자동 PR 생성 시스템
- 리뷰 워크플로우 구축

### 8.3 Phase 3 - 고도화 (4주)
- 버전 관리 기능
- 즐겨찾기 기능
- 다국어 지원 (영어)
- Analytics 도입

### 8.4 Phase 4 - 커뮤니티 (계속)
- 사용자 프로필 페이지
- 댓글 시스템 (GitHub Discussions)
- RSS 피드
- 뉴스레터

## 9. 리스크 및 대응 방안

### 9.1 리스크
| 리스크 | 영향도 | 확률 | 대응 방안 |
|--------|--------|------|-----------|
| GitHub API Rate Limit 초과 | 높음 | 중간 | Serverless Function 활용, 캐싱 |
| 스팸 규칙 등록 | 중간 | 높음 | 수동 리뷰, reCAPTCHA 도입 |
| 검색 성능 저하 (규칙 수 증가) | 중간 | 낮음 | 서버 사이드 검색 전환, Algolia 도입 |
| 낮은 초기 트래픽 | 낮음 | 높음 | SEO 최적화, 커뮤니티 홍보 |

## 10. 부록

### 10.1 규칙 파일 예시
```markdown
---
title: "TypeScript 엄격 모드 Best Practices"
version: "1.0.0"
created: "2026-01-27"
updated: "2026-01-27"
author: "홍길동"
email: "hong@example.com"
tags: [TypeScript, Best Practices, Strict Mode]
category: [Language, TypeScript]
difficulty: intermediate
---

# TypeScript 엄격 모드 Best Practices

## 개요
TypeScript의 엄격 모드를 활성화하여 더 안전한 코드를 작성하는 방법을 안내합니다.

## 규칙

### 1. `strict` 모드 활성화
\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

### 2. `noImplicitAny` 사용
- 암시적 any 타입을 허용하지 않습니다.
- 모든 변수와 매개변수에 명시적 타입을 지정합니다.

...
```

### 10.2 PR 템플릿
```markdown
## 규칙 정보
- **제목**: [규칙 제목]
- **카테고리**: [카테고리]
- **태그**: [태그1, 태그2, ...]

## 체크리스트
- [ ] 제목이 명확하고 설명적인가?
- [ ] 카테고리가 적절한가?
- [ ] Markdown 형식이 올바른가?
- [ ] 코드 예시가 포함되어 있는가?
- [ ] 중복된 규칙이 아닌가?
- [ ] Frontmatter가 완전한가?

## 추가 코멘트
[선택 사항]
```

---

**작성자**: Smart Rules Archive Team  
**작성일**: 2026-01-27  
**버전**: 1.0.0  
