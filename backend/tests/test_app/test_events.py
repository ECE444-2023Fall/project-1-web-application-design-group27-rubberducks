import pytest
from models import Account, Host, Event

def test_get_all_events(client):#danny ahmad
    response=client.get("/events/all")
    assert response.status_code == 200

# Test to fetch an event by its eid
def test_get_event_by_eid(client, sample_event_data, add_event_to_db):  #Kartikey Sachdeva 
    response = client.get("/events/1")
    assert response.status_code == 200

    expected_data = sample_event_data.copy()  
    returned_data = response.json

    expected_data['eid'] = 1

    for key in expected_data.keys():
        assert key in returned_data, f"Key {key} not found in response."
        assert expected_data[key] == returned_data[key], f"Mismatch in key {key}. Expected {expected_data[key]}, but got {returned_data[key]}."


# # Test to fetch an event by its name
# def test_get_event_by_name(client, sample_event_data, add_event_to_db): #Kartikey Sachdeva
#     response = client.get("/events/Sample Event")
#     print(response.json)
#     assert response.status_code == 200
#     assert response.json == sample_event_data

# def test_create_event_and_store_in_db(client, sample_event_data, add_host_to_db): #Kartikey Sachdeva
#     response = client.post("/events/", json=sample_event_data)
#     assert response.status_code == 201 

#     with client.application.app_context():
#         event_in_db = Event.query.filter_by(name=sample_event_data["name"]).first()
#         assert event_in_db is not None
#         assert event_in_db.location == sample_event_data["location"]

