from flask import request
from flask_restx import Namespace, Resource, fields
from models import Host
from flask_jwt_extended import jwt_required

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
    },
)


@hosts_ns.route("/")
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
        host = Host.query.filter_by(name=name).first()
        if host:
            return host
        hosts_ns.abort(404, f"Host with name {name} not found")
