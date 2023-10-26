import pytest

def test_get_all_events(client):#danny ahmad
    response=client.get("/events/")
    assert response.status_code == 200