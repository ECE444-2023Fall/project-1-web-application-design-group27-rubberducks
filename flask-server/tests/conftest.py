import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
import pytest

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
def signup():
    return ({
            "name": "Test",
            "email": "test@utoronto.ca",
            "password": "test",
        })
