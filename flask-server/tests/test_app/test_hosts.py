import pytest

def test_get_all_hosts(client):#danny ahmad
        response = client.get("/hosts/")
        assert response.status_code == 200