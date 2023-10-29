import pytest
from models import Account, Host, Event

def test_create_event_and_store_in_db(client, sample_event_data, add_host_to_db): #Kartikey Sachdeva
    response = client.post("/events/", json=sample_event_data)
    assert response.status_code == 201 

    with client.application.app_context():
        event_in_db = Event.query.filter_by(name=sample_event_data["name"]).first()
        assert event_in_db is not None
        assert event_in_db.location == sample_event_data["location"]

