import React from 'react';
import { 
  Building2, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Lock, 
  X, 
  Folder 
} from 'lucide-react';
import { CurrentUser } from '../types';

interface SidebarProps {
  activeTab: 'chat' | 'docs';
  onTabChange: (tab: 'chat' | 'docs') => void;
  selectedDepartment: string;
  onDepartmentSelect: (dept: string) => void;
  user: CurrentUser;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  departments: { id: string; label: string; count: number }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  selectedDepartment,
  onDepartmentSelect,
  user,
  isOpenMobile,
  onCloseMobile,
  departments,
}) => {
  return (
    <>
      {/* Затемнение фона на мобильных */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Бренд и кнопка закрытия для мобильных */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">DocuMind AI</h2>
                <span className="text-[10px] text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                  Enterprise v1.0
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Закрыть меню"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Основные разделы интерфейса */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                onTabChange('chat');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI-Ассистент</span>
            </button>

            <button
              onClick={() => {
                onTabChange('docs');
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'docs'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Реестр документов</span>
            </button>
          </nav>

          {/* Фильтр по отделам компании */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-2">
              Департаменты
            </span>
            <div className="space-y-0.5">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    onDepartmentSelect(dept.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedDepartment === dept.id
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-slate-600" />
                    {dept.label}
                  </span>
                  <span className="text-[10px] text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded-full font-mono">
                    {dept.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Профиль текущего сотрудника внизу */}
        <div className="p-3 bg-slate-100/90 rounded-2xl flex items-center gap-2.5 border border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            АС
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="capitalize">{user.role}</span> • {user.department}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
