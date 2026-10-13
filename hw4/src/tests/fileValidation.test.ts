import { describe, it, expect } from 'vitest';

/**
 * Валидатор файлов для загрузки нормативных документов
 */
export function validateUploadFile(fileName: string, sizeBytes: number): { isValid: boolean; error?: string } {
  const allowed = ['.pdf', '.docx', '.txt', '.md'];
  const ext = '.' + fileName.split('.').pop()?.toLowerCase();
  const sizeMb = sizeBytes / (1024 * 1024);

  if (!allowed.includes(ext)) {
    return {
      isValid: false,
      error: `Недопустимый формат файла ${ext}. Разрешены: ${allowed.join(', ')}`,
    };
  }

  if (sizeMb > 20) {
    return {
      isValid: false,
      error: `Файл превышает лимит 20 МБ (текущий: ${sizeMb.toFixed(1)} МБ)`,
    };
  }

  return { isValid: true };
}

describe('Тест 3: Валидация загружаемых регламентов (US-03, FR-2.2)', () => {
  it('должен успешно валидировать корректный PDF файл размером 5 МБ', () => {
    const res = validateUploadFile('reglament_security.pdf', 5 * 1024 * 1024);
    expect(res.isValid).toBe(true);
    expect(res.error).toBeUndefined();
  });

  it('должен отклонять исполняемые файлы .exe или архивы .zip', () => {
    const res = validateUploadFile('malware_script.exe', 1024 * 1024);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Недопустимый формат');
  });

  it('должен отклонять файлы размером свыше 20 МБ', () => {
    const res = validateUploadFile('huge_archive.pdf', 25 * 1024 * 1024);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('превышает лимит 20 МБ');
  });
});
