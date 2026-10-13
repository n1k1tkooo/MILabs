#!/bin/bash
# ==============================================================================
# DocuMind AI — Скрипт быстрого запуска приложения
# Дважды кликните по этому файлу в Finder для запуска приложения в браузере
# ==============================================================================

# Переход в директорию расположения скрипта
cd "$(dirname "$0")"

echo "--------------------------------------------------------"
echo "🚀 Запуск DocuMind AI (Enterprise Knowledge Workspace)..."
echo "--------------------------------------------------------"

# Проверяем, запущен ли уже локальный сервер на порту 3001
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Локальный сервер уже активен на http://localhost:3001"
    open "http://localhost:3001/standalone_app.html"
else
    echo "⚡ Запуск встроенного веб-сервера на порту 3001..."
    if command -v python3 &>/dev/null; then
        python3 -m http.server 3001 &
        SERVER_PID=$!
        sleep 1
        open "http://localhost:3001/standalone_app.html"
        echo "Сервер работает (PID: $SERVER_PID). Чтобы остановить — закройте это окно."
        wait $SERVER_PID
    else
        echo "🌐 Открытие автономного приложения напрямую в браузере..."
        open "standalone_app.html"
    fi
fi
