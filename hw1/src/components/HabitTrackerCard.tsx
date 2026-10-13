import React, { useMemo } from 'react';
import { format, subDays } from 'date-fns';
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
