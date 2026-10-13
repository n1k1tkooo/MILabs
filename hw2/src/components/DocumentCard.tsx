import React, { useMemo } from 'react';
import { FileText, Lock, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

/**
 * Уровни конфиденциальности нормативного документа согласно регламенту ИБ
 */
export type AccessLevel = 'public' | 'internal' | 'confidential';

/**
 * Метаданные нормативного документа компании
 */
export interface DocumentItem {
  id: string;
  title: string;
  department: string;
  accessLevel: AccessLevel;
  updatedAt: string;
  version: string;
  pagesCount: number;
}

/**
 * Пропсы компонента карточки документа
 */
export interface DocumentCardProps {
  document: DocumentItem;
  onOpenDocument: (documentId: string) => void;
  isLoading?: boolean;
}

interface BadgeConfig {
  label: string;
  classes: string;
  icon: React.ReactNode;
}

/**
 * Карточка нормативного документа корпоративной базы знаний DocuMind AI
 * Написана строго по системным правилам .cursorrules
 */
export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onOpenDocument,
  isLoading = false,
}) => {
  // Мемоизация цветовой схемы и метаданных уровня допуска
  const badgeConfig = useMemo<BadgeConfig>(() => {
    switch (document.accessLevel) {
      case 'confidential':
        return {
          label: 'Конфиденциально (152-ФЗ / КТ)',
          classes: 'bg-red-50 text-red-700 border-red-200',
          icon: <Lock className="w-3.5 h-3.5 text-red-600" />,
        };
      case 'internal':
        return {
          label: 'Для служебного пользования',
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'public':
      default:
        return {
          label: 'Общий доступ',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
        };
    }
  }, [document.accessLevel]);

  if (isLoading) {
    return (
      <div 
        aria-busy="true" 
        className="w-full p-5 bg-white border border-slate-200 rounded-2xl shadow-sm animate-pulse space-y-3"
      >
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
      </div>
    );
  }

  return (
    <article className="w-full p-5 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Верхняя строка: гриф секретности и версия */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-lg ${badgeConfig.classes}`}
          >
            {badgeConfig.icon}
            <span>{badgeConfig.label}</span>
          </span>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            v{document.version}
          </span>
        </div>

        {/* Название документа */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1.5">
          {document.title}
        </h3>

        {/* Департамент-владелец */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
          <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="truncate">{document.department}</span>
        </div>
      </div>

      {/* Подвал карточки: метаданные и кнопка открытия */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            {document.updatedAt}
          </span>
          <span>•</span>
          <span>{document.pagesCount} стр.</span>
        </div>

        <button
          type="button"
          onClick={() => onOpenDocument(document.id)}
          aria-label={`Открыть документ ${document.title}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <span>Читать</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
