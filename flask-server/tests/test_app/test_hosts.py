import pytest

def test_get_all_hosts(client):#danny ahmad
        response = client.get("/hosts/")
        assert response.status_code == 200

def test_get_host_by_hid(client, host, add_host_to_db):#Chrstian McIntosh Clarke
        response = client.get("/hosts/1")
        assert response.status_code == 200
        assert response.json == host

def test_get_host_by_name(client, host, add_host_to_db):#Chrstian McIntosh Clarke
        response = client.get("/hosts/Test Host 1")
        assert response.status_code == 200
        assert response.json == host