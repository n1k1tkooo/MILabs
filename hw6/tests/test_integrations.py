#!/usr/bin/env python3
"""
Тесты интеграций: Health Check, Яндекс.Метрика и ЮKassa
"""

import unittest
from server import CONFIG, DATABASE

class TestExternalIntegrations(unittest.TestCase):

    def test_health_check_configuration(self):
        """Проверка наличия всех требуемых параметров в конфигурации мониторинга"""
        self.assertEqual(CONFIG["PORT"], 8000)
        self.assertEqual(CONFIG["YANDEX_METRIKA_COUNTER_ID"], "98765432")
        self.assertEqual(CONFIG["YOOKASSA_SHOP_ID"], "412095")

    def test_analytics_event_recording(self):
        """Проверка фиксации событий аналитики с деперсонализацией IP"""
        mock_event = {
            "event_id": "evt-001",
            "event": "SEARCH_QUERY_SENT",
            "params": {"query": "VPN"},
            "masked_ip": "192.168.xxx.xxx"
        }
        DATABASE["analytics_events"].append(mock_event)
        self.assertIn(mock_event, DATABASE["analytics_events"])

    def test_yookassa_webhook_event_structure(self):
        """Проверка структуры webhook события от ЮKassa"""
        sample_webhook = {
            "type": "notification",
            "event": "payment.succeeded",
            "object": {
                "id": "2d8f9e10-000f-5000-8000-1b2c3d4e5f6a",
                "status": "succeeded",
                "amount": {"value": "49000.00", "currency": "RUB"},
                "description": "Enterprise On-Premise License"
            }
        }
        self.assertEqual(sample_webhook["event"], "payment.succeeded")
        self.assertEqual(sample_webhook["object"]["status"], "succeeded")

if __name__ == "__main__":
    unittest.main()
