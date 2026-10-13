import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { DocumentMeta, AccessLevel } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (newDoc: DocumentMeta) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Информационная Безопасность');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('internal');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['.pdf', '.docx', '.txt', '.md'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const sizeMb = file.size / (1024 * 1024);

    if (!allowed.includes(ext)) {
      setErrorMsg(`Недопустимый формат файла. Разрешены только: ${allowed.join(', ')}`);
      return;
    }

    if (sizeMb > 20) {
      setErrorMsg(`Файл превышает допустимый лимит 20 МБ (текущий: ${sizeMb.toFixed(1)} МБ)`);
      return;
    }

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) {
      setErrorMsg('Пожалуйста, укажите название документа и выберите файл');
      return;
    }

    const newDoc: DocumentMeta = {
      id: `DOC-NEW-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      department,
      version: '1.0',
      accessLevel,
      updatedAt: new Date().toISOString().split('T')[0],
      pagesCount: Math.ceil(Math.random() * 15) + 3,
      fileName: selectedFile.name,
      fileSizeMb: parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2)),
    };

    onAddDocument(newDoc);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setTitle('');
      setSelectedFile(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Загрузка нормативного документа</h3>
              <p className="text-[11px] text-slate-500">Автоматический парсинг и индексация в RAG-базу</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Документ успешно добавлен!</h4>
            <p className="text-xs text-slate-500">Файл разбит на чанки и готов к RAG-поиску</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Поле выбора файла */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/60 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={handleFileChange}
              />
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              {selectedFile ? (
                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} МБ
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Нажмите для выбора файла (.pdf, .docx, .md)
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Максимальный размер: 20 МБ</p>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Название регламента */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Название регламента / приказа
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Регламент удаленного доступа v3.0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Отдел и уровень допуска */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Департамент</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Информационная Безопасность">Информ. Безопасность</option>
                  <option value="Кадры и HR">Кадры и HR</option>
                  <option value="Юридический отдел">Юридический отдел</option>
                  <option value="IT & Разработка">IT & Разработка</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Гриф доступа</label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Общий (Public)</option>
                  <option value="internal">Внутренний (Internal)</option>
                  <option value="confidential">Конфиденциально (152-ФЗ)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Сохранить и индексировать
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
