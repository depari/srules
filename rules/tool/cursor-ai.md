---
title: "Cursor AI 효과적인 프롬프트 작성법"
slug: "tool/cursor-ai"
version: "1.0.1"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: ["Cursor", "AI", "Prompts", "Productivity"]
category: ["Tool", "Cursor", "AI"]
difficulty: beginner
---

# Cursor AI 효과적인 프롬프트 작성법

## 개요

Cursor는 AI 기반 코드 에디터로, 효과적인 프롬프트 작성이 생산성의 핵심입니다.

## 기본 원칙

### 1. 명확하고 구체적으로

❌ **나쁜 예시:**
```
버튼 만들어줘
```

✅ **좋은 예시:**
```
React TypeScript로 Primary 버튼 컴포넌트를 만들어줘:
- Props: label (string), onClick (function), disabled (boolean)
- Tailwind CSS로 스타일링
- 호버 시 밝기 변화
- disabled일 때 회색 표시
```

### 2. 컨텍스트 제공

기존 코드 스타일과 프로젝트 구조를 명시합니다:
 대원 테스트

```
이 프로젝트는 Next.js 14 App Router를 사용합니다.
컴포넌트는 src/components/에 위치하며,
모든 컴포넌트는 함수형으로 작성하고 TypeScript를 사용합니다.

새로운 사용자 프로필 카드 컴포넌트를 만들어주세요.
```

### 3. 단계적 요청

복잡한 작업은 단계별로 나눕니다:

```
1단계: User 인터페이스 타입 정의
2단계: UserCard 컴포넌트 기본 구조 작성
3단계: 스타일링 추가 (Tailwind CSS)
4단계: 호버 애니메이션 추가
```

## 코드 수정 요청

### 리팩토링

```
다음 코드를 리팩토링해주세요:
- 중복 코드 제거
- 함수를 더 작은 단위로 분리
- 의미있는 변수명 사용
- 타입 안정성 향상

[기존 코드 붙여넣기]
```

### 버그 수정

```
이 함수에서 null 체크가 누락되어 에러가 발생합니다.
안전한 null 체크를 추가하고, 에러 핸들링을 개선해주세요.

[문제 코드와 에러 메시지]
```

## 문서화 요청

```
다음 함수에 JSDoc 주석을 추가해주세요:
- 함수 설명
- 매개변수 설명
- 반환값 설명
- 사용 예시

[코드]
```

## 테스트 코드 작성

```
다음 컴포넌트에 대한 Jest + React Testing Library 테스트를 작성해주세요:
- 렌더링 테스트
- 사용자 인터랙션 테스트
- Edge case 테스트

[컴포넌트 코드]
```

## 최적화 팁

### @-mentions 활용

```
@filename.ts의 함수를 참고해서 비슷한 스타일로 작성해주세요
@docs/API.md의 스펙에 맞춰 구현해주세요
```

### 예시 제공

```
다음과 같은 스타일로 작성해주세요:

예시:
```typescript
const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

새로운 Input 컴포넌트를 같은 패턴으로 만들어주세요.
```

## 피해야 할 것

❌ 너무 모호한 요청:
```
코드 좀 고쳐줘
더 좋게 만들어줘
```

❌ 한 번에 너무 많은 요청:
```
로그인 기능 만들고, 데이터베이스 연결하고, API 만들고, 
테스트 작성하고, 문서화하고, 배포까지 해줘
```

## 요약

- 명확하고 구체적인 요청
- 충분한 컨텍스트 제공
- 복잡한 작업은 단계별로 분리
- @-mentions로 관련 파일 참조
- 예시 코드 활용