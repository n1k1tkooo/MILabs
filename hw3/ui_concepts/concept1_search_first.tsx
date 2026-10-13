import React, { useState } from 'react';
import { Search, Sparkles, Command, FileText, ArrowRight } from 'lucide-react';

/**
 * Концепция 1: Search-First Spotlight (Стиль Perplexity / Raycast)
 * Минималистичный интерфейс, фокус на гигантской строке поиска по шорткату Cmd+K
 */
export const Concept1SearchFirst: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
      <div className="w-full max-w-2xl space-y-6">
        {/* Заголовок */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DocuMind QuickSearch</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Спросите что угодно о регламентах компании
          </h1>
          <p className="text-sm text-slate-500">
            Мгновенный семантический поиск по 150+ внутренним нормативным документам
          </p>
        </div>

        {/* Центральная строка поиска */}
        <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <Search className="w-6 h-6 text-blue-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например: Как настроить VPN или оформить больничный лист..."
              className="w-full bg-transparent text-base text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 text-xs font-mono rounded-lg border border-slate-200">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>

        {/* Быстрые подсказки */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400">Частые запросы:</span>
          {['Правила работы с 152-ФЗ', 'Инструкция по отпускам', 'Регламент ИБ v2.4'].map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-sm"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
