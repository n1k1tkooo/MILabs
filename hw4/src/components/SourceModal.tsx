import React from 'react';
import { X, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RegulationCitation } from '../types';

interface SourceModalProps {
  citation: RegulationCitation | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{citation.docTitle}</h3>
              <p className="text-[11px] text-slate-500">
                {citation.department} • {citation.article}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Точная цитата из первоисточника:
          </span>
          <blockquote className="text-xs text-slate-800 leading-relaxed italic border-l-2 border-blue-500 pl-3">
            «{citation.quote}»
          </blockquote>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Редакция проверена и актуальна
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
