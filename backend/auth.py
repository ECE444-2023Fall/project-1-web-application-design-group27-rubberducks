from flask import request
from flask_restx import Namespace, Resource, fields
from backend.models import Account
#from models import Account
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

# Initialize Flask-Login for session management
login_manager = LoginManager()

# Create an authentication namespace for organizing authentication-related APIs
auth_ns = Namespace("auth", description="Authentication operations")

# Initialize Flask-Principal for role-based authorization
principal = Principal()
auth_permission = Permission()

# Define the data model for user signup using Flask-RESTx fields.
# This is used for validating and documenting the API.
signup_model = auth_ns.model(
    "SignUp",
    {
        "name": fields.String,
        "email": fields.String,
        "password": fields.String,
    },
)

# Similar to signup_model, this defines the data model for user login.
login_model = auth_ns.model(
    "Login",
    {
        "email": fields.String,
        "password": fields.String,
    },
)

# Route for user signup
@auth_ns.route("/signup")
class SignUp(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        # Extract data from the request
        data = request.get_json()

        email = data["email"]

        # Check if the email already exists in the database
        if Account.query.filter_by(email=email).first():
            return {"message": f"email {email} already in use"}, 409

        # Create a new account and save it to the database
        new_account = Account(
            name=data["name"],
            email=email,
            password=generate_password_hash(data["password"]),
            # Additional fields like events, fav_events, etc., can be initialized here
            events=[],
            fav_events=[],
            orgs=[],
            msgids=[],
            profile_pic=0,
            # Additional fields like events, fav_events, etc., can be initialized here
        )
        new_account.save()
        return {"message": f"user with email {email} created"}, 201

# User loader function for Flask-Login to manage user sessions
@login_manager.user_loader
def load_user(user_id):
    return Account.query.get(user_id)

# Route for user login
@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        email = data["email"]
        password = data["password"]

        # Authenticate the user
        account = Account.query.filter_by(email=email).first()

        if account and check_password_hash(account.password, password):
            # Generate JWT tokens and log the user in
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

# Route for refreshing JWT tokens
@auth_ns.route("/refresh")
class Refresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {"access_token": access_token}, 200

# Additional routes can be added below with appropriate access control
# using Flask-Principal or Flask-Login for more fine-grained authorization.
