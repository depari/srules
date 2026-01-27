---
title: "React Hooks 사용 패턴"
slug: "react/hooks-patterns"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [React, Hooks, useState, useEffect, Best Practices]
category: [Framework, React]
difficulty: intermediate
featured: true
---

# React Hooks 사용 패턴

## 개요

React Hooks는 함수형 컴포넌트에서 상태와 생명주기 기능을 사용할 수 있게 해줍니다. 이 가이드는 Hooks의 올바른 사용 패턴과 일반적인 실수를 다룹니다.

## 기본 규칙

### 1. Hooks의 규칙

✅ **항상 최상위에서 호출하기**
```typescript
function MyComponent() {
  // ✅ 올바른 위치
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // ❌ 조건문 안에서 호출하지 않기
  if (count > 0) {
    const [temp, setTemp] = useState(0); // 잘못됨!
  }
  
  return <div>{count}</div>;
}
```

✅ **React 함수에서만 호출하기**
```typescript
// ✅ 함수형 컴포넌트에서
function MyComponent() {
  const [state, setState] = useState(0);
  return <div>{state}</div>;
}

// ✅ 커스텀 Hook에서
function useCustomHook() {
  const [state, setState] = useState(0);
  return state;
}

// ❌ 일반 JavaScript 함수에서
function regularFunction() {
  const [state, setState] = useState(0); // 잘못됨!
}
```

## useState 패턴

### 함수형 업데이트

이전 상태를 기반으로 업데이트할 때는 함수형 업데이트를 사용합니다:

```typescript
// ❌ 나쁜 예시
const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1); // 클로저 문제 발생 가능
  setCount(count + 1); // 여전히 1만 증가
}

// ✅ 좋은 예시
function increment() {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // 정확히 2 증가
}
```

### 복잡한 상태 관리

```typescript
// ❌ 나쁜 예시: 여러 개의 관련 상태
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');

// ✅ 좋은 예시: 객체로 그룹화
interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const [form, setForm] = useState<UserForm>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
});

function updateField(field: keyof UserForm, value: string) {
  setForm(prev => ({ ...prev, [field]: value }));
}
```

## useEffect 패턴

### 의존성 배열 관리

```typescript
// ❌ 나쁜 예시: 의존성 배열 누락
useEffect(() => {
  fetchUser(userId); // userId가 변경되어도 재실행 안 됨
}, []); // ESLint 경고 발생

// ✅ 좋은 예시: 모든 의존성 명시
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

### 정리(Cleanup) 함수 사용

```typescript
useEffect(() => {
  // 구독 설정
  const subscription = api.subscribe(userId);
  
  // 정리 함수 반환
  return () => {
    subscription.unsubscribe();
  };
}, [userId]);
```

### 비동기 작업 처리

```typescript
// ❌ 나쁜 예시: async를 직접 사용
useEffect(async () => {
  const data = await fetchData(); // 경고 발생
  setData(data);
}, []);

// ✅ 좋은 예시: 내부 함수 사용
useEffect(() => {
  async function loadData() {
    try {
      const data = await fetchData();
      setData(data);
    } catch (error) {
      setError(error);
    }
  }
  
  loadData();
}, []);
```

## 커스텀 Hooks

### 재사용 가능한 로직 추출

```typescript
// 커스텀 Hook: useFetch
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, [url]);
  
  return { data, loading, error };
}

// 사용 예시
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  
  return <div>{data.name}</div>;
}
```

## 성능 최적화 Hooks

### useMemo

비용이 큰 계산을 메모이제이션합니다:

```typescript
function ExpensiveComponent({ items }: { items: Item[] }) {
  // ❌ 매 렌더링마다 재계산
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // ✅ items가 변경될 때만 재계산
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  return <div>Total: {total}</div>;
}
```

### useCallback

함수를 메모이제이션합니다:

```typescript
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ 매 렌더링마다 새 함수 생성
  const handleClick = () => {
    console.log('Clicked');
  };
  
  // ✅ 함수를 메모이제이션
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return <Child onClick={handleClick} />;
}
```

## 일반적인 실수와 해결책

### 1. 무한 루프

```typescript
// ❌ 무한 루프 발생
useEffect(() => {
  setData(fetchData());
}, [data]); // data가 변경되면 다시 실행

// ✅ 한 번만 실행
useEffect(() => {
  async function load() {
    const result = await fetchData();
    setData(result);
  }
  load();
}, []);
```

### 2. 오래된 클로저

```typescript
function Counter() {
  const [count, setCount] = useState(0);
  
  // ❌ 오래된 count 값 참조
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // 항상 초기 count 사용
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // ✅ 함수형 업데이트 사용
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
}
```

## 요약

- Hooks는 항상 최상위에서, React 함수 내에서만 호출
- useState는 함수형 업데이트 활용
- useEffect는 의존성 배열을 정확히 명시
- 재사용 가능한 로직은 커스텀 Hook으로 추출
- useMemo와 useCallback으로 성능 최적화
- 정리 함수로 메모리 누수 방지
