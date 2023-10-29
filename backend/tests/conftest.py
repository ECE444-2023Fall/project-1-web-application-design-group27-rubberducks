import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
import pytest
from models import Account, Host, Event
from main import create_app
from config import TestConfig
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
def add_event_to_db(app, add_host_to_db): 
    with app.app_context():
        host = Host.query.first()
        
        if not host:
            return None
        
        event1 = Event(
            name="Test Event 1",
            location="Test Location 1",
            description="Test Description 1",
            date="2023-10-29",  
            time="12:00:00",  
            capacity=100,
            attendees=[],
            tags=["TestTag1", "TestTag2"],
            reoccuring=False,
            date_created="2023-10-28",  
            owner=host.hid  
        )
        db.session.add(event1)
        db.session.commit()

        return event1  


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


@pytest.fixture
def sample_event_data():
    return {
        "name": "Sample Event",
        "location": "Sample Location",
        "description": "Sample Description",
        "date": "2023-10-30", 
        "time": "12:00:00",
        "capacity": 100,
        "attendees": [],
        "tags": ["tag1", "tag2"],
        "reoccuring": False,
        "date_created": "2023-10-29", 
        "owner": 1 
    }
