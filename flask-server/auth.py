from flask import request
from flask_restx import Namespace, Resource, fields
from models import Account
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
)

auth_ns = Namespace("auth", description="Authentication operations")


signup_model = auth_ns.model(
    "SignUp",
    {
        "name": fields.String,
        "email": fields.String,
        "password": fields.String,
    },
)

login_model = auth_ns.model(
    "Login",
    {
        "email": fields.String,
        "password": fields.String,
    },
)


@auth_ns.route("/signup")
class SignUp(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()

        email = data["email"]

        if Account.query.filter_by(email=email).first():
            return {"message": f"email {email} already in use"}, 409

        new_account = Account(
            name=data["name"],
            email=email,
            password=generate_password_hash(data["password"]),
            events=[],
            fav_events=[],
            orgs=[],
        )
        new_account.save()
        return {"message": f"user with email {email} created"}, 201


@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        email = data["email"]
        password = data["password"]

        account = Account.query.filter_by(email=email).first()

        if account and check_password_hash(account.password, password):
            access_token = create_access_token(identity=account.uid)
            refresh_token = create_refresh_token(identity=account.uid)

            return {
                "message": f"logged in as {account.name}",
                "access_token": access_token,
                "refresh_token": refresh_token,
            }, 200

        else:
            return {"message": "invalid email or password"}, 401
