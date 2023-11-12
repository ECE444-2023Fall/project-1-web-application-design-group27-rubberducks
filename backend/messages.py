from flask import request
from flask_restx import Namespace, Resource, fields, abort
from backend.models import Message
#from models import Message
from flask_jwt_extended import jwt_required

# Define a namespace for message-related operations
messages_ns = Namespace("messages", description="Message operations")

# Define the data model for messages using Flask-RESTx fields
# This model helps in validating and documenting the API
messages_model = messages_ns.model(
    "Message",
    {
        "msgid": fields.Integer,  # Unique message identifier
        "account_id": fields.Integer,  # Identifier for the account associated with the message
        "message": fields.String,  # Message content
        "created_at": fields.DateTime(dt_format="rfc822"),  # Timestamp of message creation
        "read": fields.Boolean,  # Flag indicating if the message has been read
        "msg_type": fields.Integer  # Type of the message (e.g., event-notification, club-notification, transfer-club)
    },
)

# Route for operations on multiple messages
@messages_ns.route("/")
class Messages(Resource):
    # GET endpoint to retrieve all messages
    @messages_ns.marshal_list_with(messages_model)
    def get(self):
        # Query and return all messages
        return Message.query.all(), 200

    # POST endpoint to create a new message
    @messages_ns.expect(messages_model)
    @messages_ns.marshal_with(messages_model)
    def post(self):
        # Create a Message object from the provided payload and save it to the database
        messages = Message(**messages_ns.payload)
        messages.save()
        return messages, 201

# Route for operations on a specific message identified by its ID
@messages_ns.route("/<int:msgid>")
class MessagesById(Resource):
    # GET endpoint to retrieve a message by its ID
    @messages_ns.marshal_with(messages_model)
    def get(self, msgid):
        # Query for the message by ID or return a 404 if not found
        messages = Message.query.get_or_404(msgid)
        return messages, 200

    # PUT endpoint to update a specific message
    @messages_ns.expect(messages_model)
    @messages_ns.marshal_with(messages_model)
    def put(self, msgid):
        # Find the message and update its details
        messages = Message.query.get_or_404(msgid)
        messages.update(**messages_ns.payload)
        return messages, 200

    # DELETE endpoint to delete a specific message
    def delete(self, msgid):
        # Delete the message by ID
        messages = Message.query.get_or_404(msgid)
        messages.delete()
        return {"message": "message deleted"}, 200

# Route for retrieving messages for a specific account
@messages_ns.route("/account/<int:account_id>")
class MessagesByAccount(Resource):
    # GET endpoint to retrieve messages by account ID
    @messages_ns.marshal_list_with(messages_model)
    def get(self, account_id):
        # Query for messages associated with an account, ordered by creation time
        messages = Message.query.filter_by(account_id=account_id).order_by(Message.created_at.desc()).all()
        if not messages: 
            abort(404)  # Abort if no messages found
        return messages, 200

# Route for retrieving the latest message for a specific account
@messages_ns.route("/account/<int:account_id>/latest")
class LatestMessageByAccount(Resource):
    # GET endpoint to retrieve the latest message by account ID
    @messages_ns.marshal_with(messages_model)
    def get(self, account_id):
        # Query for the latest message associated with an account
        latest_message = Message.query.filter_by(account_id=account_id).order_by(Message.created_at.desc()).first_or_404()
        return latest_message, 200
