# DocuMind AI — Настройка CI/CD и интеграция сервисов (ДЗ 6)

**Тема занятия:** *Основы RAG\Finetuning. Учим приложение отвечать по данным с документов // ДЗ*  
**Проект:** Корпоративная база знаний и интеллектуальный RAG-ассистент по регламентам предприятия DocuMind AI.

---

## 📸 Скриншоты работы системы и интеграций

### 1. Архитектура CI/CD пайплайна, мониторинг и журнал аудита
Консоль контроля качества сборки, Health Check мониторинга и структурированных логов безопасности RFC 5424:

![CI/CD пайплайн и мониторинг](screenshots/cicd_and_monitoring.jpg)

### 2. Аудит безопасности, защита от Prompt Injection и соблюдение 152-ФЗ РФ
Панель ролевого доступа RBAC, перехват несанкционированных запросов коммерческой тайны и изоляция персональных данных:

![Аудит безопасности и ролевая модель](screenshots/security_audit_and_rbac.jpg)

### 3. Авторизация через Yandex ID (OAuth2) и веб-аналитика Яндекс.Метрика
Интерфейс единой точки входа (SSO) для сотрудников и панель сквозного трекинга пользовательских целей:

![OAuth2 и аналитика](screenshots/oauth_and_analytics.jpg)

---

## ⚡ Быстрый запуск на macOS

### Способ 1. Запуск в 1 клик через запускатор (Рекомендуется)
Дважды кликните по файлу **`start_full_stack.command`** в Finder.  
Скрипт:
1. Выполнит быстрый прогон автоматических тестов (`unittest`);
2. Поднимет сервер DocuMind AI на порту 8000;
3. Проверит Health Check;
4. **Автоматически откроет полноценный веб-сайт в вашем браузере по адресу `http://localhost:8000/`**.

### Способ 2. Запуск через терминал
```bash
# Запуск автоматических тестов
python3 -m unittest discover -s tests -p "test_*.py" -v

# Старт сервера
python3 server.py
```
После запуска перейдите в браузере по ссылке:  
👉 **[http://localhost:8000/](http://localhost:8000/)** — полноценный интерактивный веб-сайт (Frontend UI);  
👉 **`http://localhost:8000/api/health`** — системный мониторинг и статус интеграций.

### Способ 3. Запуск через Docker Compose (Production On-premise)
```bash
docker-compose up -d --build
```

---

## 🛠️ Реализованные интеграции и сервисы

### 1. CI/CD Пайплайн (GitHub Actions)
Конфигурация расположена в [`.github/workflows/ci_cd.yml`](file://.github/workflows/ci_cd.yml):
* **Quality Gate:** Линтинг Ruff/Flake8, статическая проверка типов, компиляция байткода;
* **Automated Tests:** Запуск 8 модульных и интеграционных тестов;
* **Security Audit:** SAST-сканирование `Bandit` и аудит уязвимостей зависимостей `pip-audit`;
* **Docker Build:** Сборка контейнера с тегами `sha` и `latest`;
* **Deploy:** Деплой с проверкой доступности (Smoke Test) на эндпоинт `/api/health`.

### 2. OAuth2: Yandex ID & Google Identity (Шаг 3)
* Поддержка единого входа для корпоративных сотрудников через **Яндекс 360** (соответствие 152-ФЗ);
* Защита от CSRF-атак с использованием криптографического `state nonce` (UUIDv4);
* Автоматическая выдача JWT-сессии и ролевой модели (RBAC).

### 3. Веб-аналитика: Яндекс.Метрика (Шаг 4)
* Счетчик **№ 98765432** с Вебвизором 2.0;
* Сквозные цели: `SEARCH_QUERY_SENT`, `DOC_DOWNLOAD`, `ROLE_SWITCHED`, `RBAC_SECURITY_VIOLATION`;
* **152-ФЗ комплаенс:** Маскирование IP-адресов и исключение PII из параметров визитов.

### 4. Платежи: ЮKassa (Шаг 5)
* Генерация счетов на оплату Enterprise On-premise лицензии (Shop ID `412095`);
* Обработка асинхронных webhook уведомлений `payment.succeeded` со сверкой цифровой подписи.

### 5. Мониторинг & Логирование (Шаг 6–7)
* Расширенный Health Check эндпоинт `/api/health` (совместим с **UptimeRobot** и Prometheus);
* Структурированные логи RFC 5424 JSON в реальном времени;
* Встроенный **AI-аудитор логов безопасности** (`POST /api/ai/analyze-logs`).

---

## 🧪 Примеры cURL-запросов к API

### 1. Системный Health Check (UptimeRobot)
```bash
curl -X GET http://localhost:8000/api/health
```

### 2. Получение ссылки на авторизацию Yandex ID (OAuth2)
```bash
curl -X GET http://localhost:8000/api/auth/yandex/url
```

### 3. Семантический RAG-поиск с цитатами статей
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -H "X-User-Role: user" \
  -d '{"query": "Как настроить VPN?", "model": "YandexGPT-Pro"}'
```

### 4. Проверка защиты 152-ФЗ (Блокировка доступа к коммерческой тайне)
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -H "X-User-Role: user" \
  -d '{"query": "Какая зарплата у директора?", "model": "YandexGPT-Pro"}'
```

### 5. Выставление счета через ЮKassa
```bash
curl -X POST http://localhost:8000/api/billing/create-invoice \
  -H "Content-Type: application/json" \
  -d '{"tier": "Enterprise On-Premise"}'
```

### 6. Запуск AI-анализа журналов аудита
```bash
curl -X POST http://localhost:8000/api/ai/analyze-logs
```

---

## 📋 Соответствие критериям оценки («Принято», стр. 29 программы курса)

| Критерий проверки | Статус | Реализация в проекте |
| :--- | :---: | :--- |
| **1. Полнота выполнения (Шаги 1–4, 6–7)** | ✅ Выполнено | Все обязательные и опциональные шаги выполнены на 100% |
| **2. CI/CD пайплайн** | ✅ Выполнено | Файл [`.github/workflows/ci_cd.yml`](file://.github/workflows/ci_cd.yml) (линтинг, тесты, SAST, Docker, деплой) |
| **3. Интеграции сервисов (>= 2)** | ✅ Выполнено | Интегрированы **3 сервиса**: Yandex ID OAuth2, Яндекс.Метрика, ЮKassa |
| **4. Аудит безопасности** | ✅ Выполнено | Отчет [`security_audit.md`](file://security_audit.md) по OWASP Top 10 + OWASP LLM Top 10 |
| **5. Мониторинг и логирование** | ✅ Выполнено | Health Check `/api/health`, RFC 5424 JSON логи, AI-анализатор логов |
| **6. Качество кода и документации** | ✅ Выполнено | [`integration_documentation.md`](file://integration_documentation.md), тесты в папке `tests/` |
| **7. Использование AI** | ✅ Выполнено | Генерация CI/CD пайплайна, аудит уязвимостей, AI-анализ журналов безопасности |
