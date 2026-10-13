import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Upload, 
  FileText, 
  Lock, 
  ShieldCheck, 
  Calendar, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { DocumentMeta, AccessLevel } from '../types';

interface DocumentRegistryViewProps {
  documents: DocumentMeta[];
  selectedDepartment: string;
  onOpenUpload: () => void;
  onSelectDocument: (doc: DocumentMeta) => void;
}

export const DocumentRegistryView: React.FC<DocumentRegistryViewProps> = ({
  documents,
  selectedDepartment,
  onOpenUpload,
  onSelectDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | AccessLevel>('all');

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Фильтр по отделу
      if (selectedDepartment !== 'all' && doc.department !== selectedDepartment) {
        return false;
      }
      // Фильтр по грифу допуска
      if (accessFilter !== 'all' && doc.accessLevel !== accessFilter) {
        return false;
      }
      // Поиск по названию или имени файла
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          doc.title.toLowerCase().includes(query) ||
          doc.fileName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [documents, selectedDepartment, accessFilter, searchQuery]);

  const getBadge = (level: AccessLevel) => {
    switch (level) {
      case 'confidential':
        return { label: 'CONFIDENTIAL (152-ФЗ)', color: 'bg-red-50 text-red-700 border-red-200', icon: <Lock className="w-3.5 h-3.5" /> };
      case 'internal':
        return { label: 'ДСП / Внутренний', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <ShieldCheck className="w-3.5 h-3.5" /> };
      case 'public':
      default:
        return { label: 'Общий доступ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <ShieldCheck className="w-3.5 h-3.5" /> };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Шапка реестра с поиском и фильтрами */}
      <div className="bg-white border-b border-slate-200 p-4 sm:px-6 sm:py-4 shrink-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Реестр нормативных документов</h2>
            <p className="text-xs text-slate-500">
              Всего документов в базе: <strong>{filteredDocuments.length}</strong>
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Загрузить новый регламент</span>
          </button>
        </div>

        {/* Панель фильтрации */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Фильтр по названию документа или коду..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Гриф:
            </span>
            <button
              onClick={() => setAccessFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                accessFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setAccessFilter('public')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                accessFilter === 'public'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Общие
            </button>
            <button
              onClick={() => setAccessFilter('internal')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                accessFilter === 'internal'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              ДСП
            </button>
            <button
              onClick={() => setAccessFilter('confidential')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                accessFilter === 'confidential'
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Конфиденциально
            </button>
          </div>
        </div>
      </div>

      {/* Список документов (Сетка карточек) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredDocuments.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
            <FileText className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Документов не найдено</p>
            <p className="text-xs text-slate-400 mt-0.5">Попробуйте изменить параметры поиска или фильтрации</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => {
              const badge = getBadge(doc.accessLevel);
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="p-5 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold border rounded-lg ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        v{doc.version}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.department}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {doc.updatedAt}
                    </span>
                    <span>{doc.pagesCount} стр. • {doc.fileSizeMb} МБ</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
