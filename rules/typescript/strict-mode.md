---
title: "TypeScript 엄격 모드 Best Practices"
slug: "typescript/strict-mode"
version: "1.0.0"
created: "2026-01-27"
updated: "2026-01-27"
author: "Smart Rules Archive"
tags: [TypeScript, Best Practices, Strict Mode, Type Safety]
category: [Language, TypeScript]
difficulty: intermediate
featured: true
---

# TypeScript 엄격 모드 Best Practices

## 개요

TypeScript의 엄격 모드(`strict`)를 활성화하면 더 안전하고 견고한 코드를 작성할 수 있습니다. 이 가이드는 엄격 모드 설정과 관련 Best Practices를 제공합니다.

## 왜 엄격 모드를 사용해야 하나요?

- **타입 안정성 향상**: 암시적 any 타입 방지
- **런타임 에러 감소**: 컴파일 타임에 더 많은 에러 발견
- **코드 품질 개선**: 명시적인 타입 선언 강제
- **리팩토링 안정성**: 타입 시스템이 변경사항을 추적

## 규칙

### 1. `strict` 모드 활성화

`tsconfig.json`에서 `strict` 옵션을 활성화합니다:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

이 옵션은 다음 옵션들을 모두 활성화합니다:
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

### 2. `noImplicitAny` 준수

❌ **나쁜 예시:**
```typescript
function add(a, b) {  // 암시적 any
  return a + b;
}
```

✅ **좋은 예시:**
```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

### 3. `strictNullChecks` 활용

❌ **나쁜 예시:**
```typescript
function getUser(id: string) {
  const user = users.find(u => u.id === id);
  return user.name;  // user가 undefined일 수 있음
}
```

✅ **좋은 예시:**
```typescript
function getUser(id: string): string | undefined {
  const user = users.find(u => u.id === id);
  return user?.name;
}

// 또는 예외 처리
function getUserOrThrow(id: string): string {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error(`User not found: ${id}`);
  }
  return user.name;
}
```

### 4. 타입 단언보다 타입 가드 사용

❌ **나쁜 예시:**
```typescript
function processValue(value: unknown) {
  const str = value as string;  // 위험한 타입 단언
  return str.toUpperCase();
}
```

✅ **좋은 예시:**
```typescript
function processValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  throw new Error('Value must be a string');
}
```

### 5. 함수 매개변수 타입 명시

❌ **나쁜 예시:**
```typescript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

users.forEach((user) => {  // user의 타입이 암시적
  console.log(user.name);
});
```

✅ **좋은 예시:**
```typescript
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

users.forEach((user: User) => {
  console.log(user.name);
});
```

## 마이그레이션 전략

기존 프로젝트에 엄격 모드를 도입할 때는 단계적 접근을 권장합니다:

1. **단계별 활성화**: 전체 `strict` 대신 개별 옵션을 하나씩 활성화
```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    // strict의 다른 옵션들은 점진적으로 추가
  }
}
```

2. **파일별 예외 처리**: `// @ts-ignore` 또는 `// @ts-expect-error` 주석 활용
```typescript
// @ts-expect-error: 레거시 코드, 추후 수정 예정
legacyFunction(uncheckedData);
```

3. **우선순위 설정**: 핵심 비즈니스 로직부터 수정

## 추가 권장 사항

### `noUnusedLocals` 및 `noUnusedParameters`

사용하지 않는 변수와 매개변수를 감지합니다:

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### `noImplicitReturns`

모든 코드 경로에서 값을 반환하도록 강제합니다:

```json
{
  "compilerOptions": {
    "noImplicitReturns": true
  }
}
```

## 도구 및 리소스

- **ESLint**: `@typescript-eslint/recommended-requiring-type-checking` 사용
- **VS Code**: TypeScript 에러를 실시간으로 확인
- **CI/CD**: 빌드 파이프라인에 타입 체크 포함

## 요약

TypeScript의 엄격 모드는 초기 설정 비용이 있지만, 장기적으로 코드 품질과 유지보수성을 크게 향상시킵니다. 새 프로젝트는 처음부터 엄격 모드를 활성화하고, 기존 프로젝트는 점진적으로 마이그레이션하는 것을 권장합니다.
