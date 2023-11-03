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

def test_get_account_by_uid(client, add_account_to_db): #lily li
      response=client.get("/accounts/1")
      assert response.status_code == 200

def test_put_account_by_uid(client, add_account_to_db, account): #lily li
      response=client.put("/accounts/1", json=account)
      assert response.status_code == 200

def test_get_account_by_email(client, add_account_to_db): #lily li
      response=client.get("/accounts/test1@example.com")
      assert response.status_code == 200