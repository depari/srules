---
title: "TypeScript 유틸리티 타입 활용하기"
slug: "typescript/utility-types"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [TypeScript, Utility Types, Advanced, Type Manipulation]
category: [Language, TypeScript]
difficulty: advanced
---

# TypeScript 유틸리티 타입 활용하기

## 개요

TypeScript는 강력한 유틸리티 타입을 제공하여 타입 변환 작업을 용이하게 합니다.

## 주요 유틸리티 타입

### 1. Partial<T>

모든 속성을 선택적으로 만듭니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ 일부 속성만 업데이트
function updateUser(id: number, updates: Partial<User>) {
  // updates는 id, name, email 중 일부만 가질 수 있음
}

updateUser(1, { name: "New Name" }); // OK
updateUser(1, { email: "new@email.com" }); // OK
```

### 2. Required<T>

모든 속성을 필수로 만듭니다.

```typescript
interface Config {
  host?: string;
  port?: number;
  timeout?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; timeout: number }
```

### 3. Pick<T, K>

특정 속성만 선택합니다.

```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

type ArticlePreview = Pick<Article, 'id' | 'title' | 'author'>;
// { id: number; title: string; author: string }
```

### 4. Omit<T, K>

특정 속성을 제외합니다.

```typescript
type ArticleWithoutContent = Omit<Article, 'content'>;
// id, title, author, createdAt만 포함
```

### 5. Record<K, T>

키-값 쌍을 정의합니다.

```typescript
type Role = 'admin' | 'user' | 'guest';

type Permissions = Record<Role, string[]>;

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};
```

### 6. Readonly<T>

모든 속성을 읽기 전용으로 만듭니다.

```typescript
interface Point {
  x: number;
  y: number;
}

const point: Readonly<Point> = { x: 10, y: 20 };
// point.x = 5; // Error: readonly
```

### 7. ReturnType<T>

함수의 반환 타입을 추출합니다.

```typescript
function getUser() {
  return { id: 1, name: "Alice" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string }
```

## 실전 예제

### API 응답 타입 생성

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type UserResponse = ApiResponse<User>;
type UsersResponse = ApiResponse<User[]>;
```

### 폼 데이터 타입

```typescript
interface FullUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// 생성 시: id와 createdAt 제외
type CreateUserDto = Omit<FullUser, 'id' | 'createdAt'>;

// 업데이트 시: 모든 필드 선택적
type UpdateUserDto = Partial<Omit<FullUser, 'id' | 'createdAt'>>;
```

## 요약

- `Partial`: 선택적 속성
- `Required`: 필수 속성
- `Pick`: 속성 선택
- `Omit`: 속성 제외
- `Record`: 객체 타입 정의
- `Readonly`: 읽기 전용
- `ReturnType`: 반환 타입 추출
