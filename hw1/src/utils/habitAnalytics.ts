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
 * Рассчитывает текущую и лучшую серию выполнения привычки, а также процент выполнения
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

  // Если сегодня еще не отмечено, проверяем, была ли отметка вчера
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
