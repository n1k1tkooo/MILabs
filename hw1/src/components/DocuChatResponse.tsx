import React, { useState } from 'react';
import { FileText, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { DocumentChunk } from '../utils/documentChunker';

interface DocuChatResponseProps {
  query: string;
  answerText: string;
  sources: DocumentChunk[];
  modelUsed: 'YandexGPT-Pro' | 'DeepSeek-V3-Local' | 'Qwen-2.5-Coder';
  isConfidentialWarning?: boolean;
}

export const DocuChatResponse: React.FC<DocuChatResponseProps> = ({
  query,
  answerText,
  sources,
  modelUsed,
  isConfidentialWarning = false,
}) => {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModelBadge = () => {
    switch (modelUsed) {
      case 'YandexGPT-Pro':
        return { label: 'YandexGPT 5 Pro (РФ / 152-ФЗ)', color: 'bg-red-50 text-red-700 border-red-200' };
      case 'DeepSeek-V3-Local':
        return { label: 'DeepSeek V3 (On-premise)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'Qwen-2.5-Coder':
        return { label: 'Qwen 2.5 (Локальный контур)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  const badge = getModelBadge();

  return (
    <div className="w-full max-w-3xl mx-auto my-4 bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      {/* Шапка карточки ответа */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            AI
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">DocuMind Корпоративный Ассистент</h4>
            <span className={`inline-block px-2 py-0.5 text-[11px] font-medium border rounded-md ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Скопировать ответ"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Скопировано' : 'Копировать'}</span>
        </button>
      </div>

      {/* Предупреждение о конфиденциальности при необходимости */}
      {isConfidentialWarning && (
        <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Ответ содержит цитаты из регламентов уровня <strong>CONFIDENTIAL</strong>. 
            Передача третьим лицам запрещена политикой безопасности компании.
          </span>
        </div>
      )}

      {/* Текст сгенерированного ответа */}
      <div className="p-5 text-gray-800 text-sm leading-relaxed whitespace-pre-line font-normal">
        {answerText}
      </div>

      {/* Аккордеон источников и цитируемых регламентов */}
      {sources.length > 0 && (
        <div className="px-5 pb-5">
          <button
            onClick={() => setIsSourcesOpen(!isSourcesOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200/80 transition-colors text-xs font-medium text-gray-700"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>
                Использованные регламенты и источники: <strong>{sources.length}</strong>
              </span>
            </div>
            {isSourcesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isSourcesOpen && (
            <div className="mt-3 space-y-2.5">
              {sources.map((chunk, index) => (
                <div
                  key={chunk.chunkId}
                  className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5 text-gray-900 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      [{index + 1}] {chunk.metadata.title} (v{chunk.metadata.version})
                    </span>
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">
                      Отдел: {chunk.metadata.department}
                    </span>
                  </div>
                  <blockquote className="text-gray-600 italic bg-white p-2.5 rounded-lg border border-gray-100 text-[11px] leading-relaxed">
                    «{chunk.content}»
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
