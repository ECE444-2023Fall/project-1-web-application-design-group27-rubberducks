import pytest
from models import Account, Host, Event

def test_get_all_events(client):#danny ahmad
    response=client.get("/events/")
    assert response.status_code == 200

# Test to fetch an event by its eid
def test_get_event_by_eid(client, sample_event_data, add_event_to_db):  #Kartikey Sachdeva
    response = client.get("/events/1")
    assert response.status_code == 200
    assert response.json == event

# Test to fetch an event by its name
def test_get_event_by_name(client, sample_event_data, add_event_to_db): #Kartikey Sachdeva
    response = client.get("/events/Test Event 1")
    assert response.status_code == 200
    assert response.json == event

def test_create_event_and_store_in_db(client, sample_event_data, add_host_to_db): #Kartikey Sachdeva
    response = client.post("/events/", json=sample_event_data)
    assert response.status_code == 201 

    with client.application.app_context():
        event_in_db = Event.query.filter_by(name=sample_event_data["name"]).first()
        assert event_in_db is not None
        assert event_in_db.location == sample_event_data["location"]

