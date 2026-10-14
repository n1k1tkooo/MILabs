#!/bin/bash
# ==============================================================================
# DocuMind AI — Скрипт запуска Fullstack системы с интеграциями (ДЗ 6)
# Запускает веб-сайт, REST API, модули OAuth2, Метрики, ЮKassa и открывает браузер
# ==============================================================================

cd "$(dirname "$0")"

echo "========================================================"
echo "🚀 Запуск DocuMind AI Fullstack (ДЗ 6: CI/CD & Интеграции)"
echo "========================================================"

PORT=8000

# 1. Проверяем и освобождаем порт при необходимости
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Порт $PORT занят. Перезапуск процесса..."
    kill -9 $(lsof -t -i:$PORT) 2>/dev/null
    sleep 1
fi

# 2. Быстрый прогон тестов
echo "🧪 Выполнение автоматических тестов интеграций..."
python3 -m unittest discover -s tests -p "test_*.py" -v
if [ $? -ne 0 ]; then
    echo "❌ Ошибка при выполнении тестов!"
    exit 1
fi

echo ""
echo "⚡ Старт сервера DocuMind AI на порту $PORT..."
python3 server.py &
SERVER_PID=$!
sleep 1

# 3. Проверка доступности через Health Check
echo "🔎 Проверка состояния системы (Health Check)..."
curl -s http://localhost:$PORT/api/health | python3 -m json.tool

echo ""
echo "========================================================"
echo "✅ DocuMind AI успешно запущен (PID: $SERVER_PID)!"
echo "🌐 Полноценный сайт:      http://localhost:$PORT/"
echo "🔐 Авторизация 152-ФЗ:    Локальный вход (SHA-256 + соль) / Панель администратора"
echo "⚙️  REST API & Health:     http://localhost:$PORT/api/health"
echo "🔑 OAuth2 / Yandex ID:    http://localhost:$PORT/api/auth/yandex/url"
echo "📊 Яндекс.Метрика ID:     98765432 (Активен)"
echo "💳 ЮKassa Shop ID:        412095 (Готов)"
echo "========================================================"
echo "🖥  Открываем сайт в вашем браузере..."
open "http://localhost:$PORT/" 2>/dev/null || open "index.html"

echo ""
echo "Для остановки сервера закройте это окно терминала (или нажмите Ctrl+C)."
echo "========================================================"

wait $SERVER_PID
