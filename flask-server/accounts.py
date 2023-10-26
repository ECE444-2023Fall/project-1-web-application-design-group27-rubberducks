from flask import request
from flask_restx import Namespace, Resource, fields
from models import Account
from flask_jwt_extended import jwt_required

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
    },
)


@accounts_ns.route("/")
class Accounts(Resource):
    @accounts_ns.marshal_list_with(account_model)
    def get(self):
        return Account.query.all()

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
        return Account.query.get_or_404(uid)

    @accounts_ns.expect(account_model)
    @accounts_ns.marshal_with(account_model)
    def put(self, uid):
        account = Account.query.get_or_404(uid)
        account.update(**accounts_ns.payload)
        return account

    def delete(self, uid):
        account = Account.query.get_or_404(uid)
        account.delete()
        return {"message": "account deleted"}
