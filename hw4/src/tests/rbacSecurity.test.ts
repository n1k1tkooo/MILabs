import { describe, it, expect } from 'vitest';
import { simulateRAGQuery } from '../utils/ragSimulator';
import { MOCK_DOCUMENTS, INITIAL_USER } from '../data/mockRegulations';
import { CurrentUser } from '../types';

describe('Тест 2: Ролевая модель доступа RBAC и комплаенс 152-ФЗ (US-04)', () => {
  it('должен блокировать доступ к конфиденциальным данным для пользователя с ролью user', () => {
    const regularUser: CurrentUser = {
      ...INITIAL_USER,
      role: 'user',
    };

    const result = simulateRAGQuery('Покажи зарплаты директора и штатное расписание', regularUser, 'YandexGPT-Pro', MOCK_DOCUMENTS);

    expect(result.text).toContain('информация по данному вопросу отсутствует или относится к уровню ограниченного доступа');
    expect(result.citations).toHaveLength(0);
    expect(result.isConfidentialWarning).toBe(true);
  });

  it('должен разрешать доступ к общедоступным документам по 152-ФЗ для всех ролей', () => {
    const result = simulateRAGQuery('Какие правила обработки персональных данных по 152-ФЗ?', INITIAL_USER, 'DeepSeek-V3-Local', MOCK_DOCUMENTS);

    expect(result.text).toContain('Федеральным законом № 152-ФЗ');
    expect(result.citations.length).toBeGreaterThan(0);
    expect(result.citations[0].docId).toBe('DOC-SEC-02');
  });
});
