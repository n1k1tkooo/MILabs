/**
 * Клиентский SDK модуль для интеграции Frontend с Backend API DocuMind AI
 * Разработан в рамках ДЗ5 (Шаг 6)
 */

export interface DocumentItem {
  id: string;
  title: string;
  department: string;
  version: string;
  access_level: 'public' | 'internal' | 'confidential';
  updated_at: string;
  pages_count: number;
  file_name: string;
  file_size_mb: number;
}

export interface SearchResponse {
  answer: string;
  citations: {
    citation_id: string;
    doc_id: string;
    doc_title: string;
    article: string;
    quote: string;
  }[];
  is_confidential_warning: boolean;
  model_used: string;
  latency_ms?: number;
}

const API_BASE_URL = 'http://localhost:8000/api';

export class DocuMindApiClient {
  private static userRole = 'user';

  public static setUserRole(role: 'user' | 'manager' | 'security_officer' | 'admin') {
    this.userRole = role;
  }

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-User-Role': this.userRole,
    };
  }

  /**
   * Проверка доступности бэкенда
   */
  public static async checkHealth(): Promise<{ status: string; database: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Healthcheck failed: ${res.status}`);
    return res.json();
  }

  /**
   * Получение списка документов из PostgreSQL
   */
  public static async getDocuments(filters?: { department?: string; access?: string; q?: string }): Promise<DocumentItem[]> {
    const params = new URLSearchParams();
    if (filters?.department && filters.department !== 'all') params.append('department', filters.department);
    if (filters?.access && filters.access !== 'all') params.append('access', filters.access);
    if (filters?.q) params.append('q', filters.q);

    const res = await fetch(`${API_BASE_URL}/documents?${params.toString()}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  /**
   * Выполнение семантического RAG-поиска
   */
  public static async searchRegulations(query: string, model: string): Promise<SearchResponse> {
    const res = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ query, model }),
    });
    if (!res.ok) throw new Error(`Search error: ${res.status}`);
    return res.json();
  }

  /**
   * Загрузка нового документа в реестр
   */
  public static async uploadDocument(docData: {
    title: string;
    department: string;
    access_level: string;
    file_name: string;
    file_size_mb: number;
  }): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(docData),
    });
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const json = await res.json();
    return json.document;
  }
}
