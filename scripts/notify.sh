#!/bin/bash
# scripts/notify.sh
# Telegram 알림 공통 발송 스크립트
# 사용법: bash scripts/notify.sh "메시지 내용"
#         bash scripts/notify.sh "메시지" "✅"  (이모지 지정)

set -e

MESSAGE="${1:-알림}"
EMOJI="${2:-🔔}"
PROJECT="srules"

# 환경 변수 로드 (.env.local 우선, 없으면 시스템 환경 변수 사용)
if [ -f ".env.local" ]; then
  # 주석 제거 후 export
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs) 2>/dev/null || true
fi

# 필수 환경 변수 확인
if [ -z "$TELEGRAM_TOKEN" ]; then
  echo "❌ TELEGRAM_TOKEN이 설정되지 않았습니다. .env.local을 확인해주세요."
  exit 1
fi

if [ -z "$TELEGRAM_CHAT_ID" ]; then
  echo "❌ TELEGRAM_CHAT_ID가 설정되지 않았습니다. .env.local을 확인해주세요."
  exit 1
fi

# 발송 날짜/시간
DATETIME=$(date +"%Y-%m-%d %H:%M:%S")

# 메시지 구성
FULL_MESSAGE="${EMOJI} [${PROJECT}] ${MESSAGE}
📅 ${DATETIME}"

# Telegram API 호출
RESPONSE=$(curl -s -X POST \
  "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  --data-urlencode "text=${FULL_MESSAGE}")

# 결과 확인
if echo "$RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Telegram 알림 전송 성공: ${MESSAGE}"
else
  echo "❌ Telegram 알림 전송 실패: ${RESPONSE}"
  exit 1
fi
