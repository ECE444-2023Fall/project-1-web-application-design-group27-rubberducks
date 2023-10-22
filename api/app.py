from flask import Flask, request
import os
import psycopg2
from dotenv import load_dotenv 

load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)


@app.route("/api/club", methods=["POST", "GET"])
def club_methods():
   if request.method == "POST":
      INSERT_CLUB = (
      "INSERT INTO std_info.clubs(name, email, bio) VALUES (%s,%s,%s) RETURNING cid; "
      )
      data = request.get_json()
      club_name = data["name"]
      club_email = data["email"]
      club_bio = data["bio"]

      with connection:
         with connection.cursor() as cursor:
            cursor.execute(INSERT_CLUB,(club_name,club_email,club_bio))
            club_id = cursor.fetchone()[0]
      return {"id":club_id, "message":f"Club {club_name} created."}, 201
   elif request.method == "GET":
      GET_CLUB = (
      "SELECT * FROM std_info.clubs WHERE cid = %s; "
      )

      data = request.get_json()
      cid = data["cid"]

      with connection:
         with connection.cursor() as cursor:
            cursor.execute(GET_CLUB,(cid,))
            club_info = cursor.fetchone()
            club_name = club_info[0]
            club_email = club_info[1]
            club_bio = club_info[2]
      return {"name":club_name, "email":club_email, "bio":club_bio}, 201

@app.route("/api/event", methods=["POST", "GET"])
def event_methods():
   if request.method == "POST":
      INSERT_CLUB = (
      "INSERT INTO std_info.events(name, date, location, description, capacity) VALUES (%s,%s,%s,%s,%s) RETURNING eid; "
      )
      data = request.get_json()
      event_name = data["name"]
      event_date = data["date"]
      event_location = data["location"]
      event_description = data["description"]
      event_capacity = data["capacity"]

      with connection:
         with connection.cursor() as cursor:
            cursor.execute(INSERT_CLUB,(event_name,event_date,event_location,event_description,event_capacity))
            event_id = cursor.fetchone()[0]
      return {"id":event_id, "message":f"Event {event_name} created."}, 201
   elif request.method == "GET":
      GET_EVENT = (
      "SELECT * FROM std_info.events WHERE eid = %s; "
      )

      data = request.get_json()
      eid = data["eid"]

      with connection:
         with connection.cursor() as cursor:
            cursor.execute(GET_EVENT,(eid,))
            event_info = cursor.fetchone()
            event_name = event_info[0]
            event_date = event_info[1]
            event_location = event_info[2]
            event_description = event_info[3]
            event_capacity = event_info[4]
      return {"name":event_name, "date":event_date, "location":event_location, "description":event_description,"capacity":event_capacity}, 201

@app.route("/api/account", methods=["GET", "POST"])
def account_methods():
    if request.method == "GET":
        GET_ACCOUNT = (
            "SELECT * FROM std_info.account WHERE uid = %s; "
        )

        data = request.get_json()
        uid = data["uid"]

        with connection:
            with connection.cursor() as cursor:
                cursor.execute(GET_ACCOUNT, (uid,))
                account_info = cursor.fetchone()
                account_name = account_info[0]
                account_password = account_info[1]

        return {"name": account_name, "password": account_password}

    elif request.method == "POST":
        INSERT_ACCOUNT = (
            "INSERT INTO std_info.account (name, password, email) "
            "VALUES (%s, %s, %s) RETURNING uid;"
        )

        data = request.get_json()
        account_name = data["name"]
        account_password = data["password"]
        account_email = data["email"]

        with connection:
            with connection.cursor() as cursor:
                cursor.execute(INSERT_ACCOUNT, (account_name, account_password, account_email))
                account_id = cursor.fetchone()[0]

        return {"id": account_id, "message": f"Account {account_name} created."}, 201
   

if __name__ == "__main__":
    app.run(debug=True)