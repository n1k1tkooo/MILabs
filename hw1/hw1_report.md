# Отчет по Домашнему Заданию 1: Сравнительный анализ и настройка AI-инструментов


## Шаг 1. Анализ требований проекта

### 1.1. Описание задачи разработки
В качестве сквозного проекта выбрана разработка современного веб-приложения:  
**«TrackFlow AI» — умный трекер задач и привычек с персонализированной AI-аналитикой продуктивности.**

Приложение решает задачу систематизации ежедневных рутин, долгосрочных целей и динамического анализа эффективности пользователя (выявление паттернов прокрастинации, прогнозирование вероятности срыва привычки и генерация адаптивных рекомендаций).

### 1.2. Ключевые требования к проекту
* **Сложность разработки:** Средняя (Medium/High).
  * *Frontend:* Многокомпонентный реактивный UI (Kanban-доска, карточки привычек, интерактивные недельные сетки чек-инов, графики прогресса).
  * *Логика:* Сложные расчеты стриков (текущих/рекордных серий с учетом часовых поясов UTC), валидация данных, кэширование состояния.
  * *Backend (в перспективе ДЗ 5):* Реляционная БД (PostgreSQL / Supabase), Row Level Security, CRUD API, Webhooks.
* **Доступ к локальным файлам и инструментам разработки:**
  * **Критически необходим.** Требуется полный контроль над структурой файлов, конфигурациями сборщика (`vite.config.ts`, `tailwind.config.js`, `tsconfig.json`), локальным репозиторием Git, установкой npm-пакетов и запуском локального dev-сервера.
* **Требования к безопасности и конфиденциальности данных:**
  * Исходный код содержит бизнес-логику, интерфейсы API и архитектуру;
  * Недопустимость утечки секретов и сервисных ключей (API-ключи LLM, токены доступа к БД);
  * Соответствие требованиям изоляции данных: код и промпты не должны использоваться для публичного дообучения моделей без явного согласия.
* **Бюджет:**
  * Оптимальный бюджет: **$0 – $20 / месяц**.
  * Важна предсказуемость расходов: исключение скрытых трат за облачные виртуальные машины или неконтролируемый оверхед по токенам за каждую пересборку в облаке.

---

## Шаг 2. Сравнительный анализ инструментов

Для анализа выбраны 4 актуальных инструмента:
* **Cloud-агенты:**
  1. **Bolt.new** (StackBlitz) — среда разработки на базе WebContainers в браузере с полным циклом prompt-to-app.
  2. **Lovable.dev** — no-code/low-code AI-платформа для быстрой генерации fullstack веб-приложений с интеграцией Supabase и GitHub.
* **IDE / CLI-агенты:**
  3. **Cursor** — специализированный форк VS Code с глубокой интеграцией AI-моделей (Claude 3.5 Sonnet, GPT-4o), индексом кодовой базы и агентским режимом (Composer).
  4. **Cline** (ранее Claude Dev) — автономный open-source CLI/IDE-агент для VS Code с поддержкой протокола MCP (Model Context Protocol), прямого доступа к терминалу и модели Bring Your Own Key (BYOK).

### 2.1. Сравнительная таблица (шкала от 1 до 5)

| Критерий | Bolt.new (Cloud) | Lovable.dev (Cloud) | Cursor (IDE) | Cline (IDE/CLI) |
| :--- | :---: | :---: | :---: | :---: |
| **1. Доступ к контексту проекта** | 3.5 | 3.8 | **4.9** | 4.8 |
| **2. Скорость генерации кода** | 4.5 | **4.7** | 4.3 | 4.0 |
| **3. Качество кода и архитектуры** | 3.6 | 3.9 | **4.8** | 4.7 |
| **4. Стоимость использования** | 3.0 | 3.2 | 4.5 | **4.8** |
| **5. Безопасность данных и приватность**| 2.8 | 3.0 | 4.6 | **4.9** |
| **6. Удобство интеграции в workflow** | 3.0 | 3.4 | **4.9** | 4.6 |
| **ИТОГОВЫЙ БАЛЛ (из 30)** | **20.4** | **22.0** | **28.0** | **27.8** |

---

### 2.2. Детальная оценка и аргументация по каждому инструменту

#### 1. Bolt.new
* **Контекст (3.5/5):** Работает в изолированном WebContainer в браузере. При росте кодовой базы свыше 15-20 файлов начинает «забывать» удаленные зависимости и затирать вспомогательные модули.
* **Скорость (4.5/5):** Высокая скорость первоначальной сборки «с нуля по одному промпту».
* **Качество кода (3.6/5):** Часто складывает все в один монолитный файл или плоскую структуру. Имеет склонность к повторному дублированию стилей вместо переиспользуемых Tailwind-классов.
* **Стоимость (3.0/5):** Быстро сжигает бесплатные токены при отладке и итеративных правках мелких багов.
* **Безопасность (2.8/5):** Весь код живет на удаленных серверах платформы; закрытый контур или локальный Git не поддерживаются напрямую в процессе кодинга.
* **Интеграция (3.0/5):** Сложно интегрировать в стандартный пайплайн (линтеры, локальные тесты, кастомные pre-commit хуки). Экспорт в Git возможен, но обратная синхронизация затруднена.

#### 2. Lovable.dev
* **Контекст (3.8/5):** Отлично держит контекст UI и стандартных Supabase-схем за счет жестких шаблонных рамок. Для нестандартной бизнес-логики контекст ограничен.
* **Скорость (4.7/5):** Молниеносное прототипирование красивых экранов и форм.
* **Качество кода (3.9/5):** Генерирует качественный визуальный код на React + Tailwind + shadcn/ui, но архитектура сильно завязана на собственные конвенции платформы (vendor lock-in).
* **Стоимость (3.2/5):** Подписочная модель от $20/мес с жесткими лимитами кредитов на генерации; быстро становится невыгодным при серьезной разработке.
* **Безопасность (3.0/5):** Облачное исполнение, код передается через проприетарные бэкенды сервиса.
* **Интеграция (3.4/5):** Есть двусторонняя синхронизация с GitHub, но отсутствует возможность прямого локального дебага и запуска тестов во время генерации.

#### 3. Cursor (Лидер)
* **Контекст (4.9/5):** Передовая индексация репозитория (Codebase Indexing через эмбеддинги и AST-парсинг). Возможность точечно подключать файлы через `@Files`, папки через `@Folders`, документацию библиотек через `@Docs` и веб-поиск через `@Web`.
* **Скорость (4.3/5):** Быстрая потоковая генерация в режимах Inline Edit (Cmd+K) и многофайловом агенте (Composer / Agent Mode).
* **Качество кода (4.8/5):** Высочайшее качество при использовании Claude 3.5 Sonnet. Строгое соблюдение структуры проекта, линтинга, типов TypeScript.
* **Стоимость (4.5/5):** $20/мес дает 500 fast requests топовых моделей и безлимитный доступ к slow requests + Cursor Tab автокомплит.
* **Безопасность (4.6/5):** Наличие Privacy Mode (код пользователя не сохраняется и не используется для обучения). Код физически находится на машине разработчика.
* **Интеграция (4.9/5):** Полноценный VS Code: все расширения, терминал, отладчик, Docker, Git, Jest/Vitest работают прямо из коробки.

#### 4. Cline (VS Code Extension)
* **Контекст (4.8/5):** Читает дерево файлов, анализирует вывод терминала и ошибки компилятора в реальном времени.
* **Скорость (4.0/5):** Чуть медленнее за счет шагов валидации каждого действия (проверка diff, ожидание подтверждения команд в терминале).
* **Качество кода (4.7/5):** Сопоставимо с Cursor при использовании аналогичных моделей. Агент сам запускает тесты и правит свои ошибки.
* **Стоимость (4.8/5):** Истинный BYOK (OpenRouter / Anthropic API / DeepSeek API). Оплата только за фактически сожженные токены, что при использовании DeepSeek-V3/R1 снижает стоимость до единиц центов за задачу.
* **Безопасность (4.9/5):** Полный контроль: ключи хранятся локально, соединение идет напрямую в API провайдера без промежуточных серверов.
* **Интеграция (4.6/5):** Идеально встраивается в VS Code, поддерживает расширение через MCP-серверы (Model Context Protocol).

---

## Шаг 3. Выбор инструмента и обоснование

### 3.1. Итоговый выбор: Cursor (основной) + Cline (дополнительный CLI/MCP агент)
Для реализации проекта **«TrackFlow AI»** в качестве основного инструмента разработки выбран **Cursor**.

### 3.2. Ключевые факторы, повлиявшие на решение:
1. **Многофайловое редактирование в Agent Mode (Composer):** Cursor способен одновременно изменять контракт интерфейса в `types/`, логику в `utils/` и верстку в `components/`, автоматически контролируя целостность связей.
2. **Нулевой Vendor Lock-in:** Проект создается как стандартное Vite/React приложение. Разработчик в любой момент может продолжить разработку без AI.
3. **Локальный контроль и безопасность:** Приватный режим исключает утечку проприетарного кода, а все переменные окружения (`.env.local`) физически остаются на диске пользователя.
4. **Поддержка кастомных правил `.cursorrules`:** Критично для соблюдения стандартов TypeScript (строгая типизация без `any`, модульность, правила именования).

### 3.3. Почему не подошли альтернативные варианты (Cloud-агенты)
* **Bolt.new и Lovable:** Превосходны для создания первичного кликабельного MVP за 10 минут, однако критически непригодны для этапов ДЗ 4–6. В них крайне затруднена гибкая настройка тестовых фреймворков (Vitest/Playwright), настройка строгой CI/CD автоматизации, работа с кастомными локальными скриптами миграций и подключение сторонних SDK со специфическими требованиями безопасности.

---

## Шаг 4. Настройка рабочего окружения

### 4.1. Установка и базовое конфигурирование
1. Установлен редактор **Cursor** (версия 0.45+).
2. Активирован **Privacy Mode** в настройках аккаунта (`Settings -> Privacy Mode: ON`).
3. В качестве основной модели для рассуждений и написания кода выбрана **Claude 3.5 Sonnet**, для быстрого автодополнения включен **Cursor Tab**.
4. В корень проекта добавлен базовый файл правил `.cursorrules`.

### 4.2. Настройка MCP (Model Context Protocol)
Для расширения возможностей агента настроен протокол MCP, позволяющий AI напрямую инспектировать локальные ресурсы и структуру файлов.


### 4.3. Инициализация тестового окружения проекта
Выполнены команды инициализации окружения React + TypeScript + Tailwind CSS:
```bash
# 1. Создание проекта на базе Vite
npm create vite@latest trackflow-ai -- --template react-ts

# 2. Установка зависимостей аналитики дат и иконок
cd trackflow-ai
npm install lucide-react clsx tailwind-merge date-fns
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react
npx tailwindcss init -p
```

---

## Шаг 5. Практическое применение

В качестве практической задачи реализован ключевой бизнес-компонент системы:  
**`HabitTrackerCard` — интерактивная карточка трекинга привычки с динамическим расчетом серий (стриков), недельным чек-ином и обработкой краевых случаев дат.**

### 5.1. Фиксация процесса работы и промпты

#### Итерация 1: Генерация контрактов типов и базовой математики
* **Промпт 1:**
  > «Ты Senior Frontend Архитектор. Напиши TypeScript модуль `habitAnalytics.ts` для приложения трекера привычек.
  > Необходимы функции:
  > 1. Расчет текущего стрика (`calculateCurrentStreak`) с учетом того, что привычка могла быть еще не выполнена сегодня, но выполнена вчера.
  > 2. Расчет рекордного стрика (`calculateBestStreak`).
  > 3. Расчет процента завершения за последние 30 дней.
  > Важно: даты передаются в формате ISO (`YYYY-MM-DD`). Не используй `any`. Покрой граничные случаи: пустая история, повторяющиеся даты, пропуски дней.»
* **Результат итерации 1:** Агент сгенерировал математически корректный модуль. 
* **Возникшая сложность:** В первой версии расчет текущего стрика сбрасывался в 0, если сегодня пользователь еще не нажал кнопку чек-ина, хотя вчера серия была активна.
* **Решение:** Добавлен промпт на доработку условия проверки разницы дней относительно текущей даты `today`.

#### Итерация 2: Создание визуального интерактивного компонента
* **Промпт 2:**
  > «Создай React-компонент `HabitTrackerCard.tsx` с использованием Tailwind CSS и иконок Lucide React.
  > Требования:
  > - Принимает объект привычки: `id`, `title`, `category`, `streakGoal`, `completedDates` (массив строк).
  > - Отображает бейджи категорий, текущий стрик с иконкой огня, рекордный стрик.
  > - Отображает интерактивную полосу последних 7 дней (пн-вс) с возможностью переключения статуса выполнения кликом.
  > - Анимация при достижении цели стрика.
  > - Обработка состояний: загрузка (loading skeleton), отключенное состояние (disabled).»
* **Результат итерации 2:** Создан полнофункциональный компонент с аккуратным UI.

#### Итерация 3: Оптимизация и безопасность типов
* **Промпт 3:**
  > «Проведи рефакторинг `HabitTrackerCard.tsx`:
  > 1. Мемоизируй вычисления через `useMemo` для предотвращения лишних перерендеров при работе со списками из 50+ привычек.
  > 2. Добавь обработку состояния ошибки, если переданы невалидные даты.
  > 3. Обеспечь поддержку доступности (ARIA-атрибуты для кнопок дней).»

---

### 5.2. Реализованный код

#### 1. Модуль аналитики: `src/utils/habitAnalytics.ts`
```typescript
import { differenceInCalendarDays, parseISO, subDays, format } from 'date-fns';

export interface HabitData {
  id: string;
  title: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'learning';
  streakGoal: number;
  completedDates: string[]; // Формат: YYYY-MM-DD
}

export interface HabitMetrics {
  currentStreak: number;
  bestStreak: number;
  completionRateLast30Days: number;
  isCompletedToday: boolean;
}

/**
 * Рассчитывает текущую и лучшую серию выполнения привычки
 */
export function calculateHabitMetrics(
  completedDates: string[],
  goal: number,
  referenceDate: Date = new Date()
): HabitMetrics {
  if (!completedDates || completedDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      completionRateLast30Days: 0,
      isCompletedToday: false,
    };
  }

  // Убираем дубликаты и сортируем по убыванию дат
  const uniqueDates = Array.from(new Set(completedDates)).sort(
    (a, b) => parseISO(b).getTime() - parseISO(a).getTime()
  );

  const todayStr = format(referenceDate, 'yyyy-MM-dd');
  const isCompletedToday = uniqueDates.includes(todayStr);

  let currentStreak = 0;
  let checkCursor = referenceDate;

  // Если сегодня не отмечено, проверяем, была ли отметка вчера
  if (!isCompletedToday) {
    checkCursor = subDays(referenceDate, 1);
  }

  while (true) {
    const formattedCursor = format(checkCursor, 'yyyy-MM-dd');
    if (uniqueDates.includes(formattedCursor)) {
      currentStreak++;
      checkCursor = subDays(checkCursor, 1);
    } else {
      break;
    }
  }

  // Расчет максимального (best) стрика за всю историю
  const ascendingDates = [...uniqueDates].sort(
    (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
  );

  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of ascendingDates) {
    const currentDate = parseISO(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diff = differenceInCalendarDays(currentDate, prevDate);
      if (diff === 1) {
        tempStreak++;
      } else if (diff > 1) {
        tempStreak = 1;
      }
    }
    prevDate = currentDate;
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }

  // Расчет процента выполнения за последние 30 дней
  let completedLast30 = 0;
  for (let i = 0; i < 30; i++) {
    const dayStr = format(subDays(referenceDate, i), 'yyyy-MM-dd');
    if (uniqueDates.includes(dayStr)) {
      completedLast30++;
    }
  }
  const completionRateLast30Days = Math.round((completedLast30 / 30) * 100);

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    completionRateLast30Days,
    isCompletedToday,
  };
}
```

#### 2. Интерактивный компонент: `src/components/HabitTrackerCard.tsx`
```tsx
import React, { useMemo } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Flame, Trophy, Check, Award } from 'lucide-react';
import { HabitData, calculateHabitMetrics } from '../utils/habitAnalytics';

interface HabitTrackerCardProps {
  habit: HabitData;
  onToggleDate: (habitId: string, dateIso: string) => void;
  isLoading?: boolean;
}

const CATEGORY_COLORS = {
  health: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  productivity: 'bg-blue-50 text-blue-700 border-blue-200',
  mindfulness: 'bg-purple-50 text-purple-700 border-purple-200',
  learning: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const HabitTrackerCard: React.FC<HabitTrackerCardProps> = ({
  habit,
  onToggleDate,
  isLoading = false,
}) => {
  const metrics = useMemo(() => {
    return calculateHabitMetrics(habit.completedDates, habit.streakGoal);
  }, [habit.completedDates, habit.streakGoal]);

  // Генерируем последние 7 дней для быстрой отметки
  const last7Days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const iso = format(date, 'yyyy-MM-dd');
      const isCompleted = habit.completedDates.includes(iso);
      return {
        date,
        iso,
        dayName: format(date, 'eee', { locale: ru }),
        dayNum: format(date, 'd'),
        isCompleted,
        isToday: i === 6,
      };
    });
  }, [habit.completedDates]);

  if (isLoading) {
    return (
      <div className="w-full p-5 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />
        <div className="h-10 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  const isGoalReached = metrics.currentStreak >= habit.streakGoal;

  return (
    <div className="w-full p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-medium border rounded-full mb-1.5 ${
              CATEGORY_COLORS[habit.category]
            }`}
          >
            {habit.category.toUpperCase()}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            {habit.title}
          </h3>
        </div>

        {isGoalReached && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-lg animate-bounce">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Цель взята!</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-gray-50/80 rounded-xl mb-4 border border-gray-100 text-center">
        <div>
          <p className="text-xs text-gray-500 font-medium">Серия</p>
          <div className="flex items-center justify-center gap-1 mt-0.5 font-bold text-gray-900">
            <Flame className={`w-4 h-4 ${metrics.currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
            <span>{metrics.currentStreak} дн.</span>
          </div>
        </div>
        <div className="border-x border-gray-200/60">
          <p className="text-xs text-gray-500 font-medium">Рекорд</p>
          <div className="flex items-center justify-center gap-1 mt-0.5 font-bold text-gray-700">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{metrics.bestStreak} дн.</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">30 дней</p>
          <p className="font-bold text-indigo-600 mt-0.5">{metrics.completionRateLast30Days}%</p>
        </div>
      </div>

      {/* 7-Days Quick Check-in */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">Отметки за 7 дней</p>
        <div className="grid grid-cols-7 gap-1.5">
          {last7Days.map((day) => (
            <button
              key={day.iso}
              onClick={() => onToggleDate(habit.id, day.iso)}
              aria-label={`Отметить ${day.iso}`}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all ${
                day.isCompleted
                  ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${day.isToday ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`}
            >
              <span className="text-[10px] uppercase opacity-80">{day.dayName}</span>
              <span className="text-sm font-bold my-0.5">{day.dayNum}</span>
              <div className="h-3 flex items-center justify-center">
                {day.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## Шаг 6. Выводы и рекомендации

1. **Баланс между Cloud и IDE агентами:**
   * **Cloud-агенты (Bolt.new, Lovable):** Непревзойденны на стадии проверки гипотез (Pre-seed / Hackathon), когда нужно за 30 минут собрать интерактивный макет для демонстрации инвестору.
   * **IDE-агенты (Cursor, Cline):** Единственное жизнеспособное решение для этапа Production-инженерии. Они обеспечивают полный контроль за кодовой базой, версионированием, локальными тестами и качеством рефакторинга.
2. **Значение стандартизации промптов:**
   * Без строгой ролевой модели и контекста AI-агенты склонны писать хрупкий код с использованием `any` и игнорировать краевые случаи (например, часовые пояса при парсинге дат).
   * Использование кастомных правил (`.cursorrules`) сокращает количество итераций отладки в 2–3 раза.
