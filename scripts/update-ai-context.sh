#!/bin/bash
# scripts/update-ai-context.sh
# AI Agent 컨텍스트 자동 업데이트 스크립트

set -e

DATE=$(date +"%Y-%m-%d")
DATETIME=$(date +"%Y-%m-%dT%H:%M:%S")

echo "🤖 AI 컨텍스트 업데이트 중... ($DATE)"

# npm 경로 확인 및 테스트 실행
if command -v npm >/dev/null 2>&1; then
  echo "🧪 테스트 실행 중..."
  # 테스트 실패 시에도 스크립트가 죽지 않도록 || true 사용
  TEST_OUTPUT=$(npm test -- --passWithNoTests --watchAll=false 2>&1 | tail -n 10 || echo "테스트 실행 중 오류 발생")
else
  TEST_OUTPUT="오류: npm 명령어를 찾을 수 없습니다. 환경 설정을 확인하세요."
  echo "⚠️  npm을 찾을 수 없습니다. 테스트 결과 없이 진행합니다."
fi

# .cursor/memory 폴더 확인
mkdir -p .cursor/memory

# 05_progress.md 업데이트
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
  # macOS와 Linux 호환성을 위한 sed 처리
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/최종 업데이트: [0-9-]*/최종 업데이트: $DATE/" AI_CONTEXT.md
  else
    sed -i "s/최종 업데이트: [0-9-]*/최종 업데이트: $DATE/" AI_CONTEXT.md
  fi
  echo "✅ AI_CONTEXT.md 날짜 업데이트 완료"
fi

# 텔레그램 알림 발송 (선택 사항 - 필요 시 주석 해제)
# if [ -f "scripts/notify.sh" ]; then
#   bash scripts/notify.sh "AI Context Updated ($DATE)"
# fi

echo ""
echo "🎉 AI 컨텍스트 업데이트 완료!"
echo "   - .cursor/memory/05_progress.md"
echo "   - AI_CONTEXT.md"
