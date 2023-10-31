import pytest

def test_post_signup(client, signup):#danny ahmad
        response=client.post("/auth/signup", json=signup)
        assert response.status_code == 201
        assert response.json["message"] == "user with email test@utoronto.ca created"