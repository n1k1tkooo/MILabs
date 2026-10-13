import React, { useState, useMemo } from 'react';
import { Menu, ShieldCheck, Upload, Building2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { DocumentRegistryView } from './components/DocumentRegistryView';
import { UploadModal } from './components/UploadModal';
import { SourceModal } from './components/SourceModal';
import { 
  DocumentMeta, 
  ChatMessage, 
  ModelProvider, 
  RegulationCitation, 
  CurrentUser 
} from './types';
import { INITIAL_USER, MOCK_DOCUMENTS } from './data/mockRegulations';
import { simulateRAGQuery } from './utils/ragSimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'docs'>('chat');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedModel, setSelectedModel] = useState<ModelProvider>('YandexGPT-Pro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<RegulationCitation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Состояние документов и пользователя
  const [documents, setDocuments] = useState<DocumentMeta[]>(MOCK_DOCUMENTS);
  const [currentUser] = useState<CurrentUser>(INITIAL_USER);

  // Состояние сообщений чата
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Здравствуйте, Алексей! Я корпоративный ассистент DocuMind AI. Задайте вопрос по регламентам информационной безопасности, правилам отпусков или процедурам компании.',
      timestamp: '10:00',
      modelUsed: 'YandexGPT-Pro',
    },
  ]);

  // Подсчет документов по отделам
  const departmentCounts = useMemo(() => {
    const list = [
      { id: 'all', label: 'Все регламенты', count: documents.length },
      { id: 'Информационная Безопасность', label: 'Информ. Безопасность', count: 0 },
      { id: 'Кадры и HR', label: 'Кадры и HR', count: 0 },
      { id: 'Служба Безопасности', label: 'Служба Безопасности', count: 0 },
      { id: 'IT & Разработка', label: 'IT & Разработка', count: 0 },
    ];
    documents.forEach((doc) => {
      const found = list.find((d) => d.id === doc.department);
      if (found) found.count++;
    });
    return list;
  }, [documents]);

  const handleSendMessage = (query: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Имитация асинхронного RAG-запроса через модель
    setTimeout(() => {
      const ragResult = simulateRAGQuery(query, currentUser, selectedModel, documents);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: ragResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: ragResult.modelUsed,
        citations: ragResult.citations,
        isConfidentialWarning: ragResult.isConfidentialWarning,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 800);
  };

  const handleAddDocument = (newDoc: DocumentMeta) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. Боковой сайдбар */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedDepartment={selectedDepartment}
        onDepartmentSelect={setSelectedDepartment}
        user={currentUser}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        departments={departmentCounts}
      />

      {/* 2. Основная рабочая область */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Верхняя навигационная плашка (Header) */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Открыть меню навигации"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900">DocuMind AI Workspace</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  152-ФЗ ЗАЩИТА
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Корпоративная база нормативных актов компании
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Контур On-premise активен</span>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Загрузить регламент</span>
              <span className="sm:hidden">Загрузить</span>
            </button>
          </div>
        </header>

        {/* 3. Переключатель контента: Чат или Реестр */}
        {activeTab === 'chat' ? (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            onOpenCitation={setActiveCitation}
          />
        ) : (
          <DocumentRegistryView
            documents={documents}
            selectedDepartment={selectedDepartment}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onSelectDocument={(doc) => {
              setActiveCitation({
                citationId: 'cit-preview',
                docId: doc.id,
                docTitle: doc.title,
                article: 'Общие положения регламента',
                department: doc.department,
                quote: `Документ "${doc.title}" зарегистрирован в реестре компании. Версия: ${doc.version}. Гриф доступа: ${doc.accessLevel.toUpperCase()}.`,
                accessLevel: doc.accessLevel,
              });
            }}
          />
        )}
      </div>

      {/* 4. Модальные окна */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddDocument={handleAddDocument}
      />

      <SourceModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />
    </div>
  );
}
