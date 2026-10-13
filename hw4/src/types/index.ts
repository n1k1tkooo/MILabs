/**
 * Типы и контракты данных Frontend-приложения DocuMind AI
 */

export type AccessLevel = 'public' | 'internal' | 'confidential';
export type UserRole = 'user' | 'manager' | 'security_officer' | 'admin';
export type ModelProvider = 'YandexGPT-Pro' | 'DeepSeek-V3-Local' | 'Qwen-2.5-Coder';

export interface DocumentMeta {
  id: string;
  title: string;
  department: string;
  version: string;
  accessLevel: AccessLevel;
  updatedAt: string;
  pagesCount: number;
  fileName: string;
  fileSizeMb: number;
}

export interface RegulationCitation {
  citationId: string;
  docId: string;
  docTitle: string;
  article: string;
  department: string;
  quote: string;
  accessLevel: AccessLevel;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: ModelProvider;
  citations?: RegulationCitation[];
  isConfidentialWarning?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}
