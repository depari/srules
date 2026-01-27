---
title: "Cursor Rules 작성 가이드"
slug: "cursor/cursor-rules"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [Cursor, AI, Rules, Configuration]
category: [Tool, Cursor]
difficulty: beginner
---

# Cursor Rules 작성 가이드

## .cursorrules 파일이란?

프로젝트 루트에 `.cursorrules` 파일을 만들어 Cursor AI가 따라야 할 규칙을 정의할 수 있습니다.

## 기본 구조

```
# 프로젝트 개요
이 프로젝트는 Next.js 14를 사용한 웹 애플리케이션입니다.

## 코딩 스타일
- TypeScript 사용
- 함수형 컴포넌트 선호
- Tailwind CSS로 스타일링

## 네이밍 규칙
- 컴포넌트: PascalCase
- 함수: camelCase
- 상수: UPPER_SNAKE_CASE

## 파일 구조
- 컴포넌트: src/components/
- 유틸리티: src/lib/
- 타입: src/types/
```

## 실전 예제

### React + TypeScript 프로젝트

```
You are an expert in TypeScript, React, and Next.js.

Code Style and Structure:
- Use functional components with TypeScript
- Prefer named exports over default exports
- Use Tailwind CSS for styling
- Place components in src/components/
- Keep components small and focused

Naming Conventions:
- Components: PascalCase (e.g., UserProfile.tsx)
- Utilities: camelCase (e.g., formatDate.ts)
- Types: PascalCase with 'I' prefix for interfaces

Best Practices:
- Always add proper TypeScript types
- Use React hooks appropriately
- Implement error boundaries
- Add PropTypes or TypeScript interfaces
- Write JSDoc comments for complex functions
```

### Python 프로젝트

```
You are an expert Python developer.

Code Style:
- Follow PEP 8 style guide
- Use type hints for all functions
- Maximum line length: 88 characters (Black)

Structure:
- One class per file
- Group imports: stdlib, third-party, local
- Use absolute imports

Documentation:
- Google-style docstrings
- Add types to function signatures
- Include usage examples

Testing:
- Use pytest for testing
- Aim for 80% code coverage
- Mock external dependencies
```

## 팁

### 1. 구체적으로 작성

❌ "좋은 코드를 작성하세요"
✅ "TypeScript를 사용하고 모든 함수에 타입을 지정하세요"

### 2. 프로젝트 컨텍스트 포함

```
Project Context:
- This is a healthcare application
- HIPAA compliance is required
- Performance is critical (target: <100ms response time)
```

### 3. 예제 코드 포함

```
Example Component Structure:
```typescript
interface UserProps {
  id: string;
  name: string;
}

export function UserCard({ id, name }: UserProps) {
  return <div>{name}</div>;
}
```
```

## .cursorrules 위치

```
your-project/
├── .cursorrules      ← 여기에 작성
├── package.json
├── src/
└── ...
```

## 요약

- `.cursorrules` 파일로 프로젝트 규칙 정의
- 코딩 스타일, 네이밍, 구조 명시
- 구체적이고 실행 가능한 규칙 작성
- 예제 코드로 명확성 확보
