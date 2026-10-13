import React from 'react';
import { ShieldCheck, AlertTriangle, FileLock2, Activity, Database, Key } from 'lucide-react';

/**
 * Концепция 3: Compliance & Security Dashboard (Стиль FinTech / CyberSec)
 * Темная аналитическая тема, фокус на аудите 152-ФЗ, контроле доступов и хэшах
 */
export const Concept3ComplianceDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Шапка дашборда */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <FileLock2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">
                DocuMind // Compliance & SecOps Audit
              </h1>
              <p className="text-xs text-slate-400">On-premise Контур • Статус 152-ФЗ: ЗАЩИЩЕНО</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-semibold">Система изолирована</span>
          </div>
        </div>

        {/* Метрики безопасности */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Всего регламентов</span>
            <p className="text-2xl font-bold text-white">142</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-amber-400">Гриф CONFIDENTIAL</span>
            <p className="text-2xl font-bold text-amber-400">28</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-emerald-400">Индексировано в pgvector</span>
            <p className="text-2xl font-bold text-emerald-400">100%</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-blue-400">Локальная модель</span>
            <p className="text-sm font-bold text-blue-400 mt-1">DeepSeek-V3 Q8</p>
          </div>
        </div>

        {/* Журнал аудита RAG-обращений */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Журнал аудита обращений к регламентам (Zero-Leakage Logs)
            </h3>
            <span className="text-[11px] text-slate-500">Обновление: Real-time</span>
          </div>
          <div className="text-xs space-y-2 text-slate-300">
            <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <span>[11:34:02] Запрос пользователя ID:943 (Отдел ИБ) к "Регламент VPN v2.4"</span>
              <span className="text-emerald-400 font-semibold">Доступ разрешен (RBAC OK)</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <span>[11:32:15] Попытка запроса ID:112 к "Штатное расписание топ-менеджмента"</span>
              <span className="text-rose-400 font-semibold">Отклонено (Confidential Blocked)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
