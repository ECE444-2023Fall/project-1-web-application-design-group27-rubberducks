from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from backend.models import Account
#from models import Account
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash

# Create a namespace for account operations
accounts_ns = Namespace("accounts", description="Account operations")

# Define the account data model using Flask-RESTx fields
account_model = accounts_ns.model(
    "Account",
    {
        "uid": fields.Integer,           # Unique identifier for the account
        "name": fields.String,           # Account holder's name
        "email": fields.String,          # Account holder's email
        "password": fields.String,       # Account password (hashed)
        "events": fields.List(fields.Integer),    # List of event IDs associated with the account
        "fav_events": fields.List(fields.Integer),    # List of favorite event IDs
        "orgs": fields.List(fields.Integer),         # List of organization IDs associated with the account
        "msgids": fields.List(fields.Integer),       # List of message IDs related to the account
        "profile_pic": fields.Integer
    },
)

# Define a test route to check if the API is working
@accounts_ns.route("/test")
class Test(Resource):
    def get(self):
        return {"message": "test"}, 404

# Define routes for managing accounts
@accounts_ns.route("/")
class Accounts(Resource):
    @accounts_ns.marshal_list_with(account_model)
    def get(self):
        # Retrieve all accounts and return as a list
        return Account.query.all(), 200

    @accounts_ns.expect(account_model)
    @accounts_ns.marshal_with(account_model)
    def post(self):
        # Create a new account based on the provided data
        account = Account(**accounts_ns.payload)
        account.save()
        return account, 201

# Define routes for managing accounts by their unique identifier (uid)
@accounts_ns.route("/<int:uid>")
class AccountById(Resource):
    @accounts_ns.marshal_with(account_model)
    def get(self, uid):
        # Retrieve an account by its UID
        return Account.query.get_or_404(uid), 200

    @accounts_ns.expect(account_model)
    @accounts_ns.marshal_with(account_model)
    def put(self, uid):
        if "password" in accounts_ns.payload:
            # Hash the account password before updating
            accounts_ns.payload["password"] = generate_password_hash(accounts_ns.payload["password"])
        account = Account.query.get_or_404(uid)
        account.update(**accounts_ns.payload)
        return account, 200

    def delete(self, uid):
        # Delete an account by its UID
        account = Account.query.get_or_404(uid)
        account.delete()
        return {"message": "account deleted"}, 200

# Define a route to retrieve an account by email
@accounts_ns.route("/<string:email>")
class AccountByEmail(Resource):
    @accounts_ns.marshal_with(account_model)
    def get(self, email):
        # Retrieve an account by its email
        account = Account.query.filter_by(email=email).first_or_404()
        return account, 200
