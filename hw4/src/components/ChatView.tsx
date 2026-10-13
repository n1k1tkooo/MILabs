import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Search, 
  ShieldAlert, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ChatMessage, ModelProvider, RegulationCitation } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  selectedModel: ModelProvider;
  onModelSelect: (model: ModelProvider) => void;
  onOpenCitation: (citation: RegulationCitation) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedModel,
  onModelSelect,
  onOpenCitation,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const getModelBadge = (model?: ModelProvider) => {
    const current = model || selectedModel;
    switch (current) {
      case 'YandexGPT-Pro':
        return { label: 'YandexGPT 5 Pro (РФ / 152-ФЗ)', color: 'bg-red-50 text-red-700 border-red-200' };
      case 'DeepSeek-V3-Local':
        return { label: 'DeepSeek V3 (On-premise)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'Qwen-2.5-Coder':
        return { label: 'Qwen 2.5 Coder (Локально)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Верхняя панель переключения модели */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-900">Используемая AI-модель:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => onModelSelect('YandexGPT-Pro')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedModel === 'YandexGPT-Pro'
                ? 'bg-white text-red-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            YandexGPT Pro (РФ)
          </button>
          <button
            onClick={() => onModelSelect('DeepSeek-V3-Local')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedModel === 'DeepSeek-V3-Local'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DeepSeek V3 (Local)
          </button>
          <button
            onClick={() => onModelSelect('Qwen-2.5-Coder')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedModel === 'Qwen-2.5-Coder'
                ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Qwen 2.5 Coder
          </button>
        </div>
      </div>

      {/* Лента сообщений чата */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
            } w-full`}
          >
            {msg.sender === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm p-4 text-sm max-w-xl shadow-sm">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[10px] text-blue-200 block text-right mt-1.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-5 shadow-sm space-y-3">
                {/* Шапка ответа AI */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      AI
                    </span>
                    <span className="text-xs font-bold text-slate-900">DocuMind Ассистент</span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold border rounded-md ${getModelBadge(msg.modelUsed).color}`}>
                      {getModelBadge(msg.modelUsed).label}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    aria-label="Скопировать ответ"
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === msg.id ? 'Скопировано' : 'Копировать'}</span>
                  </button>
                </div>

                {/* Предупреждение о конфиденциальности при необходимости */}
                {msg.isConfidentialWarning && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Запрос затрагивает конфиденциальные сведения. Доступ предоставлен строго в соответствии с вашей ролью (152-ФЗ / КТ).
                    </span>
                  </div>
                )}

                {/* Текст ответа */}
                <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Аккордеон источников и цитирования */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Верифицированные первоисточники ({msg.citations.length})</span>
                      </div>
                      {expandedSources[msg.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedSources[msg.id] && (
                      <div className="mt-2.5 space-y-2">
                        {msg.citations.map((cit) => (
                          <div
                            key={cit.citationId}
                            onClick={() => onOpenCitation(cit)}
                            className="p-3 bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all text-xs space-y-1 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-blue-700 group-hover:underline flex items-center gap-1">
                                {cit.docTitle}
                                <ExternalLink className="w-3 h-3" />
                              </span>
                              <span className="text-[10px] text-slate-500">{cit.article}</span>
                            </div>
                            <p className="text-slate-600 italic text-[11px] leading-relaxed">
                              «{cit.quote}»
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Индикатор загрузки ответа */}
        {isLoading && (
          <div className="max-w-3xl mr-auto w-full">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Нижняя область ввода вопроса */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Задайте вопрос по корпоративным регламентам и инструкциям..."
            className="w-full pl-4 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 top-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Спросить</span>
          </button>
        </form>
      </div>
    </div>
  );
};
