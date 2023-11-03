# Test to fetch all messages
def test_get_all_messages(client):
    response = client.get("/messages/")
    assert response.status_code == 200

# Test to fetch a message by its msgid
def test_get_message_by_msgid(client, sample_message_data, add_message_to_db):
    response = client.get("/messages/1")
    assert response.status_code == 200

    expected_data = sample_message_data.copy()
    returned_data = response.json

    expected_data['msgid'] = 1

    for key in expected_data.keys():
        assert key in returned_data, f"Key {key} not found in response."
        assert expected_data[key] == returned_data[key], f"Mismatch in key {key}. Expected {expected_data[key]}, but got {returned_data[key]}."

# Test to fetch messages by account id
def test_get_messages_by_account(client, sample_message_data, add_message_to_db):
    response = client.get("/messages/account/1")
    assert response.status_code == 200
    assert response.json == [sample_message_data]

# Test to fetch all messages for account 1
def test_get_all_messages_for_account1(client, add_multiple_messages_to_db):
    response = client.get("/messages/account/1")
    assert response.status_code == 200
    messages = response.json
    
    assert len(messages) == 3
    for message in messages:
        assert message["account_id"] == 1

# Test to fetch the latest message for account 1
def test_get_latest_message_for_account1(client, add_multiple_messages_to_db):
    response = client.get("/messages/account/1/latest")
    assert response.status_code == 200
    latest_message = response.json

    assert latest_message["created_at"] == "Fri, 03 Nov 2023 00:00:00 -0000"