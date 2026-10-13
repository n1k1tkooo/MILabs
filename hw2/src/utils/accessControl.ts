/**
 * Модуль контроля ролевого доступа (RBAC) к документам корпоративной базы знаний DocuMind AI
 * Разработан по методологии Chain-of-Thought (Шаг 1 CoT)
 */

export type UserRole = 'user' | 'manager' | 'security_officer' | 'admin';
export type AccessLevel = 'public' | 'internal' | 'confidential';

export interface UserContext {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}

export interface SecurableChunk {
  chunkId: string;
  documentId: string;
  content: string;
  accessLevel: AccessLevel;
  department: string;
  similarityScore?: number;
}

/**
 * Матрица разрешенных уровней конфиденциальности для каждой роли
 */
const ROLE_PERMISSIONS: Record<UserRole, AccessLevel[]> = {
  user: ['public'],
  manager: ['public', 'internal'],
  security_officer: ['public', 'internal', 'confidential'],
  admin: ['public', 'internal', 'confidential'],
};

/**
 * Проверяет, имеет ли пользователь право доступа к конкретному уровню конфиденциальности
 */
export function canAccessLevel(role: UserRole, level: AccessLevel): boolean {
  const allowed = ROLE_PERMISSIONS[role] || ['public'];
  return allowed.includes(level);
}

/**
 * Фильтрует чанки документов, исключая конфиденциальные данные,
 * до того как они попадут в контекст AI-модели (Zero-Leakage RAG)
 */
export function filterPermittedDocuments<T extends SecurableChunk>(
  chunks: T[],
  user: UserContext
): T[] {
  if (!chunks || chunks.length === 0) return [];

  return chunks.filter((chunk) => {
    // 1. Проверка по уровню доступа роли
    if (!canAccessLevel(user.role, chunk.accessLevel)) {
      return false;
    }

    // 2. Для внутренних документов отдела проверяем соответствие департамента
    if (chunk.accessLevel === 'internal' && user.role === 'user') {
      return chunk.department === user.department;
    }

    return true;
  });
}
