import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
import pytest
from models import Account, Host
# from webtest import TestApp
from main import create_app
from config import TestConfig
# from main import db as _db
# from .factories import AccountFactory, HostFactory, EventFactory
from exts import db

@pytest.fixture()
def app():
    app = create_app(TestConfig)
    # other setup can go here
    with app.app_context():
        db.create_all()

    yield app
    # clean up / reset resources here
    with app.app_context():
        db.session.remove()
        db.drop_all()

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture
def add_host_to_db(app):
    with app.app_context():
        account1 = Account(
            name="Test User 1", 
            email="test1@example.com",
            password="1234",
            events = [],
            fav_events= [],
            orgs = [],
        )
        db.session.add(account1)
        db.session.commit()
        host1 = Host(
            name="Test Host 1", 
            owner=account1.uid, 
            email="test1@example.com",
            events= [],
            bio="Host bio 1")
        db.session.add(host1)
        db.session.commit()

@pytest.fixture
def account():
    return ({
            "name": "Test",
            "email": "test@utoronto.ca",
            "password": "test",
            "events": [],
            "fav_events": [],
            "orgs": [],
        })

@pytest.fixture
def host():
    return ({
        'hid': 1, 
        'name': 'Test Host 1', 
        'email': 'test1@example.com', 
        'bio': 'Host bio 1', 
        'events': [], 
        'owner': 1}
        )

@pytest.fixture
def signup():
    return ({
            "name": "Test",
            "email": "test@utoronto.ca",
            "password": "test",
        })

@pytest.fixture
def login():
    return ({
            "email": "test@utoronto.ca",
            "password": "test"
    })