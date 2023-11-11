from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from backend.models import Account
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash

accounts_ns = Namespace("accounts", description="Account operations")

account_model = accounts_ns.model(
    "Account",
    {
        "uid": fields.Integer,
        "name": fields.String,
        "email": fields.String,
        "password": fields.String,
        "events": fields.List(fields.Integer),
        "fav_events": fields.List(fields.Integer),
        "orgs": fields.List(fields.Integer),
        "msgids": fields.List(fields.Integer)
    },
)


@accounts_ns.route("/test")
class Test(Resource):
    def get(self):
        return {"message": "test"}, 404

@accounts_ns.route("/")
class Accounts(Resource):
    @accounts_ns.marshal_list_with(account_model)
    def get(self):
        return Account.query.all(), 200

    @accounts_ns.expect(account_model)
    @accounts_ns.marshal_with(account_model)
    def post(self):
        account = Account(**accounts_ns.payload)
        account.save()
        return account, 201


@accounts_ns.route("/<int:uid>")
class AccountById(Resource):
    @accounts_ns.marshal_with(account_model)
    def get(self, uid):
        return Account.query.get_or_404(uid), 200

    @accounts_ns.expect(account_model)
    @accounts_ns.marshal_with(account_model)
    def put(self, uid):
        if "password" in accounts_ns.payload:
            accounts_ns.payload["password"]= generate_password_hash(accounts_ns.payload["password"])
        account = Account.query.get_or_404(uid)
        account.update(**accounts_ns.payload)
        return account, 200

    def delete(self, uid):
        account = Account.query.get_or_404(uid)
        account.delete()
        return {"message": "account deleted"}, 200

@accounts_ns.route("/<string:email>")
class AccountByEmail(Resource):
    @accounts_ns.marshal_with(account_model)
    def get(self, email):
        account = Account.query.filter_by(email=email).first_or_404()
        return account, 200
