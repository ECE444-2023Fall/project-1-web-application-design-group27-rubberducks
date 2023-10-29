import time
from flask import request
from flask_restx import Namespace, Resource, fields
from models import Event
from flask_jwt_extended import jwt_required

events_ns = Namespace("events", description="Event operations")

class DateFormat(fields.Raw):
    def format(self, value):
        return value.strftime('%Y-%m-%d')
    
class TimeFormat(fields.Raw):
    def format(self, value):
        return time.strftime(value, "%H:%M")

event_model = events_ns.model(
    "Event",
    {
        "eid": fields.Integer,
        "name": fields.String,
        "description": fields.String,
        "location": fields.String,
        "date": fields.String,
        "time": fields.String,
        "capacity": fields.Integer,
        "tags": fields.List(fields.String),
        "attendees": fields.List(fields.Integer),
        "owner": fields.Integer,
    },
)


@events_ns.route("/")
class Events(Resource):
    @events_ns.marshal_list_with(event_model)
    def get(self):
        return Event.query.all(), 200

    @events_ns.expect(event_model)
    @events_ns.marshal_with(event_model)
    def post(self):
        event = Event(**events_ns.payload)
        event.save()
        return event, 201


@events_ns.route("/<int:eid>")
class EventById(Resource):
    @events_ns.marshal_with(event_model)
    def get(self, eid):
        event = Event.query.get_or_404(eid)
        return event, 200

    @events_ns.expect(event_model)
    @events_ns.marshal_with(event_model)
    def put(self, eid):
        event = Event.query.get_or_404(eid)
        event.update(**events_ns.payload)
        return event, 200

    def delete(self, eid):
        event = Event.query.get_or_404(eid)
        event.delete()
        return {"message": "event deleted"}, 200
