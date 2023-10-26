import unittest
from main import create_app
from config import TestConfig
from exts import db

class BaseTest(unittest.TestCase):
    def setUp(self):
        self.app=create_app(TestConfig)
        self.client=self.app.test_client(self)
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

class TestAccounts(BaseTest):
    def test_get_all_accounts(self):
        response=self.client.get("/accounts/")
        self.assertEqual(response.status_code, 200)

class TestEvents(BaseTest):          
    def test_get_all_events(self):
        response=self.client.get("/events/")
        self.assertEqual(response.status_code, 200)

class TestHosts(BaseTest):
    pass

if __name__ == "__main__":
    unittest.main()