/**
 * Rule 타입 정의
 */

export interface RuleFrontmatter {
  title: string;
  slug: string;
  version: string;
  created: string;
  updated?: string;
  author?: string;
  email?: string;
  tags: string[];
  category: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}

export interface Rule extends RuleFrontmatter {
  content: string;
  excerpt: string;
  filePath: string;
}

export interface RuleListItem {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  category: string[];
  author?: string;
  created: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}

export interface SearchIndexItem {
  title: string;
  slug: string;
  category: string[];
  tags: string[];
  author?: string;
  excerpt: string;
  path: string;
}

export interface CategoryInfo {
  name: string;
  count: number;
  slug: string;
}

export interface RuleSubmissionData {
  title: string;
  category: string[];
  tags: string[];
  content: string;
  author?: string;
  email?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
