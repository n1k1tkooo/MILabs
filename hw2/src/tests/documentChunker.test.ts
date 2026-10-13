import { describe, it, expect } from 'vitest';
import { 
  chunkEnterpriseDocument, 
  estimateCyrillicTokens, 
  DocumentMetadata 
} from '../../hw1/src/utils/documentChunker';

const MOCK_METADATA: DocumentMetadata = {
  id: 'DOC-TEST-001',
  title: 'Тестовый регламент обработки персональных данных',
  department: 'Юридический отдел',
  version: '1.0',
  accessLevel: 'internal',
};

describe('Модуль семантического чанкинга регламентов (documentChunker)', () => {
  it('должен корректно оценивать токены для русскоязычного текста по коэффициенту 3.2', () => {
    const text = 'Тестовое предложение на русском языке.';
    const tokens = estimateCyrillicTokens(text);
    expect(tokens).toBe(Math.ceil(text.length / 3.2));
  });

  it('должен возвращать пустой массив при передаче пустой строки', () => {
    const chunks = chunkEnterpriseDocument('', MOCK_METADATA);
    expect(chunks).toEqual([]);
  });

  it('должен сохранять метаданные документа в каждом сгенерированном чанке', () => {
    const sampleText = `Пункт 1. Общие положения регламента безопасности компании.
    
Пункт 2. Все пароли должны содержать не менее 12 символов, включая цифры и спецсимволы.

Пункт 3. Запрещается передача токенов авторизации сторонним лицам.`;

    const chunks = chunkEnterpriseDocument(sampleText, MOCK_METADATA, {
      chunkSize: 120,
      chunkOverlap: 30,
    });

    expect(chunks.length).toBeGreaterThan(0);
    chunks.forEach((chunk) => {
      expect(chunk.metadata.id).toBe(MOCK_METADATA.id);
      expect(chunk.metadata.department).toBe(MOCK_METADATA.department);
      expect(chunk.metadata.accessLevel).toBe(MOCK_METADATA.accessLevel);
      expect(chunk.chunkId).toContain(MOCK_METADATA.id);
    });
  });

  it('должен обеспечивать перекрытие (overlap) между соседними чанками', () => {
    const longText = 'А'.repeat(250) + ' ' + 'Б'.repeat(250);
    const chunks = chunkEnterpriseDocument(longText, MOCK_METADATA, {
      chunkSize: 200,
      chunkOverlap: 50,
    });

    expect(chunks.length).toBeGreaterThanOrEqual(2);
    // Проверяем, что начало второго чанка раньше, чем конец первого
    expect(chunks[1].charStart).toBeLessThan(chunks[0].charEnd);
  });
});
