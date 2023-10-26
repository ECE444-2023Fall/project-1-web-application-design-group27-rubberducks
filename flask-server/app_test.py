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
    def test_get_all_accounts(self): #danny ahmad
        response=self.client.get("/accounts/")
        self.assertEqual(response.status_code, 200)

    def test_post_account(self):#danny ahmad
        response=self.client.post("/accounts/", json={
            "name": "Test",
            "email": "test@utoronto.ca",
            "password": "test",
            "events": [],
            "fav_events": [],
            "orgs": [],
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["name"], "Test")
        self.assertEqual(response.json["email"], "test@utoronto.ca")
        self.assertEqual(response.json["password"], "test")
        self.assertEqual(response.json["events"], [])
        self.assertEqual(response.json["fav_events"], [])
        self.assertEqual(response.json["orgs"], [])

class TestEvents(BaseTest):          
    def test_get_all_events(self):#danny ahmad
        response=self.client.get("/events/")
        self.assertEqual(response.status_code, 200)

class TestHosts(BaseTest):
    def test_get_all_hosts(self):#danny ahmad
        response=self.client.get("/hosts/")
        self.assertEqual(response.status_code, 200)

class TestSignUp(BaseTest):
    def test_post_signup(self):#danny ahmad
        response=self.client.post("/auth/signup", json={
            "name": "Test",
            "email": "test@utoronto.ca",
            "password": "test",
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["message"], "user with email test@utoronto.ca created")
                         
                         

if __name__ == "__main__":
    unittest.main()