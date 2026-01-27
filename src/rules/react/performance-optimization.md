---
title: "React 성능 최적화 기법"
slug: "react/performance-optimization"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [React, Performance, Optimization, useMemo, useCallback]
category: [Framework, React]
difficulty: advanced
---

# React 성능 최적화 기법

## 1. React.memo로 불필요한 리렌더링 방지

```typescript
const ExpensiveComponent = React.memo(({ data }: { data: Data }) => {
  return <div>{/* 복잡한 렌더링 */}</div>;
});
```

## 2. useMemo로 계산 비용 절감

```typescript
function DataTable({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.price - b.price);
  }, [items]);
  
  return <div>{sortedItems.map(/* */)}</div>;
}
```

## 3. useCallback으로 함수 메모이제이션

```typescript
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // 의존성 배열 비어있으면 함수는 한 번만 생성
  
  return <Child onClick={handleClick} />;
}
```

## 4. 리스트 렌더링 최적화

```typescript
// ✅ key 사용
items.map((item) => <Item key={item.id} {...item} />)

// ❌ index를 key로 사용 (순서 변경 시 문제)
items.map((item, index) => <Item key={index} {...item} />)
```

## 5. Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## 6. Virtual Scrolling

대량의 리스트는 react-window나 react-virtualized 사용:

```typescript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

## 7. 디바운싱과 쓰로틀링

```typescript
import { useDeferredValue } from 'react';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  // deferredQuery로 검색 (지연된 값 사용)
  const results = useSearch(deferredQuery);
}
```

## 요약

- React.memo: 불필요한 리렌더링 방지
- useMemo: 비용이 큰 계산 메모이제이션
- useCallback: 함수 메모이제이션
- Code Splitting: 번들 크기 최적화
- Virtual Scrolling: 대량 리스트 최적화
