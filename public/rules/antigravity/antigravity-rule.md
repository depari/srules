---
title: "Antigravity 에서 사용하는 Rule"
slug: "antigravity/antigravity-rule"
version: "1.0.0"
created: "2026-01-27"
author: "서대원"
tags: ["Antigravity"]
category: ["Antigravity"]
difficulty: beginner
---

# 대원's Rule

## 개요

대원이가 사용하는 Antigravity Rule



## 예시
대답 할때는 한글로 해
git commit message 생성 할때는 구어체가 아니라 내용을 나열 하는 형태로 만들어줘.
작업 진행시 git commit 은 진행하지 말고, 내가 확인후 진행 할 거야.
파일 처리는 small chunks 로 해줘.
작업 보고서 요청시에는 별도 reports 폴더 (폴더가 없을때는 생성 후) 하위에 report_[date]_[task_number]_[task_description].md 파일로 마크 다운 포멧으로 작성 해. 
항상 빌드가 깨지지 않도록 유지해. 
문제점이 발행해서 개선 요청 하면 아래와 같이 개선 진행 해
  1)관련된 unit test 를 만들고 
  2)개선전 test failed 확인
  3)지금까지 준비된 TC pass 하도록 구현. 개선 확인 
시도에 대한 기록을 위해서는 tasks/[taskname] 폴더 하위에 [momorisedItem].md 파일 형태로 기록 하도록 해
프로젝트 문서는 docs 폴더 하위에 작성해 (프로젝트의 개발 계획서, 요구사양서 등)
작업 완료에 대한 알림은 텔레그램 AntigravityNotiHelper_bot 으로 보내줘 (chat_id : 56437630)

