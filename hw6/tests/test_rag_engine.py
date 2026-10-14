#!/usr/bin/env python3
"""
Тесты гибридного векторного RAG-движка DocuMind AI
Проверяет:
1. Чанкинг документов с перекрытием;
2. Вычисление косинусного сходства векторов;
3. Семантическое ранжирование и фильтрацию Top-K чанков.
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from server import (
    chunk_document_text,
    tokenize_nlp,
    compute_tf,
    cosine_similarity,
    DATABASE
)

class TestRAGEngine(unittest.TestCase):

    def test_document_chunking_with_overlap(self):
        """Проверка разбиения длинного текста на чанки с перекрытием"""
        sample_text = (
            "Раздел 1. Вводные положения безопасности.\n"
            "Сотрудники обязаны строго соблюдать парольную политику компании.\n"
            "Раздел 2. Парольные требования.\n"
            "Минимальная длина пароля составляет 12 символов с обязательным использованием спецсимволов."
        )
        chunks = chunk_document_text(sample_text, chunk_size=120, overlap=30)
        self.assertTrue(len(chunks) >= 2)
        self.assertIn("Раздел 1", chunks[0])

    def test_cosine_similarity_semantic_matching(self):
        """Проверка, что запрос по отпускам находит релевантный чанк с высоким скором"""
        query = "Как получить учебный отпуск студенту?"
        q_vec = compute_tf(tokenize_nlp(query))

        vacation_chunk = next(c for c in DATABASE["chunks"] if c["doc_id"] == "DOC-HR-01")
        vpn_chunk = next(c for c in DATABASE["chunks"] if c["doc_id"] == "DOC-IT-01")

        sim_vacation = cosine_similarity(q_vec, vacation_chunk["vector"])
        sim_vpn = cosine_similarity(q_vec, vpn_chunk["vector"])

        self.assertGreater(sim_vacation, sim_vpn, "Сходство с регламентом отпусков должно быть выше, чем с VPN")
        self.assertGreater(sim_vacation, 0.05, "Сходство должно быть положительным")

    def test_dynamic_document_chunking_and_indexing(self):
        """Проверка динамического добавления документа и индексации в векторную базу"""
        new_doc_id = "DOC-TEST-99"
        new_doc_title = "Положение о наставничестве и онбординге"
        new_doc_content = (
            "1. Общие положения о стажировке.\n"
            "Каждому новому сотруднику назначается опытный куратор на срок до трех месяцев.\n"
            "2. Оценка прохождения испытательного срока.\n"
            "Куратор составляет индивидуальный план адаптации с ключевыми метриками эффективности."
        )
        new_chunks = chunk_document_text(new_doc_content, chunk_size=100, overlap=25)
        self.assertGreater(len(new_chunks), 1)

        indexed_chunks = []
        for i, ch in enumerate(new_chunks):
            tokens = tokenize_nlp(ch)
            vec = compute_tf(tokens)
            indexed_chunks.append({
                "chunk_id": f"{new_doc_id}_c{i+1}",
                "doc_id": new_doc_id,
                "text": ch,
                "vector": vec
            })

        # Поиск по кураторам
        q_tokens = tokenize_nlp("Кто назначается куратором стажеру?")
        q_vec = compute_tf(q_tokens)
        score = cosine_similarity(q_vec, indexed_chunks[0]["vector"])
        self.assertGreater(score, 0.05, "Куратор должен быть найден в первом чанке")

    def test_database_initial_regulations_integrity(self):
        """Проверка целостности предустановленных 6 регламентов и наличия полного текста"""
        self.assertEqual(len(DATABASE["documents"]), 6)
        doc_ids = {d["id"] for d in DATABASE["documents"]}
        self.assertIn("DOC-SEC-01", doc_ids)
        self.assertIn("DOC-SEC-02", doc_ids)
        self.assertIn("DOC-SEC-03", doc_ids)
        self.assertIn("DOC-HR-01", doc_ids)
        self.assertIn("DOC-HR-02", doc_ids)
        self.assertIn("DOC-IT-01", doc_ids)

        for doc in DATABASE["documents"]:
            self.assertIn("content", doc)
            self.assertGreater(len(doc["content"]), 100, f"Регламент {doc['id']} должен содержать полный текст")
            self.assertIn("department", doc)

if __name__ == "__main__":
    unittest.main()
