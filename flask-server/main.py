from flask import Flask
from flask_restx import Api
from models import Account, Event, Host
from exts import db
from flask_jwt_extended import JWTManager
from events import events_ns
from accounts import accounts_ns
from hosts import hosts_ns
from auth import auth_ns
from config import DevConfig


def create_app(config=DevConfig):
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    JWTManager(app)
    api = Api(app, doc="/docs")
    api.add_namespace(events_ns)
    api.add_namespace(accounts_ns)
    api.add_namespace(hosts_ns)
    api.add_namespace(auth_ns)

    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Account": Account, "Host": Host, "Event": Event}

    return app
