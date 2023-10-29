import pytest


def test_get_all_events(client):#danny ahmad
    response=client.get("/events/")
    assert response.status_code == 200

# Test to fetch an event by its eid
def test_get_event_by_eid(client, event, add_event_to_db):  #Kartikey Sachdeva
    response = client.get("/events/1")
    assert response.status_code == 200
    assert response.json == event

# Test to fetch an event by its name
def test_get_event_by_name(client, event, add_event_to_db): #Kartikey Sachdeva
    response = client.get("/events/Test Event 1")
    assert response.status_code == 200
    assert response.json == event
