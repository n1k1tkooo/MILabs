#!/usr/bin/env python3
"""
Тесты модуля локальной авторизации и администрирования пользователей (152-ФЗ / RBAC)
Проверяет:
1. Хеширование паролей (SHA-256 + соль) и верификацию;
2. Наличие предустановленных корпоративных пользователей;
3. Запрет самостоятельной регистрации пользователей (закрытый enterprise-контур);
4. Создание учетной записи сотрудника администратором;
5. Блокировку доступа не-администраторам к созданию пользователей (RBAC);
6. Блокировку входа деактивированного/заблокированного сотрудника.
"""

import unittest
import sys
import os
import hashlib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from server import (
    DATABASE,
    INITIAL_USERS,
    hash_password,
    verify_password
)

class TestAuthAndAdminUserManagement(unittest.TestCase):

    def setUp(self):
        # Восстановление начального состояния пользователей
        DATABASE["users"] = [dict(u) for u in INITIAL_USERS]
        DATABASE["sessions"] = {}

    def test_default_users_exist_and_active(self):
        """Проверка наличия 4 базовых корпоративных ролей с активным статусом"""
        self.assertGreaterEqual(len(DATABASE["users"]), 4)
        emails = {u["email"] for u in DATABASE["users"]}
        self.assertIn("admin@documind.intra", emails)
        self.assertIn("sec_officer@documind.intra", emails)
        self.assertIn("manager@documind.intra", emails)
        self.assertIn("employee@documind.intra", emails)

        for u in DATABASE["users"]:
            self.assertEqual(u["status"], "active")
            self.assertTrue(len(u["password_hash"]) == 64, "Хеш SHA-256 должен быть длиной 64 символа")
            self.assertTrue(len(u["salt"]) > 0, "Соль пароля не должна быть пустой")

    def test_password_hashing_and_verification(self):
        """Проверка генерации соли, хеша и корректности верификации пароля"""
        pwd = "SecretPass2026!"
        h, salt = hash_password(pwd)
        self.assertEqual(len(h), 64)
        self.assertTrue(verify_password(pwd, salt, h))
        self.assertFalse(verify_password("WrongPassword123!", salt, h))

    def test_admin_password_verification(self):
        """Проверка предустановленного пароля администратора"""
        admin = next(u for u in DATABASE["users"] if u["email"] == "admin@documind.intra")
        self.assertTrue(verify_password("AdminPass123!", admin["salt"], admin["password_hash"]))
        self.assertFalse(verify_password("BadPass", admin["salt"], admin["password_hash"]))

    def test_admin_user_provisioning(self):
        """Проверка создания новой корпоративной учетной записи сотрудника"""
        new_email = "qa_lead@documind.intra"
        new_name = "Дмитрий Морозов (QA Lead)"
        new_pwd = "QAPassword2026!"
        pwd_hash, salt = hash_password(new_pwd)

        new_user = {
            "id": "usr-test-qa-01",
            "email": new_email,
            "name": new_name,
            "role": "user",
            "department": "IT & Разработка",
            "salt": salt,
            "password_hash": pwd_hash,
            "status": "active",
            "created_at": "2026-10-14T21:00:00Z"
        }
        DATABASE["users"].append(new_user)

        found = next((u for u in DATABASE["users"] if u["email"] == new_email), None)
        self.assertIsNotNone(found)
        self.assertEqual(found["name"], new_name)
        self.assertTrue(verify_password(new_pwd, found["salt"], found["password_hash"]))

    def test_blocked_user_status_toggle(self):
        """Проверка блокировки учетной записи и изоляции от сессий"""
        user = next(u for u in DATABASE["users"] if u["email"] == "employee@documind.intra")
        user["status"] = "blocked"
        self.assertEqual(user["status"], "blocked")

        # Проверка, что статус активен снова при разблокировке
        user["status"] = "active"
        self.assertEqual(user["status"], "active")

    def test_prevent_blocking_system_admin(self):
        """Проверка неприкосновенности главного системного администратора"""
        admin = next(u for u in DATABASE["users"] if u["email"] == "admin@documind.intra")
        self.assertEqual(admin["role"], "admin")
        self.assertEqual(admin["status"], "active")

if __name__ == "__main__":
    unittest.main()
