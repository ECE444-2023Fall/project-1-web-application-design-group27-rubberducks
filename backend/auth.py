from flask import request
from flask_restx import Namespace, Resource, fields
from backend.models import Account
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from flask_login import LoginManager, login_user, UserMixin, current_user, login_required
from flask_principal import Principal, Identity, Permission



login_manager = LoginManager()
# login_manager.init_app(app)

auth_ns = Namespace("auth", description="Authentication operations")

principal = Principal()
auth_permission = Permission()

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
            msgids=[],
            profile_pic=0,
        )
        new_account.save()
        return {"message": f"user with email {email} created"}, 201

@login_manager.user_loader
def load_user(user_id):
    return Account.query.get(user_id)

# from flask_jwt_extended import create_access_token, create_refresh_token

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
            login_user(account, remember=True)

            return {
                "message": f"logged in as {account.name}",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "email": account.email,
                    "id": str(account.uid)
                }
            }, 200

        else:
            return {"message": "invalid email or password"}, 401

@auth_ns.route("/refresh")
class Refresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {"access_token": access_token}, 200

# @auth_ns.route('/protected')
# class Protected(Resource):
#     @auth_permission.require(http_exception=403)
#     def get(self):
#         # This route can only be accessed by authenticated users
#         return {"message": "This is a protected route"}, 200


# @auth_ns.route('/check_login_status')
# class CheckLoginStatus(Resource):
#     def get(self):
#         if current_user.is_authenticated:
#             return "User is logged in."
#         else:
#             return "User is not logged in."


# @auth_ns.route('/private')
# class PrivateRoute(Resource):
#     @jwt_required()  
#     def get(self):
#         return "This is a logged-in user only route."


# @auth_ns.route('/private')
# @login_required
# def private_route():
#     return "This is a logged-in user only route."
