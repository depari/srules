---
title: "Python Type Hints 완벽 가이드"
slug: "python/type-hints"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [Python, Type Hints, mypy, Static Typing]
category: [Language, Python]
difficulty: intermediate
---

# Python Type Hints 완벽 가이드

## 기본 타입 힌트

```python
def greet(name: str) -> str:
    return f"Hello, {name}"

age: int = 25
price: float = 19.99
is_active: bool = True
```

## 컬렉션 타입

```python
from typing import List, Dict, Set, Tuple

names: List[str] = ["Alice", "Bob"]
scores: Dict[str, int] = {"Alice": 95, "Bob": 87}
tags: Set[str] = {"python", "coding"}
point: Tuple[int, int] = (10, 20)
```

## Optional과 Union

```python
from typing import Optional, Union

def find_user(user_id: int) -> Optional[str]:
    # None을 반환할 수 있음
    return None

def process(value: Union[int, str]) -> str:
    # int 또는 str을 받을 수 있음
    return str(value)
```

## 제네릭 타입

```python
from typing import TypeVar, Generic, List

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self.items: List[T] = []
    
    def push(self, item: T) -> None:
        self.items.append(item)
    
    def pop(self) -> T:
        return self.items.pop()

# 사용
int_stack: Stack[int] = Stack()
int_stack.push(1)
```

## Callable 타입

```python
from typing import Callable

def apply_operation(
    x: int, 
    y: int, 
    operation: Callable[[int, int], int]
) -> int:
    return operation(x, y)

apply_operation(5, 3, lambda a, b: a + b)
```

## TypedDict

```python
from typing import TypedDict

class User(TypedDict):
    name: str
    age: int
    email: str

user: User = {
    "name": "Alice",
    "age": 30,
    "email": "alice@example.com"
}
```

## Literal 타입

```python
from typing import Literal

def set_status(status: Literal["pending", "approved", "rejected"]) -> None:
    print(f"Status: {status}")

set_status("approved")  # OK
# set_status("invalid")  # mypy error
```

## 도구

### mypy 사용

```bash
pip install mypy
mypy your_file.py
```

### pyright (Microsoft)

```bash
pip install pyright
pyright your_file.py
```

## 요약

- 기본 타입: str, int, float, bool
- 컬렉션: List, Dict, Set, Tuple
- Optional: None 가능
- Union: 여러 타입 허용
- Generic: 제네릭 클래스
- TypedDict: 구조화된 딕셔너리
