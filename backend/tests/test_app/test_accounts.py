import pytest

def test_get_all_accounts(client): #danny ahmad
        response=client.get("/accounts/")
        assert response.status_code == 200

def test_post_account(client, account):#danny ahmad
    response=client.post("/accounts/", json=account)
    assert response.status_code == 201
    assert response.json["name"] == "Test"
    assert response.json["email"] == "test@utoronto.ca"
    assert response.json["password"] == "test"
    assert response.json["events"] == []
    assert response.json["fav_events"] == []
    assert response.json["orgs"] == []

def test_get_nonexistent_account(client): #Ruoyi Xie
    response = client.get("/accounts/9999")
    assert response.status_code == 404
    assert "error" in response.json
