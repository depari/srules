---
title: "Python PEP 8 스타일 가이드"
slug: "python/pep8-guide"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [Python, PEP 8, Style Guide, Code Quality]
category: [Language, Python]
difficulty: beginner
featured: true
---

# Python PEP 8 스타일 가이드

## 개요

PEP 8은 Python 코드의 공식 스타일 가이드입니다. 일관된 코딩 스타일은 코드 가독성을 높이고 협업을 용이하게 합니다.

## 들여쓰기

스페이스 4개를 사용합니다:

```python
# ✅ 좋은 예시
def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

# ❌ 나쁜 예시 (탭 또는 2칸)
def calculate_sum(numbers):
  total = 0
  for num in numbers:
    total += num
  return total
```

## 줄 길이

최대 79자로 제한합니다:

```python
# ✅ 좋은 예시
result = some_function(
    argument1, argument2,
   argument3, argument4
)

# ❌ 나쁜 예시
result = some_function(argument1, argument2, argument3, argument4, argument5, argument6)
```

## 네이밍 규칙

```python
# 변수와 함수: snake_case
user_name = "Alice"
def calculate_total():
    pass

# 클래스: PascalCase
class UserProfile:
    pass

# 상수: UPPER_CASE
MAX_SIZE = 100
API_KEY = "secret"

# 비공개(private): 언더스코어 접두사
_internal_value = 42
```

## 공백 사용

```python
# ✅ 연산자 주변에 공백
x = 1 + 2
result = x * 5

# ❌ 
x=1+2
result=x*5

# ✅ 함수 인자에서 등호 주변 공백 없음
def greet(name="World"):
    pass

# ❌
def greet(name = "World"):
    pass
```

## Import 문

```python
# ✅ 표준 라이브러리, 서드파티, 로컬 순서
import os
import sys

import numpy as np
import pandas as pd

from myproject import mymodule

# ❌ 한 줄에 여러 import
import os, sys  # 나쁨
```

## 문서화

```python
def calculate_area(radius: float) -> float:
    """
    원의 넓이를 계산합니다.
    
    Args:
        radius: 원의 반지름
    
    Returns:
        원의 넓이
    
    Raises:
        ValueError: radius가 음수인 경우
    """
    if radius < 0:
        raise ValueError("Radius must be positive")
    return 3.14159 * radius ** 2
```

## 도구

- **Black**: 자동 포맷터
- **Flake8**: 린터
- **pylint**: 코드 분석

```bash
pip install black flake8 pylint
black your_file.py
flake8 your_file.py
```
