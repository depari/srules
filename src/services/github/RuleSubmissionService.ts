/**
 * 규칙 제출 서비스 구현
 * 책임: 규칙 제출/수정/삭제를 위한 고수준 비즈니스 로직
 */

import type {
    IRuleSubmissionService,
    IGitOperationsService,
    IPullRequestService,
    RuleSubmissionParams,
    RuleUpdateParams,
    RuleDeleteParams,
} from '../interfaces/IGitHubService';

export class RuleSubmissionService implements IRuleSubmissionService {
    constructor(
        private readonly gitOps: IGitOperationsService,
        private readonly prService: IPullRequestService
    ) { }

    /**
     * 규칙 제출 → PR 생성
     */
    async submitRule(params: RuleSubmissionParams): Promise<{ prUrl: string; prNumber: number }> {
        const { title, content, category, tags, difficulty, author, fileName } = params;

        // 브랜치 이름 생성
        const timestamp = Date.now();
        const branchName = `add-rule-${fileName.replace(/\.\w+$/, '')}-${timestamp}`;

        // main 브랜치에서 새 브랜치 생성
        const mainSHA = await this.gitOps.getMainBranchSHA();
        await this.gitOps.createBranch(branchName, mainSHA);

        // Frontmatter + Content 생성
        const fileContent = this.createMarkdownContent({
            title,
            category,
            tags,
            difficulty,
            author,
            content,
        });

        // 파일 생성
        await this.gitOps.createOrUpdateFile(
            fileName,
            fileContent,
            `Add new rule: ${title}`,
            branchName
        );

        // Pull Request 생성
        const prBody = this.createPRBody({
            title,
            category,
            tags,
            difficulty,
            author,
        });

        const pr = await this.prService.createPullRequest(
            `[Proposal] ${title}`,
            branchName,
            prBody
        );

        return {
            prUrl: pr.url,
            prNumber: pr.number,
        };
    }

    /**
     * 규칙 수정 → PR 생성
     */
    async updateRule(params: RuleUpdateParams): Promise<{ prUrl: string; prNumber: number }> {
        const { title, content, category, tags, difficulty, author, originalPath } = params;

        // 브랜치 이름 생성
        const timestamp = Date.now();
        const branchName = `update-rule-${originalPath.replace(/\.\w+$/, '').replace(/\//g, '-')}-${timestamp}`;

        // main 브랜치에서 새 브랜치 생성
        const mainSHA = await this.gitOps.getMainBranchSHA();
        await this.gitOps.createBranch(branchName, mainSHA);

        // 기존 파일 정보 가져오기
        const fileInfo = await this.gitOps.getFileInfo(originalPath);

        // Frontmatter + Content 생성
        const fileContent = this.createMarkdownContent({
            title,
            category,
            tags,
            difficulty,
            author,
            content,
        });

        // 파일 업데이트
        await this.gitOps.createOrUpdateFile(
            originalPath,
            fileContent,
            `Update rule: ${title}`,
            branchName,
            fileInfo.sha
        );

        // Pull Request 생성
        const prBody = this.createPRBody({
            title,
            category,
            tags,
            difficulty,
            author,
            isUpdate: true,
        });

        const pr = await this.prService.createPullRequest(
            `[Update] ${title}`,
            branchName,
            prBody
        );

        return {
            prUrl: pr.url,
            prNumber: pr.number,
        };
    }

    /**
     * 규칙 삭제 → PR 생성
     */
    async deleteRule(params: RuleDeleteParams): Promise<{ prUrl: string; prNumber: number }> {
        const { title, originalPath, author } = params;

        // 브랜치 이름 생성
        const timestamp = Date.now();
        const branchName = `delete-rule-${originalPath.replace(/\.\w+$/, '').replace(/\//g, '-')}-${timestamp}`;

        // main 브랜치에서 새 브랜치 생성
        const mainSHA = await this.gitOps.getMainBranchSHA();
        await this.gitOps.createBranch(branchName, mainSHA);

        // 기존 파일 정보 가져오기
        const fileInfo = await this.gitOps.getFileInfo(originalPath);

        // 파일 삭제
        await this.gitOps.deleteFile(
            originalPath,
            `Delete rule: ${title}`,
            branchName,
            fileInfo.sha
        );

        // Pull Request 생성
        const prBody = `
## 규칙 삭제 요청

**제목**: ${title}
**경로**: ${originalPath}
**요청자**: ${author}

---
*이 PR은 Smart Rules Archive 웹사이트에서 생성되었습니다.*
`.trim();

        const pr = await this.prService.createPullRequest(
            `[Delete] ${title}`,
            branchName,
            prBody
        );

        return {
            prUrl: pr.url,
            prNumber: pr.number,
        };
    }

    /**
     * Markdown 파일 내용 생성 (Frontmatter + Content)
     */
    private createMarkdownContent(params: {
        title: string;
        category: string[];
        tags: string[];
        difficulty: string;
        author: string;
        content: string;
    }): string {
        const { title, category, tags, difficulty, author, content } = params;
        const now = new Date().toISOString().split('T')[0];

        return `---
title: "${title}"
created: "${now}"
author: "${author}"
category: [${category.map(c => `"${c}"`).join(', ')}]
tags: [${tags.map(t => `"${t}"`).join(', ')}]
difficulty: "${difficulty}"
---

${content}
`.trim();
    }

    /**
     * Pull Request 본문 생성
     */
    private createPRBody(params: {
        title: string;
        category: string[];
        tags: string[];
        difficulty: string;
        author: string;
        isUpdate?: boolean;
    }): string {
        const { title, category, tags, difficulty, author, isUpdate } = params;

        return `
## ${isUpdate ? '규칙 수정 요청' : '새 규칙 제안'}

**제목**: ${title}
**카테고리**: ${category.join(', ')}
**태그**: ${tags.join(', ')}
**난이도**: ${difficulty}
**작성자**: ${author}

---
*이 PR은 Smart Rules Archive 웹사이트에서 생성되었습니다.*
`.trim();
    }
}
