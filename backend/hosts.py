from flask import request
from flask_restx import Namespace, Resource, fields
from backend.models import Host
from flask_jwt_extended import jwt_required

# Create a namespace for host-related operations
hosts_ns = Namespace("hosts", description="Host operations")

# Define the data model for a host using Flask-RESTx fields
# This model will be used for validating and documenting the API endpoints
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
        "profile_pic": fields.Integer,
    },
)

# Route for operations on multiple hosts
# @hosts_ns.route("/")
class Hosts(Resource):
    # GET endpoint to retrieve all hosts
    @hosts_ns.marshal_list_with(host_model)
    def get(self):
        # Query all hosts and return them
        return Host.query.all(), 200

    # POST endpoint to create a new host
    @hosts_ns.expect(host_model)
    @hosts_ns.marshal_with(host_model)
    def post(self):
        # Create a Host object from the provided payload and save it to the database
        host = Host(**hosts_ns.payload)
        host.save()
        return host, 201

# Route for operations on a specific host identified by its ID
@hosts_ns.route("/<int:hid>")
class HostById(Resource):
    # GET endpoint to retrieve a host by its ID
    @hosts_ns.marshal_with(host_model)
    def get(self, hid):
        # Query for the host by ID or return a 404 if not found
        host = Host.query.get_or_404(hid)
        return host, 200

    # PUT endpoint to update a specific host
    @hosts_ns.expect(host_model)
    @hosts_ns.marshal_with(host_model)
    def put(self, hid):
        # Find the host and update its details
        host = Host.query.get_or_404(hid)
        host.update(**hosts_ns.payload)
        return host, 200

    # DELETE endpoint to delete a specific host
    def delete(self, hid):
        # Delete the host by ID
        host = Host.query.get_or_404(hid)
        host.delete()
        return {"message": "host deleted"}, 200

# Route for operations on a host identified by name
@hosts_ns.route("/<string:name>")
class HostByName(Resource):
    # GET endpoint to retrieve a host by name
    @hosts_ns.marshal_with(host_model)
    def get(self, name):
        # Query for the host by name or return a 404 if not found
        host = Host.query.filter_by(name=name).first_or_404()
        return host, 200
