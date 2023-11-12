from flask import request
from flask_restx import Namespace, Resource, fields
from sqlalchemy import Integer, func
from backend.models import Host
#from models import Host
from flask_jwt_extended import jwt_required
from backend.exts import db
#from exts import db

hosts_ns = Namespace("hosts", description="Host operations")

host_model = hosts_ns.model(
    "Host",
    {
        "hid": fields.Integer,
        "name": fields.String,
        "email": fields.String,
        "bio": fields.String,
        "events": fields.List(fields.Integer),
        "owner": fields.Integer,
        "pending_transfer": fields.Boolean,
    },
)

@hosts_ns.route("/")
class Hosts(Resource):
    @hosts_ns.marshal_list_with(host_model)
    def get(self):
        # Infinite scroll
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        offset = (page - 1) * limit
        #Sorting
        order = str(request.args.get('ord', 0)) # order (sorting) 0: alpha 1: events
        if order == 1:
            query = Host.query.order_by(func.cardinality(Host.events).desc(), Host.name.asc()).group_by(Host.hid, Host.name) # Count Order
        else:
            query = Host.query.order_by(Host.name.asc()) # Alphabetical Order
        # print(str(query.statement.compile(compile_kwargs={"literal_binds": True})))
        hosts = query.offset(offset).limit(limit).all()

        return hosts, 200

    @hosts_ns.expect(host_model)
    @hosts_ns.marshal_with(host_model)
    def post(self):
        host = Host(**hosts_ns.payload)
        host.save()
        return host, 201

@hosts_ns.route("/all")
class Hosts(Resource):
    @hosts_ns.marshal_list_with(host_model)
    def get(self):
        return Host.query.all(), 200

    @hosts_ns.expect(host_model)
    @hosts_ns.marshal_with(host_model)
    def post(self):
        host = Host(**hosts_ns.payload)
        host.save()
        return host, 201


@hosts_ns.route("/<int:hid>")
class HostById(Resource):
    @hosts_ns.marshal_with(host_model)
    def get(self, hid):
        host = Host.query.get_or_404(hid)
        return host, 200

    @hosts_ns.expect(host_model)
    @hosts_ns.marshal_with(host_model)
    def put(self, hid):
        host = Host.query.get_or_404(hid)
        host.update(**hosts_ns.payload)
        return host, 200

    def delete(self, hid):
        host = Host.query.get_or_404(hid)
        host.delete()
        return {"message": "host deleted"}, 200

@hosts_ns.route("/<string:name>")
class HostByName(Resource):
    @hosts_ns.marshal_with(host_model)
    def get(self, name):
        host = Host.query.filter_by(name=name).first_or_404()
        return host, 200
