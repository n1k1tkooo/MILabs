#!/usr/bin/env python3
"""
Тесты исследовательской ИИ-Лаборатории DocuMind:
1. DLP-фильтрация персональных данных (Паспорт РФ, СНИЛС, Банковские карты);
2. Комплаенс матрица 152-ФЗ РФ и Приказа ФСТЭК № 21;
3. Метрики RAG Triad (Faithfulness, Relevance, Recall);
4. Топология графа знаний (25 регламентов и 5 департаментов).
"""

import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from server import (
    inspect_dlp_payload,
    COMPLIANCE_CONTROLS,
    RAG_BENCHMARK_SCENARIOS,
    RAG_BENCHMARK_BASELINES,
    build_knowledge_graph_data,
    DATABASE
)

class TestLabSecurityAndRAG(unittest.TestCase):

    def test_dlp_passport_and_snils_detection(self):
        """Проверка детекции и маскирования паспорта РФ и СНИЛС"""
        sample_text = "Сотрудник Иванов, паспорт 4515 892341, СНИЛС 123-456-789 00, направить в командировку."
        res = inspect_dlp_payload(sample_text, policy="redact")
        
        self.assertGreater(res["risk_score"], 60)
        self.assertEqual(res["risk_level"], "CRITICAL")
        self.assertEqual(res["action"], "redacted")
        self.assertFalse(res["is_blocked"])
        
        # Проверяем, что исходные ПДн замаскированы в sanitized_text
        self.assertNotIn("4515 892341", res["sanitized_text"])
        self.assertNotIn("123-456-789 00", res["sanitized_text"])
        self.assertIn("[ЗАМАСКИРОВАНО: Паспорт РФ", res["sanitized_text"])
        self.assertIn("[ЗАМАСКИРОВАНО: СНИЛС", res["sanitized_text"])

    def test_dlp_quarantine_policy_blocks_high_risk(self):
        """Проверка жесткой блокировки (Quarantine) при передаче карты МИР и секрета"""
        sample_text = "Номер карты 2200 1234 5678 9010, токен api_key=AQVN8b92kLMN_secret_prod_99214"
        res = inspect_dlp_payload(sample_text, policy="quarantine")
        
        self.assertTrue(res["is_blocked"])
        self.assertEqual(res["action"], "quarantined")
        self.assertGreaterEqual(res["risk_score"], 70)

    def test_compliance_matrix_fstec_controls(self):
        """Проверка полноты матрицы требований ФСТЭК № 21 (8 ключевых мер УЗ-1/УЗ-2)"""
        self.assertEqual(len(COMPLIANCE_CONTROLS), 8)
        codes = [c["code"] for c in COMPLIANCE_CONTROLS]
        self.assertIn("ИАФ-1", codes)
        self.assertIn("УПД-1", codes)
        self.assertIn("РСБ-1", codes)
        self.assertIn("АВЗ-1", codes)
        self.assertIn("ОЦЛ-1", codes)
        self.assertIn("ЗИС-1", codes)
        
        for c in COMPLIANCE_CONTROLS:
            self.assertEqual(c["status"], "COMPLIANT")

    def test_rag_benchmark_scenarios_integrity(self):
        """Проверка наличия 10 валидационных кейсов для RAG Triad"""
        self.assertEqual(len(RAG_BENCHMARK_SCENARIOS), 10)
        categories = set(s["category"] for s in RAG_BENCHMARK_SCENARIOS)
        self.assertIn("HR", categories)
        self.assertIn("Security", categories)
        self.assertIn("Infrastructure", categories)
        self.assertIn("DevOps", categories)
        self.assertIn("Finance", categories)

    def test_knowledge_graph_topology(self):
        """Проверка связности графа знаний (хабы + 25 документов)"""
        graph = build_knowledge_graph_data()
        self.assertGreaterEqual(graph["total_nodes"], 31) # 1 root + 5 hubs + 25 docs
        self.assertGreaterEqual(graph["total_links"], 35)
        
        node_ids = [n["id"] for n in graph["nodes"]]
        self.assertIn("hub-core", node_ids)
        self.assertIn("hub-sec", node_ids)
        self.assertIn("DOC-SEC-01", node_ids)
        self.assertIn("DOC-HR-01", node_ids)
        self.assertIn("DOC-FIN-01", node_ids)

if __name__ == "__main__":
    unittest.main()
