from flask import request
from flask_restx import Namespace, Resource, fields, abort
from models import Message
from flask_jwt_extended import jwt_required

messages_ns = Namespace("messages", description="Message operations")

messages_model = messages_ns.model(
    "Message",
    {
        "msgid": fields.Integer,
        "account_id": fields.Integer,
        "message": fields.String,
        "created_at": fields.DateTime(dt_format="rfc822"),
        "read": fields.Boolean,
        # 1: event-notifcation
        # 2: club-notification
        # 3: transfer-host-profile
        "msg_type": fields.Integer 
    },
)


@messages_ns.route("/")
class Messages(Resource):
    @messages_ns.marshal_list_with(messages_model)
    def get(self):
        return Message.query.all(), 200

    @messages_ns.expect(messages_model)
    @messages_ns.marshal_with(messages_model)
    def post(self):
        messages = Message(**messages_ns.payload)
        messages.save()
        return messages, 201


@messages_ns.route("/<int:msgid>")
class MessagesById(Resource):
    @messages_ns.marshal_with(messages_model)
    def get(self, msgid):
        messages = Message.query.get_or_404(msgid)
        return messages, 200

    @messages_ns.expect(messages_model)
    @messages_ns.marshal_with(messages_model)
    def put(self, msgid):
        messages = Message.query.get_or_404(msgid)
        messages.update(**messages_ns.payload)
        return messages, 200

    def delete(self, msgid):
        messages = Message.query.get_or_404(msgid)
        messages.delete()
        return {"message": "message deleted"}, 200


@messages_ns.route("/account/<int:account_id>")
class MessagesByAccount(Resource):
    @messages_ns.marshal_list_with(messages_model)
    def get(self, account_id):
        messages = Message.query.filter_by(account_id=account_id).all()
        if not messages: 
            abort(404)
        return messages, 200


@messages_ns.route("/account/<int:account_id>/latest")
class LatestMessageByAccount(Resource):
    @messages_ns.marshal_with(messages_model)
    def get(self, account_id):
        latest_message = Message.query.filter_by(account_id=account_id).order_by(Message.created_at.desc()).first_or_404()
        return latest_message, 200
    