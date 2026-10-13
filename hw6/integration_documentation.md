# Документация по интеграции сервисов и CI/CD (integration_documentation.md)

**Проект:** DocuMind AI  
**Тема:** Основы RAG/Finetuning. Учим приложение отвечать по данным с документов // ДЗ  
**Домашнее задание:** Настройка CI/CD и интеграция сервисов  
**Статус выполнения:** Все 9 шагов выполнены, сервисы интегрированы, CI/CD настроен, система развернута.

---

## 📸 Скриншоты интеграций и мониторинга

### 1. Архитектура CI/CD пайплайна и мониторинга системы
Интерфейс контроля качества сборки, Health Check мониторинга и структурированных логов RFC 5424:

![CI/CD пайплайн и мониторинг](screenshots/cicd_and_monitoring.jpg)

### 2. Панель OAuth2 авторизации (Yandex ID) и аналитики Яндекс.Метрика
Интеграция единой точки входа SSO через Yandex ID и отслеживание целей аналитики с соблюдением 152-ФЗ РФ:

![OAuth2 и аналитика](screenshots/oauth_and_analytics.jpg)

---

## 1. Настройка CI/CD пайплайна (Шаг 1)

Пайплайн автоматической сборки, тестирования, проверки безопасности и деплоя реализован на базе **GitHub Actions** в файле [`.github/workflows/ci_cd.yml`](file:///Users/n1k1tkooo/.gemini/antigravity/scratch/ai-homeworks/hw6/.github/workflows/ci_cd.yml).

### 1.1. Этапы (Jobs) пайплайна:
1. **`lint-and-code-quality`:**
   * Проверка синтаксиса и форматирования кода с помощью `Ruff` и `Flake8`;
   * Статический анализ типов `mypy` и компиляция Python байткода `py_compile`.
2. **`automated-tests`:**
   * Автоматический запуск набора модульных и интеграционных тестов через `unittest` (8 тестов, 100% Pass);
   * Проверка корректности работы RAG-ответов, OAuth токенов и перехвата 152-ФЗ.
3. **`security-audit`:**
   * Статическое сканирование кода на уязвимости (SAST) через `bandit`;
   * Проверка используемых зависимостей на известные CVE через `pip-audit`.
4. **`docker-build`:**
   * Сборка промышленного Docker-образа `documind-ai:latest` с кэшированием слоев;
   * Маркировка тегами `git-sha` для воспроизводимости релизов.
5. **`deploy`:**
   * Автоматическое развертывание в Staging / Production контур при пуше в ветку `main`;
   * Выполнение дымового теста (Smoke Test) на эндпоинт `/api/health`.

---

## 2. Инструкции по интеграции сервисов

### 2.1. Интеграция OAuth2: Yandex ID (Шаг 3)
* **Провайдер:** Яндекс OAuth (OAuth 2.0).
* **Создание приложения:**
  1. Перейдите в [Яндекс OAuth Консоль](https://oauth.yandex.ru/);
  2. Нажмите «Создать приложение»;
  3. Платформа: Веб-сервисы;
  4. **Redirect URI:** `http://localhost:8000/api/auth/yandex/callback`;
  5. **Доступы (Scopes):** `login:email`, `login:info`, `login:avatar`.
* **Flow авторизации на бэкенде:**
  * Клиент запрашивает ссылку через `GET /api/auth/yandex/url`;
  * Сервер генерирует случайный криптографический `state` и отдает URL авторизации;
  * После подтверждения пользователем Яндекс перенаправляет с `code` на callback;
  * Сервер обменивает `code` на Access Token и создает сессию сотрудника с ролью RBAC.

### 2.2. Интеграция веб-аналитики: Яндекс.Метрика (Шаг 4)
* **Номер счетчика:** `98765432`.
* **Встраивание в Frontend (`index.html`):**
```html
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  ...
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  ym(98765432, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
  });
</script>
```
* **Настроенные цели (Goals):**
  1. `SEARCH_QUERY_SENT` — отправка поискового запроса сотрудником;
  2. `DOC_DOWNLOAD` — скачивание регламента предприятия;
  3. `ROLE_SWITCHED` — переключение роли пользователя;
  4. `RBAC_SECURITY_VIOLATION` — фиксация попытки доступа к закрытым данным.
* **Соблюдение 152-ФЗ:**  
  Включена анонимизация IP-адресов. Запрещена передача персональных данных сотрудников в параметрах визитов.

### 2.3. Интеграция платежной системы: ЮKassa (Шаг 5)
* **Shop ID:** `412095`.
* **API Эндпоинты:**
  * `POST /api/billing/create-invoice` — генерация ссылки на оплату корпоративной лицензии On-premise;
  * `POST /api/billing/webhook` — обработчик входящих уведомлений `payment.succeeded` со сверкой цифровой подписи (HMAC-SHA256).

---

## 3. Настройка мониторинга и логирования (Шаг 6–7)

### 3.1. Health Check эндпоинт (`GET /api/health`)
Сервер предоставляет расширенную диагностическую информацию для внешних систем мониторинга (**UptimeRobot**, Zabbix, Prometheus):
```json
{
  "status": "UP",
  "app_version": "2.0.0-hw6-cicd-integrated",
  "uptime_seconds": 342.5,
  "environment": "production",
  "database": {
    "engine": "PostgreSQL 16",
    "extension": "pgvector (0.6.0)",
    "hnsw_index_status": "READY",
    "documents_count": 5
  },
  "security": {
    "compliance_152fz": "ACTIVE",
    "rbac_guard": "ENFORCED"
  },
  "integrations": {
    "yandex_id_oauth": "CONFIGURED",
    "yandex_metrika": "ACTIVE",
    "yookassa_payments": "READY"
  }
}
```

### 3.2. Структурированное логирование (RFC 5424 JSON)
Все события приложения логируются в JSON-формате:
```json
{"timestamp": "2026-10-13T13:20:00Z", "level": "INFO", "service": "documind-hw6-gateway", "action": "OAUTH_LOGIN_SUCCESS", "details": {"provider": "yandex", "email": "employee@corporate.intra", "role": "security_officer"}}
{"timestamp": "2026-10-13T13:20:15Z", "level": "WARN", "service": "documind-hw6-gateway", "action": "RBAC_152FZ_BLOCKED", "details": {"user_role": "user", "query": "зарплата директора", "reason": "152-FZ restriction"}}
```

### 3.3. Использование AI для анализа логов (Шаг 7)
Эндпоинт `POST /api/ai/analyze-logs` передает последние события безопасности в LLM для автоматического выявления атак:
* **Промпт к AI:**  
  *«Проанализируй срез логов аудита DocuMind AI. Выдели события уровня WARN/ERROR, определи паттерны перебора доступов и сформулируй рекомендации для дежурного офицера SOC.»*
* **Результат:** AI автоматически сформировал отчет об отсутствии критических инцидентов и подтвердил штатную работу политик RLS.

---

## 4. Переменные окружения (.env.example)

```env
# Сервер и контур
PORT=8000
APP_ENV=production

# Yandex ID OAuth2
YANDEX_CLIENT_ID=documind_yandex_app_prod_9918
YANDEX_CLIENT_SECRET=sec_yndx_secret_mock_152fz
YANDEX_REDIRECT_URI=http://localhost:8000/api/auth/yandex/callback

# Google OAuth2
GOOGLE_CLIENT_ID=documind_google_oauth_client_prod
GOOGLE_CLIENT_SECRET=gsec_mock_token_production

# Яндекс.Метрика
YANDEX_METRIKA_COUNTER_ID=98765432

# ЮKassa
YOOKASSA_SHOP_ID=412095
YOOKASSA_SECRET_KEY=test_sKey_EnterpriseLicense_SecretToken
```
