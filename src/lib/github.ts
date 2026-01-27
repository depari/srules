/**
 * GitHub API Client for creating pull requests
 * 
 * 사용 방법:
 * 1. GitHub Personal Access Token 필요 (repo 권한)
 * 2. 환경 변수 설정: NEXT_PUBLIC_GITHUB_TOKEN (또는 서버 사이드에서 GITHUB_TOKEN)
 */

interface GitHubFileContent {
    path: string;
    content: string;
}

interface CreatePRParams {
    title: string;
    content: string;
    category: string[];
    tags: string[];
    difficulty: string;
    author: string;
}

export class GitHubAPIClient {
    private owner: string;
    private repo: string;
    private token: string;
    private baseURL = 'https://api.github.com';

    constructor(owner: string, repo: string, token: string) {
        this.owner = owner;
        this.repo = repo;
        this.token = token;
    }

    /**
     * GitHub API 요청
     */
    private async request(endpoint: string, options: RequestInit = {}) {
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

    /**
     * main 브랜치의 최신 SHA 가져오기
     */
    private async getMainBranchSHA(): Promise<string> {
        const data = await this.request(`/repos/${this.owner}/${this.repo}/git/refs/heads/main`);
        return data.object.sha;
    }

    /**
     * 새 브랜치 생성
     */
    private async createBranch(branchName: string, fromSHA: string): Promise<void> {
        await this.request(`/repos/${this.owner}/${this.repo}/git/refs`, {
            method: 'POST',
            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: fromSHA,
            }),
        });
    }

    /**
     * 파일 생성 또는 업데이트
     */
    private async createFile(
        path: string,
        content: string,
        message: string,
        branch: string,
        sha?: string
    ): Promise<void> {
        const encodedContent = btoa(unescape(encodeURIComponent(content)));

        await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'PUT',
            body: JSON.stringify({
                message,
                content: encodedContent,
                branch,
                sha,
            }),
        });
    }

    /**
     * 파일 삭제
     */
    private async deleteFile(
        path: string,
        message: string,
        branch: string,
        sha: string
    ): Promise<void> {
        await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'DELETE',
            body: JSON.stringify({
                message,
                branch,
                sha,
            }),
        });
    }

    /**
     * 파일 정보(SHA 등) 가져오기
     */
    async getFileInfo(path: string): Promise<{ sha: string; content: string }> {
        const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
        return {
            sha: data.sha,
            content: decodeURIComponent(escape(atob(data.content))),
        };
    }

    /**
     * Pull Request 생성
     */
    private async createPullRequest(
        title: string,
        head: string,
        body: string
    ): Promise<any> {
        return await this.request(`/repos/${this.owner}/${this.repo}/pulls`, {
            method: 'POST',
            body: JSON.stringify({
                title,
                head,
                base: 'main',
                body,
            }),
        });
    }

    /**
     * 규칙 제출 → PR 생성
     */
    async submitRule(params: CreatePRParams): Promise<{ prUrl: string; prNumber: number }> {
        try {
            // 1. 브랜치 이름 생성 (타임스탬프 포함)
            const timestamp = Date.now();
            const slug = params.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            const branchName = `rule/${slug}-${timestamp}`;

            // 2. main 브랜치 최신 SHA 가져오기
            const mainSHA = await this.getMainBranchSHA();

            // 3. 새 브랜치 생성
            await this.createBranch(branchName, mainSHA);

            // 4. 파일 경로 생성
            const category = params.category[0].toLowerCase();
            const filePath = `rules/${category}/${slug}.md`;

            // 5. Markdown 콘텐츠 생성
            const markdown = `---
title: "${params.title}"
slug: "${category}/${slug}"
version: "1.0.0"
created: "${new Date().toISOString().split('T')[0]}"
author: "${params.author}"
tags: [${params.tags.map((t: string) => `"${t}"`).join(', ')}]
category: [${params.category.map((c: string) => `"${c}"`).join(', ')}]
difficulty: ${params.difficulty}
---

${params.content}`;

            // 6. 파일 생성
            await this.createFile(
                filePath,
                markdown,
                `Add rule: ${params.title}`,
                branchName
            );

            // 7. PR 생성
            const prBody = `## 새 규칙 제출

**제목**: ${params.title}
**카테고리**: ${params.category.join(', ')}
**태그**: ${params.tags.join(', ')}
**난이도**: ${params.difficulty}
**작성자**: ${params.author}

### 파일:
- \`${filePath}\`

### 체크리스트
- [ ] 제목이 명확하고 설명적인가?
- [ ] 내용이 최소 50자 이상인가?
- [ ] 코드 예시가 포함되어 있는가?
- [ ] 카테고리와 태그가 적절한가?

---
*이 PR은 자동으로 생성되었습니다.*`;

            const pr = await this.createPullRequest(
                `📝 Add rule: ${params.title}`,
                branchName,
                prBody
            );

            return {
                prUrl: pr.html_url,
                prNumber: pr.number,
            };
        } catch (error) {
            console.error('GitHub API Error:', error);
            throw error;
        }
    }

    /**
     * 규칙 수정 → PR 생성
     */
    async updateRule(params: CreatePRParams & { originalPath: string }): Promise<{ prUrl: string; prNumber: number }> {
        try {
            const timestamp = Date.now();
            const slug = params.originalPath.split('/').pop()?.replace('.md', '') || 'updated-rule';
            const branchName = `update/${slug}-${timestamp}`;

            const mainSHA = await this.getMainBranchSHA();
            await this.createBranch(branchName, mainSHA);

            // 기존 파일 정보 가져오기 (SHA 필요)
            const { sha: originalSha } = await this.getFileInfo(params.originalPath);

            const category = params.category[0].toLowerCase();
            const newSlug = params.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const newPath = `rules/${category}/${newSlug}.md`;

            const markdown = `---
title: "${params.title}"
slug: "${category}/${newSlug}"
version: "1.0.1"
created: "${new Date().toISOString().split('T')[0]}"
author: "${params.author}"
tags: [${params.tags.map((t: string) => `"${t}"`).join(', ')}]
category: [${params.category.map((c: string) => `"${c}"`).join(', ')}]
difficulty: ${params.difficulty}
---

${params.content}`;

            // 경로가 바뀌었으면 기존 파일 삭제 후 새 파일 생성, 같으면 업데이트
            if (params.originalPath !== newPath) {
                await this.deleteFile(params.originalPath, `Remove old version of ${params.title}`, branchName, originalSha);
                await this.createFile(newPath, markdown, `Update rule: ${params.title}`, branchName);
            } else {
                await this.createFile(newPath, markdown, `Update rule: ${params.title}`, branchName, originalSha);
            }

            const pr = await this.createPullRequest(
                `📝 Update rule: ${params.title}`,
                branchName,
                `## 규칙 수정 요청\n\n**제목**: ${params.title}\n**변경 내용**: 사용자가 웹 폼을 통해 규칙을 수정했습니다.`
            );

            return { prUrl: pr.html_url, prNumber: pr.number };
        } catch (error) {
            console.error('GitHub API Error (Update):', error);
            throw error;
        }
    }

    /**
     * 규칙 삭제 → PR 생성
     */
    async deleteRule(params: { title: string; originalPath: string; author: string }): Promise<{ prUrl: string; prNumber: number }> {
        try {
            const timestamp = Date.now();
            const slug = params.originalPath.split('/').pop()?.replace('.md', '') || 'deleted-rule';
            const branchName = `delete/${slug}-${timestamp}`;

            const mainSHA = await this.getMainBranchSHA();
            await this.createBranch(branchName, mainSHA);

            const { sha: originalSha } = await this.getFileInfo(params.originalPath);

            await this.deleteFile(params.originalPath, `Delete rule: ${params.title}`, branchName, originalSha);

            const pr = await this.createPullRequest(
                `🗑️ Delete rule: ${params.title}`,
                branchName,
                `## 규칙 삭제 요청\n\n**제목**: ${params.title}\n**작성자**: ${params.author}\n\n이 규칙을 아카이브에서 삭제하고자 합니다.`
            );

            return { prUrl: pr.html_url, prNumber: pr.number };
        } catch (error) {
            console.error('GitHub API Error (Delete):', error);
            throw error;
        }
    }
}

/**
 * GitHub API 클라이언트 인스턴스 생성 헬퍼
 */
export function createGitHubClient(): GitHubAPIClient | null {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'depari';
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'srules';

    if (!token) {
        console.warn('GitHub token not found. PR creation will be disabled.');
        return null;
    }

    return new GitHubAPIClient(owner, repo, token);
}
