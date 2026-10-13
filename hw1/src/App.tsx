import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Send, 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle,
  FileCheck2,
  Lock
} from 'lucide-react';
import { DocuChatResponse } from './components/DocuChatResponse';
import { 
  DocumentMetadata, 
  DocumentChunk, 
  chunkEnterpriseDocument, 
  estimateCyrillicTokens 
} from './utils/documentChunker';

// Тестовый регламент компании
const SAMPLE_REGULATION_TEXT = `1. ОБЩИЕ ПОЛОЖЕНИЯ И ТРЕБОВАНИЯ 152-ФЗ.
1.1. Настоящий Регламент определяет порядок работы сотрудников с конфиденциальной информацией и персональными данными в корпоративной информационной системе DocuMind.
1.2. Вся обработка персональных данных клиентов и сотрудников осуществляется строго на серверах, физически размещенных на территории Российской Федерации, в соответствии с требованиями Федерального закона № 152-ФЗ.

2. ПРАВИЛА УДАЛЕННОГО ДОСТУПА И СЕТЕВОЙ БЕЗОПАСНОСТИ.
2.1. Подключение к внутренним контурам компании разрешено исключительно с использованием корпоративного двухфакторного VPN-клиента (WireGuard/OpenVPN).
2.2. Запрещается сохранение служебных учетных записей и ключей доступа в открытом виде на личных устройствах.

3. ЗАПРЕТ НА ПЕРЕДАЧУ КОНФИДЕНЦИАЛЬНЫХ ДАННЫХ В ПУБЛИЧНЫЕ СЕРВИСЫ.
3.1. Категорически запрещается загрузка исходного кода, клиентских баз, бухгалтерской отчетности и внутренних регламентов в сторонние публичные облачные AI-инструменты (включая неавторизованные чат-боты).
3.2. Для работы с AI разрешено использовать только сертифицированный On-premise контур DocuMind AI (локальные модели DeepSeek и Qwen) либо авторизованный шлюз Yandex Cloud с корпоративным NDA.`;

const SAMPLE_DOC_METADATA: DocumentMetadata = {
  id: 'REG-SEC-2026-04',
  title: 'Регламент ИБ и защиты коммерческой тайны v2.4',
  department: 'Департамент Информационной Безопасности',
  version: '2.4 (Актуальная)',
  accessLevel: 'confidential',
};

export default function App() {
  const [selectedModel, setSelectedModel] = useState<'YandexGPT-Pro' | 'DeepSeek-V3-Local' | 'Qwen-2.5-Coder'>('YandexGPT-Pro');
  const [userQuery, setUserQuery] = useState('Можно ли загружать внутренние регламенты в публичные AI-сервисы и как подключаться к VPN?');
  const [activeTab, setActiveTab] = useState<'chat' | 'chunker'>('chat');
  
  // Чанки
  const [chunks, setChunks] = useState<DocumentChunk[]>(() => 
    chunkEnterpriseDocument(SAMPLE_REGULATION_TEXT, SAMPLE_DOC_METADATA, { chunkSize: 400, chunkOverlap: 80 })
  );

  // Ответ ассистента
  const sampleAnswer = `На основании "Регламента ИБ и защиты коммерческой тайны v2.4" сообщаю:

1. **Запрет на публичные AI-сервисы:** Загрузка внутренних регламентов, исходного кода и конфиденциальных данных в сторонние публичные облачные AI-инструменты категорически запрещена (п. 3.1). Разрешено использовать только защищенный On-premise контур DocuMind AI или шлюз Yandex Cloud с корпоративным договором (п. 3.2). [Источник 3, Документ Регламент ИБ v2.4]

2. **Подключение к VPN:** Доступ к внутренним ресурсам допускается исключительно через корпоративный двухфакторный VPN-клиент (п. 2.1). Хранение учетных данных на личных устройствах запрещено (п. 2.2). [Источник 2, Документ Регламент ИБ v2.4]`;

  const handleTestChunking = () => {
    const generated = chunkEnterpriseDocument(
      SAMPLE_REGULATION_TEXT, 
      SAMPLE_DOC_METADATA, 
      { chunkSize: 350, chunkOverlap: 70 }
    );
    setChunks(generated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Верхняя навигационная панель */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-slate-900">DocuMind AI</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  ДЗ1 Демо
                </span>
              </div>
              <p className="text-xs text-slate-500">Корпоративная база знаний и On-premise ассистент</p>
            </div>
          </div>

          {/* Селектор модели из методички */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedModel('YandexGPT-Pro')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedModel === 'YandexGPT-Pro'
                  ? 'bg-white text-red-600 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              YandexGPT Pro (РФ)
            </button>
            <button
              onClick={() => setSelectedModel('DeepSeek-V3-Local')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedModel === 'DeepSeek-V3-Local'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DeepSeek V3 (Local)
            </button>
            <button
              onClick={() => setSelectedModel('Qwen-2.5-Coder')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedModel === 'Qwen-2.5-Coder'
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Qwen 2.5 Coder
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Баннер соответствия ДЗ1 */}
        <div className="p-4 mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs rounded font-semibold">
                Статус: ДЗ1 Настроено и работает
              </span>
              <span className="text-xs text-blue-200">Слушатель: n1k1tkooo</span>
            </div>
            <h2 className="text-lg font-bold mt-1 text-white">Практическое тестирование RAG-модулей и интерфейса</h2>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Проверка семантического чанкинга кириллицы, защищенного системного промпта и визуализации источников.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'chat' 
                  ? 'bg-white text-blue-900 shadow' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Ответ Ассистента
            </button>
            <button
              onClick={() => setActiveTab('chunker')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'chunker' 
                  ? 'bg-white text-blue-900 shadow' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Семантический Чанкинг
            </button>
          </div>
        </div>

        {activeTab === 'chat' ? (
          <div>
            {/* Поисковая строка вопроса */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Задайте вопрос по корпоративным регламентам..."
                  className="w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <button 
                  onClick={() => {}}
                  className="absolute right-2 top-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Поиск</span>
                </button>
              </div>

              {/* Быстрые подсказки */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-500">
                <span className="font-medium text-slate-400">Частые вопросы:</span>
                <button
                  onClick={() => setUserQuery('Как регламентируется работа с персональными данными по 152-ФЗ?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition-colors"
                >
                  Требования 152-ФЗ
                </button>
                <button
                  onClick={() => setUserQuery('Разрешено ли использовать внешние публичные LLM?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition-colors"
                >
                  Использование сторонних LLM
                </button>
                <button
                  onClick={() => setUserQuery('Какие правила настройки VPN?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition-colors"
                >
                  Правила VPN
                </button>
              </div>
            </div>

            {/* Карточка ответа ассистента */}
            <DocuChatResponse
              query={userQuery}
              answerText={sampleAnswer}
              sources={chunks}
              modelUsed={selectedModel}
              isConfidentialWarning={true}
            />
          </div>
        ) : (
          /* Вкладка тестирования алгоритма чанкинга */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  Исходный текст регламента (docs/REG-SEC-2026-04.txt)
                </h3>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  CONFIDENTIAL
                </span>
              </div>
              <textarea
                readOnly
                value={SAMPLE_REGULATION_TEXT}
                rows={14}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 leading-relaxed resize-none focus:outline-none"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Символов: <strong>{SAMPLE_REGULATION_TEXT.length}</strong> | Оценка токенов кириллицы: <strong>{estimateCyrillicTokens(SAMPLE_REGULATION_TEXT)}</strong>
                </span>
                <button
                  onClick={handleTestChunking}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Пересчитать чанки
                </button>
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Сгенерированные чанки для векторной БД ({chunks.length} шт.)
                </h3>
                <span className="text-xs text-slate-500">Overlap: 80 символов</span>
              </div>
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {chunks.map((chunk, index) => (
                  <div key={chunk.chunkId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-blue-700">
                        Чанк #{index + 1} ({chunk.chunkId})
                      </span>
                      <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {chunk.tokensEstimate} токенов (~{chunk.content.length} симв.)
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans">{chunk.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
