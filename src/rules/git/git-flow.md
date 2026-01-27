---
title: "Git 브랜치 전략 (Git Flow)"
slug: "git/git-flow"
version: "1.0.0"
created: "2026-01-27"
author: "Smart Rules Archive"
tags: [Git, Git Flow, Branching, Workflow, Version Control]
category: [Tool, Git]
difficulty: intermediate
---

# Git 브랜치 전략 (Git Flow)

## Git Flow란?

Vincent Driessen이 제안한 Git 브랜치 관리 전략으로, 체계적인 릴리즈 관리에 적합합니다.

## 주요 브랜치

### 1. main (master)
- 프로덕션 배포용
- 항상 배포 가능한 상태 유지
- 태그로 버전 관리

### 2. develop
- 다음 릴리즈 개발용
- feature 브랜치가 머지되는 통합 브랜치

## 보조 브랜치

### Feature 브랜치
새로운 기능 개발용

```bash
# feature 브랜치 생성
git checkout -b feature/user-authentication develop

# 개발 후 develop에 머지
git checkout develop
git merge --no-ff feature/user-authentication
git branch -d feature/user-authentication
```

**네이밍**: `feature/기능명`
- `feature/login`
- `feature/user-profile`
- `feature/payment-integration`

### Release 브랜치
릴리즈 준비용

```bash
# release 브랜치 생성
git checkout -b release/1.2.0 develop

# 버그 수정, 버전 업데이트 등

# main과 develop에 머지
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0

git checkout develop
git merge --no-ff release/1.2.0

# 브랜치 삭제
git branch -d release/1.2.0
```

**네이밍**: `release/버전`
- `release/1.0.0`
- `release/2.1.0`

### Hotfix 브랜치
긴급 버그 수정용

```bash
# hotfix 브랜치 생성 (main에서)
git checkout -b hotfix/critical-bug main

# 수정 후 main과 develop에 머지
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.2.1

git checkout develop
git merge --no-ff hotfix/critical-bug

git branch -d hotfix/critical-bug
```

**네이밍**: `hotfix/이슈명`
- `hotfix/login-crash`
- `hotfix/payment-error`

## 전체 플로우

```
main           *---*-------*-------*
                    \       \       \
release              *-------*
                    /         \
develop        *---*---*---*---*---*
                \   \   \ /   /
feature          *   *   *   *
```

## 실전 예시

### 신규 기능 개발

```bash
# 1. develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/dark-mode

# 2. 개발 및 커밋
git add .
git commit -m "feat: 다크 모드 UI 구현"

# 3. develop에 머지
git checkout develop
git merge --no-ff feature/dark-mode
git push origin develop
git branch -d feature/dark-mode
```

### 릴리즈 준비

```bash
# 1. release 브랜치 생성
git checkout -b release/1.3.0 develop

# 2. 버전 업데이트
# package.json, README.md 등 수정

# 3. main에 머지 및 태그
git checkout main
git merge --no-ff release/1.3.0
git tag -a v1.3.0 -m "Release version 1.3.0"
git push origin main --tags

# 4. develop에도 머지
git checkout develop
git merge --no-ff release/1.3.0
git push origin develop
```

## GitHub Flow와의 차이

| | Git Flow | GitHub Flow |
|---|----------|-------------|
| 복잡도 | 높음 | 낮음 |
| 브랜치 | 5가지 | 2가지 (main, feature) |
| 릴리즈 | 명확한 버전 관리 | 지속적 배포 |
| 적합한 프로젝트 | 정기 릴리즈 | 지속적 배포 |

## 요약

- **main**: 프로덕션 코드
- **develop**: 개발 통합 브랜치
- **feature**: 새 기능 개발
- **release**: 릴리즈 준비
- **hotfix**: 긴급 수정
- `--no-ff` 옵션으로 머지 이력 보존
