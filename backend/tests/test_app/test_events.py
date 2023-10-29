import pytest

def test_get_all_events(client):#danny ahmad
    response=client.get("/events/")
    assert response.status_code == 200


def test_get_event_by_eid(client, add_host_to_db, add_event_to_db): #lily li
    response = client.get("/events/1")
    assert response.status_code == 200