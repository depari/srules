# SOLID 원칙 기반 프로젝트 개선 계획서

**프로젝트명**: Smart Rules Archive (srules)  
**작성일**: 2026-01-28  
**작성자**: Antigravity AI  
**버전**: 1.0.0

---

## 📋 목차

1. [개요](#개요)
2. [프로젝트 현황 분석](#프로젝트-현황-분석)
3. [SOLID 원칙 분석](#solid-원칙-분석)
4. [개선 항목](#개선-항목)
5. [우선순위 및 로드맵](#우선순위-및-로드맵)
6. [검증 계획](#검증-계획)
7. [예상 효과](#예상-효과)

---

## 개요

### 목적
현재 Smart Rules Archive 프로젝트를 SOLID 원칙 관점에서 분석하고, 코드 품질 및 유지보수성 향상을 위한 구체적인 개선 방안을 제시합니다.

### 범위
- **대상**: Next.js 기반 React/TypeScript 프로젝트
- **분석 영역**: 컴포넌트, 라이브러리, 타입 정의, 비즈니스 로직
- **적용 원칙**: SOLID 5대 원칙 (SRP, OCP, LSP, ISP, DIP)

---

## 프로젝트 현황 분석

### 기술 스택
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4
- **상태 관리**: React Hooks, LocalStorage
- **폼 검증**: React Hook Form + Zod
- **Markdown**: marked, gray-matter
- **검색**: Fuse.js
- **테스팅**: Jest, React Testing Library
- **국제화**: next-intl

### 아키텍처 구조
```
src/
├── app/                    # Next.js App Router 페이지
│   ├── [locale]/          # 국제화 라우팅
│   └── (index)/           # 홈 페이지
├── components/            # React 컴포넌트
│   ├── common/            # 공통 컴포넌트
│   ├── favorites/         # 즐겨찾기 기능
│   ├── rules/             # 규칙 관련 컴포넌트
│   └── submit/            # 제출 폼
├── lib/                   # 비즈니스 로직 및 유틸리티
│   ├── github.ts          # GitHub API 클라이언트
│   ├── rules.ts           # 규칙 데이터 처리
│   ├── storage.ts         # LocalStorage 관리
│   └── markdown.ts        # Markdown 파싱
└── types/                 # TypeScript 타입 정의
```

---

## SOLID 원칙 분석

### 1. SRP (Single Responsibility Principle) - 단일 책임 원칙

#### ❌ 위반 사례

**1-1. `RuleActions.tsx` - 다중 책임 문제**
```typescript
// 현재: 즐겨찾기, 복사, 삭제, 다운로드, 공유 등 다수의 기능이 한 컴포넌트에 혼재
export default function RuleActions({ content, slug, title, ... }) {
    const handleCopy = async () => { /* 복사 로직 */ }
    const handleDownload = () => { /* 다운로드 로직 */ }
    const handleShare = async () => { /* 공유 로직 */ }
    const handleFavorite = () => { /* 즐겨찾기 로직 */ }
    const handleDelete = async () => { /* 삭제 로직 + GitHub API 호출 */ }
    // ... UI 렌더링
}
```

**문제점**:
- 하나의 컴포넌트가 너무 많은 책임을 가짐 (202줄)
- 각 액션의 상태 관리가 컴포넌트 내부에 산재
- 테스트 및 재사용이 어려움
- GitHub API 호출 로직이 UI 컴포넌트에 직접 포함

**1-2. `SubmitClient.tsx` - 비즈니스 로직과 UI 혼재**
```typescript
// 현재: 447줄의 거대한 컴포넌트
// 폼 검증, API 호출, UI 렌더링, 프리뷰 생성 등이 모두 포함
function SubmitForm() {
    const onSubmit = async (data: RuleFormData) => {
        // GitHub API 클라이언트 생성 및 호출
        const client = createGitHubClient();
        // Issue URL 생성 로직
        // PR 생성 로직
        // ...
    }
    // ... 복잡한 UI 렌더링
}
```

**문제점**:
- 폼 제출 로직, GitHub 통신, UI가 모두 한 곳에 존재
- 비즈니스 로직 재사용 불가
- 단위 테스트 작성 어려움

**1-3. `github.ts` - API 클라이언트가 너무 많은 책임**
```typescript
export class GitHubAPIClient {
    private async request() { /* HTTP 요청 */ }
    private async getMainBranchSHA() { /* Git 작업 */ }
    private async createBranch() { /* Git 작업 */ }
    private async createFile() { /* 파일 작업 */ }
    private async deleteFile() { /* 파일 작업 */ }
    async submitRule() { /* 복잡한 비즈니스 로직: 브랜치 생성 + 파일 생성 + PR 생성 */ }
    async updateRule() { /* 복잡한 비즈니스 로직 */ }
    async deleteRule() { /* 복잡한 비즈니스 로직 */ }
}
```

**문제점**:
- HTTP 통신, Git 작업, 비즈니스 로직이 모두 혼재
- 각 메서드가 여러 단계의 작업을 수행
- 테스트 시 모킹이 어려움

### 2. OCP (Open/Closed Principle) - 개방-폐쇄 원칙

#### ❌ 위반 사례

**2-1. `storage.ts` - 하드코딩된 스토리지 키**
```typescript
const STORAGE_KEYS = {
    FAVORITES: 'srules_favorites',
    RECENT_VIEWS: 'srules_recent_views',
    GITHUB_TOKEN: 'srules_github_token',
    THEME: 'srules_theme',
};

export const getFavorites = (): FavoriteItem[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
};
```

**문제점**:
- LocalStorage에 강하게 결합됨
- 다른 스토리지 (SessionStorage, IndexedDB) 로 확장하려면 코드 수정 필요
- 스토리지 추상화 계층 부재

**2-2. `rules.ts` - 파일 시스템에 강한 결합**
```typescript
const rulesDirectory = path.join(process.cwd(), 'rules');

export function getAllRules(): RuleListItem[] {
    const files = getAllRuleFiles();
    const rules: RuleListItem[] = files.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        // ...
    });
}
```

**문제점**:
- 파일 시스템에만 의존, 다른 데이터 소스(API, DB) 확장 불가
- 데이터 레이어 추상화 부재

**2-3. `SearchBar.tsx` - Fuse.js에 강한 결합**
```typescript
const fuseInstance = new Fuse(data, {
    keys: [...],
    threshold: 0.4,
});
```

**문제점**:
- 검색 엔진 교체 시 컴포넌트 수정 필요
- 검색 로직이 UI와 강하게 결합

### 3. LSP (Liskov Substitution Principle) - 리스코프 치환 원칙

#### ✅ 양호한 부분
- 현재 프로젝트에 복잡한 상속 구조가 없음
- 대부분 함수형 컴포넌트 및 유틸리티 함수 사용
- 인터페이스 기반 설계 필요성 낮음

#### ⚠️ 개선 여지
타입 정의가 일부 모호하여 예상치 못한 동작 가능성 존재

### 4. ISP (Interface Segregation Principle) - 인터페이스 분리 원칙

#### ❌ 위반 사례

**4-1. `RuleActions.tsx` Props - 비대한 인터페이스**
```typescript
interface RuleActionsProps {
    content: string;
    slug: string;
    title: string;
    author?: string;
    category: string[];
    difficulty?: string;
    excerpt?: string;
    created: string;
    tags: string[];
}
```

**문제점**:
- 모든 액션이 모든 props를 필요로 하지 않음
- 예: `handleCopy`는 `content`만 필요, `handleFavorite`는 `author`, `category` 등 필요
- 불필요한 데이터 전달로 인한 결합도 증가

**4-2. GitHub API 메서드가 비대한 파라미터 받음**
```typescript
interface CreatePRParams {
    title: string;
    content: string;
    category: string[];
    tags: string[];
    difficulty: string;
    author: string;
}

async submitRule(params: CreatePRParams) { /* ... */ }
async updateRule(params: CreatePRParams & { originalPath: string }) { /* ... */ }
```

**문제점**:
- 각 메서드가 필요 이상의 정보를 받음
- 관심사 분리 부족

### 5. DIP (Dependency Inversion Principle) - 의존성 역전 원칙

#### ❌ 위반 사례

**5-1. 컴포넌트가 구체 구현체에 직접 의존**
```typescript
// RuleActions.tsx
import { createGitHubClient } from '@/lib/github';
import { toggleFavorite, isFavorite, addRecentView } from '@/lib/storage';

const handleDelete = async () => {
    const client = createGitHubClient(); // 구체 클래스에 직접 의존
    await client.deleteRule(...);
};
```

**문제점**:
- 고수준 모듈(컴포넌트)이 저수준 모듈(구체 API 클라이언트)에 직접 의존
- 테스트 시 실제 GitHub API를 호출하거나 복잡한 모킹 필요
- 인터페이스/추상화 계층 부재

**5-2. `SubmitClient.tsx`도 동일한 문제**
```typescript
import { createGitHubClient } from '@/lib/github';

const onSubmit = async (data: RuleFormData) => {
    const client = createGitHubClient(); // 구체 클래스에 직접 의존
    const { prUrl } = await client.submitRule(...);
};
```

---

## 개선 항목

### 개선 항목 1: 컴포넌트 책임 분리 (SRP)

#### 개선 방안

**1-1. `RuleActions.tsx` 리팩토링**

각 액션을 독립적인 훅 또는 서비스로 분리:

```typescript
// hooks/useRuleActions.ts
export function useCopyRule(content: string) {
    const [copied, setCopied] = useState(false);
    
    const copy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return { copied, copy };
}

export function useDownloadRule(slug: string, content: string) {
    const download = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug.replace(/\//g, '-')}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    return { download };
}

export function useShareRule() {
    const [sharesCopied, setShareCopied] = useState(false);
    
    const share = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
    };
    
    return { sharesCopied, share };
}

export function useFavoriteRule(slug: string, ruleData: FavoriteItem) {
    const [favorited, setFavorited] = useState(false);
    
    useEffect(() => {
        setFavorited(isFavorite(slug));
    }, [slug]);
    
    const toggleFavorite = () => {
        const isAdded = toggleFavoriteStorage(ruleData);
        setFavorited(isAdded);
        window.dispatchEvent(new CustomEvent('favorites-updated'));
    };
    
    return { favorited, toggleFavorite };
}

export function useDeleteRule(slug: string, title: string, author: string) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePrUrl, setDeletePrUrl] = useState<string | null>(null);
    
    const deleteRule = async (ruleService: IRuleService) => {
        if (!confirm('정말로 이 규칙을 삭제하시겠습니까?')) return;
        
        setIsDeleting(true);
        try {
            const { prUrl } = await ruleService.deleteRule({
                title,
                originalPath: `rules/${slug}.md`,
                author
            });
            setDeletePrUrl(prUrl);
            alert('삭제 요청 PR이 성공적으로 생성되었습니다.');
        } catch (error) {
            console.error('Delete error:', error);
            alert('삭제 요청 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };
    
    return { isDeleting, deletePrUrl, deleteRule };
}
```

**1-2. 리팩토링된 `RuleActions.tsx`**

```typescript
// components/rules/RuleActions.tsx
import { useCopyRule, useDownloadRule, useShareRule, useFavoriteRule, useDeleteRule } from '@/hooks/useRuleActions';
import { useRuleService } from '@/hooks/useRuleService';

export default function RuleActions({ content, slug, title, author, ... }: RuleActionsProps) {
    const ruleService = useRuleService();
    const { copied, copy } = useCopyRule(content);
    const { download } = useDownloadRule(slug, content);
    const { sharesCopied, share } = useShareRule();
    const { favorited, toggleFavorite } = useFavoriteRule(slug, { slug, title, category, ... });
    const { isDeleting, deletePrUrl, deleteRule } = useDeleteRule(slug, title, author || 'Anonymous');
    
    if (deletePrUrl) {
        return <DeleteSuccessMessage prUrl={deletePrUrl} />;
    }
    
    return (
        <RuleActionButtons
            copied={copied}
            onCopy={copy}
            favorited={favorited}
            onFavorite={toggleFavorite}
            onDownload={download}
            sharesCopied={sharesCopied}
            onShare={share}
            isDeleting={isDeleting}
            onDelete={() => deleteRule(ruleService)}
            editSlug={slug}
        />
    );
}
```

**영향도**: 중간  
- `RuleActions.tsx` 파일 수정
- 새로운 `hooks/useRuleActions.ts` 파일 생성
- UI 컴포넌트 분리 필요 (`DeleteSuccessMessage`, `RuleActionButtons`)

**검증 방안**:
1. 각 훅에 대한 단위 테스트 작성
2. 기존 기능 정상 동작 확인
3. 리팩토링 전후 동작 비교 테스트

---

**1-3. `SubmitClient.tsx` 리팩토링**

비즈니스 로직을 커스텀 훅으로 분리:

```typescript
// hooks/useRuleSubmission.ts
export function useRuleSubmission(editSlug: string | null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prUrl, setPrUrl] = useState<string | null>(null);
    const ruleService = useRuleService();
    
    const submitRule = async (data: RuleFormData) => {
        setIsSubmitting(true);
        try {
            const result = await ruleService.submitRule({
                ...data,
                tags: data.tags.split(',').map(tag => tag.trim()),
                fileName: editSlug ? `${editSlug}.md` : `${data.title.toLowerCase().replace(/\s+/g, '-')}.md`,
                isEdit: !!editSlug
            });
            setPrUrl(result.prUrl);
        } catch (error) {
            console.error('Submission error:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return { isSubmitting, prUrl, submitRule, setPrUrl };
}

// hooks/useRuleEditor.ts
export function useRuleEditor(editSlug: string | null, setValue: Function) {
    useEffect(() => {
        if (!editSlug) return;
        
        const loadRuleForEditing = async () => {
            try {
                const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                const response = await fetch(`${basePath}/rules/${editSlug}.md`);
                if (!response.ok) throw new Error('Rule not found');
                
                const text = await response.text();
                const { data, content } = matter(text);
                
                setValue('title', data.title || '');
                setValue('author', data.author || '');
                setValue('difficulty', data.difficulty || 'beginner');
                setValue('category', data.category || []);
                setValue('tags', (data.tags || []).join(', '));
                setValue('content', content || '');
            } catch (err) {
                console.error('Failed to load rule for editing:', err);
                alert('수정할 규칙을 불러오지 못했습니다.');
            }
        };
        
        loadRuleForEditing();
    }, [editSlug, setValue]);
}
```

**영향도**: 중간  
- `SubmitClient.tsx` 대폭 축소
- 새로운 훅 파일 생성
- 프리뷰 로직도 별도 훅으로 분리 가능

---

### 개선 항목 2: 추상화 계층 도입 (OCP, DIP)

#### 개선 방안

**2-1. 서비스 인터페이스 정의**

```typescript
// services/interfaces/IRuleService.ts
export interface IRuleService {
    submitRule(params: SubmitRuleParams): Promise<{ prUrl: string; prNumber: number }>;
    updateRule(params: UpdateRuleParams): Promise<{ prUrl: string; prNumber: number }>;
    deleteRule(params: DeleteRuleParams): Promise<{ prUrl: string; prNumber: number }>;
}

export interface SubmitRuleParams {
    title: string;
    content: string;
    category: string[];
    tags: string[];
    difficulty: string;
    author: string;
    fileName: string;
    isEdit?: boolean;
}

export interface UpdateRuleParams extends SubmitRuleParams {
    originalPath: string;
}

export interface DeleteRuleParams {
    title: string;
    originalPath: string;
    author: string;
}
```

**2-2. GitHub 서비스 구현**

```typescript
// services/GitHubRuleService.ts
export class GitHubRuleService implements IRuleService {
    private api: GitHubAPIClient;
    
    constructor(api: GitHubAPIClient) {
        this.api = api;
    }
    
    async submitRule(params: SubmitRuleParams): Promise<{ prUrl: string; prNumber: number }> {
        if (params.isEdit) {
            return this.api.updateRule(params as UpdateRuleParams);
        }
        return this.api.submitRule(params);
    }
    
    async updateRule(params: UpdateRuleParams): Promise<{ prUrl: string; prNumber: number }> {
        return this.api.updateRule(params);
    }
    
    async deleteRule(params: DeleteRuleParams): Promise<{ prUrl: string; prNumber: number }> {
        return this.api.deleteRule(params);
    }
}
```

**2-3. Issue 기반 서비스 구현 (토큰 없는 경우)**

```typescript
// services/IssueRuleService.ts
export class IssueRuleService implements IRuleService {
    private owner: string;
    private repo: string;
    
    constructor(owner: string, repo: string) {
        this.owner = owner;
        this.repo = repo;
    }
    
    async submitRule(params: SubmitRuleParams): Promise<{ prUrl: string; prNumber: number }> {
        const titleEncoded = encodeURIComponent(
            params.isEdit ? `[Update] ${params.title}` : `[Proposal] ${params.title}`
        );
        
        const bodyContent = this.generateIssueBody(params);
        const bodyEncoded = encodeURIComponent(bodyContent);
        
        const issueUrl = `https://github.com/${this.owner}/${this.repo}/issues/new?title=${titleEncoded}&body=${bodyEncoded}&labels=rule-proposal`;
        
        // 새 탭으로 이동
        window.open(issueUrl, '_blank');
        
        return { prUrl: issueUrl, prNumber: 0 };
    }
    
    private generateIssueBody(params: SubmitRuleParams): string {
        return `
## 규칙 제안서

**제목**: ${params.title}
**카테고리**: ${params.category.join(', ')}
**태그**: ${params.tags.join(', ')}
**난이도**: ${params.difficulty}
**작성자**: ${params.author}

### 제안 내용
\`\`\`markdown
${params.content}
\`\`\`

---
*이 이슈는 srules 웹사이트에서 생성되었습니다.*
        `.trim();
    }
    
    // updateRule, deleteRule도 유사하게 구현
}
```

**2-4. 서비스 팩토리 또는 Context Provider**

```typescript
// hooks/useRuleService.ts
import { createGitHubClient } from '@/lib/github';
import { GitHubRuleService } from '@/services/GitHubRuleService';
import { IssueRuleService } from '@/services/IssueRuleService';
import { IRuleService } from '@/services/interfaces/IRuleService';

export function useRuleService(): IRuleService {
    const client = createGitHubClient();
    const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'depari';
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'srules';
    
    if (client) {
        return new GitHubRuleService(client);
    }
    
    return new IssueRuleService(owner, repo);
}
```

**영향도**: 높음  
- `lib/github.ts` 수정
- 새로운 서비스 계층 생성
- 모든 컴포넌트에서 서비스 사용 방식 변경
- 테스트 코드 대폭 개선 가능

**검증 방안**:
1. Mock 서비스 구현하여 단위 테스트 작성
2. 실제 GitHub API 호출 시나리오 E2E 테스트
3. 이슈 생성 플로우 통합 테스트

---

### 개선 항목 3: 스토리지 추상화 (OCP, DIP)

#### 개선 방안

**3-1. 스토리지 인터페이스 정의**

```typescript
// services/interfaces/IStorage.ts
export interface IStorage<T> {
    get(key: string): T | null;
    set(key: string, value: T): void;
    remove(key: string): void;
    getAll(): T[];
}
```

**3-2. LocalStorage 어댑터 구현**

```typescript
// services/storage/LocalStorageAdapter.ts
export class LocalStorageAdapter<T> implements IStorage<T> {
    private prefix: string;
    
    constructor(prefix: string = 'srules') {
        this.prefix = prefix;
    }
    
    private getKey(key: string): string {
        return `${this.prefix}_${key}`;
    }
    
    get(key: string): T | null {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem(this.getKey(key));
        return stored ? JSON.parse(stored) : null;
    }
    
    set(key: string, value: T): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.getKey(key), JSON.stringify(value));
    }
    
    remove(key: string): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.getKey(key));
    }
    
    getAll(): T[] {
        // 구현 필요
        return [];
    }
}
```

**3-3. 리팩토링된 스토리지 서비스**

```typescript
// services/FavoriteService.ts
export class FavoriteService {
    private storage: IStorage<FavoriteItem[]>;
    private storageKey = 'favorites';
    
    constructor(storage: IStorage<FavoriteItem[]>) {
        this.storage = storage;
    }
    
    getFavorites(): FavoriteItem[] {
        return this.storage.get(this.storageKey) || [];
    }
    
    toggleFavorite(item: FavoriteItem): boolean {
        const favorites = this.getFavorites();
        const index = favorites.findIndex((f) => f.slug === item.slug);
        
        let isAdded = false;
        if (index === -1) {
            favorites.push(item);
            isAdded = true;
        } else {
            favorites.splice(index, 1);
            isAdded = false;
        }
        
        this.storage.set(this.storageKey, favorites);
        return isAdded;
    }
    
    isFavorite(slug: string): boolean {
        const favorites = this.getFavorites();
        return favorites.some((f) => f.slug === slug);
    }
}
```

**영향도**: 중간  
- `lib/storage.ts` 대폭 리팩토링
- 새로운 서비스 계층 및 어댑터 생성
- 컴포넌트에서 사용 방식 변경

**검증 방안**:
1. Mock 스토리지 어댑터로 단위 테스트
2. LocalStorage, SessionStorage 전환 테스트
3. 기존 기능 회귀 테스트

---

### 개선 항목 4: Props 인터페이스 분리 (ISP)

#### 개선 방안

**4-1. 작은 인터페이스로 분리**

```typescript
// types/rule-actions.ts
export interface CopyableRule {
    content: string;
}

export interface DownloadableRule {
    slug: string;
    content: string;
}

export interface ShareableRule {
    // URL은 window.location에서 가져오므로 props 불필요
}

export interface FavorableRule {
    slug: string;
    title: string;
    category: string[];
    difficulty?: string;
    excerpt?: string;
    created: string;
    tags: string[];
    author?: string;
}

export interface DeletableRule {
    slug: string;
    title: string;
    author?: string;
}

export interface EditableRule {
    slug: string;
}

// 조합 타입
export type RuleActionsData = CopyableRule & 
                               DownloadableRule & 
                               FavorableRule & 
                               DeletableRule & 
                               EditableRule;
```

**4-2. 개별 컴포넌트로 분리**

```typescript
// components/rules/actions/CopyButton.tsx
export function CopyButton({ content }: CopyableRule) {
    const { copied, copy } = useCopyRule(content);
    return <button onClick={copy}>{copied ? '복사됨!' : '복사'}</button>;
}

// components/rules/actions/FavoriteButton.tsx
export function FavoriteButton(rule: FavorableRule) {
    const { favorited, toggleFavorite } = useFavoriteRule(rule.slug, rule);
    return <button onClick={toggleFavorite}>{favorited ? '즐겨찾기 취소' : '즐겨찾기'}</button>;
}

// 기타 버튼들...
```

**영향도**: 낮음  
- 타입 정의 세분화
- 컴포넌트 분리
- 기존 로직 재사용

**검증 방안**:
1. 각 버튼 컴포넌트 단위 테스트
2. 조합된 UI에서 정상 작동 확인

---

### 개선 항목 5: GitHub API 클라이언트 책임 분리 (SRP)

#### 개선 방안

**5-1. HTTP 클라이언트 분리**

```typescript
// lib/http/GitHubHttpClient.ts
export class GitHubHttpClient {
    private baseURL = 'https://api.github.com';
    private token: string;
    
    constructor(token: string) {
        this.token = token;
    }
    
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`GitHub API Error: ${error.message || response.statusText}`);
        }
        
        return response.json();
    }
}
```

**5-2. Git 작업 서비스 분리**

```typescript
// lib/git/GitOperationsService.ts
export class GitOperationsService {
    private http: GitHubHttpClient;
    private owner: string;
    private repo: string;
    
    constructor(http: GitHubHttpClient, owner: string, repo: string) {
        this.http = http;
        this.owner = owner;
        this.repo = repo;
    }
    
    async getMainBranchSHA(): Promise<string> {
        const data = await this.http.request<any>(`/repos/${this.owner}/${this.repo}/git/refs/heads/main`);
        return data.object.sha;
    }
    
    async createBranch(branchName: string, fromSHA: string): Promise<void> {
        await this.http.request(`/repos/${this.owner}/${this.repo}/git/refs`, {
            method: 'POST',
            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: fromSHA,
            }),
        });
    }
    
    // 기타 Git 작업들...
}
```

**5-3. 파일 작업 서비스 분리**

```typescript
// lib/git/GitFileService.ts
export class GitFileService {
    private http: GitHubHttpClient;
    private owner: string;
    private repo: string;
    
    constructor(http: GitHubHttpClient, owner: string, repo: string) {
        this.http = http;
        this.owner = owner;
        this.repo = repo;
    }
    
    async createOrUpdateFile(params: {
        path: string;
        content: string;
        message: string;
        branch: string;
        sha?: string;
    }): Promise<void> {
        const encodedContent = btoa(unescape(encodeURIComponent(params.content)));
        
        await this.http.request(`/repos/${this.owner}/${this.repo}/contents/${params.path}`, {
            method: 'PUT',
            body: JSON.stringify({
                message: params.message,
                content: encodedContent,
                branch: params.branch,
                sha: params.sha,
            }),
        });
    }
    
    async deleteFile(params: {
        path: string;
        message: string;
        branch: string;
        sha: string;
    }): Promise<void> {
        await this.http.request(`/repos/${this.owner}/${this.repo}/contents/${params.path}`, {
            method: 'DELETE',
            body: JSON.stringify(params),
        });
    }
    
    async getFileInfo(path: string): Promise<{ sha: string; content: string }> {
        const data = await this.http.request<any>(`/repos/${this.owner}/${this.repo}/contents/${path}`);
        return {
            sha: data.sha,
            content: decodeURIComponent(escape(atob(data.content))),
        };
    }
}
```

**5-4. PR 서비스 분리**

```typescript
// lib/git/PullRequestService.ts
export class PullRequestService {
    private http: GitHubHttpClient;
    private owner: string;
    private repo: string;
    
    constructor(http: GitHubHttpClient, owner: string, repo: string) {
        this.http = http;
        this.owner = owner;
        this.repo = repo;
    }
    
    async createPullRequest(params: {
        title: string;
        head: string;
        body: string;
    }): Promise<{ html_url: string; number: number }> {
        return await this.http.request(`/repos/${this.owner}/${this.repo}/pulls`, {
            method: 'POST',
            body: JSON.stringify({
                title: params.title,
                head: params.head,
                base: 'main',
                body: params.body,
            }),
        });
    }
}
```

**5-5. 리팩토링된 GitHubAPIClient**

```typescript
// lib/github.ts
export class GitHubAPIClient {
    private http: GitHubHttpClient;
    private gitOps: GitOperationsService;
    private fileOps: GitFileService;
    private prService: PullRequestService;
    
    constructor(owner: string, repo: string, token: string) {
        this.http = new GitHubHttpClient(token);
        this.gitOps = new GitOperationsService(this.http, owner, repo);
        this.fileOps = new GitFileService(this.http, owner, repo);
        this.prService = new PullRequestService(this.http, owner, repo);
    }
    
    // submitRule, updateRule, deleteRule은 각 서비스를 조합하여 구현
    async submitRule(params: CreatePRParams): Promise<{ prUrl: string; prNumber: number }> {
        const timestamp = Date.now();
        const slug = this.generateSlug(params.title);
        const branchName = `rule/${slug}-${timestamp}`;
        
        // Git 작업
        const mainSHA = await this.gitOps.getMainBranchSHA();
        await this.gitOps.createBranch(branchName, mainSHA);
        
        // 파일 생성
        const category = params.category[0].toLowerCase();
        const filePath = `rules/${category}/${slug}.md`;
        const markdown = this.generateMarkdown(params, category, slug);
        
        await this.fileOps.createOrUpdateFile({
            path: filePath,
            content: markdown,
            message: `Add rule: ${params.title}`,
            branch: branchName,
        });
        
        // PR 생성
        const pr = await this.prService.createPullRequest({
            title: `📝 Add rule: ${params.title}`,
            head: branchName,
            body: this.generatePRBody(params, filePath),
        });
        
        return {
            prUrl: pr.html_url,
            prNumber: pr.number,
        };
    }
    
    private generateSlug(title: string): string {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    
    private generateMarkdown(params: CreatePRParams, category: string, slug: string): string {
        // Markdown 생성 로직
    }
    
    private generatePRBody(params: CreatePRParams, filePath: string): string {
        // PR Body 생성 로직
    }
}
```

**영향도**: 높음  
- `lib/github.ts` 완전 재구조화
- 4개 이상의 새로운 서비스 클래스 생성
- 테스트 가능성 대폭 향상

**검증 방안**:
1. 각 서비스 클래스 독립적으로 단위 테스트
2. 통합 테스트로 전체 흐름 검증
3. Mock HTTP 클라이언트로 외부 의존성 제거

---

### 개선 항목 6: 데이터 레이어 추상화 (OCP)

#### 개선 방안

**6-1. 데이터 소스 인터페이스 정의**

```typescript
// services/interfaces/IRuleDataSource.ts
export interface IRuleDataSource {
    getAllRules(): Promise<RuleListItem[]>;
    getRuleBySlug(slug: string): Promise<Rule | null>;
    getRulesByCategory(category: string): Promise<RuleListItem[]>;
    getRulesByTag(tag: string): Promise<RuleListItem[]>;
    getFeaturedRules(): Promise<RuleListItem[]>;
}
```

**6-2. 파일 시스템 데이터 소스 구현**

```typescript
// services/data/FileSystemRuleDataSource.ts
export class FileSystemRuleDataSource implements IRuleDataSource {
    private rulesDirectory: string;
    
    constructor(rulesDirectory: string) {
        this.rulesDirectory = rulesDirectory;
    }
    
    async getAllRules(): Promise<RuleListItem[]> {
        const files = this.getAllRuleFiles();
        const rules: RuleListItem[] = files.map((filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);
            const frontmatter = data as RuleFrontmatter;
            
            return {
                title: frontmatter.title,
                slug: frontmatter.slug || this.getSlugFromPath(filePath),
                excerpt: this.createExcerpt(content),
                tags: frontmatter.tags || [],
                category: frontmatter.category || [],
                author: frontmatter.author,
                created: frontmatter.created,
                difficulty: frontmatter.difficulty,
                featured: frontmatter.featured,
            };
        });
        
        return rules.sort((a, b) => 
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );
    }
    
    // 나머지 메서드 구현...
}
```

**6-3. API 기반 데이터 소스 (향후 확장)**

```typescript
// services/data/APIRuleDataSource.ts
export class APIRuleDataSource implements IRuleDataSource {
    private apiBaseUrl: string;
    
    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }
    
    async getAllRules(): Promise<RuleListItem[]> {
        const response = await fetch(`${this.apiBaseUrl}/rules`);
        return response.json();
    }
    
    // 나머지 메서드 구현...
}
```

**영향도**: 중간  
- `lib/rules.ts` 리팩토링
- 새로운 데이터 소스 계층 생성
- 서버 컴포넌트에서 사용 방식 수정

**검증 방안**:
1. Mock 데이터 소스로 테스트
2. 파일 시스템 기반 기존 동작 회귀 테스트
3. API 기반 데이터 소스 통합 시 별도 검증

---

## 우선순위 및 로드맵

### Phase 1: 기반 작업 (1-2주)

| 우선순위 | 개선 항목 | 예상 공수 | 난이도 |
|---------|---------|----------|--------|
| P0 | 서비스 인터페이스 정의 (개선 항목 2) | 2일 | 중 |
| P0 | 스토리지 추상화 (개선 항목 3) | 3일 | 중 |
| P1 | Props 인터페이스 분리 (개선 항목 4) | 2일 | 하 |

**목표**: 추상화 계층 구축 및 의존성 역전 기반 마련

### Phase 2: 컴포넌트 리팩토링 (2-3주)

| 우선순위 | 개선 항목 | 예상 공수 | 난이도 |
|---------|---------|----------|--------|
| P1 | `RuleActions.tsx` 책임 분리 (개선 항목 1-1) | 3일 | 중 |
| P1 | `SubmitClient.tsx` 책임 분리 (개선 항목 1-2) | 4일 | 중 |
| P2 | 데이터 레이어 추상화 (개선 항목 6) | 3일 | 중 |

**목표**: 단일 책임 원칙 적용 및 테스트 가능성 향상

### Phase 3: 고급 리팩토링 (2-3주)

| 우선순위 | 개선 항목 | 예상 공수 | 난이도 |
|---------|---------|----------|--------|
| P2 | GitHub API 클라이언트 책임 분리 (개선 항목 5) | 5일 | 상 |
| P3 | 검색 로직 추상화 | 2일 | 중 |

**목표**: 개방-폐쇄 원칙 완성 및 확장 가능성 극대화

### Phase 4: 테스트 및 문서화 (1-2주)

| 우선순위 | 개선 항목 | 예상 공수 | 난이도 |
|---------|---------|----------|--------|
| P0 | 단위 테스트 작성 | 5일 | 중 |
| P1 | 통합 테스트 작성 | 3일 | 중 |
| P2 | 아키텍처 문서 업데이트 | 2일 | 하 |

**목표**: 품질 보증 및 유지보수 문서 완성

**전체 예상 기간**: 6-10주

---

## 검증 계획

### 1. 단위 테스트 전략

각 개선 항목마다 다음과 같은 단위 테스트를 작성합니다:

```typescript
// __tests__/hooks/useRuleActions.test.ts
describe('useCopyRule', () => {
    it('should copy content to clipboard', async () => {
        const { result } = renderHook(() => useCopyRule('test content'));
        
        await act(async () => {
            await result.current.copy();
        });
        
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test content');
        expect(result.current.copied).toBe(true);
    });
    
    it('should reset copied state after 2 seconds', async () => {
        jest.useFakeTimers();
        const { result } = renderHook(() => useCopyRule('test content'));
        
        await act(async () => {
            await result.current.copy();
        });
        
        expect(result.current.copied).toBe(true);
        
        act(() => {
            jest.advanceTimersByTime(2000);
        });
        
        expect(result.current.copied).toBe(false);
        jest.useRealTimers();
    });
});

// __tests__/services/GitHubRuleService.test.ts
describe('GitHubRuleService', () => {
    let mockAPI: jest.Mocked<GitHubAPIClient>;
    let service: GitHubRuleService;
    
    beforeEach(() => {
        mockAPI = {
            submitRule: jest.fn(),
            updateRule: jest.fn(),
            deleteRule: jest.fn(),
        } as any;
        service = new GitHubRuleService(mockAPI);
    });
    
    it('should submit new rule', async () => {
        const params = {
            title: 'Test Rule',
            content: 'Test Content',
            category: ['TypeScript'],
            tags: ['test'],
            difficulty: 'beginner',
            author: 'Test Author',
            fileName: 'test-rule.md',
        };
        
        mockAPI.submitRule.mockResolvedValue({ prUrl: 'https://github.com/pr/1', prNumber: 1 });
        
        const result = await service.submitRule(params);
        
        expect(mockAPI.submitRule).toHaveBeenCalledWith(params);
        expect(result.prUrl).toBe('https://github.com/pr/1');
    });
});
```

**목표 커버리지**: 80% 이상

### 2. 통합 테스트 전략

주요 사용자 흐름에 대한 통합 테스트:

```typescript
// __tests__/integration/rule-submission.test.tsx
describe('Rule Submission Flow', () => {
    it('should submit a new rule successfully', async () => {
        const mockService: IRuleService = {
            submitRule: jest.fn().mockResolvedValue({
                prUrl: 'https://github.com/pr/1',
                prNumber: 1
            }),
            updateRule: jest.fn(),
            deleteRule: jest.fn(),
        };
        
        render(
            <RuleServiceProvider value={mockService}>
                <SubmitClient />
            </RuleServiceProvider>
        );
        
        // 폼 입력
        fireEvent.change(screen.getByLabelText('제목'), {
            target: { value: 'Test Rule Title' }
        });
        
        // ... 나머지 필드 입력
        
        // 제출
        fireEvent.click(screen.getByText('제출하기'));
        
        await waitFor(() => {
            expect(mockService.submitRule).toHaveBeenCalled();
            expect(screen.getByText('제출이 준비되었습니다!')).toBeInTheDocument();
        });
    });
});
```

### 3. E2E 테스트 전략

Playwright를 사용한 E2E 테스트 (선택사항):

```typescript
// e2e/rule-submission.spec.ts
test('complete rule submission flow', async ({ page }) => {
    await page.goto('/submit');
    
    await page.fill('[name="title"]', 'E2E Test Rule');
    await page.fill('[name="author"]', 'E2E Tester');
    await page.selectOption('[name="difficulty"]', 'beginner');
    await page.check('[value="TypeScript"]');
    await page.fill('[name="tags"]', 'e2e, test');
    await page.fill('[name="content"]', 'This is an E2E test rule content.');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=제출이 준비되었습니다!')).toBeVisible();
});
```

### 4. 회귀 테스트 전략

각 Phase 완료 후 기존 기능이 정상 작동하는지 확인:

- ✅ 검색 기능 정상 작동
- ✅ 즐겨찾기 추가/제거 정상 작동
- ✅ 규칙 상세 페이지 정상 표시
- ✅ 다운로드 기능 정상 작동
- ✅ 공유 기능 정상 작동
- ✅ 삭제 요청 정상 작동
- ✅ 규칙 제출/수정 정상 작동
- ✅ 빌드 및 배포 정상 작동

### 5. 성능 테스트

리팩토링 전후 성능 비교:

```typescript
// 측정 항목
- 초기 로딩 시간 (First Contentful Paint)
- 검색 응답 시간
- 페이지 전환 시간
- 번들 크기
```

**목표**: 성능 저하 없음 (±5% 이내)

---

## 예상 효과

### 1. 코드 품질 향상

**측정 지표**:
- 함수/컴포넌트 평균 줄 수: 200줄 → 50줄 이하
- 순환 복잡도(Cyclomatic Complexity): 평균 15 → 5 이하
- 코드 중복률: 20% → 5% 이하

### 2. 테스트 커버리지 향상

**측정 지표**:
- 현재 커버리지: ~30%
- 목표 커버리지: 80% 이상
- 테스트 가능한 모듈 비율: 40% → 95%

### 3. 유지보수성 향상

**측정 지표**:
- 새로운 기능 추가 시간: 평균 3일 → 1일
- 버그 수정 시간: 평균 2시간 → 30분
- 코드 리뷰 소요 시간: 평균 1시간 → 30분

### 4. 확장성 향상

**기대 효과**:
- 새로운 데이터 소스 추가 시: 기존 코드 수정 불필요
- 새로운 스토리지 방식 추가 시: 어댑터만 구현
- 새로운 제출 방식 추가 시: 서비스만 구현

### 5. 개발자 경험 향상

**기대 효과**:
- 명확한 책임 분리로 코드 이해도 향상
- Mock 객체 사용이 쉬워져 테스트 작성 시간 단축
- 타입 추론 개선으로 IDE 지원 강화

---

## 리스크 및 대응 방안

### 리스크 1: 대규모 리팩토링으로 인한 버그 발생

**대응 방안**:
- Phase별로 점진적 적용
- 각 Phase 완료 후 철저한 회귀 테스트
- Feature Flag를 사용한 점진적 배포

### 리스크 2: 일정 지연

**대응 방안**:
- 우선순위가 높은 항목부터 진행
- 각 Phase를 독립적으로 완료 가능하도록 설계
- 필요시 P3 항목은 차기 버전으로 연기

### 리스크 3: 팀원들의 학습 곡선

**대응 방안**:
- 아키텍처 문서 및 가이드 작성
- 코드 리뷰 시 충분한 설명 제공
- 예제 코드 및 테스트 코드 제공

### 리스크 4: 성능 저하

**대응 방안**:
- 각 Phase 후 성능 벤치마크 실행
- 성능 저하 발견 시 즉시 최적화
- 필요시 메모이제이션 및 캐싱 적용

---

## 결론

본 개선 계획서는 Smart Rules Archive 프로젝트를 SOLID 원칙에 부합하도록 리팩토링하여 다음과 같은 목표를 달성하고자 합니다:

1. **유지보수성 향상**: 명확한 책임 분리와 낮은 결합도
2. **확장성 향상**: 추상화 계층을 통한 쉬운 기능 확장
3. **테스트 가능성 향상**: 의존성 주입을 통한 쉬운 테스트
4. **코드 품질 향상**: 작고 집중된 모듈로 이해하기 쉬운 코드

제안된 개선사항들을 Phase별로 점진적으로 적용하여 안정적으로 프로젝트 품질을 향상시킬 수 있습니다.

---

**다음 단계**:
1. 개선 계획서 검토 및 승인
2. Phase 1 작업 착수
3. 주간 진행 상황 리뷰 미팅 설정
4. 각 Phase 완료 후 회고 및 다음 Phase 계획 조정

