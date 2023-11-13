from flask import Flask, render_template
from flask_restx import Api
from flask_cors import CORS

from backend.models import Account, Event, Host, Message
#from models import Account, Event, Host, Message
from backend.exts import db
#from exts import db
from flask_jwt_extended import JWTManager
from backend.messages import messages_ns
#from messages import messages_ns
from backend.events import events_ns
#from events import events_ns
from backend.accounts import accounts_ns
#from accounts import accounts_ns
from backend.hosts import hosts_ns
#from hosts import hosts_ns
from backend.auth import auth_ns, principal 
#from auth import auth_ns, principal 
from backend.s3 import s3_ns
#from s3 import s3_ns

from backend.config import DevConfig
#from config import DevConfig
from backend.auth import login_manager
#from auth import login_manager

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


    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Account": Account, "Host": Host, "Event": Event, "Message": Message}
    
    @app.errorhandler(404)
    def not_found(e):
        return render_template("index.html")
    
    CORS(app)

    return app
