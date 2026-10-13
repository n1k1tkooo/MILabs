/**
 * Утилита для семантического разбиения текста нормативных документов компании 
 * на чанки (chunks) с перекрытием (overlap) для RAG-пайплайна под российские и OpenSource LLM (YandexGPT, DeepSeek, Qwen).
 */

export interface DocumentMetadata {
  id: string;
  title: string;
  department: string;
  version: string;
  accessLevel: 'public' | 'internal' | 'confidential';
}

export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  content: string;
  charStart: number;
  charEnd: number;
  tokensEstimate: number;
  metadata: DocumentMetadata;
}

export interface ChunkingOptions {
  chunkSize: number;       // Рекомендуемый размер чанка в символах (например, 1000)
  chunkOverlap: number;    // Перекрытие в символах (например, 200)
  separatorPatterns?: RegExp[]; // Разделители: абзацы, статьи, пункты
}

const DEFAULT_SEPARATORS: RegExp[] = [
  /\n\s*\n/,               // Двойной перенос строки (абзац)
  /(?<=\.)\s+(?=[А-ЯA-Z0-9])/, // Точка с последующей заглавной буквой
  /\n/,                    // Одинарный перенос строки
  /\s+/,                   // Пробел
];

/**
 * Оценивает количество токенов (эвристика: ~3.2 символа на токен для кириллицы в токенизаторах YandexGPT/Qwen/DeepSeek)
 */
export function estimateCyrillicTokens(text: string): number {
  return Math.ceil(text.length / 3.2);
}

/**
 * Разбивает текст корпоративного регламента на смысловые блоки с перекрытием
 */
export function chunkEnterpriseDocument(
  rawText: string,
  metadata: DocumentMetadata,
  options: Partial<ChunkingOptions> = {}
): DocumentChunk[] {
  const chunkSize = options.chunkSize ?? 1000;
  const chunkOverlap = options.chunkOverlap ?? 200;

  if (!rawText || rawText.trim().length === 0) {
    return [];
  }

  // Очистка от мусорных переносов строк и нормализация пробелов
  const cleanText = rawText.replace(/\r\n/g, '\n').trim();
  const chunks: DocumentChunk[] = [];

  let startIndex = 0;
  let chunkCounter = 1;

  while (startIndex < cleanText.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex >= cleanText.length) {
      endIndex = cleanText.length;
    } else {
      // Ищем ближайший естественный разделитель (конец абзаца или предложения)
      const lookbackZone = cleanText.substring(
        Math.max(startIndex, endIndex - 150),
        Math.min(cleanText.length, endIndex + 100)
      );

      let splitPoint = -1;
      for (const sep of DEFAULT_SEPARATORS) {
        const match = lookbackZone.search(sep);
        if (match !== -1) {
          splitPoint = Math.max(startIndex, endIndex - 150) + match;
          break;
        }
      }

      if (splitPoint > startIndex && splitPoint < cleanText.length) {
        endIndex = splitPoint;
      }
    }

    const chunkContent = cleanText.substring(startIndex, endIndex).trim();

    if (chunkContent.length > 0) {
      chunks.push({
        chunkId: `${metadata.id}_chunk_${chunkCounter++}`,
        documentId: metadata.id,
        content: chunkContent,
        charStart: startIndex,
        charEnd: endIndex,
        tokensEstimate: estimateCyrillicTokens(chunkContent),
        metadata,
      });
    }

    if (endIndex >= cleanText.length) {
      break;
    }

    // Сдвиг с учетом перекрытия (overlap)
    startIndex = Math.max(startIndex + 1, endIndex - chunkOverlap);
  }

  return chunks;
}

/**
 * Формирует строгий системный контекст для LLM (YandexGPT / DeepSeek / Qwen)
 * с защитой от галлюцинаций и цитированием регламентов
 */
export function buildEnterpriseRAGPrompt(
  userQuery: string,
  relevantChunks: DocumentChunk[]
): string {
  const contextFormatted = relevantChunks
    .map(
      (chunk, idx) =>
        `[Источник ${idx + 1}]: Документ "${chunk.metadata.title}" (Отдел: ${chunk.metadata.department}, Версия: ${chunk.metadata.version}, Уровень доступа: ${chunk.metadata.accessLevel})\nСодержание:\n"${chunk.content}"`
    )
    .join('\n\n---\n\n');

  return `Ты — корпоративный AI-ассистент "DocuMind AI". Твоя задача — отвечать на вопросы сотрудников строго на основе предоставленных регламентов и внутренних документов компании.

ПРАВИЛА БЕЗОПАСНОСТИ И ОТВЕТА:
1. Используй ТОЛЬКО факты из контекста ниже. Не выдумывай информацию.
2. Если в контексте нет прямого ответа, напиши: "В доступных регламентах компании нет информации по данному вопросу. Пожалуйста, обратитесь в соответствующий департамент".
3. В конце каждого тезиса обязательно указывай ссылку на источник в формате [Источник N, Документ].
4. Не разглашай конфиденциальные данные сотрудникам без соответствующего уровня допуска.

КОНТЕКСТ РЕГЛАМЕНТОВ:
${contextFormatted}

ВОПРОС СОТРУДНИКА:
${userQuery}

ОТВЕТ:`;
}
