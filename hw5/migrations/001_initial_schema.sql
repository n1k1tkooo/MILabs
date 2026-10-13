-- ==============================================================================
-- Миграция 001: Инициализация схемы БД для платформы DocuMind AI
-- СУБД: PostgreSQL 16+ с расширением pgvector
-- Соответствие: 152-ФЗ РФ, разграничение прав доступа Row-Level Security (RLS)
-- ==============================================================================

-- 1. Подключение расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Расширение для семантических эмбеддингов

-- 2. Таблица департаментов компании
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблица пользователей и ролевой модели доступа
CREATE TYPE user_role_enum AS ENUM ('user', 'manager', 'security_officer', 'admin');

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'user',
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Таблица нормативных документов
CREATE TYPE access_level_enum AS ENUM ('public', 'internal', 'confidential');

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE RESTRICT,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    access_level access_level_enum NOT NULL DEFAULT 'public',
    file_name VARCHAR(255) NOT NULL,
    file_size_mb NUMERIC(6, 2) NOT NULL,
    pages_count INT NOT NULL DEFAULT 1,
    checksum_sha256 VARCHAR(64) NOT NULL,
    created_by VARCHAR(50) REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE
);

-- 5. Таблица семантических чанков документов для RAG
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id VARCHAR(50) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    char_start INT NOT NULL,
    char_end INT NOT NULL,
    tokens_estimate INT NOT NULL,
    -- Вектор эмбеддинга (1536 измерений под стандарты YandexGPT / OpenAI)
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индекс HNSW для молниеносного косинусного поиска по векторам
CREATE INDEX IF NOT EXISTS idx_chunks_embedding 
ON document_chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 6. Журнал аудита обращений и безопасности (Zero-Leakage Logs)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- SEARCH_QUERY, DOCUMENT_VIEW, RBAC_BLOCKED, UPLOAD
    resource_id VARCHAR(50),
    ip_address VARCHAR(45) NOT NULL,
    status VARCHAR(50) NOT NULL, -- SUCCESS, FORBIDDEN, ERROR
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. НАСТРОЙКА ROW-LEVEL SECURITY (RLS) ПОЛИТИК
-- ==============================================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Политика: Публичные документы видны всем авторизованным пользователям
CREATE POLICY rls_documents_public_read ON documents
    FOR SELECT
    USING (access_level = 'public');

-- Политика: Внутренние документы (internal) видны сотрудникам того же отдела
CREATE POLICY rls_documents_internal_read ON documents
    FOR SELECT
    USING (
        access_level = 'internal' AND 
        department_id = (SELECT department_id FROM users WHERE id = current_user)
    );

-- Политика: Конфиденциальные документы (152-ФЗ) видны только администраторам и ИБ
CREATE POLICY rls_documents_confidential_read ON documents
    FOR SELECT
    USING (
        access_level = 'confidential' AND 
        (SELECT role FROM users WHERE id = current_user) IN ('security_officer', 'admin')
    );

-- ==============================================================================
-- 8. ТЕСТОВЫЕ ДАННЫЕ (SEED DATA)
-- ==============================================================================

INSERT INTO departments (id, name, description) VALUES
('sec', 'Информационная Безопасность', 'Обеспечение ИБ, защита КТ и соблюдение 152-ФЗ'),
('hr', 'Кадры и HR', 'Управление персоналом, трудовые регламенты и отпуска'),
('it', 'IT & Разработка', 'Инфраструктура, разработка ПО и сетевой доступ'),
('sb', 'Служба Безопасности', 'Внутренний аудит и физическая безопасность')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, full_name, role, department_id) VALUES
('USR-001', 'alexey@documind.ru', 'Алексей Смирнов', 'user', 'it'),
('USR-002', 'marina@documind.ru', 'Марина Ковалева', 'manager', 'hr'),
('USR-003', 'dmitry@documind.ru', 'Дмитрий Волков', 'security_officer', 'sec')
ON CONFLICT (id) DO NOTHING;
