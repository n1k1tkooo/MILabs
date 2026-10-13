import React, { useState } from 'react';
import { 
  Building2, 
  FolderLock, 
  Users, 
  ShieldAlert, 
  Search, 
  MessageSquare, 
  FileText, 
  Upload, 
  SlidersHorizontal,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

/**
 * Концепция 2: Enterprise Knowledge Workspace (Выбранная концепция)
 * Двухколоночный воркспейс в стиле Notion/Slack с боковой панелью отделов и реестром
 */
export const Concept2EnterpriseWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'docs'>('chat');
  const [selectedDept, setSelectedDept] = useState('all');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. Левый сайдбар навигации */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* Бренд */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">DocuMind AI</h2>
              <span className="text-[10px] text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">Корпоративный</span>
            </div>
          </div>

          {/* Основные разделы */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI-Ассистент</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'docs'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Реестр документов</span>
            </button>
          </nav>

          {/* Фильтр по отделам */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-2">Департаменты</span>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Все документы', count: 48 },
                { id: 'sec', label: 'Информ. Безопасность', count: 12 },
                { id: 'hr', label: 'Кадры и HR', count: 18 },
                { id: 'legal', label: 'Юридический отдел', count: 9 },
                { id: 'it', label: 'IT & Инфраструктура', count: 9 },
              ].map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedDept === dept.id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="truncate">{dept.label}</span>
                  <span className="text-[10px] text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded-full">{dept.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Пользователь внизу сайдбара */}
        <div className="p-3 bg-slate-100/80 rounded-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            АИ
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-900 truncate">Алексей Иванов</p>
            <p className="text-[10px] text-slate-600 truncate">Инженер (Допуск: Internal)</p>
          </div>
        </div>
      </aside>

      {/* 2. Центральная рабочая панель */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Верхняя строка поиска */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 w-1/2">
            <Search className="w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Поиск по регламентам, приказам и кодексам..."
              className="w-full text-xs bg-transparent focus:outline-none placeholder-slate-600 text-slate-900"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
              152-ФЗ Активен
            </span>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Загрузить регламент</span>
            </button>
          </div>
        </header>

        {/* Контентная зона */}
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {activeTab === 'chat' ? 'Диалог с AI-ассистентом по нормативным актам' : 'Реестр нормативных документов'}
            </h3>
            <p className="text-xs text-slate-500">
              Ответы формируются в строгом соответствии с версией регламентов на текущую дату
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
