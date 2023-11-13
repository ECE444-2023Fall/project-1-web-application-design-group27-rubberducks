from flask import Flask, render_template
from flask_cors import CORS
from flask_restx import Api
from backend.models import Account, Event, Host, Message
from backend.exts import db
from flask_jwt_extended import JWTManager
from backend.messages import messages_ns, Messages, MessagesById, MessagesByAccount, LatestMessageByAccount
from backend.events import events_ns, Events, EventById, Event_tags, EventTagId, EventsAll
from backend.accounts import accounts_ns, Accounts, AccountById, AccountByEmail
from backend.hosts import hosts_ns, Hosts, HostById, HostByName
from backend.auth import auth_ns, principal, SignUp, Login, Refresh
from backend.s3 import s3_ns

from backend.config import DevConfig
from backend.auth import login_manager

def create_app(config=DevConfig):
    app = Flask(__name__,
            static_url_path='',
            static_folder='../client/dist',
            template_folder='../client/dist'
                )
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
    api.add_namespace(s3_ns)

    app.config['JWT_SECRET_KEY'] = 'secret_key_here'  # Change this to a secure secret key
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_ALGORITHM'] = 'HS256'

    CORS(app, resources=r'/*')

    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Account": Account, "Host": Host, "Event": Event, "Message": Message}
    
    @app.errorhandler(404)
    def not_found(e):
        return render_template("index.html")
    
    api.add_resource(SignUp, '/api/auth/signup/')
    api.add_resource(Login, '/api/auth/login/')
    api.add_resource(Refresh, '/api/auth/refresh/')
    api.add_resource(Accounts, '/api/accounts/')
    api.add_resource(AccountById, '/api/accounts/<int:uid>/')
    api.add_resource(AccountByEmail, '/api/accounts/<string:email>/')
    api.add_resource(Events, '/api/events/')
    api.add_resource(EventsAll, '/api/events/all/')
    api.add_resource(EventById, '/api/events/<int:eid>/')
    api.add_resource(Event_tags, '/api/events/tags/')
    api.add_resource(EventTagId, '/api/events/tags/<int:etid>/')
    api.add_resource(Messages, '/api/messages/')
    api.add_resource(MessagesById, '/api/messages/<int:msgid>/')
    api.add_resource(MessagesByAccount, '/api/messages/account/<int:account_id>/')
    api.add_resource(LatestMessageByAccount, '/api/messages/account/<int:account_id>/latest/')
    api.add_resource(Hosts, '/api/hosts/')
    api.add_resource(HostById, '/api/hosts/<int:hid>/')
    api.add_resource(HostByName, '/api/hosts/<string:name>/')
    
    return app
