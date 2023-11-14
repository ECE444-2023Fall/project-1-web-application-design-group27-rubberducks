import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
import pytest
from backend.models import Account, Host, Event, Message, Event_tag
from backend.main import create_app
from backend.config import TestConfig
from backend.exts import db

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
            msgids = [],
            profile_pic=0,
        )
        db.session.add(account1)
        db.session.commit()
        host1 = Host(
            name="Test Host 1", 
            owner=account1.uid, 
            email="test1@example.com",
            events= [],
            bio="Host bio 1",
            profile_pic=0,)
        db.session.add(host1)
        db.session.commit()


@pytest.fixture
def add_event_to_db(app, add_host_to_db): 
    with app.app_context():
        host = Host.query.first()
        
        if not host:
            return None
        
        event1 = Event(
            name="Sample Event",
            location="Sample Location",
            coords=[43.65980450000001,
            -79.39729799999999],
            description="Sample Description",
            date="2023-10-30",
            start_time= "00:00:00",
            end_time= "00:00:00",
            capacity=100,
            attendees=[],
            tags=[1, 2],
            reoccuring=0,
            date_created="2023-10-29",
            owner=host.hid,
            profile_pic=0,  
        )
        db.session.add(event1)
        db.session.commit()

        return event1  

@pytest.fixture
def add_account_to_db(app):
    with app.app_context():
        account1 = Account(
            name="Test User 1", 
            email="test1@example.com",
            password="1234",
            events = [],
            fav_events= [],
            orgs = [],
            msgids = [],
            profile_pic=0,
        )
        db.session.add(account1)
        db.session.commit()

@pytest.fixture
def add_message_to_db(app, add_account_to_db):
    with app.app_context():
        account = Account.query.first()
        
        if not account:
            return None

        message = Message(
            account_id = account.uid,
            message = "This is a test message",
            created_at = "2023-11-02",
            read = False,
            msg_type = 1,
            )
        db.session.add(message)
        db.session.commit()

@pytest.fixture
def add_multiple_messages_to_db(app):
    with app.app_context():
        account1 = Account(
            name="Test User 1", 
            email="test1@example.com",
            password="1234",
            events = [],
            fav_events= [],
            orgs = [],
            msgids = [],
            profile_pic=0,
        )
        db.session.add(account1)
        db.session.commit()

        account2 = Account(
            name="Test User 2", 
            email="test2@example.com",
            password="1234",
            events = [],
            fav_events= [],
            orgs = [],
            msgids = [],
            profile_pic=0,
        )
        db.session.add(account2)
        db.session.commit()

        message1 = Message(
            account_id = account1.uid,
            message = "1st msg for account 1",
            created_at = "2023-11-01",
            read = False,
            msg_type = 1,
            )
        db.session.add(message1)
        db.session.commit()

        # put latest message in the middle to ensure that it is not just grabbing
        # last message placed in table
        message2 = Message( 
            account_id = account1.uid,
            message = "2nd msg for account 1",
            created_at = "2023-11-03 ",
            read = False,
            msg_type = 1,
            )
        db.session.add(message2)
        db.session.commit()

        message3 = Message(
            account_id = account1.uid,
            message = "2nd msg for account 1",
            created_at = "2023-11-02 ",
            read = False,
            msg_type = 1,
            )
        db.session.add(message3)
        db.session.commit()

        message4 = Message(
            account_id = account2.uid,
            message = "1st msg for account 2",
            created_at = "2023-11-02",
            read = False,
            msg_type = 1,
            )
        db.session.add(message4)
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
            "msgids": [],
            "profile_pic":0,

        })

@pytest.fixture
def sample_message_data():
    return ({
        'msgid': 1,
        'account_id': 1, 
        'message': 'This is a test message', 
        'created_at': 'Thu, 02 Nov 2023 00:00:00 -0000',
        'read': False, 
        'msg_type': 1,
        })

@pytest.fixture
def host():
    return ({
        'hid': 1, 
        'name': 'Test Host 1', 
        'email': 'test1@example.com', 
        'bio': 'Host bio 1', 
        'events': [], 
        'owner': 1,
        'pending_transfer': False,
        'profile_pic':0,}
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
    data = {
        "name": "Sample Event",
        "location": "Sample Location",
        "coords": [43.65980450000001,
            -79.39729799999999],
        "description": "Sample Description",
        "date": "2023-10-30", 
        "start_time": "00:00:00",
        "end_time": "00:00:00",
        "capacity": 100,
        "attendees": [],
        "tags": [1, 2],
        "reoccuring": 0,
        "date_created": "2023-10-29", 
        "owner": 1,
        "profile_pic":0,  
    }
    
    data["owner"] = int(data["owner"])

    return data

@pytest.fixture
def add_event_tag_to_db(app): 
    with app.app_context():
        event_tag1 = Event_tag(
            etid="1",
            name="Sample Event Tag",
            description="Sample Description",
        )
        db.session.add(event_tag1)
        db.session.commit()

        return event_tag1  
    