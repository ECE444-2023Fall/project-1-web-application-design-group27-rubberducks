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

"""
# test get all hosts #YiFeng Chen
def test_get_all_hosts(client):
    response = client.get("/hosts/")
    assert response.status_code == 200
    hosts = response.json
    assert isinstance(hosts, list)
    assert len(hosts) > 0

# test sort hosts alphabetically #YiFeng Chen
def test_sort_hosts_alphabetically(client):
    response = client.get("/hosts/?ord=0")
    assert response.status_code == 200
    hosts = response.json
    sorted_names = sorted(host['name'] for host in hosts)
    for i, host in enumerate(hosts):
        assert host['name'] == sorted_names[i]

# test sort hosts by number of events #YiFeng Chen
def test_sort_hosts_by_event_count(client):
    response = client.get("/hosts/?ord=1")
    assert response.status_code == 200
    hosts = response.json
    sorted_event_counts = sorted((len(host['events']) for host in hosts), reverse=True)
    for i, host in enumerate(hosts):
        assert len(host['events']) == sorted_event_counts[i]
"""
