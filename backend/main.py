from flask import Flask
from flask_restx import Api
from models import Account, Event, Host, Message
from exts import db
from flask_jwt_extended import JWTManager
from messages import messages_ns
from events import events_ns
from accounts import accounts_ns
from hosts import hosts_ns
from auth import auth_ns, principal 

from config import DevConfig
from auth import login_manager

def create_app(config=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    JWTManager(app)
    login_manager.init_app(app)
    principal.init_app(app)
    api = Api(app, doc="/docs")
    api.add_namespace(messages_ns)
    api.add_namespace(events_ns)
    api.add_namespace(accounts_ns)
    api.add_namespace(hosts_ns)
    api.add_namespace(auth_ns)

    app.config['JWT_SECRET_KEY'] = 'secret_key_here'  # Change this to a secure secret key
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_ALGORITHM'] = 'HS256'


    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Account": Account, "Host": Host, "Event": Event, "Message": Message}

    return app
