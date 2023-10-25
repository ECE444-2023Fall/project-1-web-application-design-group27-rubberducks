from flask import Flask
from flask_restx import Api, Resource, fields
from config import DevConfig
from models import Account, Event, Host
from exts import db

app = Flask(__name__)
app.config.from_object(DevConfig)
db.init_app(app)
api=Api(app, doc='/docs')

event_model = api.model('Event', {
    'eid': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'location': fields.String,
    'date': fields.String,
    'time': fields.String,
    'host': fields.String
})

account_model = api.model('Account', {
    'aid': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'password': fields.String,
    'host': fields.String
})

host_model = api.model('Host', {
    'hid': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'bio': fields.String,
    'events': fields.String,
    'owner': fields.String
})
    
@api.route('/events')
class Events(Resource):
    @api.marshal_with(event_model)
    def get(self):
        return Event.query.all()
    
    @api.expect(event_model)
    @api.marshal_with(event_model)
    def post(self):
        event = Event(**api.payload)
        event.save()
        return event,201
    
@api.route('/events/<int:eid>')
class EventById(Resource):
    @api.marshal_with(event_model)
    def get(self, eid):
        return Event.query.filter_by(eid=eid).first()
    
    @api.expect(event_model)
    @api.marshal_with(event_model)
    def put(self, eid):
        event = Event.query.filter_by(eid=eid).first()
        event.update_name(**api.payload)
        return event
    
    def delete(self, eid):
        event = Event.query.filter_by(eid=eid).first()
        event.delete()
        return {'message': 'event deleted'}

@api.route('/accounts')
class Accounts(Resource):
    @api.marshal_with(account_model)
    def get(self):
        return Account.query.all()
    
    @api.expect(account_model)
    @api.marshal_with(account_model)
    def post(self):
        account = Account(**api.payload)
        account.save()
        return account,201

@api.route('/accounts/<int:uid>')
class AccountById(Resource):
    @api.marshal_with(account_model)
    def get(self, uid):
        return Account.query.filter_by(uid=uid).first()
    
    @api.expect(account_model)
    @api.marshal_with(account_model)
    def put(self, uid):
        account = Account.query.filter_by(uid=uid).first()
        account.update_name(**api.payload)
        return account
    
    def delete(self, uid):
        account = Account.query.filter_by(uid=uid).first()
        account.delete()
        return {'message': 'account deleted'}

@api.route('/hosts')
class Hosts(Resource):
    @api.marshal_with(host_model)
    def get(self):
        return Host.query.all()
    
    @api.expect(host_model)
    @api.marshal_with(host_model)
    def post(self):
        host = Host(**api.payload)
        host.save()
        return host,201

@api.route('/hosts/<int:hid>')
class HostById(Resource):
    @api.marshal_with(host_model)
    def get(self, hid):
        return Host.query.filter_by(hid=hid).first()
    
    @api.expect(host_model)
    @api.marshal_with(host_model)
    def put(self, hid):
        host = Host.query.filter_by(hid=hid).first()
        host.update_name(**api.payload)
        return host
    
    def delete(self, hid):
        host = Host.query.filter_by(hid=hid).first()
        host.delete()
        return {'message': 'host deleted'}
    
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Account': Account, 'Host': Host, 'Event': Event}
    
if __name__ == '__main__':
    app.run(port=8000)