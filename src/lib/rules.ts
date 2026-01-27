import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from '@/lib/markdown';
import { Rule, RuleListItem, RuleFrontmatter } from '@/types/rule';

const rulesDirectory = path.join(process.cwd(), 'rules');

/**
 * 모든 규칙 파일 경로를 재귀적으로 가져옵니다
 */
function getAllRuleFiles(dir: string = rulesDirectory): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
        return files;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllRuleFiles(fullPath));
        } else if (item.endsWith('.md')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * 규칙 파일 경로에서 slug 생성
 */
function getSlugFromPath(filePath: string): string {
    const relativePath = path.relative(rulesDirectory, filePath);
    return relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
}

/**
 * Markdown 내용에서 발췌문 생성
 */
function createExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\n/g, ' ')
        .trim();

    return plainText.length > maxLength
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
}

/**
 * 모든 규칙 목록 가져오기
 */
export function getAllRules(): RuleListItem[] {
    const files = getAllRuleFiles();

    const rules: RuleListItem[] = files.map((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const frontmatter = data as RuleFrontmatter;

        return {
            title: frontmatter.title,
            slug: frontmatter.slug || getSlugFromPath(filePath),
            excerpt: createExcerpt(content),
            tags: frontmatter.tags || [],
            category: frontmatter.category || [],
            author: frontmatter.author,
            created: frontmatter.created,
            difficulty: frontmatter.difficulty,
            featured: frontmatter.featured,
        };
    });

    // 최신순 정렬
    return rules.sort((a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
}

/**
 * 특정 카테고리의 규칙 가져오기
 */
export function getRulesByCategory(category: string): RuleListItem[] {
    const allRules = getAllRules();
    return allRules.filter((rule) =>
        rule.category.some((cat) => cat.toLowerCase() === category.toLowerCase())
    );
}

/**
 * 특정 태그의 규칙 가져오기
 */
export function getRulesByTag(tag: string): RuleListItem[] {
    const allRules = getAllRules();
    return allRules.filter((rule) =>
        rule.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
}

/**
 * Featured 규칙 가져오기
 */
export function getFeaturedRules(): RuleListItem[] {
    const allRules = getAllRules();
    return allRules.filter((rule) => rule.featured === true);
}

/**
 * slug로 규칙 하나 가져오기
 */
export function getRuleBySlug(slug: string): Rule | null {
    const files = getAllRuleFiles();

    for (const filePath of files) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const frontmatter = data as RuleFrontmatter;
        const ruleSlug = frontmatter.slug || getSlugFromPath(filePath);

        if (ruleSlug === slug) {
            return {
                ...frontmatter,
                slug: ruleSlug,
                content,
                excerpt: createExcerpt(content),
                filePath,
            };
        }
    }

    return null;
}

/**
 * Markdown을 HTML로 변환
 */
export async function markdownToHtml(markdown: string): Promise<string> {
    const result = await marked(markdown);
    return result;
}

/**
 * 모든 카테고리 정보 가져오기
 */
export function getAllCategories(): { name: string; count: number }[] {
    const allRules = getAllRules();
    const categoryMap = new Map<string, number>();

    allRules.forEach((rule) => {
        rule.category.forEach((cat) => {
            const count = categoryMap.get(cat) || 0;
            categoryMap.set(cat, count + 1);
        });
    });

    return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * 모든 태그 정보 가져오기
 */
export function getAllTags(): { name: string; count: number }[] {
    const allRules = getAllRules();
    const tagMap = new Map<string, number>();

    allRules.forEach((rule) => {
        rule.tags.forEach((tag) => {
            const count = tagMap.get(tag) || 0;
            tagMap.set(tag, count + 1);
        });
    });

    return Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}
