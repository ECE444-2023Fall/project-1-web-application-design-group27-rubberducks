from flask import request
from flask_restx import Namespace, Resource, fields
from sqlalchemy import Integer, func
from backend.models import Host
#from models import Host
from flask_jwt_extended import jwt_required
from backend.exts import db
#from exts import db

# Create a namespace for host-related operations
hosts_ns = Namespace("hosts", description="Host operations")

# Define the data model for a host using Flask-RESTx fields
# This model will be used for validating and documenting the API endpoints
host_model = hosts_ns.model(
    "Host",
    {
        "hid": fields.Integer,  # Unique host identifier
        "name": fields.String,  # Host name
        "email": fields.String,  # Host email address
        "bio": fields.String,  # Brief biography of the host
        "events": fields.List(fields.Integer),  # List of event IDs associated with the host
        "owner": fields.Integer,  # Owner's user ID
        "pending_transfer": fields.Boolean,  # Status flag for pending ownership transfer
        "profile_pic": fields.Integer,
    },
)

# Route for operations on multiple hosts
@hosts_ns.route("/")
class Hosts(Resource):
    # GET endpoint to retrieve all hosts
    @hosts_ns.marshal_list_with(host_model)
    def get(self):
        # Infinite scroll
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        offset = (page - 1) * limit

        # Filter
        name = str(request.args.get('name'))
        #Sorting
        order = str(request.args.get('ord', 0)) # order (sorting) 0: alpha 1: events

        if order == 1:
            query = Host.query.order_by(func.cardinality(Host.events).desc(), Host.name.asc()).group_by(Host.hid, Host.name) # Count Order
        else:
            query = Host.query.order_by(Host.name.asc()) # Alphabetical Order

        if name and name != 'None': # Name
            query = query.filter(Host.name.ilike(f"%{name}%"))
            
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
