import pytest
from backend.models import Account, Host, Event
from datetime import datetime

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
"""

# Test Pagination #YiFeng Chen
def test_pagination(client):
    response = client.get("/events/?page=1&limit=20")
    assert response.status_code == 200
    events = response.json
    assert len(events) <= 20

# Test Create Event #YiFeng Chen
def test_create_event(client, sample_event_data):
    response = client.post("/events/all", json=sample_event_data)
    assert response.status_code == 201
    created_event = response.json
    for key, value in sample_event_data.items():
        assert created_event[key] == value

# Test Update Event #YiFeng Chen
def test_update_event(client, sample_event_data, eid):
    updated_data = sample_event_data.copy()
    updated_data['name'] = 'Updated Event Name'
    response = client.put(f"/events/{eid}", json=updated_data)
    assert response.status_code == 200
    updated_event = response.json
    assert updated_event['name'] == 'Updated Event Name'

# Test Delete Event #YiFeng Chen
def test_delete_event(client, eid):
    response = client.delete(f"/events/{eid}")
    assert response.status_code == 200
    response = client.get(f"/events/{eid}")
    assert response.status_code == 404  # Not found

# Test Event Tags Retrieval #YiFeng Chen
def test_get_event_tags(client):
    response = client.get("/events/tags")
    assert response.status_code == 200
    tags = response.json
    assert len(tags) > 0

# Test Non-existant EID #YiFeng Chen
def test_invalid_eid(client):
    response = client.get("/events/999999")
    assert response.status_code == 404

# Test upcoming events only #YiFeng Chen
def test_upcoming_filter(client):
    response = client.get("/events/?ft=1")
    assert response.status_code == 200
    events = response.json
    current_date = datetime.now().date()
    for event in events:
        event_date = datetime.strptime(event['date'], '%Y-%m-%d').date()
        assert event_date >= current_date

# Test via all filters #YiFeng Chen

def test_filter_by_name(client, name):
    response = client.get(f"/events/?name={name}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert name in event['name']

def test_filter_by_location(client, location):
    response = client.get(f"/events/?loc={location}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert event['location'] == location

def test_filter_by_start_time(client, start_time): # format "xx:xx"
    response = client.get(f"/events/?ts={start_time}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert event['start_time'] >= start_time

def test_filter_by_end_time(client, end_time): # format "xx:xx"
    response = client.get(f"/events/?te={end_time}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert event['end_time'] <= end_time

def test_filter_by_date(client, date): # format "yyyy-mm-dd"
    response = client.get(f"/events/?d={date}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert event['date'] >= date

def test_filter_by_capacity(client, capacity):
    response = client.get(f"/events/?cap={capacity}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert event['capacity'] >= capacity

def test_filter_by_capacity_reached(client):
    response = client.get("/events/?capr=1")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert len(event['attendees']) >= event['capacity']

def test_filter_by_reoccuring(client, reoccuring): # format Int
    response = client.get(f"/events/?re={reoccuring}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert event['reoccuring'] == reoccuring

def test_filter_by_tags(client, tags): #format "x, x, x..." where x is int
    response = client.get(f"/events/?tags={tags}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        for tag in tags.split(','):
            assert int(tag) in event['tags']

def test_filter_by_host(client, host):  # format "host_name"
    response = client.get(f"/events/?host={host}")
    assert response.status_code == 200
    events = response.json
    for event in events:
        assert host in event['owner_name']

# Test via each sort #YiFeng Chen

def test_sort_by_date_ascending(client):
    response = client.get("/events/?ord=0")
    assert response.status_code == 200
    events = response.json
    sorted_dates = sorted(event['date'] for event in events)
    for i, event in enumerate(events):
        assert event['date'] == sorted_dates[i]

def test_sort_by_date_descending(client):
    response = client.get("/events/?ord=1")
    assert response.status_code == 200
    events = response.json
    sorted_dates = sorted((event['date'] for event in events), reverse=True)
    for i, event in enumerate(events):
        assert event['date'] == sorted_dates[i]

def test_sort_by_creation_date_ascending(client):
    response = client.get("/events/?ord=2")
    assert response.status_code == 200
    events = response.json
    sorted_dates = sorted(event['date_created'] for event in events)
    for i, event in enumerate(events):
        assert event['date_created'] == sorted_dates[i]

def test_sort_by_creation_date_descending(client):
    response = client.get("/events/?ord=3")
    assert response.status_code == 200
    events = response.json
    sorted_dates = sorted((event['date_created'] for event in events), reverse=True)
    for i, event in enumerate(events):
        assert event['date_created'] == sorted_dates[i]

def test_sort_by_attendees_descending(client):
    response = client.get("/events/?ord=4")
    assert response.status_code == 200
    events = response.json
    sorted_attendees = sorted((len(event['attendees']) for event in events), reverse=True)
    for i, event in enumerate(events):
        assert len(event['attendees']) == sorted_attendees[i]

def test_sort_by_attendees_ascending(client):
    response = client.get("/events/?ord=5")
    assert response.status_code == 200
    events = response.json
    sorted_attendees = sorted(len(event['attendees']) for event in events)
    for i, event in enumerate(events):
        assert len(event['attendees']) == sorted_attendees[i]
"""

def test_get_all_event_tags(client): #lily li
    response = client.get("events/tags")
    assert response.status_code == 200

def test_get_event_tags_by_etid(client, add_event_tag_to_db): #lily li
    response = client.get("events/tags/1")
    assert response.status_code == 200
    