FROM python:3.11-slim

WORKDIR /app

# Системные зависимости для сборки
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копируем исходный код сервера
COPY server.py /app/server.py

EXPOSE 8000

# Запуск сервера
CMD ["python3", "server.py"]
