#!/bin/bash
# ==============================================================================
# DocuMind AI — Скрипт запуска Fullstack веб-сайта (Frontend + Backend REST API)
# Запускает единый сервер на порту 8000 и открывает сайт в браузере
# ==============================================================================

cd "$(dirname "$0")"

echo "========================================================"
echo "🚀 Запуск DocuMind AI Fullstack системы (ДЗ 5)..."
echo "========================================================"

PORT=8000

# Проверяем, свободен ли порт 8000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Порт $PORT уже занят. Перезапуск процесса..."
    kill -9 $(lsof -t -i:$PORT) 2>/dev/null
    sleep 1
fi

echo "⚡ Старт сервера DocuMind AI на порту $PORT..."
python3 server.py &
SERVER_PID=$!
sleep 1

# Проверка работоспособности через cURL
echo "🔎 Проверка доступности API (Health Check)..."
curl -s http://localhost:$PORT/api/health | python3 -m json.tool

echo ""
echo "========================================================"
echo "✅ DocuMind AI успешно запущен (PID: $SERVER_PID)!"
echo "🌐 Полноценный веб-сайт: http://localhost:$PORT/"
echo "⚙️  REST API эндпоинты:   http://localhost:$PORT/api/health"
echo "========================================================"
echo "🖥  Открываем веб-сайт в вашем браузере..."
open "http://localhost:$PORT/" 2>/dev/null || open "index.html"

echo ""
echo "Чтобы остановить сайт и сервер — закройте это окно (или нажмите Ctrl+C)."
echo "========================================================"

wait $SERVER_PID
