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
        return Host.query.all()

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
        return Host.query.get_or_404(hid)

    @hosts_ns.expect(host_model)
    @hosts_ns.marshal_with(host_model)
    def put(self, hid):
        host = Host.query.get_or_404(hid)
        host.update(**hosts_ns.payload)
        return host

    def delete(self, hid):
        host = Host.query.get_or_404(hid)
        host.delete()
        return {"message": "host deleted"}
