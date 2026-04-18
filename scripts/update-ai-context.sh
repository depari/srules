#!/bin/bash
# scripts/update-ai-context.sh
# AI Agent 컨텍스트 자동 업데이트 스크립트
# 사용법: bash scripts/update-ai-context.sh

set -e

DATE=$(date +"%Y-%m-%d")
DATETIME=$(date +"%Y-%m-%dT%H:%M:%S")

echo "🤖 AI 컨텍스트 업데이트 중... ($DATE)"

# 테스트 현황 파악
TEST_OUTPUT=$(npm test -- --passWithNoTests 2>&1 | tail -5 || echo "테스트 실행 실패")
BUILD_STATUS="미확인"

# .cursor/memory/05_progress.md 업데이트
mkdir -p .cursor/memory

cat > .cursor/memory/05_progress.md << EOF
# 프로젝트 진행 현황

> 자동 업데이트: $DATETIME

## 최근 커밋 이력

$(git log --oneline -10 2>/dev/null || echo "Git 로그 없음")

## 테스트 현황

\`\`\`
$TEST_OUTPUT
\`\`\`

## 파일 변경 현황

$(git status --short 2>/dev/null || echo "Git 상태 없음")

## 브랜치 정보

- 현재 브랜치: $(git branch --show-current 2>/dev/null || echo "알 수 없음")
EOF

echo "✅ .cursor/memory/05_progress.md 업데이트 완료"

# AI_CONTEXT.md 업데이트 날짜 갱신
if [ -f "AI_CONTEXT.md" ]; then
  sed -i.bak "s/*최종 업데이트:.*/*최종 업데이트: $DATE/" AI_CONTEXT.md
  rm -f AI_CONTEXT.md.bak
  echo "✅ AI_CONTEXT.md 날짜 업데이트 완료"
fi

echo ""
echo "🎉 AI 컨텍스트 업데이트 완료!"
echo "   - .cursor/memory/05_progress.md"
echo "   - AI_CONTEXT.md"
