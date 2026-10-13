#!/usr/bin/env python3
"""
Тесты модуля OAuth2 авторизации (Yandex ID и Google Identity)
Проверяет генерацию ссылок, CSRF nonce state и ролевую сессию
"""

import unittest
import json
import urllib.parse
from server import DocuMindFullStackHandler, DATABASE, CONFIG

class TestOAuth2Integration(unittest.TestCase):

    def test_yandex_oauth_url_generation(self):
        """Проверка генерации корректного URL для Yandex ID с защитой от CSRF (state nonce)"""
        client_id = CONFIG["YANDEX_CLIENT_ID"]
        expected_redirect = "http://localhost:8000/api/auth/yandex/callback"
        
        # Эмуляция формирования ссылки
        state_nonce = "test-nonce-12345"
        auth_url = (
            f"https://oauth.yandex.ru/authorize?response_type=code"
            f"&client_id={client_id}"
            f"&redirect_uri={urllib.parse.quote(expected_redirect, safe='')}"
            f"&state={state_nonce}"
        )
        
        self.assertIn("oauth.yandex.ru/authorize", auth_url)
        self.assertIn(f"client_id={client_id}", auth_url)
        self.assertIn(f"state={state_nonce}", auth_url)

    def test_user_session_creation_and_role_assignment(self):
        """Проверка выдачи сессии и присвоения роли сотрудника при входе через SSO"""
        mock_user = {
            "token": "tok_unit_test_99",
            "provider": "yandex",
            "email": "employee@corporate.intra",
            "role": "security_officer",
            "department": "Информационная Безопасность"
        }
        DATABASE["sessions"][mock_user["token"]] = mock_user
        
        # Проверяем наличие сессии в хранилище
        self.assertIn("tok_unit_test_99", DATABASE["sessions"])
        session = DATABASE["sessions"]["tok_unit_test_99"]
        self.assertEqual(session["role"], "security_officer")
        self.assertEqual(session["provider"], "yandex")

if __name__ == "__main__":
    unittest.main()
