import { describe, it, expect } from 'vitest';
import { simulateRAGQuery } from '../utils/ragSimulator';
import { MOCK_DOCUMENTS, INITIAL_USER } from '../data/mockRegulations';

describe('Тест 1: RAG-поиск и генерация ответов с цитированием (US-01, US-02)', () => {
  it('должен возвращать структурированный ответ и сноску на регламент при вопросе о VPN', () => {
    const result = simulateRAGQuery('Как настроить VPN для удаленки?', INITIAL_USER, 'YandexGPT-Pro', MOCK_DOCUMENTS);

    expect(result.text).toContain('WireGuard');
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.citations[0].docId).toBe('DOC-IT-01');
    expect(result.citations[0].article).toContain('Статья 2.1');
    expect(result.isConfidentialWarning).toBe(false);
  });

  it('должен возвращать сообщение об отсутствии информации при вопросе вне нормативной базы (защита от галлюцинаций)', () => {
    const result = simulateRAGQuery('Какая сегодня погода в Париже?', INITIAL_USER, 'YandexGPT-Pro', MOCK_DOCUMENTS);

    expect(result.text).toContain('нет информации по данному вопросу');
    expect(result.citations).toHaveLength(0);
  });
});
